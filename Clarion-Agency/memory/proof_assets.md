# proof_assets.md
# Clarion Agent Office — Proof Asset Library
# Version: 1.0 | Created: 2026-03-12
#
# PURPOSE
# Append-only library of anonymized, sales-ready proof assets extracted from
# completed pilot analyses. Each entry captures a real finding from a real firm
# in a form that can be used in outreach, demos, and positioning without
# identifying the source firm.
#
# These are Clarion's evidence base. They answer the prospect question:
# "What does Clarion actually find?" Agents reference this file when
# drafting outreach, building sales collateral, or preparing demo narratives.
#
# WHO WRITES TO THIS FILE
# The Sales Development Agent or Outbound Sales Agent extracts and appends
# a proof asset entry after each pilot_complete event, following the rules
# in memory/pilot_execution_workflow.md (Step 8 — Extract Proof Asset).
#
# RULES
# - Append-only. Never edit or delete entries.
# - CASE_ID is sequential: CASE-001, CASE-002, etc.
#   Assign the next available number at time of extraction.
# - No firm names, attorney names, city names, or any detail that could
#   identify the source firm. Use FIRM_TYPE and GEOGRAPHY_TIER instead.
# - QUOTE must be paraphrased — never a verbatim client review.
#   Write it to sound like something a managing partner might say after
#   seeing the analysis. It is a representative synthesis, not a transcript.
# - IMPACT must describe the finding's consequence in plain language.
#   Ground it in what the analysis actually showed — no exaggeration.
# - SIGNAL_FOUND is the specific pattern Clarion detected. Be concrete:
#   name the theme, frequency, or anomaly.
# - ACTION_RECOMMENDED is what Clarion's analysis suggested the firm do.
#   One actionable sentence.
# - PRACTICE_AREA values: family_law | personal_injury | criminal_defense |
#   immigration | estate_planning | general_civil | other
# - GEOGRAPHY_TIER values: major_metro | mid_size_city | suburban | rural
# - FIRM_SIZE values: solo | small (2-5) | mid (6-20) | large (21-50)
# - IMPACT_TYPE values: reputation | operations | intake | governance |
#   retention | training | other
#
# Agents may reference this file in:
# - Outreach personalization (QUOTE, SIGNAL_FOUND)
# - Demo preparation (IMPACT, ACTION_RECOMMENDED)
# - Case study drafts (all fields)
# - Sales collateral (anonymized summary only)
#
# Chief of Staff does NOT read this file directly.
# Sales Development Agent surfaces relevant proof assets in PROPOSED ACTIONS
# when preparing outreach or collateral requiring Level 2 or Level 3 approval.

---

## ENTRY FORMAT

Each entry must follow this exact block. Copy and fill in all fields.
Leave no field blank — write "Not captured" if a field is unavailable.

---
CASE_ID:
DATE_EXTRACTED:
PILOT_BRIEF_SOURCE:
PRACTICE_AREA:
FIRM_SIZE:
GEOGRAPHY_TIER:
SIGNAL_FOUND:
ACTION_RECOMMENDED:
IMPACT:
IMPACT_TYPE:
QUOTE:
SALES_USE_APPROVED:
---

## FIELD NOTES

PILOT_BRIEF_SOURCE: path to the pilot brief this was extracted from
  (e.g., data/pilots/reports/hargrove_family_law_pilot_brief.md)
  This is for internal traceability only — never share with prospects.

QUOTE: a paraphrased, representative statement that captures the "so what"
  of this finding for a prospect. Write in first person as if the managing
  partner is speaking. Example:
  "I had no idea we were getting this many complaints about response time —
   that's not something you see from star ratings alone."

SALES_USE_APPROVED: Yes | Pending | No
  - Yes = CEO or division lead has cleared this asset for use in outreach
  - Pending = extracted but not yet reviewed for sales use
  - No = contains a finding too sensitive to reference externally
  New entries default to: Pending

---

## ENTRIES

_(No entries yet. First entry will be appended after the first pilot_complete
event, following Step 8 of pilot_execution_workflow.md.)_
