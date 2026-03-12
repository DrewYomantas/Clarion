# product_truth.md
# Clarion — Canonical Product Facts
# Version: 2.0 | All agents must treat this file as ground truth.
# Updated: 2026-03-12 — corrected classification engine description

---

## What Clarion Is

Clarion is a SaaS platform for small to mid-size law firms that turns fragmented client feedback into structured operational intelligence that managing partners can act on.

Core workflow:
  feedback / reviews / surveys / inbox messages
  → theme classification (LLM-powered)
  → signal detection
  → partner action recommendations
  → meeting-ready governance brief

Core outputs:
  - issue themes
  - sentiment patterns
  - governance signals
  - partner action plans
  - governance briefs (PDF, branded)

---

## What Clarion Is NOT

- Not a generic reputation management tool
- Not a review-response tool
- Not a social media tool
- Not a marketing automation platform
- Not a generic analytics dashboard
- Not a legal practice management system
- Not a CRM

---

## How Classification Works

Reviews are classified using the Anthropic API (claude-sonnet-4-5) via services/llm_client.py.
Classification is deterministic at temperature 0.0.
Results are cached by SHA-256 hash to avoid re-classifying identical reviews.
ANTHROPIC_API_KEY is required in production.

Do NOT claim classification is keyword-based. It is not.
Do NOT claim "AI is not involved in production scoring." It is.

---

## Plan Tiers (verified from plan_limits.py)

| Plan | Price | Reviews/upload | Reports/month | Seats |
|------|-------|---------------|---------------|-------|
| Free | $0 | 50 | 1 | 1 |
| Team | $179/mo or $1,790/yr | 250 | 10 | Unlimited |
| Firm | $449/mo or $4,490/yr | 1,000 | Unlimited | Unlimited |

---

## Allowed Product Claims

Agents may only claim capabilities that exist in the current product:
- Ingests client feedback CSVs
- Classifies reviews into governance themes via LLM
- Detects governance signals and generates action items
- Produces branded governance-brief PDFs
- Delivers briefs via email (Resend)
- Multi-user team support on Team and Firm plans
- Scheduled weekly brief delivery

---

## Product Principles

- Deterministic outputs (temperature 0.0 classification)
- Bounded scope — governance intelligence, not general analytics
- Explainable — themes and signals are traceable
- Selective AI — used for classification and brief generation only
- Built for leadership decision-making, not operational dashboards

---

## Hard Constraints — Agents Must Never

- Modify production code or scoring logic
- Access production databases
- Send external communications automatically
- Give legal advice of any kind
- Claim features that do not exist in the current product
