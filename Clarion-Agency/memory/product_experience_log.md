# product_experience_log.md
# Clarion — Product Experience Log
# Version: 1.0 | 2026-03-12
# Append-only. Never overwrite. Never delete entries.
# Written by: Product Experience Agent only
# Read by: Product Experience Agent, Chief of Staff, CEO

---

## PURPOSE
Running log of all product and website experience findings.
Each entry is a single, atomic observation with a proposed change and a status.
Chief of Staff reads this file for HIGH-severity unresolved entries to surface in the CEO brief.
Product Experience Agent reads this before each run to avoid logging duplicates.

---

## STATUS VALUES
proposed          — Logged by agent, not yet reviewed by founder
founder_reviewed  — Founder has seen it, decision pending
approved_for_claude — Approved for implementation; Claude prompt to be drafted
rejected          — Founder reviewed and declined; do not re-log

---

## LOG FORMAT (one block per finding)

```
---
DATE:           [YYYY-MM-DD]
AREA:           [homepage | pricing | signup | onboarding | dashboard | pilot_collateral]
SURFACE:        [landing | pricing | signup | onboarding | dashboard | pilot collateral]
ISSUE_TYPE:     [clarity | conversion | trust | hierarchy | visual_age | friction | proof_gap | navigation]
SEVERITY:       [HIGH | MEDIUM | LOW]
OBSERVATION:    [What was found — specific and factual]
WHY_IT_MATTERS: [Commercial consequence — one sentence]
PROPOSED_CHANGE:[Specific proposed fix — one or two sentences, non-technical]
STATUS:         [proposed | founder_reviewed | approved_for_claude | rejected]
---
```

---

## ENTRIES

[No entries yet. First entry will be appended after the initial Product Experience audit run.]
