"""
services/bench/comparator.py
=============================
Compares deterministic tagger output against AI benchmark labels and
classifies each disagreement into one of eight categories.

Disagreement taxonomy
---------------------
missing_theme           : AI found a theme the deterministic engine missed.
extra_theme             : Deterministic engine fired; AI did not.
wrong_polarity          : Both agree on theme, but polarity differs.
wrong_severity          : Both agree on theme+polarity direction, severity differs
                          (e.g. deterministic said negative, AI said severe_negative).
missed_severe_phrase    : AI returned severe_negative but deterministic returned
                          negative or positive for the same theme.
ambiguity_or_mixed_sentiment : AI confidence is low for this theme, or the review
                          is 3-star and both engines diverge.
likely_false_positive   : Deterministic fired on a theme where AI confidence is
                          "low" and the theme has no high-signal evidence span in
                          the evidence log.
likely_context_guard_failure : Deterministic fired positive but AI returned
                          negative — likely the engine missed a negation or contrast.
"""

from __future__ import annotations

from typing import Any


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _polarity_direction(polarity: str) -> str:
    """Map polarity to coarse direction: 'pos' or 'neg'."""
    return "pos" if polarity == "positive" else "neg"


def _severity_rank(polarity: str) -> int:
    """severe_negative > negative > positive."""
    return {"positive": 0, "negative": 1, "severe_negative": 2}.get(polarity, 0)


# ---------------------------------------------------------------------------
# Core comparison
# ---------------------------------------------------------------------------

def compare(
    det_result: dict[str, Any],
    ai_result: dict[str, Any] | None,
) -> dict[str, Any]:
    """
    Compare deterministic and AI results for a single review.

    Parameters
    ----------
    det_result : dict
        Output of deterministic_tagger.tag_review().
    ai_result : dict | None
        Output of openrouter_client.get_ai_labels(), or None if AI was
        skipped / failed.

    Returns
    -------
    dict with keys:
        review_text     : str
        rating          : int
        review_date     : str | None
        deterministic   : list[ThemeResult]
        ai              : list[ThemeResult] | None
        ai_available    : bool
        disagreements   : list[Disagreement]
        agreement_count : int
        evidence_log    : list[EvidenceEntry]  (pass-through from det_result)

    Disagreement
    ------------
        theme           : str
        disagreement_type : str  (see taxonomy above)
        det_polarity    : str | None
        ai_polarity     : str | None
        det_confidence  : str | None
        ai_confidence   : str | None
        evidence_span   : str | None  (from whichever side has it)
        notes           : str         (human-readable explanation)
    """
    review_text = det_result.get("review_text", "")
    rating = det_result.get("rating", 0)
    review_date = det_result.get("review_date")
    det_themes: list[dict] = det_result.get("themes", [])
    evidence_log: list[dict] = det_result.get("evidence_log", [])

    ai_available = ai_result is not None
    ai_themes: list[dict] = (ai_result or {}).get("themes", []) if ai_available else []

    # Index by theme name for O(1) lookup
    det_by_theme: dict[str, dict] = {t["theme"]: t for t in det_themes}
    ai_by_theme: dict[str, dict] = {t["theme"]: t for t in ai_themes}

    all_themes = set(det_by_theme) | set(ai_by_theme)
    disagreements: list[dict] = []
    agreement_count = 0

    for theme in sorted(all_themes):
        det = det_by_theme.get(theme)
        ai = ai_by_theme.get(theme)

        if not ai_available:
            # No AI run — skip disagreement classification
            continue

        # Both found it
        if det and ai:
            det_pol = det["polarity"]
            ai_pol = ai["polarity"]

            if det_pol == ai_pol:
                agreement_count += 1
                continue

            det_dir = _polarity_direction(det_pol)
            ai_dir = _polarity_direction(ai_pol)

            if det_dir != ai_dir:
                # Direction differs — context guard failure (engine said pos, AI neg) or vice versa
                if det_pol == "positive" and ai_pol in ("negative", "severe_negative"):
                    dtype = "likely_context_guard_failure"
                    notes = (
                        f"Engine tagged '{theme}' as positive; AI tagged it as {ai_pol}. "
                        "Likely missed negation or contrast token."
                    )
                else:
                    dtype = "wrong_polarity"
                    notes = f"Engine: {det_pol} | AI: {ai_pol}"
            else:
                # Same direction, different severity
                det_rank = _severity_rank(det_pol)
                ai_rank = _severity_rank(ai_pol)
                if ai_rank > det_rank and ai_pol == "severe_negative":
                    dtype = "missed_severe_phrase"
                    notes = (
                        f"AI returned severe_negative; engine returned {det_pol}. "
                        "Engine may be missing a severity amplifier phrase."
                    )
                else:
                    dtype = "wrong_severity"
                    notes = f"Same direction but different intensity: engine={det_pol} ai={ai_pol}"

            ev_span = det.get("evidence_span") or ai.get("evidence_span", "")
            disagreements.append({
                "theme": theme,
                "disagreement_type": dtype,
                "det_polarity": det_pol,
                "ai_polarity": ai_pol,
                "det_confidence": det.get("confidence"),
                "ai_confidence": ai.get("confidence"),
                "evidence_span": ev_span,
                "notes": notes,
            })

        elif det and not ai:
            # Engine fired but AI did not — possible false positive
            det_pol = det["polarity"]
            det_conf = det.get("confidence", "medium")

            # Check evidence log for this theme — if all matches are ambiguous families
            theme_evidence = [e for e in evidence_log if e["theme"] == theme]
            high_signal = any(
                e["pattern_family"].endswith("_pos") or e["pattern_family"].endswith("_neg")
                for e in theme_evidence
            )

            if det_conf == "low" and not high_signal:
                dtype = "likely_false_positive"
                notes = (
                    f"Engine fired on '{theme}' with low confidence and no high-signal "
                    "phrase family. AI found nothing. Candidate for phrase removal."
                )
            else:
                dtype = "extra_theme"
                notes = (
                    f"Engine detected '{theme}' (polarity={det_pol}, confidence={det_conf}); "
                    "AI did not detect this theme."
                )

            disagreements.append({
                "theme": theme,
                "disagreement_type": dtype,
                "det_polarity": det_pol,
                "ai_polarity": None,
                "det_confidence": det_conf,
                "ai_confidence": None,
                "evidence_span": det.get("evidence_span", ""),
                "notes": notes,
            })

        else:  # ai found theme, det did not
            ai_pol = ai["polarity"]
            ai_conf = ai.get("confidence", "medium")

            if ai_conf == "low" and rating == 3:
                dtype = "ambiguity_or_mixed_sentiment"
                notes = (
                    f"AI detected '{theme}' with low confidence on a 3-star review. "
                    "Likely ambiguous — may not need a new phrase."
                )
            else:
                dtype = "missing_theme"
                notes = (
                    f"AI detected '{theme}' (polarity={ai_pol}, confidence={ai_conf}); "
                    "engine missed it. Candidate for new phrase addition."
                )

            disagreements.append({
                "theme": theme,
                "disagreement_type": dtype,
                "det_polarity": None,
                "ai_polarity": ai_pol,
                "det_confidence": None,
                "ai_confidence": ai_conf,
                "evidence_span": ai.get("evidence_span", ""),
                "notes": notes,
            })

    return {
        "review_text": review_text,
        "rating": rating,
        "review_date": review_date,
        "deterministic": det_themes,
        "ai": ai_themes if ai_available else None,
        "ai_available": ai_available,
        "disagreements": disagreements,
        "agreement_count": agreement_count,
        "evidence_log": evidence_log,
    }
