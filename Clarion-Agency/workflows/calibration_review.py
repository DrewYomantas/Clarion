"""
calibration_review.py
Clarion — Dictionary Calibration Standalone Runner
Run any time you want a calibration-only pass outside the monthly cycle.
Useful after adding new review sources or seeing unexpected score distributions.

Usage: python workflows/calibration_review.py
"""
import sys
import traceback
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from workflows.dictionary_calibration_runner import build_data_context as dc_ctx
from shared.agent_runner import run_agent


def run_calibration():
    print("=" * 60)
    print("CLARION — CALIBRATION REVIEW RUN")
    print("=" * 60)
    print("Temperature: 0.0 — proposals only, no creativity.")
    print("This agent NEVER modifies the phrase dictionary.")
    print("All proposals require human review before implementation.")
    print("=" * 60)

    try:
        run_agent(
            agent_key       = "dictionary_calibration",
            prompt_rel_path = "agents/product_integrity/dictionary_calibration.md",
            report_subdir   = "product_integrity",
            data_context    = dc_ctx(),
            agent_title     = "Clarion Dictionary Calibration Agent",
        )
        print("Calibration report saved. Review proposals in reports/product_integrity/.")
        print("Approved changes are logged in memory/calibration_log.md by a human only.")
    except Exception as e:
        print(f"[ERROR] Calibration run failed: {e}")
        traceback.print_exc()

    print("=" * 60)


if __name__ == "__main__":
    run_calibration()
