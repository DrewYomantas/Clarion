"""
shared/approved_actions_reader.py
Clarion — Approved Actions Reader & State Manager

Reads memory/approved_actions.md, parses action blocks, routes them,
and updates status in-place after execution.

Format expected in approved_actions.md:

    ---
    Action ID:   ACT-001
    Action:      [what to do]
    Approved By: CEO
    Date:        2026-03-12
    Owner:       Content & SEO Agent
    Status:      approved
    Notes:       optional context
    ---

Supported statuses: approved | in_progress | completed | blocked

This module exposes:
    load_approved_actions()   -> list[dict]
    route_action()            -> (agent_key, prompt_rel, subdir) | None
    is_safe_execution()       -> bool
    update_action_status()    -> bool
    append_execution_log()    -> None
    log_no_actions()          -> None
"""

import re
import datetime
from pathlib import Path

BASE_DIR     = Path(__file__).resolve().parent.parent
ACTIONS_PATH    = BASE_DIR / "memory" / "approved_actions.md"
DLA_PATH        = BASE_DIR / "memory" / "division_lead_approvals.md"
LOG_PATH        = BASE_DIR / "memory" / "execution_log.md"

# ── Owner routing ─────────────────────────────────────────────────────────────
# Maps owner strings (lowercase) -> (agent_key, prompt_rel_path, report_subdir)

OWNER_ROUTE = {
    "content & seo agent":        ("content_seo",             "agents/comms/content_seo.md",               "execution"),
    "comms":                       ("content_seo",             "agents/comms/content_seo.md",               "execution"),
    "competitive intelligence":    ("competitive_intelligence","agents/market/competitive_intelligence.md",  "execution"),
    "market intelligence agent":   ("competitive_intelligence","agents/market/competitive_intelligence.md",  "execution"),
    "usage analyst":               ("usage_analyst",           "agents/product_insight/usage_analyst.md",   "execution"),
    "product insight":             ("usage_analyst",           "agents/product_insight/usage_analyst.md",   "execution"),
    "chief of staff":              ("chief_of_staff",          "agents/executive/chief_of_staff.md",        "execution"),
    "executive":                   ("chief_of_staff",          "agents/executive/chief_of_staff.md",        "execution"),
    "customer discovery":          ("customer_discovery",      "agents/market/customer_discovery.md",       "execution"),
    "sales development":           ("sales_development",       "agents/sales/outbound_sales.md",             "execution"),
    "sales development analyst":   ("sales_development",       "agents/sales/outbound_sales.md",             "execution"),
    "head of growth":              ("head_of_growth",          "agents/revenue/head_of_growth.md",           "execution"),
    "revenue":                     ("head_of_growth",          "agents/revenue/head_of_growth.md",           "execution"),
    "funnel conversion":           ("funnel_conversion",       "agents/revenue/funnel_conversion.md",        "execution"),
    "funnel conversion analyst":   ("funnel_conversion",       "agents/revenue/funnel_conversion.md",        "execution"),
    "narrative strategy":          ("narrative_strategy",      "agents/growth/narrative_strategy.md",        "execution"),
    "launch readiness":            ("launch_readiness",        "agents/strategy/launch_readiness.md",        "execution"),
    "market intelligence":         ("market_intelligence",     "agents/strategy/market_intelligence.md",     "execution"),
}

# Safe bounded verbs for pre-launch execution
SAFE_EXECUTION_TYPES = (
    "finalize", "draft", "prepare", "produce", "expand",
    "deepen", "refine", "summarize", "convert", "compile",
    "research", "document", "outline", "analyze", "review", "audit",
    "publish", "post", "reply", "send", "create account",
)

# Actions that must NEVER execute autonomously regardless of approval level.
# These are Level 3 hard-blocked: launch/PR/pricing/partnerships/security/legal.
# Normal publishing, posting, outreach, and account creation are now Level 2
# and may appear in division_lead_approvals.md — they are no longer blocked here.
BLOCKED_EXECUTION_TYPES = (
    "launch announcement",
    "press release",
    "media statement",
    "partnership announcement",
    "pricing change",
    "change price",
    "modify pricing",
    "legal terms",
    "terms of service",
    "security policy",
    "enterprise commitment",
    "crisis communication",
    "paid advertising",
    "sponsored content",
)


# ── Parser ────────────────────────────────────────────────────────────────────

