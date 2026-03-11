"""
market_trends_runner.py
Clarion — Market Trends Agent Runner
Division: Market Intelligence | Cadence: Monthly

Usage: python workflows/market_trends_runner.py
"""
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA = BASE_DIR / "data"

def build_data_context() -> str:
    # Research reports dir — load any .md files present
    research_dir = DATA / "market" / "research_reports"
    research_files = list(research_dir.glob("*.md")) if research_dir.exists() else []

    parts = ["### Research Reports Provided\n"]
    if research_files:
        for rf in research_files:
            parts.append(f"#### {rf.name}\n{rf.read_text(encoding='utf-8')[:800]}\n")
    else:
        parts.append("No research reports available this cycle.\n")

    parts.append(
        "\n### Live Sources\n"
        "Also scan Legal Tech News, Above the Law, Law360, "
        "law society publications, and LinkedIn per your prompt.\n"
    )
    return "\n".join(parts)

if __name__ == "__main__":
    run_agent(
        agent_key       = "market_trends",
        prompt_rel_path = "agents/market/market_trends.md",
        report_subdir   = "market",
        data_context    = build_data_context(),
        agent_title     = "Clarion Market Trends Agent",
    )
