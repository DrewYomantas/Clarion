# incidents_log.md
# Clarion Agent Office — Site Health Incident Log
# Version: 1.0 | Created: 2026-03-12
#
# PURPOSE
# Append-only record of all site health incidents detected by the Site Health Monitor.
# Each entry captures what broke, when it was detected, how severe it was,
# and what was done about it.
#
# WHO WRITES TO THIS FILE
# Site Health Monitor — appends a new entry for every area with status DEGRADED,
# FAILING, or UNKNOWN. Also updates STATUS and ACTION_TAKEN when an incident resolves.
#
# RULES
# - Append-only. Do not delete entries.
# - Do not create duplicate entries for the same active incident.
#   Check OPEN entries before writing. If an incident is already OPEN for the same
#   area and cause, note "Active incident — INC-[ID] — still open" in the report.
# - INC IDs are sequential: INC-001, INC-002, INC-003, etc.
#   Assign the next available number each run.
# - STATUS values: OPEN | RESOLVED | MONITORING
#   OPEN       — incident is active; root cause not confirmed resolved
#   MONITORING — issue appeared to resolve; watching for recurrence
#   RESOLVED   — confirmed resolved; root cause known or problem gone
# - When resolving: update STATUS and ACTION_TAKEN in the existing entry.
#   Do not create a new entry to record a resolution.
# - Chief of Staff reads this file weekly. Critical and High incidents
#   surface in EXCEPTIONS REQUIRING CEO ATTENTION.
#
# SEVERITY VALUES
# Critical — core user action completely blocked (signup, upload, reports, email)
# High     — core action degraded or intermittently failing
# Medium   — non-blocking anomaly (performance, minor error spike, stale data)
# Low      — informational (data gap, single isolated error, no confirmed user impact)
#
# AREA VALUES
# signup_flow | csv_upload | broken_pages | api_errors | email_delivery | slow_responses

---

## ENTRY FORMAT

Each entry must follow this exact block. Copy and fill in all fields.
Leave no field blank — write "Unknown" or "None" if data is unavailable.

---
INC-[ID]:
DATE:
DETECTED_BY:
SEVERITY:
AREA:
DESCRIPTION:
STATUS:
ACTION_TAKEN:
---

---

## INCIDENTS

_(No incidents yet. First entry will be appended by the Site Health Monitor
when the first failure or anomaly is detected.)_
