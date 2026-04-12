"""
Legacy benchmark routes.

The authoritative internal benchmark harness lives at /internal/benchmark and
uses services.benchmark_* modules. The older /internal/bench path is frozen so
it cannot silently exercise the stale services.bench stack.
"""

from __future__ import annotations

from flask import Blueprint, jsonify

bench_bp = Blueprint("bench", __name__, url_prefix="/internal/bench")

_LEGACY_BENCH_RESPONSE = {
    "success": False,
    "error": "The legacy /internal/bench benchmark path is frozen and no longer supported.",
    "authoritative_path": "/internal/benchmark",
    "authoritative_route_file": "backend/routes/internal_benchmark.py",
    "authoritative_engine_file": "backend/services/benchmark_engine.py",
}


def _legacy_bench_disabled():
    return jsonify(_LEGACY_BENCH_RESPONSE), 410


@bench_bp.route("/single", methods=["GET", "POST"])
@bench_bp.route("/batch", methods=["GET", "POST"])
@bench_bp.route("/fixtures", methods=["GET", "POST"])
@bench_bp.route("/calibration-report", methods=["GET", "POST"])
@bench_bp.route("/run-all", methods=["GET", "POST"])
def legacy_bench_disabled():
    return _legacy_bench_disabled()
