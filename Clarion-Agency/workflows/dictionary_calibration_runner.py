"""
dictionary_calibration_runner.py
Clarion — Phrase Dictionary Calibration Agent Runner
Division: Product Integrity | Cadence: Monthly
Temperature: 0.0 — zero creativity, proposals only.

Usage: python workflows/dictionary_calibration_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA   = BASE_DIR / "data"
MEMORY = BASE_DIR / "memory"

def build_data_context() -> str:
    files = {
        "Review Samples — Anonymized (30d)":    DATA   / "integrity" / "review_samples.csv",
        "Phrase Dictionary Export":             DATA   / "integrity" / "phrase_dictionary_export.csv",
        "Scoring Output Log (theme assigns)":   DATA   / "integrity" / "scoring_output.csv",
        "Score Outlier Report":                 DATA   / "integrity" / "score_outliers.csv",
        "Calibration Log (reference only)":     MEMORY / "calibration_log.md",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "dictionary_calibration",
        prompt_rel_path = "agents/product_integrity/dictionary_calibration.md",
        report_subdir   = "product_integrity",
        data_context    = build_data_context(),
        agent_title     = "Clarion Dictionary Calibration Agent",
    )
