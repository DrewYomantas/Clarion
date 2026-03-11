"""
release_impact_runner.py
Clarion — Release Impact Agent Runner
Division: Product Insight | Cadence: Event-Driven

Usage: python workflows/release_impact_runner.py --version v1.2.0
       python workflows/release_impact_runner.py          (uses "latest" if no flag)

Drop the release notes file at: data/product/release_notes_[version].md
before running.
"""
import sys
import argparse
import datetime
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file, _load_config

DATA = BASE_DIR / "data"


def build_data_context(version: str) -> str:
    release_notes_path = DATA / "product" / f"release_notes_{version}.md"
    files = {
        f"Release Notes ({version})":           release_notes_path,
        "Feature Usage (pre/post 2wk window)":  DATA / "product"  / "feature_usage.csv",
        "Support Tickets (30 days)":            DATA / "customer" / "support_tickets.csv",
        "Survey Responses":                     DATA / "customer" / "survey_responses.csv",
        "Session Log (post-release)":           DATA / "product"  / "session_log.csv",
    }
    parts = []
    for label, path in files.items():
        parts.append(f"### {label}\n{_load_file(path, label)}\n")
    return "\n".join(parts)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Release Impact Agent")
    parser.add_argument("--version", default="latest", help="Release version tag")
    args = parser.parse_args()

    date_str = datetime.date.today().isoformat()
    filename_prefix = f"release_impact_{args.version}"

    run_agent(
        agent_key              = "release_impact",
        prompt_rel_path        = "agents/product_insight/release_impact.md",
        report_subdir          = "product_insight",
        data_context           = build_data_context(args.version),
        agent_title            = "Clarion Release Impact Agent",
        report_filename_prefix = filename_prefix,
    )