def _parse_block(block: str) -> dict | None:
    """
    Parse one action block into a dict.
    Supports two formats:

    New (Section 8 style):
        ## ACTION 001
        ACTION: ...
        OWNER: ...
        STATUS: approved
        APPROVED_BY: CEO
        DATE: 2026-03-12
        NOTES: ...

    Legacy (--- delimited):
        Action ID:   ACT-001
        Action:      ...
        Owner:       ...
        Status:      approved
    """
    fields = {}
    action_id = None

    for line in block.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        # Section 8 header: ## ACTION 001
        m = re.match(r"^##\s+ACTION\s+(\S+)", stripped, re.IGNORECASE)
        if m:
            action_id = f"ACT-{m.group(1)}"
            continue
        # Key: Value line
        if ":" in stripped:
            key, _, val = stripped.partition(":")
            key_norm = key.strip().lower().replace(" ", "_")
            val = val.strip()
            # Normalise Section 8 keys to internal names
            key_norm = {
                "action":      "action",
                "owner":       "owner",
                "status":      "status",
                "approved_by": "approved_by",
                "date":        "date",
                "notes":       "notes",
                # legacy keys
                "action_id":   "action_id",
            }.get(key_norm, key_norm)
            fields[key_norm] = val

    # Inject action_id from header if not already present
    if action_id and "action_id" not in fields:
        fields["action_id"] = action_id

    required = {"action", "owner", "status"}
    if not required.issubset(fields.keys()):
        return None
    # Ensure action_id exists
    if "action_id" not in fields:
        return None
    return fields


def load_level2_actions() -> list[dict]:
    """
    Read division_lead_approvals.md and return parsed action dicts
    with status == 'approved'.  These are Level 2 actions that do not
    require CEO sign-off.  Format expected:

        ## DLA-NNN
        ACTION: ...
        DIVISION: ...
        APPROVED_BY: ...
        DATE: 2026-03-12
        STATUS: approved
        NOTES: ...
    """
    if not DLA_PATH.exists():
        return []

    text = DLA_PATH.read_text(encoding="utf-8", errors="replace")
    raw_blocks = re.split(r"(?=^## DLA-)", text, flags=re.MULTILINE)
    actions = []
    for block in raw_blocks:
        fields: dict = {}
        action_id = None
        for line in block.splitlines():
            stripped = line.strip()
            if not stripped:
                continue
            m = re.match(r"^##\s+(DLA-\S+)", stripped, re.IGNORECASE)
            if m:
                action_id = m.group(1)
                continue
            if ":" in stripped:
                key, _, val = stripped.partition(":")
                key_norm = key.strip().lower().replace(" ", "_")
                fields[key_norm] = val.strip()
        if action_id:
            fields["action_id"] = action_id
        required = {"action", "status"}
        if not required.issubset(fields.keys()):
            continue
        if fields.get("status", "").lower().strip() == "approved":
            fields.setdefault("owner", fields.get("division", "unknown"))
            actions.append(fields)
    return actions


def load_approved_actions() -> list[dict]:
    """
    Read approved_actions.md and return parsed action dicts with status == 'approved'.
    Supports both ## ACTION NNN header format and legacy --- block format.
    Creates a template file if none exists.
    """
    if not ACTIONS_PATH.exists():
        _create_template()
        return []

    text = ACTIONS_PATH.read_text(encoding="utf-8", errors="replace")

    # Split on ## ACTION headers (new format) or --- delimiters (legacy)
    if re.search(r"^## ACTION", text, re.MULTILINE):
        raw_blocks = re.split(r"(?=^## ACTION)", text, flags=re.MULTILINE)
    else:
        raw_blocks = re.split(r"\n---\n", text)

    actions = []
    for block in raw_blocks:
        parsed = _parse_block(block)
        if parsed and parsed.get("status", "").lower().strip() == "approved":
            actions.append(parsed)
    return actions


def route_action(action: dict) -> tuple | None:
    """
    Return (agent_key, prompt_rel_path, report_subdir) for this action,
    or None if the owner is unmapped or action type is blocked.
    """
    owner_raw   = action.get("owner", "").lower().strip()
    action_text = action.get("action", "").lower()

    for blocked in BLOCKED_EXECUTION_TYPES:
        if blocked in action_text:
            return None

    return OWNER_ROUTE.get(owner_raw)


def is_safe_execution(action: dict) -> bool:
    """Returns True if the action starts with a bounded safe verb."""
    action_text = action.get("action", "").lower().strip()
    for blocked in BLOCKED_EXECUTION_TYPES:
        if blocked in action_text:
            return False
    for safe in SAFE_EXECUTION_TYPES:
        if action_text.startswith(safe):
            return True
    return True  # Default allow — agent prompt constrains further


