"""
services/bench/deterministic_tagger.py
=======================================
Instrumented, self-contained re-implementation of Clarion's keyword-matching
theme engine.  Produces the same logical output as the _analyze_reviews_tx /
analyze() bag-of-words loop in app.py, but adds per-match evidence traces so
the calibration harness can compare them against AI labels.

Design rules
------------
- Zero imports from app.py (avoids circular deps and Flask context requirements).
- Reads the same raw keyword dicts that app.py uses, duplicated here so the
  harness never touches production state.
- Polarity is inferred from star rating + negation context (see _infer_polarity).
- Severity is inferred from a short list of severity amplifier phrases.
- Output schema mirrors the benchmark schema (theme / polarity / evidence_span /
  confidence / matched_phrases / multipliers_applied / sentence_snippet).
"""

from __future__ import annotations

import re
from typing import Any

# ---------------------------------------------------------------------------
# Canonical benchmark theme taxonomy
# These are the 10 governance-aligned themes the harness works with.
# They differ from the legacy 12-label schema used by review_classifier.py.
# ---------------------------------------------------------------------------
BENCH_THEMES = [
    "communication_responsiveness",
    "communication_clarity",
    "empathy_support",
    "professionalism_trust",
    "expectation_setting",
    "billing_transparency",
    "fee_value",
    "timeliness_progress",
    "office_staff_experience",
    "outcome_satisfaction",
]

