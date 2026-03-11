"""
cost_resource_runner.py
Clarion — Cost & Resource Analyst Agent Runner
Division: Operations | Cadence: Weekly
Temperature: 0.1 — spend analysis; minimal creative latitude.

Usage: python workflows/cost_resource_runner.py
"""
import sys
import json
import glob
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA     = BASE_DIR / "data"
REPORTS  = BASE_DIR / "reports"
CONFIG   = BASE_DIR / "config.json"


def build_data_context() -> str:
    parts = []

    # Collect all run_log.jsonl files across all agent report directories
    run_logs = list(REPORTS.rglob("run_log.jsonl"))
    if run_logs:
        parts.append("### Agent Run Logs (token counts per run)\n")
        for log_path in run_logs:
            parts.append(f"#### {log_path.parent.name}/run_log.jsonl")
            # Read last 20 lines only to stay within token budget
            lines = log_path.read_text(encoding="utf-8").strip().splitlines()
            parts.append("\n".join(lines[-20:]) + "\n")
    else:
        parts.append("### Agent Run Logs\nNo run logs found yet.\n")

    # Config for token budgets
    parts.append(f"### Agent Token Budgets (config.json)\n{_load_file(CONFIG, 'config.json')}\n")

    # Infrastructure costs (optional)
    parts.append(f"### Infrastructure Cost Export\n{_load_file(DATA / 'operations' / 'infra_costs.csv', 'infra_costs')}\n")
    parts.append(f"### OpenRouter Usage Log\n{_load_file(DATA / 'operations' / 'openrouter_usage.csv', 'openrouter_usage')}\n")

    return "\n".join(parts)


if __name__ == "__main__":
    run_agent(
        agent_key       = "cost_resource",
        prompt_rel_path = "agents/operations/cost_resource.md",
        report_subdir   = "operations",
        data_context    = build_data_context(),
        agent_title     = "Clarion Cost & Resource Analyst Agent",
    )
