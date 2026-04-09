import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.benchmark_engine import score_review_deterministic


def _themes_by_id(review_text: str, rating: int):
    result = score_review_deterministic(review_text, rating, "2026-04-08")
    return {theme["theme"]: theme for theme in result["themes"]}


def test_positive_clarity_hits_explained_so_i_could_understand():
    themes = _themes_by_id(
        "He explained everything so I could understand and made the process feel manageable.",
        5,
    )
    assert themes["communication_clarity"]["polarity"] == "positive"


def test_positive_responsiveness_hits_responsive_and_supportive():
    themes = _themes_by_id(
        "What stood out most was how responsive and supportive they were throughout the process.",
        5,
    )
    assert themes["communication_responsiveness"]["polarity"] == "positive"


def test_positive_responsiveness_hits_kept_in_communication():
    themes = _themes_by_id(
        "He answered all my questions and kept in communication with me the whole time.",
        5,
    )
    assert themes["communication_responsiveness"]["polarity"] == "positive"


def test_positive_outcome_hits_my_case_was_approved():
    themes = _themes_by_id(
        "My case was approved and the entire process felt worth it.",
        5,
    )
    assert themes["outcome_satisfaction"]["polarity"] == "positive"


def test_reliable_guard_blocks_positive_trust_in_fee_error_complaint():
    themes = _themes_by_id(
        "They submitted the wrong application and tried to charge us a resubmission fee for their own error. "
        "I strongly advise others to look elsewhere for reliable immigration services.",
        1,
    )
    assert "professionalism_trust" not in themes


def test_professional_guard_blocks_generic_staff_praise_extra():
    themes = _themes_by_id(
        "Everyone I encountered or spoke to there was pleasant and professional.",
        5,
    )
    assert "professionalism_trust" not in themes


def test_staged_ryan_row_now_hits_clarity_and_responsiveness():
    themes = _themes_by_id(
        "They took the time to explain everything clearly and made sure I understood my options every step of the way. "
        "What stood out most to me was how responsive and supportive they were throughout the process.",
        5,
    )
    assert themes["communication_clarity"]["polarity"] == "positive"
    assert themes["communication_responsiveness"]["polarity"] == "positive"


def test_staged_fulton_row_now_hits_responsiveness_and_outcome_without_trust_extra():
    themes = _themes_by_id(
        "He answered all my questions, explained everything so I could understand and kept in communication with me. "
        "My case was approved! Everyone I encountered or spoke to there was pleasant and professional.",
        5,
    )
    assert themes["communication_clarity"]["polarity"] == "positive"
    assert themes["communication_responsiveness"]["polarity"] == "positive"
    assert themes["outcome_satisfaction"]["polarity"] == "positive"
    assert "professionalism_trust" not in themes


def test_outcome_driver_hits_got_the_job_done_and_won():
    themes = _themes_by_id(
        "Got the job done and won so to speak",
        5,
    )
    assert themes["outcome_satisfaction"]["polarity"] == "positive"
    assert themes["outcome_satisfaction"]["matched_phrase"] == "got the job done"


def test_outcome_driver_hits_social_security_disability_approved():
    themes = _themes_by_id(
        "My attorney at this law firm was very helpful with getting my social security disability approved. "
        "I felt him and all the staff did everything in their power to make me feel comfortable and showed their support even to the end.",
        5,
    )
    assert themes["outcome_satisfaction"]["polarity"] == "positive"
    assert themes["outcome_satisfaction"]["matched_phrase"] == "getting my social security disability approved"


def test_outcome_driver_hits_settlement_amount_suffered():
    themes = _themes_by_id(
        "I was disappointed in the entire process. I was assigned to 3 different attorneys. "
        "Each time a little information and understanding of my case was lost. "
        "I feel my settlement amount suffered. After 2 years, I received a final settlement offer.",
        3,
    )
    assert themes["outcome_satisfaction"]["polarity"] == "negative"
    assert themes["outcome_satisfaction"]["matched_phrase"] == "my settlement amount suffered"


def test_outcome_driver_hits_failed_me_during_my_appeal():
    themes = _themes_by_id(
        "Completely disappointed - do not trust this firm with your disability case. "
        "They failed me during my appeal.",
        1,
    )
    assert themes["outcome_satisfaction"]["polarity"] == "severe_negative"
    assert themes["outcome_satisfaction"]["matched_phrase"] == "failed me during my appeal"


def test_outcome_guard_blocks_quoted_approved_for_language():
    themes = _themes_by_id(
        "I was informed that you cannot claim any kind of income if you want to be approved for disability and she hung up on me.",
        1,
    )
    assert "outcome_satisfaction" not in themes


def test_outcome_guard_blocks_generic_because_of_praise():
    themes = _themes_by_id(
        "My attorney Andrew Kinney was very professional and knowledgeable. "
        "He knew what was coming ahead of time and explained everything to me as we were at the hearing. "
        "Everything went well because of Andrew.",
        4,
    )
    assert "outcome_satisfaction" not in themes


def test_outcome_guard_blocks_service_only_legal_help_row():
    themes = _themes_by_id(
        "He lost his temper, threw my folder across the desk, and I never got proper legal help from him. "
        "I had to hire another attorney to fix the mess.",
        1,
    )
    assert "outcome_satisfaction" not in themes


def test_outcome_guard_blocks_service_only_time_and_money_row():
    themes = _themes_by_id(
        "These guys are horrible. The lawyer showed up late and was extremely rude. "
        "Nothing but wasting my time and money.",
        1,
    )
    assert "outcome_satisfaction" not in themes


def test_outcome_guard_blocks_service_only_nothing_completed_row():
    themes = _themes_by_id(
        "We submitted all of the paperwork for our living will and trust and after six weeks, nothing was completed at all. "
        "When we questioned the status, we were told that we never gave a timeframe.",
        2,
    )
    assert "outcome_satisfaction" not in themes
