#!/usr/bin/env python3
"""
Build an agent-facing source priority queue from a coverage matrix and source scout file.

This script is for acquisition, not calibration. It helps agents decide which public
review pages to work next based on current corpus gaps.
"""

import argparse
import csv
import json
from pathlib import Path


PLATFORM_WEIGHT = {
    "google_maps": 1.0,
    "google_business_profile": 1.0,
    "trustpilot": 0.85,
    "avvo": 0.7,
    "lawyers_com": 0.65,
    "lawyers.com": 0.65,
    "yelp": 0.5,
    "bbb": 0.4,
}

VOLUME_WEIGHT = {"high": 1.0, "medium": 0.75, "low": 0.5, "unknown": 0.5}
CONFIDENCE_WEIGHT = {"high": 1.0, "medium": 0.75, "low": 0.5, "unknown": 0.5}


def parse_args():
    parser = argparse.ArgumentParser(description="Build Clarion review source priority queue")
    parser.add_argument("--coverage", required=True, help="Coverage matrix CSV")
    parser.add_argument("--scouting", required=True, help="Source scouting CSV")
    parser.add_argument("--output", required=True, help="Priority queue CSV output path")
    parser.add_argument("--stage", required=True, help="Stage name to target, e.g. phase1, wave80, wave160")
    parser.add_argument("--batches-dir", required=True, help="Directory containing collected batch CSVs")
    parser.add_argument("--existing-csv", action="append", default=[], help="Optional existing corpus CSV to count")
    parser.add_argument("--lane-registry", help="Optional lane registry CSV with persistent lane-level statuses")
    parser.add_argument(
        "--mode",
        choices=["qualification", "harvest"],
        default="harvest",
        help="Qualification mode surfaces unproven lanes; harvest mode favors prequalified viable lanes",
    )
    parser.add_argument(
        "--include-dead-lanes",
        action="store_true",
        help="Include dead lanes as recheck candidates instead of excluding them from harvest focus",
    )
    return parser.parse_args()


