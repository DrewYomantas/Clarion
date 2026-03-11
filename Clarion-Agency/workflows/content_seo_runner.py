"""
content_seo_runner.py
Clarion — Content & SEO Agent Runner
Division: Comms & Content | Cadence: Weekly

This agent cross-reads the Customer Discovery and Competitive Intelligence
reports filed this week, so it runs AFTER those two agents complete.

Usage: python workflows/content_seo_runner.py
"""
import sys
import datetime
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

DATA    = BASE_DIR / "data"
MEMORY  = BASE_DIR / "memory"
REPORTS = BASE_DIR / "reports"


def _latest_report(subdir: str, prefix: str) -> Path:
    """Return the most recent report file matching prefix in reports/subdir/."""
    report_dir = REPORTS / subdir
    matches = sorted(report_dir.glob(f"{prefix}_*.md"), reverse=True)
    if matches:
        return matches[0]
    return report_dir / f"{prefix}_not_found.md"  # _load_file will warn gracefully


def build_data_context() -> str:
    discovery_path   = _latest_report("market", "customer_discovery")
    competitive_path = _latest_report("market", "competitive_intelligence")

    files = {
        "Customer Discovery Report (latest)":       discovery_path,
        "Competitive Intelligence Report (latest)": competitive_path,
        "SEO Keyword Data":                         DATA   / "comms" / "seo_keywords.csv",
        "Published Content Log":                    DATA   / "comms" / "content_log.csv",
        "Brand Canon":                              MEMORY / "brand_canon.md",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)


if __name__ == "__main__":
    run_agent(
        agent_key       = "content_seo",
        prompt_rel_path = "agents/comms/content_seo.md",
        report_subdir   = "comms",
        data_context    = build_data_context(),
        agent_title     = "Clarion Content & SEO Agent",
    )
