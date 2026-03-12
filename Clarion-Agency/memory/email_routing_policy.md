# email_routing_policy.md
# Clarion — Inbound Email Routing Policy
# Defines how inbound emails are categorized and which division owns each type.
# All agents handling email signals must read this file before routing.

---

## Routing Categories

### SALES / INTEREST
Emails expressing interest in Clarion, asking about pricing, requesting a demo,
or asking general questions about what the product does.

**Route to:** Revenue Division (Head of Growth, Sales Development)
**Log to:** `memory/email_log.md` — type: SALES/INTEREST
**Auto-reply:** Permitted for general product questions and demo curiosity.
See `memory/email_response_policy.md`.

---

### CUSTOMER FEEDBACK
Emails from existing users sharing product feedback, feature requests,
suggestions, or general impressions.

**Route to:** Product Insight Division (Usage Analyst, VoC & Product Demand)
**Log to:** `memory/email_log.md` — type: CUSTOMER FEEDBACK
**Auto-reply:** Permitted for acknowledgement. Do not make product commitments.

---

### SUPPORT
Emails from existing users reporting problems, asking how something works,
or requesting help with onboarding or account setup.

**Route to:** Customer Division (Customer Health & Onboarding)
**Log to:** `memory/email_log.md` — type: SUPPORT
**Auto-reply:** Permitted for routine onboarding questions, feature explanation,
and documentation pointers. Escalate complaints or account-sensitive matters.

---

### PARTNERSHIPS
Emails proposing integrations, co-marketing, reseller arrangements,
or any formal business arrangement with another company.

**Route to:** Executive / Chief of Staff
**Log to:** `memory/email_log.md` — type: PARTNERSHIPS
**Auto-reply:** Not permitted. Escalate immediately. Do not engage the substance.

---

### PRESS / MEDIA
Emails from journalists, analysts, podcasters, or publication staff.

**Route to:** Executive / Chief of Staff
**Log to:** `memory/email_log.md` — type: PRESS/MEDIA
**Auto-reply:** Not permitted. Escalate immediately.

---

### INVESTOR / FUNDRAISING
Emails from investors, accelerators, or anyone asking about funding or equity.

**Route to:** Executive / Chief of Staff
**Log to:** `memory/email_log.md` — type: INVESTOR
**Auto-reply:** Not permitted. Escalate immediately.

---

### GENERAL / UNCLEAR
Emails that do not clearly fit another category — including vague inquiries,
unclear intent, or mixed signals.

**Route to:** Chief of Staff for classification
**Log to:** `memory/email_log.md` — type: GENERAL/UNCLEAR
**Auto-reply:** Hold. Do not reply until classified.

---

## Routing Decision Process

When an agent encounters an inbound email signal:

1. Read the email and identify the category above
2. If unclear between two categories, route to GENERAL/UNCLEAR
3. Log the signal to `memory/email_log.md`
4. Apply the auto-reply rule for that category
5. Escalate if the email falls into a restricted category (PARTNERSHIPS,
   PRESS/MEDIA, INVESTOR) or if any escalation trigger from
   `memory/email_response_policy.md` is met

Never route and reply simultaneously without confirming the category first.
