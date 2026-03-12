# internal_notification_policy.md
# Clarion — Internal Notification Routing Policy
# Defines how website-generated events are routed to the correct division.
# Applies to: demo requests, contact form submissions, waitlist signups,
# product feedback forms, and bug reports originating from the Clarion product.

---

## Event Routing Table

| Website Event | Primary Division | Secondary Division | Log to |
|---|---|---|---|
| Demo request | Revenue | — | `email_log.md` — type: SALES/INTEREST |
| Contact form submission | Chief of Staff | — | `email_log.md` — type: GENERAL/UNCLEAR (classify on receipt) |
| Waitlist signup | Revenue | Head of Growth | `email_log.md` — type: SALES/INTEREST |
| Product feedback (in-app or form) | Product Insight | — | `email_log.md` — type: CUSTOMER FEEDBACK |
| Bug report | Product Integrity | Customer Division (if account-impacting) | `email_log.md` — type: SUPPORT |

---

## Per-Event Handling

### Demo Requests
- Revenue Division (Head of Growth / Sales Development) receives and owns
- Log to `email_log.md`: type SALES/INTEREST, action: Auto-replied or Escalated
- Auto-reply permitted: confirm receipt, explain what the demo covers, link to demo route
- If the requestor provides company context suggesting a partnership angle,
  reroute to PARTNERSHIPS per `memory/email_routing_policy.md`

### Contact Form Submissions
- Chief of Staff receives, reads, and classifies before routing
- Do not reply until classified
- Log to `email_log.md`: type GENERAL/UNCLEAR until reclassified
- After classification, update the log entry with the final type and routing

### Waitlist Signups
- Revenue (Head of Growth) receives as primary owner
- Head of Growth may use these as an audience segment for approved outreach
  (requires OUTREACH APPROVAL PACKAGE per `memory/outreach_email_policy.md`)
- Log to `email_log.md`: type SALES/INTEREST

### Product Feedback
- Product Insight Division (Usage Analyst / VoC & Product Demand) receives
- Log to `email_log.md`: type CUSTOMER FEEDBACK
- Auto-acknowledgement reply permitted; no commitments, no timelines
- Feature request signals should be surfaced in the agent's weekly report

### Bug Reports
- Product Integrity Division receives as primary owner
- If the bug is actively impacting an account, also notify Customer Division
- Log to `email_log.md`: type SUPPORT
- Do not auto-reply with fix timelines or root cause explanations
- Auto-reply permitted: acknowledge receipt, confirm the report is being reviewed

---

## Escalation Triggers

Escalate any website-generated notification to Chief of Staff immediately if it:
- Mentions legal, regulatory, or data compliance language
- Suggests a serious account-level problem (data loss, security, billing error)
- Is from a journalist, investor, or potential partner
- Contains language that could become a public complaint

---

## Logging Standard

Every website-generated event that contains signal must be logged to
`memory/email_log.md` within the same run it is received. Use the event
type from the routing table above as the EMAIL TYPE field.
