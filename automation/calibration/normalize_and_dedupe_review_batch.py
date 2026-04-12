#!/usr/bin/env python3
"""
Normalize a collected review batch and produce dedupe artifacts.
"""

import argparse
import csv
import hashlib
import json
import re
from difflib import SequenceMatcher
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description="Normalize and dedupe a Clarion review acquisition batch")
    parser.add_argument("--batch", required=True, help="Input batch CSV")
    parser.add_argument("--output", required=True, help="Normalized output CSV")
    parser.add_argument("--report-dir", required=True, help="Directory for dedupe reports")
    return parser.parse_args()


def read_csv(path):
    with open(path, newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        return reader.fieldnames or [], rows


def write_csv(path, fieldnames, rows):
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def normalize_text(value):
    text = (value or "").replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text


def slugify(value):
    token = normalize_text(value)
    token = re.sub(r"[^a-z0-9]+", "_", token).strip("_")
    return token


def text_hash(value):
    return hashlib.sha1(value.encode("utf-8")).hexdigest() if value else ""


def word_count(value):
    return len([part for part in normalize_text(value).split(" ") if part])


def length_bucket(value):
    count = word_count(value)
    if count <= 35:
        return "short"
    if count <= 120:
        return "medium"
    return "long"


def similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()


def find_duplicates(rows):
    exact_groups = {}
    likely_pairs = []
    for row in rows:
        key = row["normalized_text_hash"]
        exact_groups.setdefault(key, []).append(row)

    grouped_rows = {}
    for row in rows:
        group_key = (row.get("source_firm_key", ""), row.get("review_rating", ""))
        grouped_rows.setdefault(group_key, []).append(row)

    for grouped in grouped_rows.values():
        for index, left in enumerate(grouped):
            for right in grouped[index + 1 :]:
                if left["record_id"] == right["record_id"]:
                    continue
                score = similarity(left["review_text_normalized"], right["review_text_normalized"])
                if score >= 0.96:
                    likely_pairs.append((left["record_id"], right["record_id"], score, "likely_duplicate_same_source"))

    return exact_groups, likely_pairs


def main():
    args = parse_args()
    fieldnames, rows = read_csv(args.batch)
    fieldnames = list(fieldnames)
    required_fields = [
        "review_text_normalized",
        "normalized_text_hash",
        "source_firm_key",
        "length_bucket",
        "dedupe_status",
        "dedupe_group_id",
        "duplicate_of_record_id",
    ]
    for field in required_fields:
        if field not in fieldnames:
            fieldnames.append(field)

    for row in rows:
        raw_text = row.get("review_text_raw", "")
        normalized = normalize_text(raw_text)
        row["review_text_normalized"] = normalized
        row["normalized_text_hash"] = text_hash(normalized)
        row["source_firm_key"] = f"{slugify(row.get('firm_name', ''))}__{slugify(row.get('state', ''))}"
        row["length_bucket"] = length_bucket(raw_text)
        row["dedupe_status"] = row.get("dedupe_status", "") or "unique"
        row["dedupe_group_id"] = row.get("dedupe_group_id", "")
        row["duplicate_of_record_id"] = row.get("duplicate_of_record_id", "")

    exact_groups, likely_pairs = find_duplicates(rows)
    duplicate_report = []

    for hash_value, grouped in exact_groups.items():
        if hash_value and len(grouped) > 1:
            primary = grouped[0]["record_id"]
            group_id = f"exact_{hash_value[:10]}"
            for index, row in enumerate(grouped):
                if index == 0:
                    row["dedupe_status"] = "primary_exact_duplicate_group"
                    row["dedupe_group_id"] = group_id
                else:
                    row["dedupe_status"] = "exact_duplicate"
                    row["dedupe_group_id"] = group_id
                    row["duplicate_of_record_id"] = primary
                duplicate_report.append(
                    {
                        "duplicate_type": row["dedupe_status"],
                        "record_id": row["record_id"],
                        "group_id": group_id,
                        "duplicate_of_record_id": row["duplicate_of_record_id"],
                        "similarity_score": 1.0,
                    }
                )

    for left_id, right_id, score, duplicate_type in likely_pairs:
        duplicate_report.append(
            {
                "duplicate_type": duplicate_type,
                "record_id": left_id,
                "group_id": f"likely_{left_id}_{right_id}",
                "duplicate_of_record_id": right_id,
                "similarity_score": round(score, 4),
            }
        )

    write_csv(args.output, fieldnames, rows)

    report_dir = Path(args.report_dir)
    report_dir.mkdir(parents=True, exist_ok=True)
    duplicate_csv = report_dir / f"{Path(args.batch).stem}_dedupe_report.csv"
    duplicate_fields = [
        "duplicate_type",
        "record_id",
        "group_id",
        "duplicate_of_record_id",
        "similarity_score",
    ]
    write_csv(duplicate_csv, duplicate_fields, duplicate_report)

    summary = {
        "batch": str(Path(args.batch).name),
        "total_rows": len(rows),
        "exact_duplicate_groups": sum(1 for grouped in exact_groups.values() if len(grouped) > 1),
        "exact_duplicate_rows": sum(max(0, len(grouped) - 1) for grouped in exact_groups.values() if len(grouped) > 1),
        "likely_duplicate_pairs": len(likely_pairs),
        "long_rows": sum(1 for row in rows if row["length_bucket"] == "long"),
    }
    summary_path = report_dir / f"{Path(args.batch).stem}_dedupe_summary.json"
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
