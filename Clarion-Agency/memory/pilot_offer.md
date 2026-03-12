# pilot_offer.md
# Clarion — Pilot Offer Definition
# Version: 1.0 | 2026-03-12

---

## What the Pilot Is

A free, no-commitment analysis of a law firm's publicly available client reviews.
The firm sees how Clarion converts raw feedback into operational signals and a
governance brief. It is concrete proof of value before any subscription discussion.

This is not a trial account. It is a done-for-you analysis using real data.

---

## Standard Pilot Parameters

Input:
- 20–50 public client reviews (Google, Avvo, Martindale, or similar)
- Source: publicly available — no internal firm data required
- Collected by Clarion, not by the prospect

Output:
- Detected feedback themes (what clients are actually saying)
- Sentiment pattern summary (positive, neutral, negative distribution)
- Potential governance signals (recurring risks, operational gaps)
- Recommended partner actions (2–4 specific actions leadership could take)
- Sample governance brief (one-page PDF or markdown document)

Timeline:
- Setup: under 30 minutes if reviews are publicly available
- Turnaround: same run cycle or within 48 hours

Storage:
- Reviews: data/pilots/<firm_slug>_reviews.csv
- Brief: data/pilots/reports/<firm_slug>_pilot_brief.md
- Pipeline status updated to: pilot_in_progress → pilot_complete

---

## When to Offer the Pilot

Offer the pilot when:
- Prospect has responded positively to initial outreach
- Reviews are publicly available (confirm before offering)
- ICP fit is Strong or Moderate
- Prospect has not yet been offered a pilot in the current pipeline cycle

Do NOT offer the pilot when:
- ICP fit is Weak
- No public reviews are available
- Prospect is already in customer status

---

## What to Say When Offering

Preferred framing:
  "To make this concrete — I can run a short analysis of [Firm Name]'s public
  client reviews and share what patterns come out. No commitment involved. It
  just gives us something real to discuss."

Alternate (after pilot is complete):
  "We reviewed a sample of [Firm Name]'s public client feedback and noticed a
  few patterns that may be worth discussing with your leadership."

Avoid:
- "free trial"
- "demo"
- "see the platform"

---

## Escalation Rule

When a pilot is completed, escalate IMMEDIATELY to FOUNDER ESCALATIONS in the
sales report and to the CEO brief. A completed pilot is a live sales opportunity
and must not sit in queue.
