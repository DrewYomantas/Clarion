# history_summaries.md
# Clarion Agency — Historical Log Summaries
# Append-only. Never overwrite existing entries. Each entry is dated.
# Purpose: condensed summaries of long-running logs so agents do not repeatedly
# ingest large historical files. Agents should reference this file for historical
# context instead of full logs unless exact detail is required.

---

## How to Use This File

**Reading:** Before ingesting any full log listed below, check for a summary entry here.
If one exists, use it as your primary historical reference.
Read the full log only if a specific decision or escalation requires exact detail.

**Writing (Chief of Staff only):** When a log crosses its summarization threshold,
append a new dated entry below in the format shown. Never edit or remove prior entries.

**Logs covered by this file:**
- `memory/office_health_log.md`
- `memory/decision_log.md`
- `memory/approved_actions.md`
- `memory/email_log.md`
- `memory/moderation_log.md`
- `memory/security_incident_log.md`

**Summarization thresholds (Chief of Staff triggers):**
| Log | Summarize when |
|---|---|
| office_health_log.md | 20+ entries since last summary |
| decision_log.md | 15+ entries since last summary |
| approved_actions.md | 20+ completed/closed entries since last summary |
| email_log.md | 30+ entries since last summary |
| moderation_log.md | 10+ entries since last summary |
| security_incident_log.md | Any resolved incidents not yet captured |

---

## Summary Entry Format

```
---
SUMMARY DATE:     [YYYY-MM-DD]
LOG FILE:         [memory/filename.md]
ENTRIES COVERED:  [YYYY-MM-DD] to [YYYY-MM-DD]  ([N] entries)
SUMMARIZED BY:    Chief of Staff

KEY DECISIONS
[Bullet list of decisions made or ratified during this period, with dates.]

KEY TRENDS
[Bullet list of patterns that persisted across multiple entries.]

RISKS IDENTIFIED
[Bullet list of risks flagged during this period, with resolution status.]

OUTCOMES
[Bullet list of material outcomes: completed projects, resolved incidents, closed actions.]

UNRESOLVED ITEMS
[Anything still open or carrying forward from this period.]

SIGNAL DENSITY
[1-2 sentences on whether this period was high/low activity and why.]
---
```

---

<!-- Chief of Staff appends dated summary entries below this line. -->
<!-- No entries yet — file initialized. First summary will be written when any log crosses its threshold. -->
