"""
sales_development_runner.py
Clarion — Sales Development Agent Runner
Division: Revenue | Cadence: Weekly

Usage: python workflows/sales_development_runner.py
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
        "New Leads This Week":            DATA   / "revenue" / "new_leads.csv",
        "Lead Source Breakdown":          DATA   / "revenue" / "lead_sources.csv",
        "Outbound Activity Log":          DATA   / "revenue" / "outbound_log.csv",
        "Lead-to-Qualified Rates (4wk)":  DATA   / "revenue" / "lead_conversion.csv",
        "ICP Reference":                  MEMORY / "customer_insights.md",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "sales_development",
        prompt_rel_path = "agents/revenue/sales_development.md",
        report_subdir   = "revenue",
        data_context    = build_data_context(),
        agent_title     = "Clarion Sales Development Agent",
    )
