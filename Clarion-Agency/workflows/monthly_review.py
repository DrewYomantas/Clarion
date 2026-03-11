"""
monthly_review.py
Clarion — Monthly Agent Orchestrator
Runs on the first Saturday of each month, AFTER weekly_operations.py completes.
Executes all monthly-cadence agents.

Usage: python workflows/monthly_review.py
"""
import sys
import traceback
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from workflows.revenue_strategy_runner      import build_data_context as rs_ctx
from workflows.market_trends_runner         import build_data_context as mt_ctx
from workflows.retention_intelligence_runner import build_data_context as ri_ctx
from workflows.dictionary_calibration_runner import build_data_context as dc_ctx
from workflows.people_ops_runner            import build_data_context as po_ctx

from shared.agent_runner import run_agent

MONTHLY_AGENTS = [
    ("revenue_strategy",       "agents/revenue/revenue_strategy.md",                 "revenue",          rs_ctx, "Revenue Strategy"),
    ("market_trends",          "agents/market/market_trends.md",                     "market",           mt_ctx, "Market Trends"),
    ("retention_intelligence", "agents/customer/retention_intelligence.md",          "customer",         ri_ctx, "Retention Intelligence"),
    ("dictionary_calibration", "agents/product_integrity/dictionary_calibration.md", "product_integrity",dc_ctx, "Dictionary Calibration"),
    # People & Ops reads process, health, and scoring reports — run last
    ("people_ops",             "agents/people/people_ops_intelligence.md",           "people",           po_ctx, "People & Ops Intelligence"),
]


def run_monthly():
    print("=" * 60)
    print("CLARION — MONTHLY REVIEW RUN")
    print("=" * 60)

    results = {"success": [], "failed": []}

    for agent_key, prompt_path, subdir, ctx_fn, title in MONTHLY_AGENTS:
        try:
            prefix = "people_ops" if agent_key == "people_ops" else agent_key
            run_agent(
                agent_key              = agent_key,
                prompt_rel_path        = prompt_path,
                report_subdir          = subdir,
                data_context           = ctx_fn(),
                agent_title            = f"Clarion {title} Agent",
                report_filename_prefix = prefix,
            )
            results["success"].append(agent_key)
        except Exception as e:
            print(f"\n  [ERROR] {agent_key} failed: {e}")
            traceback.print_exc()
            results["failed"].append(agent_key)

    print("\n" + "=" * 60)
    print(f"MONTHLY RUN COMPLETE")
    print(f"  Succeeded : {len(results['success'])} agents")
    print(f"  Failed    : {len(results['failed'])} agents")
    if results["failed"]:
        print(f"  Failed list: {', '.join(results['failed'])}")
    print("  Monthly reports ready. Run weekly_operations.py if not already run today.")
    print("=" * 60)


if __name__ == "__main__":
    run_monthly()
