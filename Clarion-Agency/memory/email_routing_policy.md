# email_routing_policy.md
# Clarion — Inbound Email Routing Policy
# Defines how inbound emails are categorized and which division owns each type.
# All agents handling email signals must read this file before routing.
# Business email is Zoho-based. Group addresses forward into admin@clarionhq.co.

---

## Inbound Classification Factors

When an agent evaluates an inbound email, apply these factors in order:

1. **Sender domain** — Is it a known law firm domain, a personal address, a media
   outlet, an investment firm, or an unknown domain? Domain often resolves category.
2. **Mailbox alias / group hit** — Which address received it?
   - `sales@` / `demo@` → SALES/INTEREST
   - `support@` / `help@` → SUPPORT
   - `feedback@` → CUSTOMER FEEDBACK
   - `partners@` / `partner@` → PARTNERSHIPS
   - `press@` / `media@` → PRESS/MEDIA
   - `security@` → SECURITY (see below)
   - `hello@` / `admin@` (catch-all) → GENERAL/UNCLEAR, route to Chief of Staff triage
3. **Keywords** — Scan subject and first paragraph for intent signals:
   pricing, demo, trial, integration, acquisition, journalist, investor,
   vulnerability, breach, complaint, data, legal, urgent.
4. **Intent detection** — What is the sender trying to accomplish?
   Inform, purchase, complain, propose, investigate, report a problem.
5. **Security sensitivity** — Any mention of vulnerability, breach, data exposure,
   unauthorized access, or security research → SECURITY, immediate escalation.
6. **Business importance** — High-value firm name, large firm size signal, or
   language suggesting urgency or time-sensitivity → flag for faster routing.

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

### SECURITY
Emails reporting a vulnerability, suspected breach, unauthorized access, data
exposure, or security research finding.

**Route to:** Product Integrity Division + Chief of Staff (simultaneous)
**Log to:** `memory/email_log.md` — type: SECURITY
**Auto-reply:** Not permitted. Escalate immediately. Acknowledge receipt only
after Chief of Staff approves the acknowledgement text.

---

### HELLO / CATCH-ALL (admin@clarionhq.co)
Emails arriving at `hello@`, `admin@`, or the catch-all forwarding address
that do not match another alias or obvious category.

**Route to:** Chief of Staff for triage and classification
**Log to:** `memory/email_log.md` — type: GENERAL/UNCLEAR (reclassify after triage)
**Auto-reply:** Hold. Do not reply until classified.

---

### GENERAL / UNCLEAR
Emails that do not clearly fit another category — including vague inquiries,
unclear intent, or mixed signals.

**Route to:** Chief of Staff for classification
**Log to:** `memory/email_log.md` — type: GENERAL/UNCLEAR
**Auto-reply:** Hold. Do not reply until classified.

---

## Fallback and Special Cases

### Fallback routing
If an email cannot be classified after applying all six classification factors,
route to GENERAL/UNCLEAR and flag in the Chief of Staff's weekly brief for
manual review. Do not leave an email unrouted.

### Ambiguous email handling
If an email could belong to two categories (e.g., a support question that also
contains a partnership proposal), classify by the higher-priority category:

| Priority | Category |
|---|---|
| 1 (highest) | SECURITY |
| 2 | PRESS / MEDIA |
| 3 | INVESTOR / FUNDRAISING |
| 4 | PARTNERSHIPS |
| 5 | CUSTOMER FEEDBACK |
| 6 | SUPPORT |
| 7 | SALES / INTEREST |
| 8 (lowest) | GENERAL / UNCLEAR |

Log under the higher-priority category. Note the secondary signal in NOTES.

### Duplicate thread handling
If a new email is a reply to an existing logged thread:
- Do not create a new log entry unless the new message contains a meaningfully
  different signal (new category, escalation trigger, or changed intent)
- Add a NOTES update to the existing entry instead
- Do not re-route a thread that is already owned and being handled

### Meaningful-signal-only logging rule
Not every email requires a log entry. Log only when the email contains:
- Commercial intent (interest, pricing, demo, purchase signal)
- A complaint of any severity
- A feature request (explicit or implied)
- A partnership, press, investor, or security signal
- A notable support issue (especially if recurring or account-impacting)
- Any email that generates a response or escalation

### What must not be logged
- Spam and unsolicited bulk mail
- Automated bounce notifications
- Unsubscribe confirmations
- Auto-replies and out-of-office messages
- Transactional receipts with no signal value
- Internal system notifications unless they indicate a failure requiring action

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
