"""
routes/bench_routes.py
========================
Internal-only routes for the calibration benchmark harness.

ALL routes are prefixed with /internal/bench and are protected by a shared
secret token (BENCH_SECRET env var).  They are NOT registered in production
unless BENCH_ENABLED=1 is explicitly set in the environment.

Routes
------
POST /internal/bench/single
    Run the deterministic tagger (and optionally AI benchmark) on a single
    review submitted in the request body.

POST /internal/bench/batch
    Same as /single but accepts a list of reviews (up to BATCH_LIMIT).

POST /internal/bench/fixtures
    Run the full fixture dataset through the harness and return comparison
    objects for all 10 seed reviews.

POST /internal/bench/calibration-report
    Accept a list of pre-run comparisons (from /batch or /fixtures) and
    return the aggregated calibration report.

POST /internal/bench/run-all
    Convenience endpoint: runs fixtures, compares, and returns the calibration
    report in a single call.

Authentication
--------------
Every request must include the header:
    X-Bench-Secret: <value of BENCH_SECRET env var>

If BENCH_SECRET is not set, all requests are rejected with 403.
This is intentionally simple — these routes are for local/staging use only
and should never be internet-facing.
"""

from __future__ import annotations

import logging
import os
from typing import Any

from flask import Blueprint, jsonify, request

from services.bench.deterministic_tagger import tag_review
from services.bench import openrouter_client
from services.bench import comparator
from services.bench import calibration_report as cal_report
from services.bench.fixtures import FIXTURES

logger = logging.getLogger("bench.routes")

bench_bp = Blueprint("bench", __name__, url_prefix="/internal/bench")

BATCH_LIMIT = 200  # max reviews accepted in a single /batch call


# ---------------------------------------------------------------------------
# Auth guard
# ---------------------------------------------------------------------------

def _check_auth() -> tuple[bool, str]:
    """Return (ok, error_message)."""
    secret = os.environ.get("BENCH_SECRET", "").strip()
    if not secret:
        return False, "BENCH_SECRET env var is not set — bench routes are disabled"
    provided = request.headers.get("X-Bench-Secret", "").strip()
    if provided != secret:
        return False, "Invalid or missing X-Bench-Secret header"
    return True, ""


def _auth_error(msg: str):
    return jsonify({"success": False, "error": msg}), 403


# ---------------------------------------------------------------------------
# Shared logic
# ---------------------------------------------------------------------------

def _run_single(review_text: str, rating: int, review_date: str | None, use_ai: bool) -> dict[str, Any]:
    """Run the full benchmark pipeline for one review."""
    det_result = tag_review(review_text, rating, review_date)
    ai_result = None
    if use_ai:
        if openrouter_client.is_available():
            ai_result = openrouter_client.get_ai_labels(review_text, rating)
        else:
            logger.warning("bench: AI requested but OPENROUTER_API_KEY not set")
    return comparator.compare(det_result, ai_result)


def _validate_review_payload(data: dict) -> tuple[str | None, int | None, str | None, str | None]:
    """
    Extract and validate review fields from a request payload.
    Returns (review_text, rating, review_date, error_string).
    error_string is None on success.
    """
    review_text = str(data.get("review_text") or "").strip()
    if not review_text:
        return None, None, None, "review_text is required"

    try:
        rating = int(data.get("rating") or 0)
    except (ValueError, TypeError):
        return None, None, None, "rating must be an integer 1-5"

    if not (1 <= rating <= 5):
        return None, None, None, "rating must be between 1 and 5"

    review_date = str(data.get("review_date") or "").strip() or None
    return review_text, rating, review_date, None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@bench_bp.post("/single")
def bench_single():
    """
    Run deterministic + optional AI benchmark on one review.

    Request body (JSON):
        review_text : str   (required)
        rating      : int   (1-5, required)
        review_date : str   (ISO date, optional)
        use_ai      : bool  (default false)

    Returns the comparison object.
    """
    ok, err = _check_auth()
    if not ok:
        return _auth_error(err)

    data = request.get_json(silent=True) or {}
    review_text, rating, review_date, error = _validate_review_payload(data)
    if error:
        return jsonify({"success": False, "error": error}), 400

    use_ai = bool(data.get("use_ai", False))
    comparison = _run_single(review_text, rating, review_date, use_ai)
    return jsonify({"success": True, "result": comparison})


