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


def test_timeliness_driver_hits_without_achieving_meaningful_progress_as_severe():
    themes = _themes_by_id(
        "I hired Dane Loizzo as my third attorney during my divorce case. Within just three weeks, Dane racked up over $7,000 in charges, "
        "many of which appeared inflated, before withdrawing from my case without achieving any meaningful progress. "
        "He failed to provide value, transparency, or support.",
        1,
    )
    assert themes["timeliness_progress"]["polarity"] == "severe_negative"
    assert themes["timeliness_progress"]["matched_phrase"] == "without achieving any meaningful progress"


def test_timeliness_driver_hits_case_ready_on_time():
    themes = _themes_by_id(
        "Easy to work with and they communicate well what information is needed along the way to make sure your case is ready on time.",
        4,
    )
    assert themes["timeliness_progress"]["polarity"] == "positive"
    assert themes["timeliness_progress"]["matched_phrase"] == "make sure your case is ready on time"


def test_timeliness_driver_hits_day_before_the_hearing():
    themes = _themes_by_id(
        "Lawyers and associate are not caring at all. Waited 2 years and only heard from them 2 or 3 times. "
        "Only heard from the actual attorney a day before the hearing. They didn't even get all my health information that they were supposed to.",
        1,
    )
    assert themes["timeliness_progress"]["polarity"] == "severe_negative"
    assert themes["timeliness_progress"]["matched_phrase"] == "only heard from the actual attorney a day before the hearing"


def test_timeliness_driver_hits_very_timely_manner():
    themes = _themes_by_id(
        "Cody Scharph is fantastic! Did what she was asked with no attitude in a very timely manner and got me a settlement in less than the time it was supposed to take. "
        "She took the time to answer my questions as the case was progressing.",
        4,
    )
    assert themes["timeliness_progress"]["polarity"] == "positive"
    assert themes["timeliness_progress"]["matched_phrase"] in {
        "in a very timely manner",
        "less than the time it was supposed to take",
    }


def test_timeliness_guard_blocks_communication_delays_boundary():
    themes = _themes_by_id(
        "I went through them to apply for social security disability. Kong was very understanding and helped me through paperwork. "
        "Then the denial came. I called to inquire about appeals. Overall frustrating experience with communication delays.",
        3,
    )
    assert "timeliness_progress" not in themes


def test_timeliness_guard_blocks_extremely_slow_responsiveness_boundary():
    themes = _themes_by_id(
        "Responses to questions are EXTREMELY slow. The paralegals are not efficient. "
        "Lack of communication on their end. The lawyer was way better than the paralegals.",
        3,
    )
    assert "timeliness_progress" not in themes


def test_timeliness_guard_blocks_positive_took_12_months_boundary():
    themes = _themes_by_id(
        "4.5 Star Rating! I hired Attorney Mehlos to help me fight a battery charge. Corey helped me through the worst year of my life. "
        "From day 1, Attorney Mehlos and I came up with a plan and continued to refine our strategy until the prosecutor dismissed the battery charge. "
        "It took 12 months to get it done. Attorney Mehlos was confident and prepared to win at trial.",
        4,
    )
    assert "timeliness_progress" not in themes


def test_timeliness_guard_blocks_nonperformance_boundary():
    themes = _themes_by_id(
        "If you expect them to help you with Student Loan Discharge, you thought wrong. "
        "They just want money from you and want you do all the work.",
        3,
    )
    assert "timeliness_progress" not in themes


def test_timeliness_guard_blocks_positive_outcome_took_a_while_boundary():
    themes = _themes_by_id(
        "I came to Hoglund Law for help and although it took a while I was able to get the assistance I needed to finally win my case. "
        "Thanks to all of the hardworking people and my attorney.",
        4,
    )
    assert "timeliness_progress" not in themes


def test_trust_driver_hits_forgotten_case_as_severe():
    themes = _themes_by_id(
        "We were referred to McNamee & Maheney Ltd. by a close friend and contacted them right away, gave our deposit and we never heard from them for over a year. "
        "We tried and tried to contact the office and always got told that our message was left for our lawyer, come to find out he did not even work there anymore and our case was forgotten about.",
        1,
    )
    assert themes["professionalism_trust"]["polarity"] == "severe_negative"
    assert themes["professionalism_trust"]["matched_phrase"] == "our case was forgotten about"


