"""
competitive_intelligence_runner.py
Clarion — Competitive Intelligence Agent Runner
Division: Market Intelligence | Cadence: Weekly

Usage: python workflows/competitive_intelligence_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    files = {
        "Competitor Tracking Reference":  DATA / "market" / "competitors.md",
        "Competitor Pricing Snapshot":    DATA / "market" / "competitor_pricing.md",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    parts.append(
        "### Live Sources\n"
        "Also check G2, Capterra, and public job boards for signals per your prompt.\n"
    )
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "competitive_intelligence",
        prompt_rel_path = "agents/market/competitive_intelligence.md",
        report_subdir   = "market",
        data_context    = build_data_context(),
        agent_title     = "Clarion Competitive Intelligence Agent",
    )
