"""
services/bench/fixtures.py
===========================
Seed dataset for the calibration harness.

10 hand-authored reviews covering the main governance themes and common
edge cases (negation, contrast, severity amplifiers, ambiguity).

Each fixture has:
    review_text   : str
    rating        : int  (1-5)
    review_date   : str  (ISO date)
    notes         : str  (describes which edge cases the review exercises)
    expected_themes : list[str]  (themes a well-tuned engine should fire on)
"""

from __future__ import annotations

FIXTURES: list[dict] = [
    {
        "review_text": (
            "John always returned my calls within the hour and kept me updated at every step. "
            "I never felt out of the loop. Five stars."
        ),
        "rating": 5,
        "review_date": "2024-11-01",
        "notes": "Clear positive: communication_responsiveness. Should NOT fire negation guard.",
        "expected_themes": ["communication_responsiveness"],
    },
    {
        "review_text": (
            "The billing was a complete nightmare. I was charged for services never rendered "
            "and found hidden fees on every invoice. I will never use this firm again."
        ),
        "rating": 1,
        "review_date": "2024-11-03",
        "notes": "Severe negative: billing_transparency + fee_value. Severity amplifier: 'nightmare'.",
        "expected_themes": ["billing_transparency", "fee_value"],
    },
    {
        "review_text": (
            "The attorney was not responsive at all. I left multiple voicemails and sent emails "
            "for two weeks. When she finally responded, she did not explain the process clearly."
        ),
        "rating": 2,
        "review_date": "2024-11-05",
        "notes": "Negation test: 'not responsive', 'did not explain'. Tests negation detection on positive phrases.",
        "expected_themes": ["communication_responsiveness", "communication_clarity"],
    },
    {
        "review_text": (
            "Staff was incredibly friendly and helpful. The paralegal walked me through every document. "
            "Office was clean and professional. Highly recommend."
        ),
        "rating": 5,
        "review_date": "2024-11-08",
        "notes": "Positive: office_staff_experience, professionalism_trust.",
        "expected_themes": ["office_staff_experience", "professionalism_trust"],
    },
    {
        "review_text": (
            "They were professional and courteous, but honestly the case dragged on for 18 months "
            "and I felt misled about how long it would take. The delays were very frustrating."
        ),
        "rating": 3,
        "review_date": "2024-11-10",
        "notes": "Contrast test: 'professional but delays'. Tests contrast guard on mixed sentiment.",
        "expected_themes": ["professionalism_trust", "timeliness_progress", "expectation_setting"],
    },
    {
        "review_text": (
            "My case was dismissed, which was devastating. I understand it wasn't the attorney's fault, "
            "but I still feel the outcome was handled poorly and I deserved better communication."
        ),
        "rating": 2,
        "review_date": "2024-11-12",
        "notes": "outcome_satisfaction (negative) + communication_responsiveness. Mild contrast token.",
        "expected_themes": ["outcome_satisfaction", "communication_responsiveness"],
    },
    {
        "review_text": (
            "Fees were reasonable and clearly explained upfront. I always knew exactly what I was "
            "paying for. No surprises. Transparent billing is hard to find — this firm delivers."
        ),
        "rating": 5,
        "review_date": "2024-11-15",
        "notes": "Positive: fee_value, billing_transparency. 'No surprises' tests negation-positive edge.",
        "expected_themes": ["fee_value", "billing_transparency"],
    },
    {
        "review_text": (
            "He listened to me. Truly listened. I felt understood and supported through one of the "
            "hardest times of my life. I never felt judged."
        ),
        "rating": 5,
        "review_date": "2024-11-17",
        "notes": "Empathy: empathy_support. 'Never felt judged' — negation that is still positive.",
        "expected_themes": ["empathy_support"],
    },
    {
        "review_text": (
            "The settlement was favorable and reached quickly. Result exceeded my expectations. "
            "The team was efficient and always kept me informed."
        ),
        "rating": 5,
        "review_date": "2024-11-20",
        "notes": "outcome_satisfaction + timeliness_progress + communication_responsiveness.",
        "expected_themes": ["outcome_satisfaction", "timeliness_progress", "communication_responsiveness"],
    },
    {
        "review_text": (
            "OK I guess. Did what they said they would. Nothing special. "
            "The office was fine, communication was adequate."
        ),
        "rating": 3,
        "review_date": "2024-11-22",
        "notes": "Ambiguous 3-star. Low signal. Tests that engine doesn't over-fire.",
        "expected_themes": [],  # engine may or may not fire — ambiguity case
    },
]
