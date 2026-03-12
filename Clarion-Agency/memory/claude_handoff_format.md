# claude_handoff_format.md
# Clarion — Claude Implementation Handoff Format
# Version: 1.0 | 2026-03-12
# Used by: Product Experience Agent, Product Insights Agent, Site Health Monitor
# Reviewed by: Founder → then passed to Claude for implementation

---

## PURPOSE
Standard format for turning an agent recommendation into a founder-reviewable brief
and a tight Claude implementation prompt. Every implementation proposal that leaves
the agent office must use this format. Vague aesthetic opinions or underbounded
requests are not valid handoffs.

---

## WHEN TO USE THIS FORMAT

Required for any recommendation that involves:
- Changing copy, layout, or UX flow on the website or in-app
- Changing a backend route, API behavior, or data model
- Fixing a product defect identified by Site Health or Data Quality
- Implementing a product insight finding that requires code or content change
- Any change that will be handed to Claude to implement

Not required for:
- Internal agent analysis with no implementation output
- Proposed actions that only require a decision (no code, no content change)

---

## HANDOFF TEMPLATE

Copy one block per recommendation. File in the relevant agent report under PROPOSED ACTIONS,
or log directly in memory/product_experience_log.md with STATUS: proposed.

```
---
HANDOFF: [Short identifying title — e.g., "Replace homepage CTA copy"]

TITLE:
  [One clear sentence naming the change]

PROBLEM:
  [What is wrong or missing right now — specific and observable, not a judgment]

WHY_IT_MATTERS:
  [Commercial or functional consequence — one sentence.
   Must answer: how does this affect conversion, trust, or reliability?]

EVIDENCE:
  [What signal or observation supports this recommendation.
   Source: [agent report date | log entry ID | founder observation | customer feedback]
   Recurrence: [first occurrence | seen N times | pattern across N cycles]]

RECOMMENDED_CHANGE:
  [Specific, bounded description of what should change.
   — What element, what surface, what behavior
   — What it should say/do after the change
   — What it currently says/does (if relevant)
   Not a code spec. Founder and Claude readable.]

SCOPE:
  [contained — one element, one file, low blast radius
   | moderate — affects multiple elements or one flow end-to-end
   | broad — affects multiple pages, flows, or data structures]

FILES_LIKELY_AFFECTED:
  [Best guess at which files will need to change.
   Frontend: [component or template name, or "unknown"]
   Backend:  [route, service, or model, or "not applicable"]
   Copy/content: [page or section, or "not applicable"]
   Memory/config: [memory file or config key, or "not applicable"]]

RISKS:
  [What could go wrong if implemented incorrectly.
   — Data integrity risk: [yes — describe | no]
   — Auth/security surface touched: [yes — describe | no]
   — Affects scoring engine or phrase dictionary: [yes — STOP, escalate per SO-004 | no]
   — Affects billing or Stripe integration: [yes — requires CEO approval | no]
   — Reversible if wrong: [yes | no — describe]]

FOUNDER_DECISION_NEEDED:
  [yes — [specific question the founder must answer before Claude can proceed]
   | no — [why this is clear enough to proceed without a decision]]

CLAUDE_PROMPT_READY:
  [yes — founder has reviewed, decision is resolved, ready to implement
   | no — awaiting founder review or decision]
---
```

---

## STATUS LIFECYCLE

When using this format inside memory/product_experience_log.md or a report:

1. Agent files the handoff block with CLAUDE_PROMPT_READY: no
2. Founder reviews — answers FOUNDER_DECISION_NEEDED if required
3. Founder sets STATUS: approved_for_claude in product_experience_log.md
4. CLAUDE_PROMPT_READY is updated to: yes
5. Claude is given the handoff block as the prompt brief
6. Implementation is completed and logged in execution_log.md

---

## WHAT MAKES A VALID HANDOFF

Valid:
- PROBLEM is observable, not opinionated ("the CTA reads 'Get started' with no specificity")
- RECOMMENDED_CHANGE names the exact element and the exact change
- RISKS are assessed honestly — if security or scoring is touched, it escalates
- SCOPE is accurate — do not mark broad changes as contained

Invalid (do not file):
- "The homepage feels generic" — not observable, no specific change
- "Improve the onboarding" — not bounded, not a handoff
- "The design looks dated" — not a change recommendation
- Any handoff where RISKS are all marked "no" without real assessment
- Any handoff touching auth, scoring, or billing without escalation flag

---

## EXAMPLE (filled)

```
---
HANDOFF: Replace primary homepage CTA

TITLE:
  Change homepage primary CTA from "Get started" to "Request a pilot analysis"

PROBLEM:
  The current CTA copy "Get started" is generic and gives the prospect no
  information about what they are clicking into.

WHY_IT_MATTERS:
  Specific CTA copy reduces hesitation for qualified prospects who are evaluating
  whether Clarion is worth a conversation. "Request a pilot analysis" names the
  exact next step and signals low commitment.

EVIDENCE:
  Source: product_experience_log.md entry 2026-03-12, confirmed by handoff_contracts.md
  ISSUE_TYPE: conversion
  Recurrence: first logged, but matches a known conversion friction pattern in
  conversion_friction.md (vague CTAs logged 2 prior times by Funnel Conversion agent)

RECOMMENDED_CHANGE:
  On the homepage hero section, change the primary button text from "Get started"
  to "Request a pilot analysis". The button destination (/signup or /contact)
  does not need to change unless the founder decides the destination should
  be a dedicated pilot request form instead.

SCOPE:
  contained — one element, one page, copy change only

FILES_LIKELY_AFFECTED:
  Frontend: homepage hero component (likely index.html or Hero.jsx or equivalent)
  Backend:  not applicable
  Copy/content: homepage hero section
  Memory/config: not applicable

RISKS:
  Data integrity risk: no
  Auth/security surface touched: no
  Affects scoring engine or phrase dictionary: no
  Affects billing or Stripe integration: no
  Reversible if wrong: yes — trivial to revert a copy change

FOUNDER_DECISION_NEEDED:
  yes — Should the CTA destination remain /signup, or should it point to a
  dedicated pilot request form or Calendly link instead?

CLAUDE_PROMPT_READY:
  no — awaiting founder decision on CTA destination
---
```
