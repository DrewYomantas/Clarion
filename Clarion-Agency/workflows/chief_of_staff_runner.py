"""
chief_of_staff_runner.py
Clarion — Chief of Staff Agent Runner
Division: Executive | Cadence: Weekly (runs Saturday, after all department agents)

Reads every report filed in the past 7 days and synthesizes the CEO brief.

Usage: python workflows/chief_of_staff_runner.py
"""
import sys
import datetime
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from shared.agent_runner import run_agent, _load_file

REPORTS  = BASE_DIR / "reports"

# Expected report locations — (subdir, filename_prefix, cadence_note)
EXPECTED_REPORTS = [
    ("revenue",          "head_of_growth",             "weekly"),
    ("revenue",          "funnel_conversion",           "weekly"),
    ("revenue",          "sales_development",           "weekly"),
    ("revenue",          "revenue_strategy",            "monthly — include if filed"),
    ("market",           "customer_discovery",          "weekly"),
    ("market",           "competitive_intelligence",    "weekly"),
    ("market",           "market_trends",               "monthly — include if filed"),
    ("market",           "icp_analyst",                 "quarterly — include if filed"),
    ("customer",         "customer_health_onboarding",  "weekly"),
    ("customer",         "voc_product_demand",          "weekly"),
    ("customer",         "retention_intelligence",      "monthly — include if filed"),
    ("product_insight",  "usage_analyst",               "weekly"),
    ("product_insight",  "release_impact",              "event-driven — include if filed"),
    ("product_integrity","dictionary_calibration",      "monthly — include if filed"),
    ("product_integrity","scoring_quality",             "weekly"),
    ("product_integrity","data_quality",                "weekly"),
    ("operations",       "site_health",                 "weekly"),
    ("operations",       "process_analyst",             "weekly"),
    ("operations",       "cost_resource",               "weekly"),
    ("comms",            "content_seo",                 "weekly"),
    ("people",           "people_ops",                  "monthly — include if filed"),
    ("revenue",          "narrative_strategy",          "monthly — include if filed"),
    ("strategy",         "market_intelligence",         "weekly"),
    ("strategy",         "launch_readiness",            "monthly — include if filed"),
]

LOOKBACK_DAYS = 7


def _find_recent_report(subdir: str, prefix: str) -> tuple[Path | None, bool]:
    """
    Return (path, found) for the most recent report within LOOKBACK_DAYS.
    """
    report_dir = REPORTS / subdir
    if not report_dir.exists():
        return None, False
    cutoff = datetime.date.today() - datetime.timedelta(days=LOOKBACK_DAYS)
    candidates = []
    for f in report_dir.glob(f"{prefix}_*.md"):
        # extract date from filename like prefix_YYYY-MM-DD.md
        # also handles release_impact_v1.2.0_YYYY-MM-DD.md
        parts = f.stem.split("_")
        for part in reversed(parts):
            try:
                d = datetime.date.fromisoformat(part)
                if d >= cutoff:
                    candidates.append((d, f))
                break
            except ValueError:
                continue
    if not candidates:
        return None, False
    candidates.sort(reverse=True)
    return candidates[0][1], True


def build_data_context() -> str:
    parts = []
    found_count = 0
    missing = []

    for subdir, prefix, cadence_note in EXPECTED_REPORTS:
        path, found = _find_recent_report(subdir, prefix)
        label = f"{prefix} ({cadence_note})"
        if found and path:
            content = path.read_text(encoding="utf-8")
            parts.append(f"---\n## REPORT: {path.name}\n\n{content}\n")
            found_count += 1
        else:
            missing.append(f"{subdir}/{prefix} [{cadence_note}]")

    total_expected_weekly = sum(1 for _, _, c in EXPECTED_REPORTS if "weekly" in c)
    summary = (
        f"## REPORT INVENTORY\n"
        f"Reports found this cycle: {found_count} of {len(EXPECTED_REPORTS)} expected slots.\n"
        f"Weekly agents expected: {total_expected_weekly}\n\n"
    )
    if missing:
        summary += "Missing or not filed this cycle:\n"
        for m in missing:
            summary += f"  - {m}\n"
    else:
        summary += "All expected reports are present.\n"

    return summary + "\n" + "\n".join(parts)


if __name__ == "__main__":
    run_agent(
        agent_key       = "chief_of_staff",
        prompt_rel_path = "agents/executive/chief_of_staff.md",
        report_subdir   = "ceo_brief",
        data_context    = build_data_context(),
        agent_title     = "Clarion Chief of Staff",
    )
