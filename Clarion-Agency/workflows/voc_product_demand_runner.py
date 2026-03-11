"""
voc_product_demand_runner.py
Clarion — Voice of Customer & Product Demand Agent Runner
Division: Customer Intelligence | Cadence: Weekly

Usage: python workflows/voc_product_demand_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Support Tickets (30 days)":      DATA / "customer" / "support_tickets.csv",
        "NPS/CSAT Survey Responses":      DATA / "customer" / "survey_responses.csv",
        "Onboarding Feedback Notes":      DATA / "customer" / "onboarding_feedback.csv",
        "Feature Request Log":            DATA / "customer" / "feature_requests.csv",
        "Sales Call Notes (objections)":  DATA / "revenue"  / "call_notes.csv",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "voc_product_demand",
        prompt_rel_path = "agents/customer/voc_product_demand.md",
        report_subdir   = "customer",
        data_context    = build_data_context(),
        agent_title     = "Clarion Voice of Customer & Product Demand Agent",
    )
