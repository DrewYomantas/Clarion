"""
funnel_conversion_runner.py
Clarion — Funnel Conversion Agent Runner
Division: Revenue | Cadence: Weekly

Usage: python workflows/funnel_conversion_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Funnel Stage Snapshot":              DATA / "revenue" / "funnel_stages.csv",
        "Stage-to-Stage Conversion (4wk)":    DATA / "revenue" / "conversion_rates.csv",
        "Demo and Trial Activity":            DATA / "revenue" / "demo_trial_log.csv",
        "Closed/Lost Reasons (30 days)":      DATA / "revenue" / "closed_lost.csv",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "funnel_conversion",
        prompt_rel_path = "agents/revenue/funnel_conversion.md",
        report_subdir   = "revenue",
        data_context    = build_data_context(),
        agent_title     = "Clarion Funnel Conversion Agent",
    )
