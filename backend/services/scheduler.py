"""Weekly governance brief email scheduler.

Reads per-user schedules from report_pack_schedules WHERE enabled = 1.
Each enabled schedule is processed independently — an error in one firm's
delivery never blocks the others.

Schema note: report_pack_schedules is keyed by user_id (not firm_id).
The scheduler resolves the firm name via the users + firms join for the brief.
"""

from __future__ import annotations

import json
import logging
import os
import sqlite3
from datetime import datetime, timezone
from typing import Any

from apscheduler.schedulers.background import BackgroundScheduler

from services.email_service import send_email_batch

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(timezone=os.getenv("FIRM_TIMEZONE", "America/Chicago"))


# ---------------------------------------------------------------------------
# Database helpers
# ---------------------------------------------------------------------------

def _db_path() -> str:
    database_url = (os.getenv("DATABASE_URL") or "").strip()
    if database_url.startswith("sqlite:///"):
        return database_url.replace("sqlite:///", "", 1)
    return os.path.join(os.path.dirname(__file__), "..", "feedback.db")


def _db_connect():
    """Open a plain sqlite3 connection for the scheduler (runs outside Flask)."""
    path = _db_path()
    conn = sqlite3.connect(path, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


# ---------------------------------------------------------------------------
# Per-firm brief generation
# ---------------------------------------------------------------------------

def _parse_themes(raw: str | None) -> str:
    if not raw:
        return "No dominant issue identified yet"
    try:
        parsed = json.loads(raw)
    except Exception:
        return "No dominant issue identified yet"
    if isinstance(parsed, dict) and parsed:
        ordered = sorted(parsed.items(), key=lambda item: int(item[1] or 0), reverse=True)
        return str(ordered[0][0])
    return "No dominant issue identified yet"


def _parse_top_quote(raw: str | None) -> str:
    if not raw:
        return "No client quote available yet."
    try:
        parsed = json.loads(raw)
    except Exception:
        return "No client quote available yet."
    if isinstance(parsed, list):
        for item in parsed:
            if isinstance(item, str) and item.strip():
                return item.strip()
            if isinstance(item, dict):
                quote = str(item.get("review_text") or "").strip()
                if quote:
                    return quote
    return "No client quote available yet."


def _generate_brief_html_for_user(user_id: int, conn) -> dict[str, Any] | None:
    """
    Pull the latest non-deleted report for user_id and return a brief data dict.
    Returns None if no report exists.
    """
    c = conn.cursor()
    c.execute(
        """
        SELECT
            r.id,
            r.created_at,
            r.avg_rating,
            r.themes,
            r.top_complaints,
            r.custom_name,
            u.firm_name,
            f.name AS firm_table_name
        FROM reports r
        INNER JOIN users u ON u.id = r.user_id
        LEFT JOIN firms f ON f.id = r.firm_id
        WHERE r.user_id = ?
          AND r.deleted_at IS NULL
        ORDER BY r.created_at DESC
        LIMIT 1
        """,
        (user_id,),
    )
    row = c.fetchone()
    if not row:
        return None

    firm_name = (
        row["firm_table_name"]
        or row["firm_name"]
        or "Your Firm"
    )
    top_issue = _parse_themes(row["themes"])
    quote = _parse_top_quote(row["top_complaints"])
    report_name = row["custom_name"] or f"Governance Brief #{row['id']}"
    avg_display = (
        f"{float(row['avg_rating']):.2f} / 5"
        if row["avg_rating"] is not None
        else "Not available"
    )
    generated_label = row["created_at"] or datetime.now(timezone.utc).isoformat()

    return {
        "firm_name": firm_name,
        "report_name": report_name,
        "average_rating": avg_display,
        "top_issue": top_issue,
        "example_quote": quote,
        "generated_at": generated_label,
    }


def _build_brief_html(data: dict[str, Any]) -> str:
    """Render the per-firm governance brief as HTML."""
    from html import escape

    firm_name = escape(str(data.get("firm_name") or "Your Firm"))
    report_name = escape(str(data.get("report_name") or "Governance Brief"))
    avg_rating = escape(str(data.get("average_rating") or "Not available"))
    top_issue = escape(str(data.get("top_issue") or "No top issue identified yet"))
    quote = escape(str(data.get("example_quote") or "No client quote available yet"))
    generated_at = escape(str(data.get("generated_at") or ""))

    return f"""<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Partner Brief</title></head>
  <body style="margin:0;padding:24px;background:#F3F5F9;font-family:Segoe UI,Arial,sans-serif;color:#0D1B2A;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
           style="max-width:680px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">
      <tr>
        <td style="padding:18px 20px;background:#0F2D57;color:#FFFFFF;">
          <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.9;">Clarion Partner Brief</div>
          <div style="margin-top:8px;font-size:20px;font-weight:700;">{report_name}</div>
          <div style="margin-top:6px;font-size:12px;opacity:.9;">{firm_name} &bull; {generated_at}</div>
        </td>
      </tr>
      <tr><td style="padding:18px 20px 4px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748B;">Average Rating</div>
        <div style="margin-top:4px;font-size:16px;font-weight:600;">{avg_rating}</div>
      </td></tr>
      <tr><td style="padding:8px 20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748B;">Top Client Issue</div>
        <div style="margin-top:4px;font-size:16px;font-weight:600;">{top_issue}</div>
      </td></tr>
      <tr><td style="padding:8px 20px 20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748B;">Example Client Quote</div>
        <div style="margin-top:6px;padding:12px;border-left:3px solid #EF4444;background:#F8FAFC;font-size:14px;line-height:1.5;">"{quote}"</div>
      </td></tr>
    </table>
  </body>
</html>"""


# ---------------------------------------------------------------------------
# Core scheduler job
# ---------------------------------------------------------------------------

def _normalize_recipients(raw: Any) -> list[str]:
    """Parse recipients_json from DB into a clean validated list."""
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except Exception:
            return []
    if not isinstance(raw, list):
        return []
    result = []
    for item in raw:
        email = str(item or "").strip().lower()
        if email and "@" in email:
            result.append(email)
    return result


def _mark_sent(conn, user_id: int, now_iso: str) -> None:
    conn.execute(
        """
        UPDATE report_pack_schedules
        SET last_sent_at = ?, updated_at = ?
        WHERE user_id = ?
        """,
        (now_iso, now_iso, user_id),
    )
    conn.commit()


def weekly_brief() -> None:
    """
    Main scheduled job. Queries all enabled schedules, delivers one brief
    per user/firm. Errors are isolated: one failure never blocks others.
    """
    try:
        conn = _db_connect()
    except Exception as exc:
        logger.error("scheduler: failed to open DB connection: %s", exc)
        return

    try:
        c = conn.cursor()
        c.execute(
            """
            SELECT user_id, recipients_json, cadence
            FROM report_pack_schedules
            WHERE enabled = 1
            """
        )
        schedules = c.fetchall()
    except Exception as exc:
        logger.error("scheduler: failed to read report_pack_schedules: %s", exc)
        conn.close()
        return

    if not schedules:
        logger.info("scheduler: no enabled schedules found, nothing to send")
        conn.close()
        return

    now_iso = datetime.now(timezone.utc).isoformat()
    logger.info("scheduler: processing %d enabled schedule(s)", len(schedules))

    for row in schedules:
        user_id = row["user_id"]
        try:
            recipients = _normalize_recipients(row["recipients_json"])
            if not recipients:
                logger.warning("scheduler: user_id=%s has no valid recipients, skipping", user_id)
                continue

            brief_data = _generate_brief_html_for_user(user_id, conn)
            if not brief_data:
                logger.warning("scheduler: user_id=%s has no reports, skipping", user_id)
                continue

            html = _build_brief_html(brief_data)
            firm_name = brief_data.get("firm_name") or "Your Firm"
            subject = f"Weekly Clarion Client Experience Brief — {firm_name}"

            send_email_batch(recipients, subject, html)
            _mark_sent(conn, user_id, now_iso)

            logger.info(
                "scheduler: sent brief for user_id=%s firm=%r to %d recipient(s)",
                user_id,
                firm_name,
                len(recipients),
            )

        except Exception as exc:
            # Isolate: log and continue to next schedule
            logger.error(
                "scheduler: failed to deliver brief for user_id=%s: %s",
                user_id,
                exc,
                exc_info=True,
            )
            continue

    conn.close()


# ---------------------------------------------------------------------------
# APScheduler wiring
# ---------------------------------------------------------------------------

def start_scheduler() -> None:
    if scheduler.running:
        return

    # Prevent duplicate startup under Flask debug reloader.
    if os.environ.get("FLASK_ENV") == "development" and os.environ.get("WERKZEUG_RUN_MAIN") != "true":
        return

    scheduler.add_job(
        weekly_brief,
        trigger="cron",
        day_of_week="mon",
        hour=8,
        id="weekly_governance_brief_email",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("scheduler: started — weekly_governance_brief_email registered (Mon 08:00 %s)",
                os.getenv("FIRM_TIMEZONE", "America/Chicago"))
