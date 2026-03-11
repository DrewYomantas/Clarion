"""
customer_health_onboarding_runner.py
Clarion — Customer Health & Onboarding Agent Runner
Division: Customer Intelligence | Cadence: Weekly

Usage: python workflows/customer_health_onboarding_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Account Activity Log":                DATA / "customer" / "account_activity.csv",
        "Onboarding Milestone Tracker (<90d)": DATA / "customer" / "onboarding_milestones.csv",
        "Time-to-First-Value":                 DATA / "customer" / "ttfv.csv",
        "Support Tickets (30 days)":           DATA / "customer" / "support_tickets.csv",
        "Account Roster (tenure + tier)":      DATA / "customer" / "account_roster.csv",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "customer_health_onboarding",
        prompt_rel_path = "agents/customer/customer_health_onboarding.md",
        report_subdir   = "customer",
        data_context    = build_data_context(),
        agent_title     = "Clarion Customer Health & Onboarding Agent",
    )
