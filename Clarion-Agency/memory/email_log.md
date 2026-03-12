# email_log.md
# Clarion — Inbound Email Signal Log
# Append-only. Never overwrite or delete entries.
# Log every meaningful inbound email signal — not every email, only those
# carrying signal worth tracking: interest, requests, complaints, themes.
# See memory/email_routing_policy.md for category definitions.

---

## Log Format

Each entry uses this template:

```
---
DATE:              [YYYY-MM-DD]
EMAIL TYPE:        [SALES/INTEREST | CUSTOMER FEEDBACK | SUPPORT | PARTNERSHIPS | PRESS/MEDIA | INVESTOR | GENERAL/UNCLEAR]
SUMMARY:           [One sentence — what the email was about, no identifying info]
DIVISION ROUTED TO:[Revenue | Product Insight | Customer | Executive/CoS | Chief of Staff]
ACTION TAKEN:      [Auto-replied | Escalated | Logged only | Pending classification]
NOTES:             [Optional — notable detail, recurring theme, or follow-up needed]
---
```

---

## What to Log

Log an entry when an inbound email contains any of the following signals:

- Product interest or intent to purchase
- Feature request (specific or implied)
- Demo inquiry
- Complaint (any severity)
- Partnership or integration proposal
- Press or investor inquiry
- Notable support theme (especially if recurring)
- Anything that generates a response or escalation

Do not log: spam, automated bounce notices, unsubscribes, or emails with
no signal value.

---

## Entries

---
DATE:               2026-03-05
EMAIL TYPE:         SALES/INTEREST
SUMMARY:            Solo practitioner asked about pricing and whether Clarion works for firms under 10 attorneys.
DIVISION ROUTED TO: Revenue
ACTION TAKEN:       Auto-replied with product overview and link to demo route
NOTES:              Potential ICP edge case — small firm size; flagged for Head of Growth review.
---

---
DATE:               2026-03-07
EMAIL TYPE:         PRESS/MEDIA
SUMMARY:            Legal tech newsletter editor requested a comment on AI adoption trends in law firm operations.
DIVISION ROUTED TO: Executive/CoS
ACTION TAKEN:       Escalated immediately; no reply sent
NOTES:              CEO approval required before any response. Outlet name logged internally.
---

---
DATE:               2026-03-09
EMAIL TYPE:         SUPPORT
SUMMARY:            Existing user could not locate the theme breakdown section in their latest governance brief.
DIVISION ROUTED TO: Customer
ACTION TAKEN:       Auto-replied with navigation instructions and documentation link
NOTES:              Second support contact this week about report navigation — possible UX signal; flagged for Product Insight.
---
