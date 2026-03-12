"""
openrouter_client.py
Clarion — Shared OpenRouter API Client

All agent runners import from this module.
No inline API calls anywhere else.

Requirements:
    pip install requests python-dotenv
"""

import os
import json
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_REFERER = "https://clarion.internal"
OPENROUTER_TITLE   = "Clarion Agent Office"

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAY = 3  # seconds


def _get_api_key() -> str:
    key = os.environ.get("OPENROUTER_API_KEY", "")
    if not key:
        raise EnvironmentError(
            "OPENROUTER_API_KEY is not set. "
            "Add it to your .env file or environment variables."
        )
    return key


def _safe_json(response: requests.Response) -> dict:
    """Safely parse JSON response."""
    try:
        return response.json()
    except Exception:
        raise RuntimeError(
            f"OpenRouter returned non-JSON response:\n{response.text}"
        )


def call(
    model: str,
    system_prompt: str,
    user_message: str,
    max_tokens: int = 600,
    temperature: float = 0.3,
    agent_title: str = "Clarion Agent",
) -> dict:
    """
    Call the OpenRouter chat completions endpoint.

    Returns:
        {
            "content":           str,
            "prompt_tokens":     int,
            "completion_tokens": int,
            "model":             str,
        }
    """

    headers = {
        "Authorization": f"Bearer {_get_api_key()}",
        "Content-Type": "application/json",
        "HTTP-Referer": OPENROUTER_REFERER,
        "X-Title": agent_title.encode("ascii", errors="replace").decode("ascii"),
    }

    payload = {
        "model": model,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
    }

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.post(
                OPENROUTER_API_URL,
                headers=headers,
                json=payload,
                timeout=120,
            )

            if response.status_code != 200:
                raise RuntimeError(
                    f"OpenRouter API error {response.status_code}: {response.text}"
                )

            data = _safe_json(response)

            content = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {})

            return {
                "content": content,
                "prompt_tokens": usage.get("prompt_tokens", 0),
                "completion_tokens": usage.get("completion_tokens", 0),
                "model": data.get("model", model),
            }

        except Exception as e:
            last_error = e

            if attempt < MAX_RETRIES:
                print(
                    f"  [RETRY] OpenRouter request failed (attempt {attempt}/{MAX_RETRIES}) — retrying..."
                )
                time.sleep(RETRY_DELAY)
            else:
                break

    raise RuntimeError(
        f"OpenRouter call failed after {MAX_RETRIES} attempts.\nError: {last_error}"
    )


def check_budget(agent_name: str, actual_out: int, max_out: int) -> None:
    """
    Log a warning if output tokens exceed budget by more than 20%.
    This does not stop execution — it is purely diagnostic.
    """

    threshold = max_out * 1.2

    if actual_out > threshold:
        print(
            f"  [BUDGET WARNING] {agent_name}: output tokens {actual_out} "
            f"exceeded budget {max_out} by >20%. "
            f"Log and review — do not auto-retry."
        )