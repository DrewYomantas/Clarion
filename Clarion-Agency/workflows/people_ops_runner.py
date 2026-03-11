"""
people_ops_runner.py
Clarion — People & Ops Intelligence Agent Runner
Division: People & Culture | Cadence: Monthly

Cross-reads Process Analyst, Customer Health, and Scoring Quality reports.
Runs AFTER those three agents complete.

Usage: python workflows/people_ops_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA    = BASE_DIR / "data"
REPORTS = BASE_DIR / "reports"


def _latest_report(subdir: str, prefix: str) -> Path:
    report_dir = REPORTS / subdir
    matches = sorted(report_dir.glob(f"{prefix}_*.md"), reverse=True)
    if matches:
        return matches[0]
    return report_dir / f"{prefix}_not_found.md"


def build_data_context() -> str:
    process_report  = _latest_report("operations",        "process_analyst")
    health_report   = _latest_report("customer",          "customer_health_onboarding")
    scoring_report  = _latest_report("product_integrity", "scoring_quality")

    files = {
        "Headcount & Role Log":                   DATA / "people" / "headcount.csv",
        "Open Roles & Time-to-Fill":              DATA / "people" / "open_roles.csv",
        "Team Pulse Survey":                      DATA / "people" / "pulse_survey.csv",
        "Process Analyst Report (latest)":        process_report,
        "Customer Health Report (latest)":        health_report,
        "Scoring Quality Report (latest)":        scoring_report,
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)


if __name__ == "__main__":
    run_agent(
        agent_key              = "people_ops",
        prompt_rel_path        = "agents/people/people_ops_intelligence.md",
        report_subdir          = "people",
        data_context           = build_data_context(),
        agent_title            = "Clarion People & Ops Intelligence Agent",
        report_filename_prefix = "people_ops",
    )
