"""
weekly_operations.py
Clarion — Weekly Agent Orchestrator
Runs every Saturday. Executes all weekly-cadence department agents in order,
then runs the Chief of Staff to synthesize the CEO brief.

Usage: python workflows/weekly_operations.py

Agents run in dependency order:
  1. Data-independent agents run first (revenue, market, customer, product, integrity, ops)
  2. Cross-reader agents run last (content_seo reads discovery+competitive)
  3. Chief of Staff runs after all department agents complete
"""
import sys
import traceback
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Import all weekly runner functions
from workflows.head_of_growth_runner          import build_data_context as hog_ctx
from workflows.sales_development_runner       import build_data_context as sd_ctx
from workflows.funnel_conversion_runner       import build_data_context as fc_ctx
from workflows.customer_discovery_runner      import build_data_context as cd_ctx
from workflows.competitive_intelligence_runner import build_data_context as ci_ctx
from workflows.customer_health_onboarding_runner import build_data_context as cho_ctx
from workflows.voc_product_demand_runner      import build_data_context as voc_ctx
from workflows.usage_analyst_runner           import build_data_context as ua_ctx
from workflows.scoring_quality_runner         import build_data_context as sq_ctx
from workflows.data_quality_runner            import build_data_context as dq_ctx
from workflows.process_analyst_runner         import build_data_context as pa_ctx
from workflows.cost_resource_runner           import build_data_context as cr_ctx
from workflows.content_seo_runner             import build_data_context as cs_ctx
from workflows.chief_of_staff_runner          import build_data_context as cos_ctx

from shared.agent_runner import run_agent

WEEKLY_AGENTS = [
    # (agent_key, prompt_rel_path, report_subdir, data_ctx_fn, title)
    ("head_of_growth",           "agents/revenue/head_of_growth.md",             "revenue",          hog_ctx, "Head of Growth"),
    ("sales_development",        "agents/revenue/sales_development.md",          "revenue",          sd_ctx,  "Sales Development"),
    ("funnel_conversion",        "agents/revenue/funnel_conversion.md",          "revenue",          fc_ctx,  "Funnel Conversion"),
    ("customer_discovery",       "agents/market/customer_discovery.md",          "market",           cd_ctx,  "Customer Discovery"),
    ("competitive_intelligence", "agents/market/competitive_intelligence.md",    "market",           ci_ctx,  "Competitive Intelligence"),
    ("customer_health_onboarding","agents/customer/customer_health_onboarding.md","customer",        cho_ctx, "Customer Health & Onboarding"),
    ("voc_product_demand",       "agents/customer/voc_product_demand.md",        "customer",         voc_ctx, "Voice of Customer & Product Demand"),
    ("usage_analyst",            "agents/product_insight/usage_analyst.md",      "product_insight",  ua_ctx,  "Product Usage Analyst"),
    ("scoring_quality",          "agents/product_integrity/scoring_quality.md",  "product_integrity",sq_ctx,  "Scoring Quality"),
    ("data_quality",             "agents/product_integrity/data_quality.md",     "product_integrity",dq_ctx,  "Data Quality"),
    ("process_analyst",          "agents/operations/process_analyst.md",         "operations",       pa_ctx,  "Internal Process Analyst"),
    ("cost_resource",            "agents/operations/cost_resource.md",           "operations",       cr_ctx,  "Cost & Resource"),
    # content_seo depends on customer_discovery + competitive_intelligence — runs last
    ("content_seo",              "agents/comms/content_seo.md",                  "comms",            cs_ctx,  "Content & SEO"),
]


def run_weekly():
    print("=" * 60)
    print("CLARION — WEEKLY OPERATIONS RUN")
    print("=" * 60)

    results = {"success": [], "failed": []}

    for agent_key, prompt_path, subdir, ctx_fn, title in WEEKLY_AGENTS:
        try:
            run_agent(
                agent_key       = agent_key,
                prompt_rel_path = prompt_path,
                report_subdir   = subdir,
                data_context    = ctx_fn(),
                agent_title     = f"Clarion {title} Agent",
            )
            results["success"].append(agent_key)
        except Exception as e:
            print(f"\n  [ERROR] {agent_key} failed: {e}")
            traceback.print_exc()
            results["failed"].append(agent_key)

    # Chief of Staff runs after all department agents
    print("\n" + "=" * 60)
    print("Running Chief of Staff synthesis...")
    print("=" * 60)
    try:
        run_agent(
            agent_key       = "chief_of_staff",
            prompt_rel_path = "agents/executive/chief_of_staff.md",
            report_subdir   = "ceo_brief",
            data_context    = cos_ctx(),
            agent_title     = "Clarion Chief of Staff",
        )
        results["success"].append("chief_of_staff")
    except Exception as e:
        print(f"\n  [ERROR] chief_of_staff failed: {e}")
        traceback.print_exc()
        results["failed"].append("chief_of_staff")

    # Summary
    print("\n" + "=" * 60)
    print(f"WEEKLY RUN COMPLETE")
    print(f"  Succeeded : {len(results['success'])} agents")
    print(f"  Failed    : {len(results['failed'])} agents")
    if results["failed"]:
        print(f"  Failed list: {', '.join(results['failed'])}")
    print("  CEO brief ready for Sunday review.")
    print("=" * 60)


if __name__ == "__main__":
    run_weekly()
