# DATA_INTAKE_GUIDE.md
# Clarion Agent Office — Data Intake Reference
# Version: 1.0

This guide defines every data file that feeds the agent system, who owns it,
how often it should be updated, what it contains, and what happens when it is missing.

---

## General Rules

- **No PII.** All files must be free of personally identifiable information.
  Account IDs are internal identifiers only. User IDs must be hashed.
- **Replace vs. Append.** Weekly snapshot files (pipeline_snapshot, mrr_arr, etc.)
  are replaced in full each run. Log files (closed_won, churn_log, etc.)
  are appended — never truncate historical rows.
- **Preserve headers.** Never change column names. Adding columns requires
  updating this guide and the relevant agent runner.
- **Encoding.** UTF-8, no BOM.
- **Date format.** ISO 8601 — YYYY-MM-DD everywhere.

---

## Revenue Division

| File | Cadence | Owner | Description |
|---|---|---|---|
| `revenue/pipeline_snapshot.csv` | Weekly (replace) | Founder | All active deals with stage, value, and probability |
| `revenue/closed_won.csv` | Weekly (append) | Founder | Deals closed and activated this week |
| `revenue/closed_lost.csv` | Weekly (append) | Founder | Deals lost this week with reason |
| `revenue/churn_log.csv` | Weekly (append) | Founder | Accounts churned with reason and ARR lost |
| `revenue/expansion_contraction.csv` | Weekly (append) | Founder | Plan upgrades and downgrades |
| `revenue/mrr_arr.csv` | Weekly (replace) | Founder | Current MRR, ARR, and net new MRR |
| `revenue/mrr_by_tier.csv` | Weekly (replace) | Founder | MRR broken down by Free, Team, Firm |
| `revenue/plan_distribution.csv` | Weekly (replace) | Founder | Account count per plan tier |
| `revenue/activations.csv` | Weekly (append) | Founder | New accounts activated this week |
| `revenue/funnel_stages.csv` | Weekly (replace) | Founder | Deal counts at each pipeline stage |
| `revenue/conversion_rates.csv` | Weekly (replace) | Founder | Stage-to-stage conversion rates (4-week rolling) |
| `revenue/demo_trial_log.csv` | Weekly (append) | Founder | Demo and trial events with outcomes |
| `revenue/new_leads.csv` | Weekly (append) | Founder | New leads entered the funnel this week |
| `revenue/lead_sources.csv` | Weekly (replace) | Founder | Lead volume by source channel |
| `revenue/outbound_log.csv` | Weekly (append) | Founder | Outbound outreach activity log |
| `revenue/lead_conversion.csv` | Weekly (replace) | Founder | Lead-to-trial and trial-to-paid rates by source |
| `revenue/call_notes.csv` | Weekly (append) | Founder | Structured call notes — objections, buyer role, outcome |

---

## Customer Division

| File | Cadence | Owner | Description |
|---|---|---|---|
| `customer/account_roster.csv` | Weekly (replace) | Founder | All active accounts with tier, size, and ARR |
| `customer/account_activity.csv` | Weekly (replace) | App | Login and feature session data per account |
| `customer/onboarding_milestones.csv` | Weekly (replace) | App | Milestone completion status for new accounts |
| `customer/ttfv.csv` | Weekly (append) | App | Time-to-first-value events |
| `customer/support_tickets.csv` | Weekly (append) | Founder | Support tickets opened and resolved |
| `customer/survey_responses.csv` | As received (append) | Founder | NPS, CSAT, or ad hoc survey responses |
| `customer/onboarding_feedback.csv` | As received (append) | Founder | Feedback collected during onboarding calls |
| `customer/feature_requests.csv` | As received (append) | Founder | Feature requests collected from any channel |
| `customer/exit_surveys.csv` | As received (append) | Founder | Exit survey responses from churned accounts |

---

## Market Division

| File | Cadence | Owner | Description |
|---|---|---|---|
| `market/competitors.md` | As needed | Founder | Tracked competitor names, URLs, positioning |
| `market/competitor_pricing.md` | Monthly | Founder | Competitor plan names, price points, feature tiers |
| `market/research_reports/` | As needed | Founder | Free-form market research, reports, or notes |

