# product_feedback.md
# Clarion Agent Office — Product Feedback Log
# Version: 1.0 | Created: 2026-03-12
#
# PURPOSE
# Append-only log of product feedback signals captured by Sales and Support
# agents during prospect and pilot interactions. Records feature requests,
# capability gaps, and usability friction heard directly from law firm contacts
# before and after Clarion reaches them.
#
# This is pre-launch prospect signal — not post-launch customer feedback.
# Post-launch customer feedback lives in data/customer/feature_requests.csv
# and is owned by the Voice of Customer & Product Demand Agent.
#
# WHO WRITES TO THIS FILE
# - Outbound Sales Agent: appends entries when prospects request features,
#   raise capability questions, or surface product gaps during any touchpoint
# - Sales Development Agent: same triggers as above
# - Any agent that surfaces a feature signal during a prospect or pilot
#   interaction may append here — this is a LEVEL 1 autonomous action;
#   no approval required to log
#
# WHO READS THIS FILE
# - Product Insights Agent (agents/product_insight/product_insights.md):
#   reads weekly, synthesizes patterns, surfaces to CEO
# - Chief of Staff: reads when Product Insights Agent escalates
# - CEO: receives synthesized summary in weekly brief under PRODUCT SIGNALS
#
# RULES
# - Append-only. Never edit or delete entries.
# - No prospect names, attorney names, or any PII. Describe firms by
#   type, size estimate, practice area, and geography tier only.
# - ENTRY_ID is sequential: FB-001, FB-002, etc.
#   Assign the next available number at time of logging.
# - SOURCE must identify the originating agent and interaction type —
#   not the prospect. Example: "Outbound Sales Agent — pilot debrief"
# - FEATURE_AREA must use values from the controlled list below.
#   Use "other" only if no existing value fits — and note what it is.
# - PRIORITY is set by the logging agent at time of entry based on
#   signal strength and ICP relevance. Product Insights Agent may
#   revise upward during synthesis if a pattern emerges.
# - Each entry captures ONE signal. If a single interaction produced
#   multiple distinct requests, write one entry per request.
#
# FEATURE_AREA values (controlled):
#   review_ingestion     — how reviews are collected or imported
#   theme_detection      — how feedback themes are identified or labeled
#   governance_signals   — partner alerts, red flags, escalation signals
#   reporting            — report format, delivery, scheduling, export
#   dashboard            — UI, navigation, data display
#   integrations         — connections to other tools or platforms
#   onboarding           — setup, first-run experience, training
#   alerts               — notifications, thresholds, triggers
#   user_management      — roles, permissions, multi-user access
#   pricing_model        — how the product is priced or packaged
#   practice_area_fit    — features specific to a practice area
#   competitor_parity    — "tool X does this" requests
#   other                — describe in OBSERVATION
#
# PRIORITY values:
#   High    — requested by 2+ ICP-fit prospects, or named as a
#             blocker to purchase/pilot by any ICP-fit prospect
#   Medium  — mentioned once, clear relevance to ICP use case
#   Low     — mentioned once, tangential or niche
#
# SOURCE values (examples):
#   "Outbound Sales Agent — cold outreach reply"
#   "Outbound Sales Agent — pilot debrief"
#   "Outbound Sales Agent — follow-up call notes"
#   "Sales Development Agent — inbound inquiry"
#   "Sales Development Agent — demo walkthrough"

---

## ENTRY FORMAT

Each entry must follow this exact block. Copy and fill in all fields.
Leave no field blank — write "Not captured" if a field is unavailable.

---
ENTRY_ID:
DATE:
SOURCE:
FIRM_TYPE:
FEATURE_AREA:
OBSERVATION:
USER_IMPACT:
PRIORITY:
---

## FIELD NOTES

FIRM_TYPE: describe the prospect without identifying them.
  Format: [practice area] firm, [size estimate] attorneys, [geography tier]
  Example: "Family law firm, ~12 attorneys, mid-size city"

OBSERVATION: what the prospect said or asked, paraphrased. One to three
  sentences. Capture the specific ask, not just the category.
  If the prospect used a memorable phrase, note it in quotes — mark as
  "paraphrase" or "exact" so the Product Insights Agent can weight it.

USER_IMPACT: what the prospect said this gap costs them or prevents them
  from doing. If they didn't state an impact, write the inferred consequence
  in one sentence and mark as "inferred."

---

## ENTRIES

_(No entries yet. First entry will be appended by the Outbound Sales Agent
or Sales Development Agent on their first run following a prospect interaction
that surfaces a product signal.)_
