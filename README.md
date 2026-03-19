# Clarion — Governance SaaS for Small Law Firms

**Clarion turns client feedback into structured governance signals — automatically.**

Built by [Andrew Yomantas](https://www.linkedin.com/in/andrew-yomantas-94a7383b0) | AI Product & Operations Builder

---

## What It Does

Small law firms have a follow-through problem. Client feedback loops back as noise — unstructured, untracked, and unacted on. Clarion fixes that.

The platform:
- Ingests client feedback and classifies it into **10 governance themes** using a fully deterministic scoring engine (zero LLM dependency in production scoring)
- Applies **negation guards, contrast detection, and severity escalation** to get clean, accurate signals
- Generates **structured action plans and branded PDF governance briefs** — meeting-ready outputs for non-technical legal staff
- Runs a **25-agent internal AI operations office** across 10 functional divisions, each with per-division authority matrices and structured approval gates
- Maintains an **append-only audit log** — every approved action is traceable

---

## What This Proves

- **Deterministic classification engine** — not prompt-dependent. Rules-based scoring with edge case handling built in
- **Production-grade architecture** — workspace-scoped data isolation, CEO approval gate, experiment engine, Stripe billing, Sentry error tracking
- **Multi-agent AI system design** — 25 agents across 10 divisions with bounded execution and structured approval flow
- **Domain expertise** — built for the specific accountability structures and output expectations of small law firms, not generic CRM

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite |
| Backend | Python + Flask |
| Database | PostgreSQL / SQLite |
| AI Agents | Claude (Anthropic) via structured pipelines |
| Billing | Stripe |
| Error Tracking | Sentry |
| PDF Generation | ReportLab |
| Deployment | Render |

---

## Architecture Highlights

**Governance scoring engine** — 10 classification themes, each with phrase libraries, negation/contrast guards, and severity weights. Fully deterministic, no LLM calls in the scoring path.

**25-agent operations office** — Agents organized into 10 functional divisions (outbound sales, evidence/insight, product experience, content SEO, and more). Central orchestrator routes tasks. Per-division authority matrices define what each agent can and cannot do autonomously.

**CEO approval gate** — No agent takes a consequential action without structured approval. Enforced at the database layer via an immutable `ceo_decisions` table, not just in prompts.

**Experiment engine** — Feature flags and A/B variants are config-driven, not code-branching. Product decisions are testable without deploys.

---

## Status

Pre-launch. Architecture complete. Scoring engine validated against real review data. Agent office dry-run complete.

---

## Contact

[LinkedIn](https://www.linkedin.com/in/andrew-yomantas-94a7383b0) | drewyomantas@gmail.com