---

## Product Integrity Division

| File | Cadence | Owner | Description |
|---|---|---|---|
| `integrity/submission_log.csv` | Weekly (append) | App | All review submissions with ingestion status |
| `integrity/ingestion_errors.csv` | Weekly (append) | App | Ingestion errors with type and resolution |
| `integrity/validation_report.csv` | Weekly (append) | App | Per-submission validation pass/fail counts |
| `integrity/submission_volume.csv` | Weekly (replace) | App | Weekly volume per account vs. 8-week average |
| `integrity/review_samples.csv` | Weekly (append) | App | Anonymized review samples for quality spot-checks |
| `integrity/phrase_dictionary_export.csv` | Monthly | App/Founder | Export of the active phrase dictionary |
| `integrity/scoring_output.csv` | Weekly (append) | App | Scoring batch results with theme assignments |
| `integrity/score_outliers.csv` | Weekly (append) | App | Scores that deviated significantly from baseline |
| `integrity/score_baseline.csv` | Weekly (replace) | App | Rolling 4-week score baseline per theme |
| `integrity/edge_cases.csv` | Weekly (append) | App/Founder | Flagged edge cases and resolution status |
| `integrity/batch_metadata.csv` | Weekly (append) | App | Batch processing metadata — timing, counts, status |

---

## Product Insight Division

| File | Cadence | Owner | Description |
|---|---|---|---|
| `product/feature_usage.csv` | Weekly (replace) | App | Feature usage counts per account per week |
| `product/session_log.csv` | Weekly (append) | App | Individual session records with duration and activity |
| `product/adoption_baseline.csv` | Weekly (replace) | App | Feature adoption rates vs. 4-week average |

---

## Operations Division

| File | Cadence | Owner | Description |
|---|---|---|---|
| `operations/support_tickets.csv` | Weekly (append) | Founder | Support tickets with SLA tracking |
| `operations/task_log.csv` | Weekly (append) | Founder | Internal task log with status and delay tracking |
| `operations/infra_costs.csv` | Weekly (append) | Founder | Infrastructure cost line items by provider |
| `operations/openrouter_usage.csv` | Weekly (append) | App | Token usage and cost per agent per week |
| `operations/sla_targets.md` | As needed | Founder | SLA target definitions — do not change without review |

---

## People Division

| File | Cadence | Owner | Description |
|---|---|---|---|
| `people/headcount.csv` | Monthly | Founder | Current headcount by role and function |
| `people/open_roles.csv` | Monthly | Founder | Open roles with days open and hiring priority |
| `people/pulse_survey.csv` | Monthly | Founder | Engagement and morale pulse survey results |

---

## Comms Division

| File | Cadence | Owner | Description |
|---|---|---|---|
| `comms/seo_keywords.csv` | Monthly | Founder | Target keywords with volume, difficulty, and current rank |
| `comms/content_log.csv` | Weekly (append) | Founder | Published content with performance metrics |

---

## Dropping Data — Quick Reference

1. Replace weekly snapshot files in full. Do not append.
2. Append to log files. Do not truncate historical rows.
3. Preserve all column headers. Do not rename or remove columns.
4. Use ISO 8601 dates (YYYY-MM-DD) in all date fields.
5. Leave cells empty rather than using NULL, N/A, or placeholder text.
6. No PII — hash user IDs, strip names from review text.

---

## What Happens If a File Is Missing

Agents are built to handle missing files gracefully. If a required data file is
not found, the agent notes it in the INPUTS USED section of its report and
continues with available data. It will not fabricate data or silently skip the gap.

The Chief of Staff will flag missing reports in the MISSING REPORTS section
of the CEO brief. Consistently missing files from a given division indicate
a data intake process that needs attention.

**Files that, if missing, materially degrade report quality:**
- `revenue/pipeline_snapshot.csv` — Head of Growth, Funnel Conversion
- `revenue/mrr_arr.csv` — Head of Growth, Revenue Strategy
- `integrity/scoring_output.csv` — Scoring Quality
- `integrity/submission_log.csv` — Data Quality
- `customer/account_roster.csv` — Customer Health, Retention Intelligence
