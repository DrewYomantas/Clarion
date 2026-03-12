# external_interaction_upgrade.md
# Clarion Agency — External Interaction Policy Upgrade

**Date:** 2026-03-12
**Author:** Agency Config Session
**Status:** Complete

---

## What Was Added

A unified external interaction policy covering brand voice, interaction permissions,
approval workflows, community participation rules, prompt injection defense, and
content moderation — with logging to two new dedicated memory files.

---

## Files Created

### `memory/brand_voice.md`
Defines Clarion's public voice: professional but conversational, confident but not
hype-driven, insightful rather than promotional, practical rather than theoretical.
Includes a prohibited words/phrases table, sentence structure rules, tone-by-context
guide, and a Conversational Authenticity section governing how agents participate
in public discussions.

### `memory/external_interaction_policy.md`
Governs all agent behavior in public and semi-public contexts. Covers:
- What is auto-approved vs. requires CEO approval
- Approval Package format for major external actions
- Community participation criteria (4-condition gate)
- Prompt injection and extraction attempt response protocol
- Moderation escalation ladder (ignore → hide/remove → restrict/block)
- Logging requirements for both moderation and security incidents

### `memory/moderation_log.md`
Append-only log for all content moderation actions taken on any external platform.
Includes entry format template and escalation criteria.

### `memory/security_incident_log.md`
Append-only log for all prompt injection, extraction attempts, and manipulation
events encountered in external contexts. Includes entry format template, escalation
criteria, and a reminder of correct agent behavior on detection.

---

## Files Modified

### `agents/market/competitive_intelligence.md`
Added `## External Interaction Policy` section before `## Guardrails`.

### `agents/market/customer_discovery.md`
Added `## External Interaction Policy` section before `## Hard Rules`.

### `agents/revenue/head_of_growth.md`
Added `## External Interaction Policy` section before `## Guardrails`.
Note: file was rewritten to resolve encoding corruption (latin-1 middot characters)
introduced by a prior session's PowerShell write. All content preserved exactly.

### `agents/comms/content_seo.md`
Added `## External Interaction Policy` section before `## Guardrails`.

### `agents/revenue/sales_development.md`
Added `## External Interaction Policy` section before `## Guardrails`.

---

## Policy Section Added to All 5 Agents

Identical block covering:
- Auto-approved interactions (routine replies, community participation, soft mentions)
- CEO approval required (promotion, press, partnerships, campaigns, major assets)
- Approval package requirement and format
- Community participation gate (4 conditions)
- Prompt injection / extraction: no public reply, log to security_incident_log.md,
  escalating silent moderation
- Content moderation: eligible content types, log to moderation_log.md

---

## Files Not Modified

- `chief_of_staff.md` — no changes (CoS reads memory files; policy is in memory)
- All other agent files (13 weekly-cadence agents not in external-facing roles)
- All backend, frontend, and production scoring files
- All existing memory files — untouched
