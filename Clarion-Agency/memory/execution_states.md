# execution_states.md
# Clarion — Agent Work Lifecycle
# Defines valid states for any piece of agent work.

---

## States

idea
  Agent identified a potential action. Not yet structured.
  No action taken. May appear in content ideas or findings.

proposal
  Agent has written a formal PROPOSED ACTION block in their report.
  Awaiting Chief of Staff review or CEO approval.

division-approved
  Chief of Staff has reviewed and cleared for execution.
  Agent may execute if action fits guardrails and is not on the restricted list.

ready-for-execution
  CEO has approved. Entry exists in memory/approved_actions.md with STATUS: approved.
  Runner will pick this up on next run.

executed
  Runner completed the action. Output file exists in reports/execution/.
  STATUS updated to completed in approved_actions.md.
  Entry written to memory/execution_log.md.

reported
  CEO has reviewed the output. Decision logged in memory/decision_log.md.
  Action archived or next step assigned.

---

## Autonomous Execution Is Permitted When

- State is division-approved or ready-for-execution
- Action fits guardrails in memory/agent_security_policy.md
- Action is NOT on the restricted list below
- A matching entry exists in memory/approved_actions.md

---

## Actions Requiring CEO Escalation (Never Autonomous)

- Pricing changes of any kind
- Legal terms or policy changes
- Partnership announcements
- Press or media outreach
- Financial commitments
- Direct product code deployment
- Creating external accounts on any platform
- Sending any outbound communication to external parties
- Publishing any content to a live channel