@bench_bp.post("/batch")
def bench_batch():
    """
    Run deterministic + optional AI benchmark on a list of reviews.

    Request body (JSON):
        reviews : list[{review_text, rating, review_date?}]  (required, max 200)
        use_ai  : bool  (default false)

    Returns a list of comparison objects.
    """
    ok, err = _check_auth()
    if not ok:
        return _auth_error(err)

    data = request.get_json(silent=True) or {}
    reviews = data.get("reviews")
    if not isinstance(reviews, list) or not reviews:
        return jsonify({"success": False, "error": "reviews must be a non-empty list"}), 400

    if len(reviews) > BATCH_LIMIT:
        return jsonify({"success": False, "error": f"Maximum batch size is {BATCH_LIMIT}"}), 400

    use_ai = bool(data.get("use_ai", False))
    results = []
    errors = []

    for i, review in enumerate(reviews):
        if not isinstance(review, dict):
            errors.append({"index": i, "error": "item must be an object"})
            continue
        review_text, rating, review_date, error = _validate_review_payload(review)
        if error:
            errors.append({"index": i, "error": error})
            continue
        comparison = _run_single(review_text, rating, review_date, use_ai)
        results.append(comparison)

    return jsonify({
        "success": True,
        "results": results,
        "processed": len(results),
        "errors": errors,
    })


@bench_bp.post("/fixtures")
def bench_fixtures():
    """
    Run the built-in seed dataset through the harness.

    Request body (JSON, optional):
        use_ai : bool  (default false)

    Returns all 10 fixture comparisons plus the fixture metadata.
    """
    ok, err = _check_auth()
    if not ok:
        return _auth_error(err)

    data = request.get_json(silent=True) or {}
    use_ai = bool(data.get("use_ai", False))

    results = []
    for fixture in FIXTURES:
        comparison = _run_single(
            fixture["review_text"],
            fixture["rating"],
            fixture["review_date"],
            use_ai,
        )
        # Attach fixture metadata for traceability
        comparison["fixture_notes"] = fixture["notes"]
        comparison["expected_themes"] = fixture["expected_themes"]
        results.append(comparison)

    return jsonify({
        "success": True,
        "fixture_count": len(FIXTURES),
        "results": results,
    })


@bench_bp.post("/calibration-report")
def bench_calibration_report():
    """
    Generate a calibration report from pre-run comparison objects.

    Request body (JSON):
        comparisons : list[comparison_object]  (from /batch or /fixtures)

    Returns the full calibration report.
    """
    ok, err = _check_auth()
    if not ok:
        return _auth_error(err)

    data = request.get_json(silent=True) or {}
    comparisons = data.get("comparisons")
    if not isinstance(comparisons, list):
        return jsonify({"success": False, "error": "comparisons must be a list"}), 400

    report = cal_report.generate(comparisons)
    return jsonify({"success": True, "report": report})


@bench_bp.post("/run-all")
def bench_run_all():
    """
    Convenience: run all fixtures through the harness and return the
    calibration report in a single call.

    Request body (JSON, optional):
        use_ai : bool  (default false)

    Returns:
        fixture_results : list[comparison_object]
        calibration_report : dict
        ai_available : bool
    """
    ok, err = _check_auth()
    if not ok:
        return _auth_error(err)

    data = request.get_json(silent=True) or {}
    use_ai = bool(data.get("use_ai", False))

    comparisons = []
    for fixture in FIXTURES:
        comparison = _run_single(
            fixture["review_text"],
            fixture["rating"],
            fixture["review_date"],
            use_ai,
        )
        comparison["fixture_notes"] = fixture["notes"]
        comparison["expected_themes"] = fixture["expected_themes"]
        comparisons.append(comparison)

    report = cal_report.generate(comparisons)

    return jsonify({
        "success": True,
        "ai_available": openrouter_client.is_available(),
        "fixture_count": len(FIXTURES),
        "fixture_results": comparisons,
        "calibration_report": report,
    })
