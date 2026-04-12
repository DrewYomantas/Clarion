#!/usr/bin/env python3
"""
Summarize acquisition progress against stage targets.
"""

import argparse
import csv
import json
from collections import Counter
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description="Summarize Clarion review acquisition progress")
    parser.add_argument("--batches-dir", required=True, help="Directory containing collected batch CSVs")
    parser.add_argument("--queues-dir", required=True, help="Directory containing label queue CSVs")
    parser.add_argument("--targets", required=True, help="Acquisition stage targets CSV")
    parser.add_argument("--output", required=True, help="Output JSON summary path")
    return parser.parse_args()


def read_csv(path):
    with open(path, newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def split_multi(value):
    if not value:
        return set()
    raw = value.replace("|", ";").replace(",", ";")
    return {item.strip() for item in raw.split(";") if item.strip()}


def load_rows(directory):
    rows = []
    for path in sorted(Path(directory).glob("*.csv")):
        rows.extend(read_csv(path))
    return rows


def count_rows(batch_rows, queue_rows):
    source_counts = Counter(row.get("source_platform", "") for row in batch_rows if row.get("source_platform"))
    state_counts = Counter(row.get("state", "") for row in batch_rows if row.get("state"))
    practice_counts = Counter(
        row.get("practice_area_primary", "") for row in batch_rows if row.get("practice_area_primary")
    )
    star_counts = Counter(str(row.get("review_rating", "")).strip() for row in batch_rows if row.get("review_rating"))

    weak_tag_counts = Counter()
    long_count = 0
    for row in batch_rows:
        weak_tag_counts.update(split_multi(row.get("weak_slice_tags", "")))
        if row.get("length_bucket") == "long":
            long_count += 1

    queue_role_counts = Counter(row.get("dataset_role", "") for row in queue_rows if row.get("dataset_role"))
    benchmark_candidates = sum(1 for row in queue_rows if row.get("benchmark_candidate_flag", "").lower() in {"1", "true", "yes"})
    holdouts = sum(1 for row in queue_rows if row.get("holdout_flag", "").lower() in {"1", "true", "yes"})

    return {
        "total_reviews": len(batch_rows),
        "star_counts": dict(star_counts),
        "source_counts": dict(source_counts),
        "state_count": len(state_counts),
        "practice_area_count": len(practice_counts),
        "long_form_count": long_count,
        "weak_tag_counts": dict(weak_tag_counts),
        "queue_role_counts": dict(queue_role_counts),
        "benchmark_candidate_count": benchmark_candidates,
        "holdout_count": holdouts,
    }


def stage_progress(metrics, targets_rows):
    progress = []
    total_reviews = metrics["total_reviews"]
    long_form = metrics["long_form_count"]
    low_star = int(metrics["star_counts"].get("1", 0)) + int(metrics["star_counts"].get("2", 0))

    for row in targets_rows:
        stage = row["stage"]
        target_reviews = int(row["target_reviews"])
        checks = {
            "total_reviews": [total_reviews, target_reviews],
            "one_star": [int(metrics["star_counts"].get("1", 0)), int(row["one_star_target"])],
            "two_star": [int(metrics["star_counts"].get("2", 0)), int(row["two_star_target"])],
            "mixed_4_star": [int(metrics["weak_tag_counts"].get("mixed_4_star", 0)), int(row["mixed_4_star_target"])],
            "explicit_positive_outcome": [
                int(metrics["weak_tag_counts"].get("explicit_positive_outcome", 0)),
                int(row["explicit_positive_outcome_target"]),
            ],
            "explicit_positive_trust": [
                int(metrics["weak_tag_counts"].get("explicit_positive_trust", 0)),
                int(row["explicit_positive_trust_target"]),
            ],
            "long_form": [long_form, int(row["long_form_target"])],
            "states": [metrics["state_count"], int(row["state_target"])],
            "practice_areas": [metrics["practice_area_count"], int(row["practice_area_target"])],
            "holdout": [metrics["holdout_count"], int(row["holdout_target"])],
            "benchmark_candidate": [metrics["benchmark_candidate_count"], int(row["benchmark_candidate_target"])],
        }
        completed = sum(1 for current, target in checks.values() if current >= target)
        progress.append(
            {
                "stage": stage,
                "checks_completed": completed,
                "checks_total": len(checks),
                "checks": {
                    key: {"current": current, "target": target, "met": current >= target}
                    for key, (current, target) in checks.items()
                },
                "low_star_total": low_star,
            }
        )
    return progress


def main():
    args = parse_args()
    batch_rows = load_rows(args.batches_dir)
    queue_rows = load_rows(args.queues_dir)
    targets_rows = read_csv(args.targets)

    metrics = count_rows(batch_rows, queue_rows)
    summary = {
        "metrics": metrics,
        "stage_progress": stage_progress(metrics, targets_rows),
    }

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