def read_csv(path):
    with open(path, newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def write_csv(path, fieldnames, rows):
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def normalize_text(value):
    return " ".join((value or "").strip().lower().split())


def normalize_token(value):
    return normalize_text(value).replace(" ", "_")


def split_multi(value):
    if not value:
        return set()
    parts = []
    for separator in [";", ",", "|"]:
        if separator in value:
            parts = [item.strip() for item in value.split(separator)]
            break
    if not parts:
        parts = [value.strip()]
    return {normalize_token(item) for item in parts if item.strip()}


def parse_bool(value):
    return normalize_token(value) in {"yes", "true", "1", "y"}


def scout_key(row):
    return (
        normalize_token(row.get("source_platform", "")),
        normalize_token(row.get("firm_name", "")),
        normalize_token(row.get("state", "")),
        normalize_token(row.get("practice_area_primary", "")),
    )


def prefer_dead_scout_row(scout_row):
    scout_id = normalize_token(scout_row.get("scout_id", ""))
    review_types = split_multi(scout_row.get("visible_review_types", ""))
    notes = normalize_token(scout_row.get("notes", ""))
    return (
        "dead_2star" in scout_id
        or "explicit_visible_2star_count" in review_types
        or "lowest_sort_dead_end" in review_types
        or "limited_view" in notes
        or "dead_end" in notes
    )


def choose_scout_row_for_registry(candidate_rows, registry_row):
    if not candidate_rows:
        return None

    target_star_slice = normalize_token(registry_row.get("target_star_slice", "general"))
    lane_status = normalize_token(registry_row.get("lane_status", ""))

    if target_star_slice in {"2_star", "2star"} and lane_status == "dead_google_maps":
        dead_rows = [row for row in candidate_rows if prefer_dead_scout_row(row)]
        if dead_rows:
            return dead_rows[0]

    live_rows = [row for row in candidate_rows if not prefer_dead_scout_row(row)]
    if live_rows:
        return live_rows[0]

    return candidate_rows[0]


def target_slice_matches(target_slice, slice_row):
    target_slice = normalize_token(target_slice or "general")
    star_band = normalize_token(slice_row.get("star_band", ""))
    review_type = normalize_token(slice_row.get("review_type", ""))

    if target_slice in {"", "any", "general", "general_harvest"}:
        return True
    if target_slice in {"2_star", "2star"}:
        return star_band == "2"
    if target_slice in {"1_star", "1star"}:
        return star_band == "1"
    if target_slice in {"mixed_4_star", "4_star", "4star"}:
        return star_band == "4" or review_type == "mixed_4_star"
    if target_slice in {"5_star", "5star", "positive_5_star"}:
        return star_band == "5" or review_type in {"explicit_positive_outcome", "explicit_positive_trust"}
    if target_slice == "positive":
        return review_type in {"explicit_positive_outcome", "explicit_positive_trust"}
    if target_slice == "long_form":
        return review_type == "long_form"
    return True


def lane_status_multiplier(lane_status, mode):
    lane_status = normalize_token(lane_status)
    if mode == "qualification":
        return {
            "needs_qualification": 1.0,
            "viable_google_maps": 0.85,
            "fallback_eligible": 0.65,
            "dead_google_maps": 0.2,
        }.get(lane_status, 0.6)

    return {
        "viable_google_maps": 1.35,
        "fallback_eligible": 1.0,
        "needs_qualification": 0.45,
        "dead_google_maps": 0.05,
    }.get(lane_status, 0.5)


def lane_priority_bucket(lane_status, mode, include_dead_lanes):
    lane_status = normalize_token(lane_status)
    if lane_status == "viable_google_maps":
        return "viable_google_maps"
    if lane_status == "fallback_eligible":
        return "fallback_eligible"
    if lane_status == "dead_google_maps":
        return "dead_google_maps_recheck" if include_dead_lanes else "dead_google_maps_excluded"
    return "qualification_lane" if mode == "qualification" else "unqualified_lane"


def queue_status_for_lane(lane_status, mode, include_dead_lanes):
    lane_status = normalize_token(lane_status)
    if lane_status == "dead_google_maps":
        return "recheck_only" if include_dead_lanes else "excluded_dead_lane"
    if mode == "harvest" and lane_status == "needs_qualification":
        return "qualification_only"
    return "queued"


def queue_status_sort_key(queue_status):
    return {
        "queued": 0,
        "qualification_only": 1,
        "recheck_only": 2,
        "excluded_dead_lane": 3,
    }.get(normalize_token(queue_status), 4)


def load_corpus_rows(batches_dir, extra_csvs):
    rows = []
    for path in sorted(Path(batches_dir).glob("*.csv")):
        rows.extend(read_csv(path))
    for extra in extra_csvs:
        extra_path = Path(extra)
        if extra_path.exists():
            rows.extend(read_csv(extra_path))
    return rows


def row_matches_slice(row, slice_row):
    star_band = slice_row["star_band"].strip().lower()
    if star_band not in {"", "any"}:
        rating = str(row.get("review_rating") or row.get("rating") or "").strip()
        if rating != star_band:
            return False

    practice = normalize_token(slice_row["practice_area_bucket"])
    if practice not in {"", "any"}:
        practice_values = split_multi(
            f"{row.get('practice_area_primary', '')};{row.get('practice_area_secondary', '')};{row.get('practice_area', '')}"
        )
        if practice not in practice_values:
            return False

    state = normalize_token(slice_row["state"])
    if state not in {"", "any"}:
        if normalize_token(row.get("state", "")) != state:
            return False

    firm_size = normalize_token(slice_row["firm_size_proxy"])
    if firm_size not in {"", "any"}:
        if normalize_token(row.get("firm_size_proxy", "")) != firm_size:
            return False

    review_type = normalize_token(slice_row["review_type"])
    if review_type not in {"", "any"}:
        tags = split_multi(row.get("weak_slice_tags", ""))
        if review_type not in tags:
            return False

    return True


def scout_matches_slice(scout_row, slice_row):
    star_band = slice_row["star_band"].strip().lower()
    if star_band not in {"", "any"}:
        if star_band not in split_multi(scout_row.get("visible_star_bands", "")):
            return False

    practice = normalize_token(slice_row["practice_area_bucket"])
    if practice not in {"", "any"}:
        practice_values = split_multi(
            f"{scout_row.get('practice_area_primary', '')};{scout_row.get('practice_area_secondary', '')}"
        )
        if practice not in practice_values:
            return False

    state = normalize_token(slice_row["state"])
    if state not in {"", "any"}:
        if normalize_token(scout_row.get("state", "")) != state:
            return False

    firm_size = normalize_token(slice_row["firm_size_proxy"])
    if firm_size not in {"", "any"}:
        if normalize_token(scout_row.get("firm_size_proxy", "")) != firm_size:
            return False

    review_type = normalize_token(slice_row["review_type"])
    if review_type not in {"", "any"}:
        review_types = split_multi(scout_row.get("visible_review_types", ""))
        if review_type not in review_types:
            return False

    return True


def build_slice_gap_map(stage_rows, corpus_rows):
    slice_gaps = []
    for slice_row in stage_rows:
        target_count = int(slice_row["target_count"])
        current_count = sum(1 for row in corpus_rows if row_matches_slice(row, slice_row))
        gap = max(0, target_count - current_count)
        slice_gaps.append(
            {
                "slice_id": slice_row["slice_id"],
                "target_count": target_count,
                "current_count": current_count,
                "gap": gap,
                "priority_weight": int(slice_row["priority_weight"]),
                "row": slice_row,
            }
        )
    return slice_gaps


def score_scout_row(scout_row, slice_gaps, target_star_slice="general"):
    matched = []
    gap_score = 0
    for slice_gap in slice_gaps:
        if slice_gap["gap"] <= 0:
            continue
        if not target_slice_matches(target_star_slice, slice_gap["row"]):
            continue
        if scout_matches_slice(scout_row, slice_gap["row"]):
            matched.append(slice_gap["slice_id"])
            gap_score += slice_gap["gap"] * slice_gap["priority_weight"]

    platform = normalize_token(scout_row.get("source_platform", ""))
    platform_weight = PLATFORM_WEIGHT.get(platform, 0.5)
    volume_weight = VOLUME_WEIGHT.get(normalize_token(scout_row.get("review_volume_signal", "")), 0.5)
    confidence_weight = CONFIDENCE_WEIGHT.get(normalize_token(scout_row.get("source_access_confidence", "")), 0.5)
    final_score = round(gap_score * platform_weight * volume_weight * confidence_weight, 2)
    return matched, final_score


def load_lane_registry(path):
    if not path:
        return []
    registry_path = Path(path)
    if not registry_path.exists():
        return []
    return read_csv(registry_path)


def build_registry_queue_rows(args, scouting_rows, slice_gaps):
    registry_rows = load_lane_registry(args.lane_registry)
    if not registry_rows:
        return None

    scout_lookup = {}
    for row in scouting_rows:
        scout_lookup.setdefault(scout_key(row), []).append(row)
    used_scout_keys = set()
    queue_rows = []

    for registry_row in registry_rows:
        key = (
            normalize_token(registry_row.get("source_type", "")),
            normalize_token(registry_row.get("firm_name", "")),
            normalize_token(registry_row.get("state", "")),
            normalize_token(registry_row.get("practice_area", "")),
        )
        scout_row = choose_scout_row_for_registry(scout_lookup.get(key, []), registry_row)
        if not scout_row:
            continue

        used_scout_keys.add(key)
        lane_status = registry_row.get("lane_status", "needs_qualification")
        target_star_slice = registry_row.get("target_star_slice", "general")
        matched_slices, base_score = score_scout_row(scout_row, slice_gaps, target_star_slice=target_star_slice)
        priority_score = round(base_score * lane_status_multiplier(lane_status, args.mode), 2)

        queue_rows.append(
            {
                "queue_id": f"{normalize_token(args.stage)}_{normalize_token(registry_row.get('lane_id', scout_row.get('scout_id', scout_row.get('firm_name', 'lane'))))}",
                "lane_id": registry_row.get("lane_id", ""),
                "queue_rank": "",
                "stage": args.stage,
                "source_platform": scout_row.get("source_platform", ""),
                "firm_name": scout_row.get("firm_name", ""),
                "source_url": scout_row.get("source_url", ""),
                "state": scout_row.get("state", ""),
                "practice_area_primary": scout_row.get("practice_area_primary", ""),
                "firm_size_proxy": scout_row.get("firm_size_proxy", ""),
                "target_star_slice": target_star_slice,
                "lane_status": lane_status,
                "lane_priority_bucket": lane_priority_bucket(lane_status, args.mode, args.include_dead_lanes),
                "status_reason": registry_row.get("status_reason", ""),
                "full_text_visible": registry_row.get("full_text_visible", ""),
                "last_checked_pass": registry_row.get("last_checked_pass", ""),
                "fallback_eligible": registry_row.get("fallback_eligible", ""),
                "visible_star_bands": scout_row.get("visible_star_bands", ""),
                "visible_review_types": scout_row.get("visible_review_types", ""),
                "matched_slice_ids": ";".join(matched_slices),
                "matched_slice_count": len(matched_slices),
                "priority_score": priority_score,
                "queue_status": queue_status_for_lane(lane_status, args.mode, args.include_dead_lanes),
                "notes": registry_row.get("notes") or scout_row.get("notes", ""),
            }
        )

    for scout_row in scouting_rows:
        key = scout_key(scout_row)
        if key in used_scout_keys:
            continue

        matched_slices, base_score = score_scout_row(scout_row, slice_gaps, target_star_slice="general")
        priority_score = round(base_score * lane_status_multiplier("needs_qualification", args.mode), 2)
        if args.mode == "harvest" and priority_score <= 0:
            continue
        queue_rows.append(
            {
                "queue_id": f"{normalize_token(args.stage)}_{normalize_token(scout_row.get('scout_id', scout_row.get('firm_name', 'source')))}",
                "lane_id": "",
                "queue_rank": "",
                "stage": args.stage,
                "source_platform": scout_row.get("source_platform", ""),
                "firm_name": scout_row.get("firm_name", ""),
                "source_url": scout_row.get("source_url", ""),
                "state": scout_row.get("state", ""),
                "practice_area_primary": scout_row.get("practice_area_primary", ""),
                "firm_size_proxy": scout_row.get("firm_size_proxy", ""),
                "target_star_slice": "general",
                "lane_status": "needs_qualification",
                "lane_priority_bucket": lane_priority_bucket("needs_qualification", args.mode, args.include_dead_lanes),
                "status_reason": "not_yet_classified_in_lane_registry",
                "full_text_visible": "",
                "last_checked_pass": "",
                "fallback_eligible": "no",
                "visible_star_bands": scout_row.get("visible_star_bands", ""),
                "visible_review_types": scout_row.get("visible_review_types", ""),
                "matched_slice_ids": ";".join(matched_slices),
                "matched_slice_count": len(matched_slices),
                "priority_score": priority_score,
                "queue_status": queue_status_for_lane("needs_qualification", args.mode, args.include_dead_lanes),
                "notes": scout_row.get("notes", ""),
            }
        )

    return queue_rows


def main():
    args = parse_args()
    coverage_rows = read_csv(args.coverage)
    stage_rows = [row for row in coverage_rows if normalize_token(row["stage"]) == normalize_token(args.stage)]
    if not stage_rows:
        raise SystemExit(f"No coverage rows found for stage '{args.stage}'")

    scouting_rows = read_csv(args.scouting)
    corpus_rows = load_corpus_rows(args.batches_dir, args.existing_csv)
    slice_gaps = build_slice_gap_map(stage_rows, corpus_rows)

    queue_rows = build_registry_queue_rows(args, scouting_rows, slice_gaps)
    if queue_rows is None:
        queue_rows = []
        for scout_row in scouting_rows:
            matched_slices, priority_score = score_scout_row(scout_row, slice_gaps)
            if priority_score <= 0:
                continue
            queue_rows.append(
                {
                    "queue_id": f"{normalize_token(args.stage)}_{normalize_token(scout_row.get('scout_id', scout_row.get('firm_name', 'source')))}",
                    "lane_id": "",
                    "queue_rank": "",
                    "stage": args.stage,
                    "source_platform": scout_row.get("source_platform", ""),
                    "firm_name": scout_row.get("firm_name", ""),
                    "source_url": scout_row.get("source_url", ""),
                    "state": scout_row.get("state", ""),
                    "practice_area_primary": scout_row.get("practice_area_primary", ""),
                    "firm_size_proxy": scout_row.get("firm_size_proxy", ""),
                    "target_star_slice": "general",
                    "lane_status": "needs_qualification",
                    "lane_priority_bucket": "unclassified",
                    "status_reason": "",
                    "full_text_visible": "",
                    "last_checked_pass": "",
                    "fallback_eligible": "",
                    "visible_star_bands": scout_row.get("visible_star_bands", ""),
                    "visible_review_types": scout_row.get("visible_review_types", ""),
                    "matched_slice_ids": ";".join(matched_slices),
                    "matched_slice_count": len(matched_slices),
                    "priority_score": priority_score,
                    "queue_status": "queued",
                    "notes": scout_row.get("notes", ""),
                }
            )

    queue_rows.sort(
        key=lambda row: (
            queue_status_sort_key(row["queue_status"]),
            -float(row["priority_score"]),
            row["source_platform"],
            row["firm_name"],
            row.get("target_star_slice", ""),
        )
    )
    for index, row in enumerate(queue_rows, start=1):
        row["queue_rank"] = index

    fieldnames = [
        "queue_id",
        "lane_id",
        "queue_rank",
        "stage",
        "source_platform",
        "firm_name",
        "source_url",
        "state",
        "practice_area_primary",
        "firm_size_proxy",
        "target_star_slice",
        "lane_status",
        "lane_priority_bucket",
        "status_reason",
        "full_text_visible",
        "last_checked_pass",
        "fallback_eligible",
        "visible_star_bands",
        "visible_review_types",
        "matched_slice_ids",
        "matched_slice_count",
        "priority_score",
        "queue_status",
        "notes",
    ]
    write_csv(args.output, fieldnames, queue_rows)

    summary = {
        "stage": args.stage,
        "mode": args.mode,
        "coverage_rows": len(stage_rows),
        "queue_rows": len(queue_rows),
        "corpus_rows_counted": len(corpus_rows),
        "open_slice_gaps": [
            {
                "slice_id": item["slice_id"],
                "target_count": item["target_count"],
                "current_count": item["current_count"],
                "gap": item["gap"],
            }
            for item in slice_gaps
        ],
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