# ── Status updater ────────────────────────────────────────────────────────────

def update_action_status(action_id: str, new_status: str,
                          note: str | None = None) -> bool:
    """
    Update the STATUS/Status line for an action in approved_actions.md.
    Handles both ## ACTION header format and legacy --- format.
    Optionally appends context to the NOTES/Notes field.
    Returns True on success.
    """
    if not ACTIONS_PATH.exists():
        return False

    text   = ACTIONS_PATH.read_text(encoding="utf-8", errors="replace")
    lines  = text.splitlines(keepends=True)

    # Determine which action_id pattern to match (ACT-001 or ACT-NNN from header)
    # action_id passed in is already in ACT-NNN form
    in_target = False
    updated   = False
    result    = []

    for line in lines:
        stripped = line.strip()

        # New format: ## ACTION 001  →  ACT-001
        m = re.match(r"^##\s+ACTION\s+(\S+)", stripped, re.IGNORECASE)
        if m:
            candidate = f"ACT-{m.group(1)}"
            in_target = (candidate == action_id)

        # Legacy format: Action ID:   ACT-001
        if re.match(r"Action ID:\s*" + re.escape(action_id), stripped, re.IGNORECASE):
            in_target = True

        # Update status line (handles both STATUS: and Status:)
        if in_target and re.match(r"(STATUS|Status):\s*", stripped):
            indent = len(line) - len(line.lstrip())
            line   = " " * indent + re.sub(r"(STATUS|Status):\s*.*", f"STATUS: {new_status}", stripped) + "\n"
            updated = True

        # Append to notes line
        if in_target and note and re.match(r"(NOTES|Notes):\s*", stripped):
            ts       = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
            existing = stripped.split(":", 1)[1].strip() if ":" in stripped else ""
            combined = f"{existing} | [{ts}] {note}" if existing else f"[{ts}] {note}"
            indent   = len(line) - len(line.lstrip())
            line     = " " * indent + f"NOTES: {combined}\n"
            in_target = False

        # End of legacy block
        if in_target and stripped == "---" and updated:
            in_target = False

        result.append(line)

    if updated:
        ACTIONS_PATH.write_text("".join(result), encoding="utf-8")
    return updated


# ── Execution log ─────────────────────────────────────────────────────────────

def _ensure_log() -> None:
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not LOG_PATH.exists():
        LOG_PATH.write_text(
            "# execution_log.md\n"
            "# Clarion — Execution Log\n"
            "# Append-only. Do not edit manually.\n\n",
            encoding="utf-8",
        )


def append_execution_log(action_id: str, action_text: str, owner: str,
                          status_result: str, what_was_done: str,
                          next_step: str, ceo_review_needed: bool) -> None:
    """Append one execution entry to memory/execution_log.md."""
    _ensure_log()
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    entry = (
        f"\n---\n"
        f"Timestamp:          {ts}\n"
        f"Action ID:          {action_id}\n"
        f"Action:             {action_text}\n"
        f"Owner:              {owner}\n"
        f"Status Result:      {status_result}\n"
        f"What Was Done:      {what_was_done}\n"
        f"Next Step:          {next_step}\n"
        f"CEO Review Needed:  {'Yes' if ceo_review_needed else 'No'}\n"
    )
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(entry)


def log_no_actions() -> None:
    """Log a single line when no approved actions exist this cycle."""
    _ensure_log()
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(f"\n[{ts}] No approved actions available this cycle.\n")


# ── Template creator ──────────────────────────────────────────────────────────

def _create_template() -> None:
    ACTIONS_PATH.parent.mkdir(parents=True, exist_ok=True)
    ACTIONS_PATH.write_text(
        "# approved_actions.md\n"
        "# Clarion - CEO Approved Actions Register\n\n"
        "## Purpose\n"
        "Actions agents are authorized to execute. CEO approves all entries.\n"
        "Agents propose in their reports. Only entries here with Status: approved\n"
        "are picked up by the runner and executed.\n\n"
        "## Format\n"
        "Each block is delimited by --- on its own line.\n\n"
        "## Approved Actions\n\n"
        "---\n"
        "Action ID:   ACT-EXAMPLE\n"
        "Action:      Finalize LinkedIn company profile draft for CEO review\n"
        "Approved By: CEO\n"
        "Date:        2026-03-12\n"
        "Owner:       Content & SEO Agent\n"
        "Status:      staged\n"
        "Notes:       Example entry - change Status to approved to activate\n"
        "---\n\n"
        "## Completed Actions\n\n"
        "_(none)_\n",
        encoding="utf-8",
    )