# ---------------------------------------------------------------------------
# Keyword families
# Each theme maps to a list of (phrase, family_label) tuples.
# family_label is surfaced in the evidence trace for calibration.
# ---------------------------------------------------------------------------
THEME_PHRASE_FAMILIES: dict[str, list[tuple[str, str]]] = {
    "communication_responsiveness": [
        ("returned my call", "callback"),
        ("returned calls", "callback"),
        ("called me back", "callback"),
        ("responded quickly", "responsiveness"),
        ("responded promptly", "responsiveness"),
        ("hard to reach", "reachability_neg"),
        ("never called", "no_contact_neg"),
        ("no response", "no_contact_neg"),
        ("didn't respond", "no_contact_neg"),
        ("did not respond", "no_contact_neg"),
        ("kept me informed", "proactive_update"),
        ("kept me updated", "proactive_update"),
        ("updates", "proactive_update"),
        ("responsive", "responsiveness"),
        ("communication", "general_comm"),
        ("contact", "general_comm"),
    ],
    "communication_clarity": [
        ("explained clearly", "clarity_pos"),
        ("explained everything", "clarity_pos"),
        ("easy to understand", "clarity_pos"),
        ("clear explanation", "clarity_pos"),
        ("confusing", "clarity_neg"),
        ("confused", "clarity_neg"),
        ("unclear", "clarity_neg"),
        ("didn't explain", "no_explanation_neg"),
        ("did not explain", "no_explanation_neg"),
        ("no explanation", "no_explanation_neg"),
        ("jargon", "jargon_neg"),
        ("plain language", "plain_language_pos"),
        ("plain english", "plain_language_pos"),
    ],
    "empathy_support": [
        ("caring", "empathy_pos"),
        ("compassionate", "empathy_pos"),
        ("empathetic", "empathy_pos"),
        ("understanding", "empathy_pos"),
        ("listened", "active_listening_pos"),
        ("listened to me", "active_listening_pos"),
        ("heard me", "active_listening_pos"),
        ("supportive", "support_pos"),
        ("cold", "empathy_neg"),
        ("dismissive", "empathy_neg"),
        ("didn't listen", "listening_neg"),
        ("did not listen", "listening_neg"),
    ],
    "professionalism_trust": [
        ("professional", "professionalism_pos"),
        ("courteous", "professionalism_pos"),
        ("respectful", "professionalism_pos"),
        ("polite", "professionalism_pos"),
        ("demeanor", "professionalism_pos"),
        ("ethical", "ethics_pos"),
        ("trustworthy", "trust_pos"),
        ("trust", "trust_pos"),
        ("rude", "professionalism_neg"),
        ("unprofessional", "professionalism_neg"),
        ("disrespectful", "professionalism_neg"),
        ("unethical", "ethics_neg"),
    ],
    "expectation_setting": [
        ("realistic expectations", "expectation_pos"),
        ("set expectations", "expectation_pos"),
        ("what to expect", "expectation_pos"),
        ("explained the process", "process_clarity_pos"),
        ("false hope", "expectation_neg"),
        ("misled", "expectation_neg"),
        ("misleading", "expectation_neg"),
        ("overpromised", "expectation_neg"),
        ("over-promised", "expectation_neg"),
        ("unrealistic", "expectation_neg"),
        ("surprised by", "surprise_neg"),
    ],
    "billing_transparency": [
        ("billing", "billing_general"),
        ("invoice", "billing_general"),
        ("invoiced", "billing_general"),
        ("itemized", "billing_transparency_pos"),
        ("transparent billing", "billing_transparency_pos"),
        ("hidden fees", "billing_transparency_neg"),
        ("hidden charges", "billing_transparency_neg"),
        ("unexpected charges", "billing_transparency_neg"),
        ("surprise bill", "billing_transparency_neg"),
        ("overcharged", "billing_transparency_neg"),
        ("double billed", "billing_transparency_neg"),
    ],
    "fee_value": [
        ("worth it", "value_pos"),
        ("good value", "value_pos"),
        ("affordable", "value_pos"),
        ("reasonable fee", "value_pos"),
        ("reasonable cost", "value_pos"),
        ("expensive", "value_neg"),
        ("overpriced", "value_neg"),
        ("too much", "value_neg"),
        ("fees", "fee_general"),
        ("cost", "fee_general"),
        ("price", "fee_general"),
        ("value", "value_general"),
    ],
    "timeliness_progress": [
        ("on time", "timeliness_pos"),
        ("timely", "timeliness_pos"),
        ("promptly", "timeliness_pos"),
        ("quickly", "timeliness_pos"),
        ("efficient", "efficiency_pos"),
        ("slow", "timeliness_neg"),
        ("delayed", "timeliness_neg"),
        ("delays", "timeliness_neg"),
        ("took too long", "timeliness_neg"),
        ("waiting", "waiting_neg"),
        ("waited", "waiting_neg"),
        ("dragged on", "timeliness_neg"),
    ],
    "office_staff_experience": [
        ("staff", "staff_general"),
        ("assistant", "staff_general"),
        ("paralegal", "staff_general"),
        ("secretary", "staff_general"),
        ("receptionist", "staff_general"),
        ("front desk", "staff_general"),
        ("office", "office_general"),
        ("team", "team_general"),
        ("helpful staff", "staff_pos"),
        ("friendly staff", "staff_pos"),
        ("rude staff", "staff_neg"),
    ],
    "outcome_satisfaction": [
        ("won", "outcome_pos"),
        ("successful", "outcome_pos"),
        ("victory", "outcome_pos"),
        ("settlement", "outcome_general"),
        ("verdict", "outcome_general"),
        ("result", "outcome_general"),
        ("outcome", "outcome_general"),
        ("resolved", "outcome_pos"),
        ("favorable", "outcome_pos"),
        ("lost", "outcome_neg"),
        ("dismissed", "outcome_neg"),
        ("lost my case", "outcome_neg"),
        ("didn't win", "outcome_neg"),
        ("did not win", "outcome_neg"),
    ],
}

# ---------------------------------------------------------------------------
# Negation context: if one of these tokens appears in the same sentence as a
# positive phrase, flip its polarity signal.
# ---------------------------------------------------------------------------
NEGATION_TOKENS = frozenset([
    "not", "never", "no", "didn't", "did not", "wasn't", "was not",
    "couldn't", "could not", "wouldn't", "would not", "barely",
    "hardly", "lack", "lacking", "lacks", "failed", "fail", "fails",
    "without", "absence",
])

