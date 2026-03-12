"""
services/bench/calibration_report.py
======================================
Aggregates a list of comparison objects (from comparator.compare()) into a
structured calibration report.

Report sections
---------------
summary
    total_reviews, ai_available_count, total_disagreements, agreement_rate,
    disagreements_by_type (counts per type)

by_theme
    Per-theme breakdown: total_mentions (det), total_disagreements,
    disagreement_types_seen, false_positive_count, missing_theme_count

false_positives
    Most common extra_theme / likely_false_positive patterns with example
    evidence spans and matched phrases from the evidence log.

missed_phrases
    missing_theme disagreements grouped by theme with example AI evidence spans
    — these are candidate phrases to add to the deterministic engine.

candidate_phrase_additions
    Deduplicated list of (theme, evidence_span) pairs from missing_theme
    disagreements where AI confidence is "high".

candidate_negation_guards
    likely_context_guard_failure cases — grouped by theme with example
    evidence spans so the developer can inspect what the negation was.

reviews_needing_manual_inspection
    Reviews that have 3+ disagreements, or have a missed_severe_phrase or
    likely_context_guard_failure — returned as trimmed objects for review.
"""

from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MANUAL_INSPECTION_DISAGREE_THRESHOLD = 3
MANUAL_INSPECTION_PRIORITY_TYPES = {
    "missed_severe_phrase",
    "likely_context_guard_failure",
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate(comparisons: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Produce a calibration report from a list of comparison dicts.

    Parameters
    ----------
    comparisons : list[dict]
        Each element is the output of comparator.compare().

    Returns
    -------
    dict — see module docstring for structure.
    """
    if not comparisons:
        return _empty_report()

    total_reviews = len(comparisons)
    ai_available_count = sum(1 for c in comparisons if c.get("ai_available"))

    # Flatten all disagreements
    all_disagreements: list[dict] = []
    for comp in comparisons:
        all_disagreements.extend(comp.get("disagreements", []))

    # --- Summary ---
    type_counter: Counter = Counter(d["disagreement_type"] for d in all_disagreements)
    agreement_count = sum(c.get("agreement_count", 0) for c in comparisons)
    # Total possible agreements = sum of min(det_themes, ai_themes) per review
    total_possible_agreements = sum(
        min(
            len(c.get("deterministic", [])),
            len(c.get("ai", []) or []),
        )
        for c in comparisons
        if c.get("ai_available")
    )
    agreement_rate = (
        round(agreement_count / total_possible_agreements, 3)
        if total_possible_agreements > 0
        else None
    )

    summary = {
        "total_reviews": total_reviews,
        "ai_available_count": ai_available_count,
        "total_disagreements": len(all_disagreements),
        "agreement_count": agreement_count,
        "agreement_rate": agreement_rate,
        "disagreements_by_type": dict(type_counter),
    }

    # --- By-theme breakdown ---
    theme_disagree: dict[str, list[dict]] = defaultdict(list)
    theme_det_mentions: Counter = Counter()

    for comp in comparisons:
        for t in comp.get("deterministic", []):
            theme_det_mentions[t["theme"]] += 1
        for d in comp.get("disagreements", []):
            theme_disagree[d["theme"]].append(d)

    by_theme: list[dict] = []
    all_themes_seen = set(theme_det_mentions) | set(theme_disagree)
    for theme in sorted(all_themes_seen):
        disagrees = theme_disagree.get(theme, [])
        fp = sum(1 for d in disagrees if d["disagreement_type"] in ("extra_theme", "likely_false_positive"))
        mt = sum(1 for d in disagrees if d["disagreement_type"] == "missing_theme")
        types_seen = list({d["disagreement_type"] for d in disagrees})
        by_theme.append({
            "theme": theme,
            "det_mentions": theme_det_mentions.get(theme, 0),
            "total_disagreements": len(disagrees),
            "disagreement_types_seen": sorted(types_seen),
            "false_positive_count": fp,
            "missing_theme_count": mt,
        })

    # --- False positives ---
    fp_disagrees = [
        d for d in all_disagreements
        if d["disagreement_type"] in ("extra_theme", "likely_false_positive")
    ]
    fp_by_theme: dict[str, list] = defaultdict(list)
    for d in fp_disagrees:
        fp_by_theme[d["theme"]].append(d.get("evidence_span", ""))

    false_positives: list[dict] = [
        {
            "theme": theme,
            "count": len(spans),
            "example_spans": list(dict.fromkeys(s for s in spans if s))[:5],
        }
        for theme, spans in sorted(fp_by_theme.items(), key=lambda x: -len(x[1]))
    ]

    # --- Missed phrases ---
    mt_disagrees = [d for d in all_disagreements if d["disagreement_type"] == "missing_theme"]
    mt_by_theme: dict[str, list] = defaultdict(list)
    for d in mt_disagrees:
        mt_by_theme[d["theme"]].append(d.get("evidence_span", ""))

    missed_phrases: list[dict] = [
        {
            "theme": theme,
            "miss_count": len(spans),
            "example_ai_evidence": list(dict.fromkeys(s for s in spans if s))[:5],
        }
        for theme, spans in sorted(mt_by_theme.items(), key=lambda x: -len(x[1]))
    ]

    # --- Candidate phrase additions ---
    # High-confidence AI detections that the engine missed
    candidate_phrase_additions: list[dict] = []
    seen_spans: set[str] = set()
    for d in all_disagreements:
        if (
            d["disagreement_type"] == "missing_theme"
            and d.get("ai_confidence") == "high"
            and d.get("evidence_span")
        ):
            key = f"{d['theme']}|{d['evidence_span'][:60]}"
            if key not in seen_spans:
                seen_spans.add(key)
                candidate_phrase_additions.append({
                    "theme": d["theme"],
                    "evidence_span": d["evidence_span"],
                    "ai_polarity": d.get("ai_polarity"),
                    "notes": "AI high-confidence miss — add phrase(s) from this span to THEME_PHRASE_FAMILIES",
                })

    # --- Candidate negation/contrast guards ---
    guard_disagrees = [
        d for d in all_disagreements
        if d["disagreement_type"] == "likely_context_guard_failure"
    ]
    guard_by_theme: dict[str, list] = defaultdict(list)
    for d in guard_disagrees:
        guard_by_theme[d["theme"]].append(d.get("evidence_span", ""))

    candidate_negation_guards: list[dict] = [
        {
            "theme": theme,
            "count": len(spans),
            "example_spans": list(dict.fromkeys(s for s in spans if s))[:5],
            "notes": (
                "Engine tagged this theme as positive but AI tagged it as negative. "
                "Inspect for negation ('not', 'never', 'didn't') or contrast ('but', 'however') "
                "immediately before the trigger phrase."
            ),
        }
        for theme, spans in sorted(guard_by_theme.items(), key=lambda x: -len(x[1]))
    ]

    # --- Reviews needing manual inspection ---
    manual_reviews: list[dict] = []
    for comp in comparisons:
        disagrees = comp.get("disagreements", [])
        priority_types = {d["disagreement_type"] for d in disagrees}
        needs_review = (
            len(disagrees) >= MANUAL_INSPECTION_DISAGREE_THRESHOLD
            or bool(priority_types & MANUAL_INSPECTION_PRIORITY_TYPES)
        )
        if needs_review:
            manual_reviews.append({
                "review_text": comp["review_text"][:300],
                "rating": comp.get("rating"),
                "review_date": comp.get("review_date"),
                "disagreement_count": len(disagrees),
                "disagreement_types": sorted(priority_types),
                "det_themes": [t["theme"] for t in comp.get("deterministic", [])],
                "ai_themes": [t["theme"] for t in (comp.get("ai") or [])],
            })

    return {
        "summary": summary,
        "by_theme": by_theme,
        "false_positives": false_positives,
        "missed_phrases": missed_phrases,
        "candidate_phrase_additions": candidate_phrase_additions,
        "candidate_negation_guards": candidate_negation_guards,
        "reviews_needing_manual_inspection": manual_reviews,
    }


def _empty_report() -> dict[str, Any]:
    return {
        "summary": {
            "total_reviews": 0,
            "ai_available_count": 0,
            "total_disagreements": 0,
            "agreement_count": 0,
            "agreement_rate": None,
            "disagreements_by_type": {},
        },
        "by_theme": [],
        "false_positives": [],
        "missed_phrases": [],
        "candidate_phrase_additions": [],
        "candidate_negation_guards": [],
        "reviews_needing_manual_inspection": [],
    }
