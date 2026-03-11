"""
icp_analyst_runner.py
Clarion — ICP Analyst Agent Runner
Division: Market Intelligence | Cadence: Quarterly

Usage: python workflows/icp_analyst_runner.py
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
        "Closed/Won with Firmographics (90d)":  DATA   / "revenue" / "closed_won.csv",
        "Closed/Lost with Firmographics (90d)": DATA   / "revenue" / "closed_lost.csv",
        "Churn Log with Firmographics (90d)":   DATA   / "revenue" / "churn_log.csv",
        "Current ICP Definition":               MEMORY / "customer_insights.md",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "icp_analyst",
        prompt_rel_path = "agents/market/icp_analyst.md",
        report_subdir   = "market",
        data_context    = build_data_context(),
        agent_title     = "Clarion ICP Analyst Agent",
    )