# Contrast guards: phrases that signal the rest of the sentence reverses prior tone.
CONTRAST_TOKENS = frozenset(["but", "however", "although", "though", "except", "despite"])

# ---------------------------------------------------------------------------
# Severity amplifiers
# Phrases that escalate a negative match to "severe_negative".
# ---------------------------------------------------------------------------
SEVERE_AMPLIFIERS = [
    "worst", "terrible", "awful", "nightmare", "disaster",
    "completely", "absolutely", "totally", "ruined", "destroyed",
    "never again", "waste of money", "scam", "fraud", "lied",
    "threatened", "illegal", "malpractice", "negligent",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _sentences(text: str) -> list[str]:
    """Split review text into sentences on [.!?] followed by whitespace."""
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]


def _has_negation(sentence_lower: str) -> bool:
    tokens = set(re.split(r"\W+", sentence_lower))
    return bool(tokens & NEGATION_TOKENS)


def _has_contrast(sentence_lower: str) -> bool:
    tokens = set(re.split(r"\W+", sentence_lower))
    return bool(tokens & CONTRAST_TOKENS)


def _infer_polarity(
    rating: int,
    sentence_lower: str,
    family_label: str,
    text_lower: str,
    phrase: str = "",
) -> str:
    """
    Infer polarity from star rating + linguistic context.

    Returns: "positive" | "negative" | "severe_negative"
    """
    # Severity check first — overrides everything
    if any(amp in text_lower for amp in SEVERE_AMPLIFIERS):
        if rating <= 2 or family_label.endswith("_neg"):
            return "severe_negative"

    # Families that are inherently negative regardless of rating
    if family_label.endswith("_neg"):
        # Double-negative guard: if the *phrase itself* already contains a negation
        # token (e.g. "did not explain", "didn't respond"), a second negation in the
        # sentence does NOT flip it back — the phrase is negative by construction.
        phrase_is_compound_negative = any(neg in phrase for neg in ("not ", "n't ", "never ", "no "))
        if _has_negation(sentence_lower) and not _has_contrast(sentence_lower) and not phrase_is_compound_negative:
            return "positive"
        return "negative"

    # Families that are inherently positive
    if family_label.endswith("_pos"):
        if _has_negation(sentence_lower):
            return "negative"
        return "positive"

    # Ambiguous family — use rating as the primary signal
    if rating >= 4:
        return "positive"
    if rating <= 2:
        if _has_negation(sentence_lower):
            return "negative"
        return "negative"
    # 3-star: trust contrast/negation, otherwise treat as positive
    if _has_contrast(sentence_lower) or _has_negation(sentence_lower):
        return "negative"
    return "positive"


