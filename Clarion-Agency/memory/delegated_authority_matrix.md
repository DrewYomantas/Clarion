# delegated_authority_matrix.md
# Clarion Agent Office — Delegated Authority Matrix
# Version: 1.0 | 2026-03-12

---

## Authority Levels

LEVEL 1 — Agent Autonomous
  Agent executes without approval.
  Must comply with product_truth, brand_voice, positioning_guardrails, do_not_chase.
  No register entry required. Agent logs in their report under WORK COMPLETED THIS RUN.

LEVEL 2 — Division Lead Approval
  Requires an approved entry in memory/division_lead_approvals.md.
  Division lead approves (human, not an agent).
  Does NOT require CEO approval or approved_actions.md entry.
  Runner reads division_lead_approvals.md for Level 2 execution.

LEVEL 3 — Executive / CEO Approval
  Requires an approved entry in memory/approved_actions.md with STATUS: approved.
  CEO approves. Chief of Staff may escalate but not approve.
  Reserved for strategic, high-risk, or irreversible actions.

---

## Comms & Content Division

LEVEL 1 (autonomous):
  - Draft posts (any platform)
  - Draft replies and comment responses
  - Draft outreach messages (internal — not sent)
  - Maintain content calendar
  - Create profile copy drafts
  - Log discovered conversations in memory/conversation_opportunities.md
  - Update market_insights.md with observed patterns
  - Produce article outlines and topic briefs

LEVEL 2 (division lead approval):
  - Publish educational posts on approved channels (LinkedIn, Twitter/X)
  - Create social accounts on platforms listed in channel_strategy.md
    (must also pass account_creation_checklist.md and platform_registry.md check)
  - Reply to comments and questions on Clarion content
  - Join relevant public discussions (Reddit, LinkedIn, forums)
  - Send normal outreach DMs introducing Clarion (non-sales)
  - Publish non-promotional community participation replies

LEVEL 3 (CEO approval):
  - Launch announcements or major product news
  - Partnership announcements
  - Press or media messaging or responses
  - Controversial or high-risk public messaging
  - Major positioning changes or rebranding
  - Paid advertising or sponsored content
  - Crisis communications

---

## Sales / Revenue Division

LEVEL 1 (autonomous):
  - Research leads and document in pipeline
  - Prepare outreach drafts (internal, not sent)
  - Update pipeline tracker
  - Draft follow-up sequences (internal)
  - Prepare demo or pilot analysis assets

LEVEL 2 (division lead approval):
  - Send cold outreach emails or DMs to identified prospects
  - Send follow-up messages to warm leads
  - Offer walkthroughs, demos, or pilot analyses
  - Schedule discovery or sales calls
  - Send normal sales emails (non-custom pricing)

LEVEL 3 (CEO approval):
  - Pricing changes or custom pricing offers
  - Custom deal structures or unusual concessions
  - Enterprise-level commitments or pilots
  - Public claims outside verified product_truth.md
  - Partnership or channel deal negotiations
  - Revenue-sharing or co-marketing arrangements

---

## Market Intelligence Division

LEVEL 1 (autonomous):
  - Research public sources for competitor activity
  - Document discovery signals
  - Maintain competitive tracker and matrix
  - Update market_insights.md
  - Draft outreach angles (internal, not sent)

LEVEL 2 (division lead approval):
  - None currently. All external market actions route through Comms or Sales.

LEVEL 3 (CEO approval):
  - Publishing competitive analysis externally
  - Contacting competitors or their customers directly

---

## Product Insight Division

LEVEL 1 (autonomous):
  - Analyze usage and session data
  - Update usage tracker and adoption baseline
  - Document friction signals
  - Advance product readiness assessment
  - Draft product clarity recommendations (internal)

LEVEL 2 (division lead approval):
  - None currently. Product Insight is internal-only.

LEVEL 3 (CEO approval):
  - External product claims or roadmap disclosures
  - Feature commitments to prospects or customers

---

## Executive / Chief of Staff

LEVEL 1 (autonomous):
  - Synthesize department reports
  - Append to office_health_log.md
  - Produce CEO brief

LEVEL 2 (division lead approval):
  - N/A. CoS does not execute external actions.

LEVEL 3 (CEO approval):
  - All decisions surfaced in the CEO brief
  - Standing order changes
  - Approving or amending decision_log.md entries

---

## Account Creation Rule (applies across all divisions)

Account creation is a LEVEL 2 action when ALL of the following are true:
  1. Platform is listed in memory/channel_strategy.md (Primary or Secondary)
  2. No entry for this platform exists in memory/platform_registry.md
  3. All 6 checks in memory/account_creation_checklist.md pass
  4. A division lead approval entry exists in memory/division_lead_approvals.md

After creation: log in memory/platform_registry.md immediately and note in WORK COMPLETED THIS RUN.

Account creation is a LEVEL 3 (CEO) action when:
  - Platform is NOT in channel_strategy.md, or
  - The account would be the first public-facing Clarion account on any platform

---

## What Still Requires CEO Approval (Level 3 Hard List)

- Any launch announcement
- Any press or media statement
- Any partnership or co-marketing deal
- Any pricing change (any amount, any format)
- Any legal or terms-of-service change
- Any security-related policy change
- Any enterprise sales commitment
- Any public claim outside product_truth.md
- Any action that cannot be undone or corrected within 24 hours
- Any action a reasonable person would consider a company-level decision
