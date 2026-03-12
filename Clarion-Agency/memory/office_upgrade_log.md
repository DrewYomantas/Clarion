# office_upgrade_log.md
# Clarion — Office Reliability + CEO Approval System Upgrade Log
# Date: 2026-03-11
# Version: 1.0

---

## Summary

This log records the changes made to implement the Office Reliability and CEO
Approval System improvements. All changes are confined to agent prompts, memory
files, and the template. No new agents were added. No architecture was changed.
No workflows or runners were modified.

---

## Files Modified

### Executive Agent
- `agents/executive/chief_of_staff.md` — Version bump 1.4 → 1.5

### Agent Template
- `agent_prompt_template.md` — Version unchanged; format and guardrails updated

### Revenue Agents (4 files)
- `agents/revenue/head_of_growth.md`
- `agents/revenue/funnel_conversion.md`
- `agents/revenue/sales_development.md`
- `agents/revenue/revenue_strategy.md`

### Market Agents (4 files)
- `agents/market/competitive_intelligence.md`
- `agents/market/customer_discovery.md`
- `agents/market/icp_analyst.md`
- `agents/market/market_trends.md`

### Customer Agents (3 files)
- `agents/customer/customer_health_onboarding.md`
- `agents/customer/retention_intelligence.md`
- `agents/customer/voc_product_demand.md`

### Product Insight Agents (2 files)
- `agents/product_insight/usage_analyst.md`
- `agents/product_insight/release_impact.md`

### Product Integrity Agents (3 files)
- `agents/product_integrity/scoring_quality.md`
- `agents/product_integrity/data_quality.md`
- `agents/product_integrity/dictionary_calibration.md`

### Operations Agents (2 files)
- `agents/operations/cost_resource.md`
- `agents/operations/process_analyst.md`

### People Agent (1 file)
- `agents/people/people_ops_intelligence.md`

### Comms Agent (1 file)
- `agents/comms/content_seo.md`

### New Memory Files (1 file created)
- `memory/approved_actions.md` — Created new (CEO approval gate register)

---

## Changes Implemented

### Change 1 — CEO Priorities Section in Chief of Staff Brief
**File:** `agents/executive/chief_of_staff.md`
**What changed:** Added `CEO PRIORITIES — NEXT 7 DAYS` as a mandatory section in
the CEO brief report format. Format requires: Priority (action-oriented, one sentence),
Owner (role, not person), and Reason (one sentence linking to the agent signal).
**Why:** The CEO brief previously surfaced signals and risks but did not translate
them into a leadership focus list. This section converts the highest-signal findings
into a concrete 7-day action set for the CEO.

---

### Change 2 — Risk Ranking Replaced RISKS — WATCH
**File:** `agents/executive/chief_of_staff.md`
**What changed:** Replaced the flat `RISKS — WATCH` section with `TOP COMPANY RISKS`,
which applies a mandatory priority sequence:
1. Product integrity risk
2. Customer churn risk
3. Revenue risk
4. Operational risk
5. Strategic positioning risk

Items within a category rank ESCALATE before WATCH. Ordering is enforced regardless
of which agent filed the item.
**Why:** Unranked risk lists force the CEO to re-prioritize mentally each week. A
consistent ordering means the most critical risk category is always visible first,
reducing cognitive load and ensuring product integrity risks are never buried below
revenue risks.

---

### Change 3 — PROPOSED ACTIONS Block Added to All 18 Agents
**Files:** All agent .md files listed above, plus `agent_prompt_template.md`
**What changed:** Added a standardized `PROPOSED ACTIONS` block to every agent's
report format. The block is optional (omit entirely if nothing to propose) and
requires five fields per action:
- Action (one sentence, what should be done)
- Owner (role responsible for execution)
- Expected Impact (one sentence)
- Execution Complexity (Low / Medium / High)
- Requires CEO Approval (Yes / No)

Added matching synthesis rule in `chief_of_staff.md` to collect and pass through
all PROPOSED ACTIONS blocks into the CEO brief under a `PROPOSED ACTIONS` section.
**Why:** RECOMMENDATIONS existed in all agents but had no structured format and
were not consistently surfaced in the CEO brief. The new block makes proposed actions
machine-readable, attributable, and directly connected to the approval gate.

---

### Change 4 — CEO Approval Gate
**File created:** `memory/approved_actions.md`
**What it does:** Defines a structured register of CEO-approved actions. Each entry
requires: Action ID, Action description, Approved By (CEO), Date, Owner, Status,
and optional Notes.
**How it works:** Agents check this file at run time. An agent may only execute a
real-world action if that specific action appears in this file with Status: Approved.
Agents that do not find their proposed action in this file must propose only — they
may not execute.
**Why:** Without an approval gate file, the system had no persistent record of what
the CEO had authorized. Approvals existed only in conversation or email. This file
closes that loop and gives agents a deterministic check point.

---

### Change 5 — Execution Guardrail Added to All 18 Agents
**Files:** All agent .md files listed above, plus `agent_prompt_template.md`
**What changed:** Added a new bullet to every agent's Guardrails section:
"Execute any real-world action (outreach, publishing, account creation, website edits,
marketing campaigns) unless that specific action appears in `memory/approved_actions.md`"

Added enforcement rule in `chief_of_staff.md` under synthesis rules: if any agent
report describes executing an unapproved real-world action, flag it under STANDING
ORDER CONFLICTS.

**Examples of actions requiring approval (non-exhaustive):**
- Creating social media accounts
- Publishing posts or content
- Sending outreach messages
- Modifying the website
- Launching marketing campaigns

**Why:** Previously, agents could theoretically recommend and imply execution of
real-world actions in the same report cycle, with no human checkpoint between
proposal and execution. The guardrail separates proposal from execution permanently.
Before approval, agents only propose.

---

## Reasoning

All five changes work as a system. Agents generate structured PROPOSED ACTIONS.
The Chief of Staff surfaces them in the CEO brief alongside ranked risks and
7-day priorities. The CEO reviews and approves actions into `memory/approved_actions.md`.
Agents check that file before executing anything. The loop is closed.

No architectural changes were made. The system remains deterministic, file-based,
and fully auditable by a human reading any report or memory file.

---

## What Was Not Changed

- No new agents were added
- No runners or workflow scripts were modified
- No config.json entries were changed
- No data files were modified
- No memory files other than the new `approved_actions.md` were modified
- The core report format structure of all agents was preserved
- The Chief of Staff synthesis process was extended, not redesigned
