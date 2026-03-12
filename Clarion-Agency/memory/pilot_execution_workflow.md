# pilot_execution_workflow.md
# Clarion — Pilot Execution Workflow
# Version: 1.0 | 2026-03-12

---

## Purpose

Step-by-step process for executing a real pilot analysis for a prospect firm.
Agents follow this workflow once a firm has been offered a pilot and the offer
is logged in leads_pipeline.csv as pilot_offered or pilot_in_progress.

Integrity rule: do NOT fabricate reviews. Do NOT invent firm data. Use only
publicly available reviews from real sources.

---

## Workflow

---

### Step 1 — Confirm ICP Fit and Public Review Availability

Before starting:
- Confirm firm is in leads_pipeline.csv with status: pilot_offered or
  recently moved to pilot_in_progress
- Confirm ICP fit is Strong or Moderate (re-check memory/icp_definition.md)
- Confirm public reviews exist on at least one source:
    - Google Maps (search firm name)
    - Avvo (search firm name or attorney name)
    - Martindale-Hubbell
    - Yelp (consumer-facing practices only)
- If no public reviews exist: stop. Log status as lost with note
  "no public reviews available." Do not fabricate.

---

### Step 2 — Collect Reviews

Collect 20–50 reviews from public sources.

For each review capture:
- review_text: the full review text
- rating: numeric (1–5)
- owner_response: the firm's response if one exists (or leave blank)

Save to:
  data/pilots/<firm_slug>_reviews.csv

Naming:
- firm_slug = lowercase firm name with spaces replaced by underscores
  Example: "Hargrove Family Law" → hargrove_family_law_reviews.csv

Review CSV columns (must match exactly):
  review_text,rating,owner_response

If fewer than 20 reviews are available, note this in the pilot brief.
Do not pad with invented reviews.

---

### Step 3 — Normalize Format

Review CSV must be clean before analysis:
- No blank review_text rows
- rating column must be numeric (1, 2, 3, 4, 5)
- owner_response may be empty — that is valid
- Remove duplicate entries (exact duplicate review_text)
- No HTML, no special encoding issues

---

### Step 4 — Run Analysis

Option A — Manual analysis (current default for pre-launch pilots):
  Read each review. Identify recurring language patterns, complaint clusters,
  sentiment distribution, and any signals that rise to governance level.
  Synthesize findings manually following the brief format in Step 5.

Option B — Clarion workflow (when available):
  Use Clarion's review ingestion and classification workflow with the
  normalized CSV as input. Output populates the brief structure.

Log which option was used in the pilot brief.

---

### Step 5 — Write Pilot Brief

Save to:
  data/pilots/reports/<firm_slug>_pilot_brief.md

Do not publicly identify the firm by name in the brief unless explicit
consent exists. Use the firm_slug as the identifier.

Pilot brief format:

```
PILOT BRIEF
Firm:           [Anonymized as firm_slug or named if consent given]
Practice area:  [Family law | PI | Criminal defense | Immigration | Other]
Review source:  [Google | Avvo | Martindale | Other]
Sample size:    [N reviews]
Analysis date:  [YYYY-MM-DD]

---

DETECTED THEMES
[List 3–6 recurring themes found across the review sample.
 Each theme: name + frequency + one illustrative paraphrase (never quote verbatim).]

SENTIMENT PATTERN
[Overall distribution: positive / neutral / negative percentages or rough split.
 Note any rating skew — e.g., "most reviews are 5-star with a small cluster of 1-star."]

POTENTIAL GOVERNANCE SIGNALS
[List 1–4 signals that rise above a recurring theme to an actionable concern.
 Format: Signal name — what it suggests — who should review it.]

RECOMMENDED PARTNER ACTIONS
[2–4 specific, actionable recommendations tied to findings.
 Format: Action — what it addresses — expected outcome.]

BRIEF SUMMARY (for sales use)
[2–3 sentences suitable for use in follow-up outreach. Plain language.
 No internal jargon. No firm name unless consent given.]
```

---

### Step 6 — Update Pipeline

Update data/revenue/leads_pipeline.csv:
- Change status from pilot_in_progress → pilot_complete
- Add brief path in notes: data/pilots/reports/<firm_slug>_pilot_brief.md
- Update last_contact_date
- Set next_action: "Share brief with prospect — await response"

---

### Step 7 — Escalate

A completed pilot is an active sales opportunity. Immediately:
- Flag in FOUNDER ESCALATIONS in the sales report
- Chief of Staff surfaces in next CEO brief under EXCEPTIONS REQUIRING CEO ATTENTION
- CEO reviews brief and decides whether to share with prospect directly or through agent

Do not send the brief to the prospect without Level 2 approval (outreach) or
Level 3 approval (if pricing discussion follows immediately).
