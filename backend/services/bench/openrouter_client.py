"""
services/bench/openrouter_client.py
=====================================
Minimal OpenRouter HTTP client for benchmark AI labels.

- API key read from OPENROUTER_API_KEY env var only.
- Returns None (never raises) on any failure so benchmark errors never
  propagate into the scoring path.
- Uses a strict JSON system prompt matching the benchmark theme taxonomy.
- Timeout is configurable via OPENROUTER_TIMEOUT_SECONDS env var (default 20s).
"""

from __future__ import annotations

import json
import logging
import os
from typing import Any

import requests

logger = logging.getLogger("bench.openrouter_client")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "openai/gpt-4o-mini"  # cheap, fast, good JSON compliance
DEFAULT_TIMEOUT = 20  # seconds

# Benchmark theme vocabulary exactly as defined in the spec
BENCH_THEME_VOCAB = [
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

_VOCAB_LINE = ", ".join(BENCH_THEME_VOCAB)

SYSTEM_PROMPT = f"""\
You are a JSON classification engine for a legal services client feedback platform.
Output ONLY valid JSON — no markdown, no explanation, no preamble.

THEME VOCABULARY (use ONLY these exact strings):
{_VOCAB_LINE}

For each theme present in the review output one object with:
  "theme"        : string (from vocabulary above)
  "polarity"     : "positive" | "negative" | "severe_negative"
  "evidence_span": verbatim excerpt from the review (max 120 chars)
  "confidence"   : "high" | "medium" | "low"

Output schema:
{{"themes": [ {{"theme": "...", "polarity": "...", "evidence_span": "...", "confidence": "..."}} ]}}

Rules:
- 0 to 5 themes per review.  If no clear theme is present return {{"themes": []}}.
- severe_negative: explicit harm language, malpractice, fraud, or systemic failure.
- Do not invent themes outside the vocabulary.
- If the review is unintelligible or non-English return {{"themes": []}}.
"""


def _resolve_api_key() -> str | None:
    key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    return key if key else None


def _resolve_model() -> str:
    return os.environ.get("OPENROUTER_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL


def _resolve_timeout() -> int:
    try:
        return int(os.environ.get("OPENROUTER_TIMEOUT_SECONDS", DEFAULT_TIMEOUT))
    except (ValueError, TypeError):
        return DEFAULT_TIMEOUT


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def is_available() -> bool:
    """Return True if the OpenRouter API key is configured."""
    return bool(_resolve_api_key())


def get_ai_labels(review_text: str, rating: int) -> dict[str, Any] | None:
    """
    Call OpenRouter and return parsed theme labels for a single review.

    Returns a dict matching the benchmark theme schema:
        {"themes": [{"theme": ..., "polarity": ..., "evidence_span": ..., "confidence": ...}]}

    Returns None on any error (network, timeout, parse, missing key).
    Failures are logged at WARNING level and never propagate.
    """
    api_key = _resolve_api_key()
    if not api_key:
        logger.warning("openrouter: OPENROUTER_API_KEY not set — AI benchmark skipped")
        return None

    safe_text = review_text.strip()[:800]
    user_prompt = (
        f"Star rating: {rating}/5\n\n"
        f"Review text:\n\"\"\"\n{safe_text}\n\"\"\"\n\n"
        "Classify the review. Return JSON only."
    )

    payload = {
        "model": _resolve_model(),
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.0,
        "max_tokens": 600,
        "response_format": {"type": "json_object"},
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://clarionhq.co",
        "X-Title": "Clarion Benchmark Harness",
    }

    try:
        response = requests.post(
            OPENROUTER_API_URL,
            json=payload,
            headers=headers,
            timeout=_resolve_timeout(),
        )
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.Timeout:
        logger.warning("openrouter: request timed out after %ss", _resolve_timeout())
        return None
    except requests.exceptions.RequestException as exc:
        logger.warning("openrouter: HTTP error: %s", exc)
        return None
    except (ValueError, KeyError) as exc:
        logger.warning("openrouter: response parse error: %s", exc)
        return None

    # Extract text content from response
    try:
        raw_text = data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, AttributeError) as exc:
        logger.warning("openrouter: unexpected response structure: %s — data=%s", exc, str(data)[:200])
        return None

    # Parse JSON
    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        logger.warning("openrouter: JSON decode error: %s — raw=%s", exc, raw_text[:200])
        return None

    # Validate structure
    if not isinstance(parsed, dict) or "themes" not in parsed:
        logger.warning("openrouter: missing 'themes' key in response: %s", str(parsed)[:200])
        return None

    if not isinstance(parsed["themes"], list):
        logger.warning("openrouter: 'themes' is not a list: %s", str(parsed)[:200])
        return None

    # Sanitize theme objects — drop malformed entries, enforce vocab
    valid_themes = []
    for item in parsed["themes"]:
        if not isinstance(item, dict):
            continue
        theme = item.get("theme", "")
        polarity = item.get("polarity", "")
        evidence_span = str(item.get("evidence_span", ""))[:200]
        confidence = item.get("confidence", "medium")

        if theme not in BENCH_THEME_VOCAB:
            logger.warning("openrouter: unknown theme '%s' — dropped", theme)
            continue
        if polarity not in ("positive", "negative", "severe_negative"):
            logger.warning("openrouter: invalid polarity '%s' — dropped", polarity)
            continue
        if confidence not in ("high", "medium", "low"):
            confidence = "medium"

        valid_themes.append({
            "theme": theme,
            "polarity": polarity,
            "evidence_span": evidence_span,
            "confidence": confidence,
        })

    return {"themes": valid_themes}
