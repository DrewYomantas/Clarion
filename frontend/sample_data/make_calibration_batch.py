import csv
import json
import sys


def _get_col(row: dict, candidates: list[str], default: str = "") -> str:
    """Return the first matching column value from a list of candidate names."""
    for name in candidates:
        if name in row:
            return row[name]
    return default


def csv_to_reviews(csv_path: str) -> list[dict]:
    """
    Read a CSV and return a list of review dicts suitable for the benchmark API.

    Column fallbacks:
      review_text → "review_text", "Review", "review", "text", "Text"
      rating      → "rating", "Rating", "stars", "Stars"  (int, default 3)
      date        → "date", "Date", "review_date"          (default "2025-01-01")

    Rows where review_text is empty after strip() are skipped.
    Rows with missing or non-integer rating default to 3 (not skipped).
    """
    TEXT_COLS  = ["review_text", "Review", "review", "text", "Text"]
    RATING_COLS = ["rating", "Rating", "stars", "Stars"]
    DATE_COLS  = ["date", "Date", "review_date"]

    reviews = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            text = _get_col(row, TEXT_COLS).strip()
            if not text:
                continue

            rating_raw = _get_col(row, RATING_COLS)
            try:
                rating = int(rating_raw)
                if rating < 1 or rating > 5:
                    rating = 3
            except (TypeError, ValueError):
                rating = 3

            date = _get_col(row, DATE_COLS).strip() or "2025-01-01"

            reviews.append({
                "review_text": text,
                "rating": rating,
                "date": date,
            })

    return reviews


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_calibration_batch.py <path_to_csv>", file=sys.stderr)
        raise SystemExit(1)

    csv_path = sys.argv[1]
    reviews = csv_to_reviews(csv_path)

    # Print only the reviews array to stdout so callers can capture and merge it.
    print(json.dumps({"reviews": reviews}))
