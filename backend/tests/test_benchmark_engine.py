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
