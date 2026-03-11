"""
process_analyst_runner.py
Clarion — Internal Process Analyst Agent Runner
Division: Operations | Cadence: Weekly

Usage: python workflows/process_analyst_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Support Ticket Log (timestamps + status)": DATA / "operations" / "support_tickets.csv",
        "Onboarding Milestone Completion Log":       DATA / "customer"   / "onboarding_milestones.csv",
        "Internal Task / Project Log":               DATA / "operations" / "task_log.csv",
        "SLA Targets Reference":                     DATA / "operations" / "sla_targets.md",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "process_analyst",
        prompt_rel_path = "agents/operations/process_analyst.md",
        report_subdir   = "operations",
        data_context    = build_data_context(),
        agent_title     = "Clarion Internal Process Analyst Agent",
    )
