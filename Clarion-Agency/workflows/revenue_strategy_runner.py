"""
revenue_strategy_runner.py
Clarion — Revenue Strategy Agent Runner
Division: Revenue | Cadence: Monthly

Usage: python workflows/revenue_strategy_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "MRR/ARR by Plan Tier":               DATA / "revenue" / "mrr_by_tier.csv",
        "Expansion/Contraction (60 days)":    DATA / "revenue" / "expansion_contraction.csv",
        "Churn Log with Reason Codes (90d)":  DATA / "revenue" / "churn_log.csv",
        "Plan Distribution":                  DATA / "revenue" / "plan_distribution.csv",
        "Competitor Pricing Reference":       DATA / "market"  / "competitor_pricing.md",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "revenue_strategy",
        prompt_rel_path = "agents/revenue/revenue_strategy.md",
        report_subdir   = "revenue",
        data_context    = build_data_context(),
        agent_title     = "Clarion Revenue Strategy Agent",
    )
