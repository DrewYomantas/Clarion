"""
services/benchmark_exporter.py

Optional offline export for benchmark results and calibration reports.

Writes JSON files to a controlled internal directory only when explicitly
requested. Never writes files automatically during normal benchmark runs.

SAFE EXPORT DIRECTORY: backend/exports/benchmark/
  - Created automatically if it doesn't exist.
  - Only filenames with timestamps are written (no path traversal possible).
  - Never exposed to the frontend or any public API.

Usage:
    from services.benchmark_exporter import export_benchmark_run

    path = export_benchmark_run(
        calibration_report=report,
        benchmark_results=results,
        disagreement_batches=batches,
        phrase_candidates=candidates,
        label="pre_launch_v1",   # optional slug appended to filename
    )
    # Returns the absolute path of the written file, or None on failure.
"""

from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger("benchmark_exporter")

# Controlled export directory — relative to this file's location
# Resolves to: backend/exports/benchmark/
_EXPORT_DIR = Path(__file__).parent.parent / "exports" / "benchmark"

# Maximum label length for filename safety
_MAX_LABEL_LEN = 40


def _safe_label(label: str) -> str:
    """Strip any non-alphanumeric/dash/underscore chars and truncate."""
    cleaned = re.sub(r'[^a-zA-Z0-9_\-]', '_', label or "")
    return cleaned[:_MAX_LABEL_LEN]


def _ensure_export_dir() -> Path:
    """Create the export directory if it doesn't exist."""
    _EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    return _EXPORT_DIR


def export_benchmark_run(
    calibration_report: Dict[str, Any],
    benchmark_results: Optional[List[Dict[str, Any]]] = None,
    disagreement_batches: Optional[List[List[Dict[str, Any]]]] = None,
    phrase_candidates: Optional[List[Dict[str, Any]]] = None,
    label: str = "",
) -> Optional[str]:
    """
    Write a benchmark run to a timestamped JSON file in the safe export dir.

    Parameters
    ----------
    calibration_report   : CalibrationReport dict (required)
    benchmark_results    : optional list of BenchmarkResult dicts
    disagreement_batches : optional list of disagreement record batches
    phrase_candidates    : optional list of PhraseCandidateGroup dicts
    label                : optional short slug appended to the filename

    Returns
    -------
    Absolute path (str) of the written file, or None if write failed.
    """
    try:
        export_dir = _ensure_export_dir()
        ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        safe = _safe_label(label)
        filename = f"benchmark_{ts}_{safe}.json" if safe else f"benchmark_{ts}.json"
        filepath = export_dir / filename

        payload: Dict[str, Any] = {
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "label": label or None,
            "calibration_report": calibration_report,
        }
        if benchmark_results is not None:
            payload["benchmark_results"] = benchmark_results
        if disagreement_batches is not None:
            payload["disagreement_batches"] = disagreement_batches
        if phrase_candidates is not None:
            payload["phrase_candidates"] = phrase_candidates

        with open(filepath, "w", encoding="utf-8") as fh:
            json.dump(payload, fh, indent=2, ensure_ascii=False)

        logger.info("benchmark_exporter: wrote %s", filepath)
        return str(filepath)

    except Exception as exc:
        logger.error("benchmark_exporter: failed to write export: %s", exc)
        return None
