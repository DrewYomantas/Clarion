"""
usage_analyst_runner.py
Clarion — Product Usage Analyst Agent Runner
Division: Product Insight | Cadence: Weekly

Usage: python workflows/usage_analyst_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Feature Usage Log (weekly)":        DATA / "product"  / "feature_usage.csv",
        "Session Frequency & Depth":         DATA / "product"  / "session_log.csv",
        "Account Roster (plan + tier)":      DATA / "customer" / "account_roster.csv",
        "Feature Adoption Baseline (4wk)":   DATA / "product"  / "adoption_baseline.csv",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "usage_analyst",
        prompt_rel_path = "agents/product_insight/usage_analyst.md",
        report_subdir   = "product_insight",
        data_context    = build_data_context(),
        agent_title     = "Clarion Product Usage Analyst Agent",
    )
