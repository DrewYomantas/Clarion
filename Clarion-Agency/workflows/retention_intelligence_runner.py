"""
retention_intelligence_runner.py
Clarion — Retention Intelligence Agent Runner
Division: Customer Intelligence | Cadence: Monthly

Usage: python workflows/retention_intelligence_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Churn Log with Exit Reasons (90d)":    DATA / "revenue"  / "churn_log.csv",
        "Contraction/Downgrade Events (90d)":   DATA / "revenue"  / "expansion_contraction.csv",
        "Exit Survey Responses":                DATA / "customer" / "exit_surveys.csv",
        "Account Roster at Churn":              DATA / "customer" / "account_roster.csv",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "retention_intelligence",
        prompt_rel_path = "agents/customer/retention_intelligence.md",
        report_subdir   = "customer",
        data_context    = build_data_context(),
        agent_title     = "Clarion Retention Intelligence Agent",
    )
