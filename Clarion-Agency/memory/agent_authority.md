# agent_authority.md
# Clarion — Delegated Agent Authority
# Version: 1.0
#
# PURPOSE
# Defines what each division may execute automatically within a normal run,
# and what must be escalated to the CEO or Chief of Staff.
#
# RULE: If an action is listed under Authorized Actions, the agent executes it
# without additional approval. If it matches an Escalate If condition, the agent
# stops execution on that item and flags it in the report.
#
# This file works alongside memory/approved_actions.md.
# approved_actions.md governs specific one-time external approvals.
# agent_authority.md governs ongoing operational permission for internal work.
#
# Agents may read this file. Agents may never modify it.
# CEO amends this file when authority boundaries need updating.

---

## DIVISION: REVENUE / GROWTH
### (Head of Growth · Sales Development · Funnel Conversion)

Authorized Actions:
- Analyze pipeline, MRR/ARR, lead volume, and conversion data
- Draft internal pipeline status reports and trackers
- Draft outreach angles and messaging frameworks (not live messages)
- Build and update lead qualification criteria
- Prepare funnel improvement proposals for human review
- Research and document ICP signals from internal data
- Maintain sales development notes and opportunity logs
- Identify and document top-of-funnel gaps
- Advance pre-launch early adopter targeting research (internal only)
- Draft hypotheses and experiment proposals for CEO review

Escalate If:
- Recommending a pricing change or discount
- Proposing a new sales channel or partnership
- Committing budget to outbound tooling or paid acquisition
- Recommending an ICP expansion beyond current vertical (SO-003)
- Revenue contraction is confirmed and requires strategic response

---

## DIVISION: MARKET INTELLIGENCE
### (Customer Discovery · Competitive Intelligence)

Authorized Actions:
- Search public sources for customer pain signals and prospect leads
- Research competitors' public product moves, pricing, and messaging
- Document and categorize discovery signals with source URLs
- Maintain internal lead signal logs and competitive trackers
- Draft outreach angles for Sales (internal use only — not live messages)
- Surface whitespace and competitive positioning gaps
- Advance pre-launch community mapping and ICP research

Escalate If:
- A competitor move could directly affect an active pipeline deal
- A competitor publishes claims Clarion cannot currently counter
- A reputational risk signal is detected in public discourse
- Recommending outreach to a named individual (SO-001)

---

## DIVISION: CUSTOMER
### (Customer Health & Onboarding · Voice of Customer & Product Demand)

Authorized Actions:
- Monitor and report on account health, onboarding milestones, and engagement
- Maintain internal customer health tracker and at-risk account log
- Draft internal intervention plans for at-risk accounts
- Analyze and document customer feedback themes and product demand signals
- Prepare anonymized case study frameworks from positive signals
- Advance onboarding readiness documentation and flow improvements
- Identify and flag accounts requiring human follow-up

Escalate If:
- A high-value account (top 20% ARR) moves to red-flag status
- Feedback contains a legal, compliance, or reputational signal (SO-005)
- A customer requests modification of the scoring or dictionary system (SO-004)
- Churn risk is systemic and requires a strategic response

---

## DIVISION: PRODUCT INSIGHT
### (Product Usage Analyst)

Authorized Actions:
- Analyze and report on feature adoption, session depth, and engagement trends
- Maintain internal product usage tracker
- Document friction signals and adoption gaps
- Draft product improvement proposals for human review
- Identify usage patterns that precede expansion or churn
- Advance pre-launch product readiness assessment

Escalate If:
- Usage data indicates a systemic product defect or broken feature
- A feature shows zero usage across all accounts for a full cycle
- Usage data is missing or corrupted and scoring/customer impact is possible

---

## DIVISION: PRODUCT INTEGRITY
### (Scoring Quality · Data Quality)

Authorized Actions:
- Audit scoring output distributions against baselines
- Verify batch completeness, determinism, and ingestion quality
- Maintain internal quality log of anomalies and edge cases
- Document and escalate pipeline failures with full context
- Draft remediation proposals for human engineering review

Escalate If:
- Any determinism violation is detected — immediate ESCALATE (SO-004)
- Any batch produced zero theme assignments — immediate ESCALATE
- Ingestion error rate exceeds 15% of total submissions
- Any scoring data is unavailable or corrupted

---

## DIVISION: OPERATIONS
### (Internal Process Analyst · Cost & Resource Analyst)

Authorized Actions:
- Monitor and report on SLA compliance, process efficiency, and cost trends
- Maintain internal operational health tracker
- Identify and document process gaps and workflow bottlenecks
- Prepare internal process improvement proposals for human review
- Track and report agent token costs vs budget
- Flag efficiency opportunities for human decision

Escalate If:
- A customer-facing process failure is traceable to an internal breakdown
- SLA compliance drops below 70%
- Total weekly AI cost exceeds the monthly budget threshold in config.json
- A vendor, tool, or infrastructure commitment is required

---

## DIVISION: COMMS & CONTENT
### (Content & SEO Agent)

Authorized Actions:
- Research content topics and keyword opportunities
- Draft social posts, article outlines, and email drafts (for human review)
- Maintain internal content calendar and topic backlog
- Prepare pre-launch brand and positioning assets (internal only)
- Document competitive content gaps and audience insights
- Build and refine messaging frameworks (internal use only)
- Advance launch content pipeline: topics, outlines, draft copy

Escalate If:
- Content materially changes Clarion's brand positioning (SO-002, SO-003)
- Public controversy or reputational risk exists (SO-001)
- Legal or regulatory exposure exists (SO-005)
- Publishing or distribution to a live channel is being recommended
  (no content goes live without CEO approval and an approved action)

---

## DIVISION: PEOPLE & CULTURE
### (People Ops Intelligence — monthly cadence)

Authorized Actions:
- Monitor and report on team health, capacity, and hiring signals
- Maintain internal people ops tracker
- Draft role descriptions and hiring criteria for review
- Document internal capacity gaps and workload patterns
- Prepare onboarding readiness documentation

Escalate If:
- A hiring decision, offer, or compensation commitment is required
- A performance issue requires HR intervention
- Legal or compliance exposure related to employment is detected

---

## DIVISION: EXECUTIVE / CHIEF OF STAFF

Authorized Actions:
- Synthesize all department agent reports into the CEO brief
- Detect cross-department conflicts and surface them without resolving
- Track open escalations and carry them forward until closed
- Evaluate and report on office health each run
- Append to memory/office_health_log.md each cycle
- Surface proposed actions, decisions, learning proposals verbatim
- Maintain ACTIVE PROJECTS status summary from memory/projects.md

Escalate If:
- Operational risk level assessed as High (must appear in CEO brief prominently)
- 3+ agents have failed or filed ESCALATE in the same cycle
- A standing order conflict is detected (surface only — do not resolve)
- A cross-department conflict represents a strategic risk