def test_trust_driver_hits_mocked_background_call():
    themes = _themes_by_id(
        "I had a five star review, but between the lack of communication and just being mocked by someone in the background of a call I have to drop a couple of stars.",
        5,
    )
    assert themes["professionalism_trust"]["polarity"] == "negative"
    assert themes["professionalism_trust"]["matched_phrase"] == "being mocked by someone in the background of a call"


def test_trust_driver_escalates_fraction_of_information_row_to_severe():
    themes = _themes_by_id(
        "They have a review screening for checking to see what cases are easy wins and which require them to actually work. "
        "I was turned down based on a fraction of the total information.",
        1,
    )
    assert themes["professionalism_trust"]["polarity"] == "severe_negative"
    assert themes["professionalism_trust"]["matched_phrase"] == "turned down based on a fraction of the total information"


def test_trust_guard_blocks_recommendation_non_driver_row():
    themes = _themes_by_id(
        "Andrew Kinney is by far the best attorney, he is so very easy to work with and understand. "
        "He works for Hoglund law firm and I would refer Hoglund to all my family and friends.",
        5,
    )
    assert "professionalism_trust" not in themes


def test_trust_guard_blocks_subjective_professional_personality_row():
    themes = _themes_by_id(
        "I could not even inquire about a Will or Power of Attorney without being judged for having a phone number area code that was not 815. "
        "I had exact opposite experience of most reviews here and could not get a word in from this person. "
        "If you don't have an 815 number don't waste your time. This was a disappointing referral. "
        "I chose to find a Rockford attorney with a more professional, kinder personality.",
        1,
    )
    assert "professionalism_trust" not in themes


def test_trust_guard_blocks_service_overlap_worst_experience_row():
    themes = _themes_by_id(
        "Worst experience I've had with a law firm. You can't ever talk to an actual lawyer. "
        "A paralegal is assigned to your case. Horrible experience.",
        1,
    )
    assert "professionalism_trust" not in themes


def test_empathy_driver_hits_reassured_me_when_it_came_to_anxiety():
    themes = _themes_by_id(
        "If I could give 6 stars, I would. My anxiety was eating me alive. "
        "Not only did he reassure me when it came to anxiety, but he was hands-on every step of the way.",
        5,
    )
    assert themes["empathy_support"]["polarity"] == "positive"
    assert themes["empathy_support"]["matched_phrase"] in {
        "reassured me",
        "reassured me when it came to anxiety",
        "not only did he reassure me",
    }


def test_empathy_driver_hits_make_me_feel_comfortable():
    themes = _themes_by_id(
        "My attorney at this law firm was very helpful with getting my social security disability approved. "
        "I felt him and all the staff did everything in their power to make me feel comfortable and showed their support even to the end.",
        5,
    )
    assert themes["empathy_support"]["polarity"] == "positive"
    assert themes["empathy_support"]["matched_phrase"] in {
        "make me feel comfortable",
        "showed their support even to the end",
    }


def test_empathy_driver_hits_treated_as_another_number():
    themes = _themes_by_id(
        "From the moment they got all of the money I was treated as another number. "
        "Calls go unreturned. Emails go unanswered. There were canceled calls and no-shows. "
        "No one even knew what was going on with my case.",
        1,
    )
    assert themes["empathy_support"]["polarity"] == "negative"
    assert themes["empathy_support"]["matched_phrase"] == "treated as another number"


def test_empathy_guard_blocks_generic_caring_and_responsive_row():
    themes = _themes_by_id(
        "The lawyers are caring, intelligent, know the law, and are aggressive in representing my interests.",
        5,
    )
    assert "empathy_support" not in themes


def test_empathy_guard_blocks_saved_my_life_row():
    themes = _themes_by_id(
        "Attorney Bolton saved my life both literally and figuratively.",
        5,
    )
    assert "empathy_support" not in themes


def test_empathy_guard_blocks_worst_year_of_my_life_row():
    themes = _themes_by_id(
        "Corey helped me through the worst year of my life. From day 1 we came up with a plan until the prosecutor dismissed the battery charge.",
        5,
    )
    assert "empathy_support" not in themes
