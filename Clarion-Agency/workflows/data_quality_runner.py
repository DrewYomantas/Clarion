"""
data_quality_runner.py
Clarion — Data Quality Agent Runner
Division: Product Integrity | Cadence: Weekly
Temperature: 0.0 — input health audit; no creativity permitted.

Usage: python workflows/data_quality_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Review Submission Log (this week)":      DATA / "integrity" / "submission_log.csv",
        "Ingestion Error Log":                    DATA / "integrity" / "ingestion_errors.csv",
        "Review Record Validation Report":        DATA / "integrity" / "validation_report.csv",
        "Submission Volume by Account (8wk)":     DATA / "integrity" / "submission_volume.csv",
        "Account Roster":                         DATA / "customer"  / "account_roster.csv",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "data_quality",
        prompt_rel_path = "agents/product_integrity/data_quality.md",
        report_subdir   = "product_integrity",
        data_context    = build_data_context(),
        agent_title     = "Clarion Data Quality Agent",
    )
