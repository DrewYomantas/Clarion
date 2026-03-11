"""
head_of_growth_runner.py
Clarion — Head of Growth Agent Runner
Division: Revenue | Cadence: Weekly

Usage: python workflows/head_of_growth_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Pipeline Snapshot":         DATA / "revenue" / "pipeline_snapshot.csv",
        "Closed/Lost (30 days)":     DATA / "revenue" / "closed_lost.csv",
        "New Activations":           DATA / "revenue" / "activations.csv",
        "MRR/ARR Snapshot":          DATA / "revenue" / "mrr_arr.csv",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "head_of_growth",
        prompt_rel_path = "agents/revenue/head_of_growth.md",
        report_subdir   = "revenue",
        data_context    = build_data_context(),
        agent_title     = "Clarion Head of Growth Agent",
    )