def _confidence(
    match_count: int,
    rating: int,
    polarity: str,
    family_label: str,
) -> str:
    """
    Coarse confidence estimate for deterministic matches.

    high   → multiple phrase hits, or rating strongly confirms polarity
    medium → single hit with weak signal
    low    → ambiguous match (e.g. 3-star with neutral family)
    """
    strongly_confirmed = (
        (polarity == "positive" and rating >= 4) or
        (polarity in ("negative", "severe_negative") and rating <= 2)
    )
    if match_count >= 2 or (match_count == 1 and strongly_confirmed):
        return "high"
    if match_count == 1 and (rating == 3 or not (family_label.endswith("_pos") or family_label.endswith("_neg"))):
        return "low"
    return "medium"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def tag_review(
    review_text: str,
    rating: int,
    review_date: str | None = None,
) -> dict[str, Any]:
    """
    Run the deterministic theme tagger on a single review.

    Parameters
    ----------
    review_text : str
        Raw review text.
    rating : int
        Star rating (1–5).
    review_date : str | None
        ISO date string — carried through to the output for traceability.

    Returns
    -------
    dict with keys:
        review_text   : str
        rating        : int
        review_date   : str | None
        themes        : list[ThemeResult]  — one per matched theme
        evidence_log  : list[EvidenceEntry] — one per phrase match (may be multiple per theme)

    ThemeResult
    -----------
        theme         : str
        polarity      : "positive" | "negative" | "severe_negative"
        evidence_span : str  (first matched sentence containing the trigger phrase)
        confidence    : "high" | "medium" | "low"

    EvidenceEntry
    -------------
        theme         : str
        matched_phrase  : str
        pattern_family  : str
        sentence_snippet: str
        polarity        : str
        severity        : str  ("low" | "moderate" | "severe")
        multipliers_applied : list[str]
        final_impact    : str  ("positive_hit" | "negative_hit" | "severe_hit")
    """
    text_lower = review_text.lower()
    sentences = _sentences(review_text)

    # Per-theme accumulators
    # theme_name -> {hits: int, evidence_span: str, polarity_votes: Counter, families: set}
    theme_hits: dict[str, dict] = {}
    evidence_log: list[dict] = []

    for theme, phrase_families in THEME_PHRASE_FAMILIES.items():
        for phrase, family in phrase_families:
            if phrase not in text_lower:
                continue

            # Find the sentence containing this phrase
            containing_sentence = next(
                (s for s in sentences if phrase in s.lower()),
                review_text[:120],  # fallback: first 120 chars
            )
            sent_lower = containing_sentence.lower()

            polarity = _infer_polarity(rating, sent_lower, family, text_lower)

            # Severity label (for evidence log — distinct from polarity)
            if polarity == "severe_negative":
                severity = "severe"
            elif polarity == "negative":
                severity = "moderate"
            else:
                severity = "low"

            # Multipliers: linguistic signals that boosted this classification
            multipliers: list[str] = []
            if any(amp in text_lower for amp in SEVERE_AMPLIFIERS):
                multipliers.append("severe_amplifier")
            if _has_negation(sent_lower):
                multipliers.append("negation_present")
            if _has_contrast(sent_lower):
                multipliers.append("contrast_guard")

            final_impact = (
                "severe_hit" if polarity == "severe_negative"
                else "negative_hit" if polarity == "negative"
                else "positive_hit"
            )

            evidence_log.append({
                "theme": theme,
                "matched_phrase": phrase,
                "pattern_family": family,
                "sentence_snippet": containing_sentence[:200],
                "polarity": polarity,
                "severity": severity,
                "multipliers_applied": multipliers,
                "final_impact": final_impact,
            })

            # Accumulate per-theme
            if theme not in theme_hits:
                theme_hits[theme] = {
                    "hits": 0,
                    "evidence_span": containing_sentence[:200],
                    "polarity_votes": [],
                    "families": set(),
                }
            theme_hits[theme]["hits"] += 1
            theme_hits[theme]["polarity_votes"].append(polarity)
            theme_hits[theme]["families"].add(family)

    # Collapse per-theme hits into ThemeResult objects
    themes: list[dict] = []
    for theme, acc in theme_hits.items():
        # Majority vote on polarity (severe_negative > negative > positive)
        votes = acc["polarity_votes"]
        if "severe_negative" in votes:
            final_polarity = "severe_negative"
        elif votes.count("negative") > votes.count("positive"):
            final_polarity = "negative"
        else:
            final_polarity = "positive"

        dominant_family = next(
            (f for f in acc["families"] if f.endswith("_neg") or f.endswith("_pos")),
            next(iter(acc["families"]), ""),
        )
        conf = _confidence(acc["hits"], rating, final_polarity, dominant_family)

        themes.append({
            "theme": theme,
            "polarity": final_polarity,
            "evidence_span": acc["evidence_span"],
            "confidence": conf,
        })

    return {
        "review_text": review_text,
        "rating": rating,
        "review_date": review_date,
        "themes": themes,
        "evidence_log": evidence_log,
    }
