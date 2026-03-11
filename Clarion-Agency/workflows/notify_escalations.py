"""
notify_escalations.py
Clarion — Escalation Notification Script

Reads the most recent Chief of Staff brief, extracts STATUS and any escalations,
prints a plain-text summary to the terminal, logs to escalation_log.jsonl,
and optionally sends a plain-text email via Gmail SMTP.

Usage:
    python workflows/notify_escalations.py           # terminal only
    python workflows/notify_escalations.py --email   # terminal + email

Email requires in .env:
    NOTIFICATION_EMAIL=you@gmail.com
    NOTIFICATION_EMAIL_PASSWORD=your_app_password

No external services. No webhooks. Local-first.
"""

import sys
import re
import json
import argparse
import datetime
import smtplib
from pathlib import Path
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR   = Path(__file__).resolve().parent.parent
BRIEF_DIR  = BASE_DIR / "reports" / "ceo_brief"
LOG_PATH   = BRIEF_DIR / "escalation_log.jsonl"


# ---------------------------------------------------------------------------
# Finding the brief
# ---------------------------------------------------------------------------

def find_latest_brief() -> Path | None:
    if not BRIEF_DIR.exists():
        return None
    candidates = sorted(BRIEF_DIR.glob("chief_of_staff_*.md"), reverse=True)
    return candidates[0] if candidates else None


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

def parse_brief(text: str) -> dict:
    """
    Extract STATUS, ESCALATIONS block, RISKS—WATCH block, and brief date
    from the Chief of Staff report format.

    Returns:
        {
            "date":        str,
            "status":      str,   # NORMAL | WATCH | ESCALATE
            "escalations": str,   # raw text of the ESCALATIONS section
            "watch":       str,   # raw text of the RISKS — WATCH section
        }
    """
    result = {
        "date":        "",
        "status":      "UNKNOWN",
        "escalations": "None.",
        "watch":       "None.",
    }

    # Date
    date_match = re.search(r"DATE:\s*(\d{4}-\d{2}-\d{2})", text)
    if date_match:
        result["date"] = date_match.group(1)

    # Status
    status_match = re.search(r"STATUS:\s*(NORMAL|WATCH|ESCALATE)", text, re.IGNORECASE)
    if status_match:
        result["status"] = status_match.group(1).upper()

    # Escalations section — everything between ESCALATIONS and the next ---
    esc_match = re.search(
        r"ESCALATIONS\s*\n(.*?)(?=\n---|\nRISKS|\Z)",
        text, re.DOTALL | re.IGNORECASE
    )
    if esc_match:
        block = esc_match.group(1).strip()
        if block:
            result["escalations"] = block

    # Risks — Watch section
    watch_match = re.search(
        r"RISKS[^\n]*WATCH[^\n]*\n(.*?)(?=\n---|\nBUSINESS PULSE|\Z)",
        text, re.DOTALL | re.IGNORECASE
    )
    if watch_match:
        block = watch_match.group(1).strip()
        if block:
            result["watch"] = block

    return result


# ---------------------------------------------------------------------------
# Terminal output
# ---------------------------------------------------------------------------

def print_summary(brief_path: Path, parsed: dict) -> None:
    status = parsed["status"]
    bar = "=" * 60

    print(f"\n{bar}")
    print(f"  CLARION — ESCALATION CHECK")
    print(f"  Brief : {brief_path.name}")
    print(f"  Date  : {parsed['date'] or 'unknown'}")
    print(f"  STATUS: {status}")
    print(bar)

    if status == "ESCALATE":
        print("\n  *** ACTION REQUIRED — ESCALATIONS PRESENT ***\n")

    print("\n  ESCALATIONS")
    print("  " + "-" * 40)
    for line in parsed["escalations"].splitlines():
        print(f"  {line}")

    if status in ("WATCH", "ESCALATE"):
        print("\n  RISKS — WATCH")
        print("  " + "-" * 40)
        for line in parsed["watch"].splitlines():
            print(f"  {line}")

    print(f"\n  Full brief: {brief_path}\n")
    print(bar + "\n")


# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------

def build_email_body(brief_path: Path, parsed: dict) -> str:
    lines = [
        f"Clarion Agent Office — Weekly Escalation Check",
        f"Brief: {brief_path.name}",
        f"Date:  {parsed['date'] or 'unknown'}",
        f"Status: {parsed['status']}",
        "",
        "ESCALATIONS",
        "-" * 40,
        parsed["escalations"],
    ]
    if parsed["status"] in ("WATCH", "ESCALATE"):
        lines += [
            "",
            "RISKS — WATCH",
            "-" * 40,
            parsed["watch"],
        ]
    lines += [
        "",
        f"Full brief: {brief_path}",
    ]
    return "\n".join(lines)


def send_email(subject: str, body: str) -> None:
    sender = os.environ.get("NOTIFICATION_EMAIL", "")
    password = os.environ.get("NOTIFICATION_EMAIL_PASSWORD", "")

    if not sender:
        print("  [SKIP] NOTIFICATION_EMAIL not set in .env — email skipped.")
        return
    if not password:
        print("  [SKIP] NOTIFICATION_EMAIL_PASSWORD not set in .env — email skipped.")
        return

    msg = MIMEText(body, "plain")
    msg["Subject"] = subject
    msg["From"]    = sender
    msg["To"]      = sender   # send to yourself

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
            server.login(sender, password)
            server.sendmail(sender, [sender], msg.as_string())
        print(f"  [EMAIL] Sent to {sender}")
    except smtplib.SMTPAuthenticationError:
        print("  [EMAIL ERROR] Authentication failed.")
        print("  Make sure you're using a Gmail App Password, not your account password.")
        print("  Generate one at: https://myaccount.google.com/apppasswords")
    except Exception as e:
        print(f"  [EMAIL ERROR] {e}")


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

def log_run(brief_path: Path, parsed: dict, emailed: bool) -> None:
    BRIEF_DIR.mkdir(parents=True, exist_ok=True)
    entry = {
        "checked_at":  datetime.datetime.now().isoformat(timespec="seconds"),
        "brief":       brief_path.name,
        "brief_date":  parsed["date"],
        "status":      parsed["status"],
        "emailed":     emailed,
        "escalations": parsed["escalations"][:300],   # truncate for log
    }
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    print(f"  [LOG] Entry written to {LOG_PATH.name}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Check the latest CEO brief for escalations."
    )
    parser.add_argument(
        "--email",
        action="store_true",
        help="Send email notification via Gmail SMTP (requires NOTIFICATION_EMAIL in .env)"
    )
    args = parser.parse_args()

    brief_path = find_latest_brief()
    if not brief_path:
        print("\n  [WARN] No CEO brief found in reports/ceo_brief/")
        print("  Run weekly_operations.py first.\n")
        sys.exit(0)

    text   = brief_path.read_text(encoding="utf-8")
    parsed = parse_brief(text)

    print_summary(brief_path, parsed)
    emailed = False

    if args.email:
        status  = parsed["status"]
        subject = f"[Clarion] {status} — Weekly Brief {parsed['date'] or 'unknown'}"
        body    = build_email_body(brief_path, parsed)
        send_email(subject, body)
        emailed = True

    log_run(brief_path, parsed, emailed)


if __name__ == "__main__":
    main()
