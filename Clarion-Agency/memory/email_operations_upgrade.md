# email_operations_upgrade.md
# Clarion Agency — Email Operations Upgrade

**Date:** 2026-03-12
**Author:** Agency Config Session
**Status:** Complete

---

## What Was Added

A unified email operations layer covering inbound routing, response authority,
outbound approval gates, internal notification routing, and signal logging.

---

## Files Created

### `memory/email_routing_policy.md`
Six inbound routing categories: SALES/INTEREST → Revenue, CUSTOMER FEEDBACK →
Product Insight, SUPPORT → Customer, PARTNERSHIPS → Executive/CoS, PRESS/MEDIA →
Executive/CoS, INVESTOR → Executive/CoS, GENERAL/UNCLEAR → Chief of Staff for
classification. Includes per-category auto-reply rules and a 5-step routing
decision process.

### `memory/email_response_policy.md`
Auto-reply permitted for: general product questions, onboarding questions, feature
explanations, documentation requests, demo curiosity, feedback acknowledgement.
All replies governed by brand_voice.md quality standards. Escalation required for:
legal language, pricing negotiation, partnerships, investor inquiries, press/media,
serious complaints, confidential matters. Logging required for every response or
escalation.

### `memory/email_log.md`
Append-only inbound signal log. Fields: DATE, EMAIL TYPE, SUMMARY, DIVISION ROUTED TO,
ACTION TAKEN, NOTES. What to log: product interest, feature requests, demo inquiries,
complaints, partnerships, press/investor signals, notable support themes. Initialized
empty.

### `memory/outreach_email_policy.md`
Agents may draft outbound emails freely. No campaign, cold outreach, or multi-recipient
outreach may be sent without an approved OUTREACH APPROVAL PACKAGE on file in
`approved_actions.md`. Package requires: target audience, outreach goal, subject line,
full body draft, relevance rationale, expected outcome, send date, sending method.
Post-approval scope is binding.

### `memory/internal_notification_policy.md`
Website event routing table: demo requests → Revenue, contact form → Chief of Staff,
waitlist signups → Revenue + Head of Growth, product feedback → Product Insight,
bug reports → Product Integrity (+ Customer if account-impacting). Per-event handling
notes, escalation triggers, and logging standard for all events.

---

## Files Modified

### `agents/revenue/head_of_growth.md`
Added `## Email Operations` section before `## Guardrails`. Covers: SALES/INTEREST
and waitlist ownership, auto-reply permissions, outreach approval gate, logging
requirement.

### `agents/revenue/sales_development.md`
Added `## Email Operations` section before `## Guardrails`. Covers: SALES/INTEREST
and demo request ownership, auto-reply permissions, outreach approval gate.

### `agents/customer/customer_health_onboarding.md`
Added `## Email Operations` section before `## Guardrails`. Covers: SUPPORT email
ownership, bug report shared ownership, auto-reply permissions, escalation triggers.

### `agents/product_insight/usage_analyst.md`
Added `## Email Operations` section before `## Guardrails`. Covers: CUSTOMER FEEDBACK
and product feedback form ownership, acknowledgement-only reply rule, feature request
surfacing requirement.

### `agents/comms/content_seo.md`
Added `## Email Operations` section before `## Guardrails`. Covers: PRESS/MEDIA
immediate escalation rule, content collaboration = PARTNERSHIPS escalation,
outreach approval gate.

### `agents/executive/chief_of_staff.md`
Two additive changes:
1. **Inputs** — `email_log.md` added after `history_summaries.md`. Directs CoS to
   scan for new entries and surface recurring themes and unrouted GENERAL/UNCLEAR
   entries under EMAIL SIGNALS in the CEO brief.
2. **EMAIL SIGNALS brief block** — added between SOCIAL HEALTH and HISTORICAL
   SUMMARIZATION in the CEO brief report format. Per-entry fields: Type, Summary,
   Routed to, Action taken, Follow-up needed. Plus: unrouted GENERAL/UNCLEAR
   classification recommendations and recurring theme summary.

---

## Files Not Modified

- All other agent files
- All backend, frontend, and production scoring files
- All other memory files

---

## Blocked Items

None.
