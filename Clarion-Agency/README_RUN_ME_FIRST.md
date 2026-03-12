# Clarion Agent Office — Run Me First

## How to run

Double-click this file:

    run_clarion_agent_office.bat

Or open a terminal here and type:

    python run_clarion_agent_office.py

---

## Where the report appears

    reports\executive_brief_latest.md

A timestamped copy is also saved in `reports\ceo_brief\`.

---

## What success looks like

The window prints something like:

    ============================================================
      Done.
      Open this file to read the brief:
      reports\executive_brief_latest.md
    ============================================================

The brief always generates. If data files are missing, agents note it
inside the report instead of crashing.

---

## If something fails

1. Check that Python is installed: open a terminal, type `python --version`
2. Check the .env file has your API key: open `Clarion-Agency\.env` in Notepad
   — the line should read: `OPENROUTER_API_KEY= sk-or-...`
3. Run again. Most failures are transient API timeouts (auto-retried 3x).
4. If one division fails, the rest still run. The brief is still produced.

---

## What runs (pre-launch mode)

| Division | What it produces |
|---|---|
| Market Intelligence | Competitive + discovery signals |
| Product Insight | Usage and feature clarity audit |
| Comms & Content | Platform strategy, content drafts (no posting) |
| Revenue | Pipeline and early demand signals |
| Executive (Chief of Staff) | CEO brief synthesizing all of the above |

Customer, Operations, People, and Product Integrity are inactive until launch.
