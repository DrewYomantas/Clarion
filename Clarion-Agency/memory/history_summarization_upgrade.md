# history_summarization_upgrade.md
# Clarion Agency — History Summarization Upgrade

**Date:** 2026-03-12
**Author:** Agency Config Session
**Status:** Complete

---

## What Was Added

A lightweight historical summarization layer so agents stop repeatedly ingesting
large, growing log files. The Chief of Staff periodically condenses long-running
logs into `memory/history_summaries.md`. All other agents read the summary as
their primary historical reference, falling back to full logs only when exact
detail is required.

---

## Files Created

### `memory/history_summaries.md`
New append-only file. Stores dated summary entries for long-running logs.
Includes: usage instructions, covered log list, summarization thresholds,
and the standard entry format. No entries yet — written on first CoS threshold trigger.

---

## Files Modified

### `agents/executive/chief_of_staff.md`

Three additive changes:

**1. Inputs section**
Added `history_summaries.md` as a required input. CoS reads it before
ingesting any full log. Only reads the full log when exact detail is needed
for a specific decision or escalation.

**2. Office Health Evaluation — Section G (new)**
Added `## G. Historical Summarization Check` between Section F (Market Freshness)
and Section E (Operational Risk Level). Defines the six covered logs, their
thresholds, and the four-step summarization procedure.

**3. CEO Brief Report Format — new section**
Added `HISTORICAL SUMMARIZATION` section to the report template, placed between
`MISSING REPORTS` and `OFFICE LEARNING`. CoS reports what was summarized each
run, or writes `None this cycle.`

---

## Logs Covered

| Log | Threshold |
|---|---|
| memory/office_health_log.md | 20+ entries since last summary |
| memory/decision_log.md | 15+ entries since last summary |
| memory/approved_actions.md | 20+ completed/closed entries since last summary |
| memory/email_log.md | 30+ entries since last summary |
| memory/moderation_log.md | 10+ entries since last summary |
| memory/security_incident_log.md | Any resolved incidents not yet captured |

---

## Files Not Modified

- All existing log files — untouched, append-only behavior preserved
- All 13 weekly-cadence agent files — no changes
- All backend, frontend, and production scoring files — untouched
- `memory/projects.md` — untouched

---

## Blocked Items

None.
