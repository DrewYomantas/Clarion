"""
customer_discovery_runner.py
Clarion — Customer Discovery Agent Runner  (replaces original customer_discovery_agent.py)
Division: Market Intelligence | Cadence: Weekly

Usage: python workflows/customer_discovery_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent

# Customer Discovery is web-search driven — no local data files.
# The agent prompt lists search queries; the model executes them.
def build_data_context() -> str:
    return (
        "No pre-loaded data files for this agent.\n"
        "Execute all search queries listed in your prompt against live public sources.\n"
        "If a source is unreachable, note it as 'unavailable this run' in INPUTS USED.\n"
        "Do not fabricate signals."
    )

if __name__ == "__main__":
    run_agent(
        agent_key       = "customer_discovery",
        prompt_rel_path = "agents/market/customer_discovery.md",
        report_subdir   = "market",
        data_context    = build_data_context(),
        agent_title     = "Clarion Customer Discovery Agent",
    )
