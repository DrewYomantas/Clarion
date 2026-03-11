"""
scoring_quality_runner.py
Clarion — Scoring Quality Agent Runner
Division: Product Integrity | Cadence: Weekly
Temperature: 0.0 — determinism check; no creativity permitted.

Usage: python workflows/scoring_quality_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Scoring Output Log (this week)":        DATA / "integrity" / "scoring_output.csv",
        "Score Distribution Baseline (4wk)":     DATA / "integrity" / "score_baseline.csv",
        "Edge Case Log":                         DATA / "integrity" / "edge_cases.csv",
        "Batch Metadata":                        DATA / "integrity" / "batch_metadata.csv",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "scoring_quality",
        prompt_rel_path = "agents/product_integrity/scoring_quality.md",
        report_subdir   = "product_integrity",
        data_context    = build_data_context(),
        agent_title     = "Clarion Scoring Quality Agent",
    )
