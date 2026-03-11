# CEO_OPERATING_GUIDE.md
# Clarion Agent Office — CEO Operating Guide
# Version: 1.0

This is your operating manual for the Clarion internal agent system.
It tells you what to run, when to run it, what to look at, and what to do when something is wrong.

---

## Weekly Rhythm

| Day | Action | Command |
|---|---|---|
| **Saturday** | Run all weekly agents + Chief of Staff | `python workflows/weekly_operations.py` |
| **Sunday** | Read the CEO brief. Action any escalations. | `reports/ceo_brief/chief_of_staff_YYYY-MM-DD.md` |
| **First Saturday of month** | Also run monthly agents (after weekly completes) | `python workflows/monthly_review.py` |

That's it. Everything else is exception-handling.

---

## Where to Look First

After every weekly run, open the CEO brief and read top-to-bottom in this order:

1. **STATUS line** — If it says `ESCALATE`, stop and read escalations immediately before anything else.
2. **ESCALATIONS section** — Any item here requires a decision or acknowledgment from you this week.
3. **RISKS — WATCH section** — Items to monitor. No action required yet, but track them week-over-week.
4. **CROSS-DEPARTMENT SIGNALS** — The highest-signal section of the brief. Two agents pointing at the same thing means something.
5. **DECISIONS REQUIRED THIS WEEK** — Your action list.
6. **MISSING REPORTS** — If a weekly agent is consistently missing, the data feed for that division is broken.

Read the rest as context. Do not skip the first six.

---

## Report Locations

| Report | Location |
|---|---|
| Weekly CEO brief | `reports/ceo_brief/chief_of_staff_YYYY-MM-DD.md` |
| Revenue reports | `reports/revenue/` |
| Market reports | `reports/market/` |
| Customer reports | `reports/customer/` |
| Product insight | `reports/product_insight/` |
| Product integrity | `reports/product_integrity/` |
| Operations | `reports/operations/` |
| Comms | `reports/comms/` |
| People | `reports/people/` |
| Run logs (per division) | `reports/[division]/run_log.jsonl` |

Reports are not committed to git. They live locally. Back them up if you want history beyond 90 days.

---

## Escalation Protocol

When the CEO brief STATUS is `ESCALATE`:

1. **Read the escalation.** Understand what the agent flagged and why.
2. **Identify the owner.** The brief names a recommended role. You decide who actually handles it.
3. **Acknowledge it.** Mark it resolved in the brief itself or in your own notes.
4. **Check carry-forward.** The brief tracks open escalations across weeks. An escalation that reappears is not noise.

When STATUS is `WATCH`:
- No immediate action required.
- Note the item. If it appears three weeks in a row, treat it as `ESCALATE`.

**Escalations do not resolve themselves.** If you take no action, they carry forward indefinitely.

---

## Running Individual Agents

Every agent can be run standalone if you need a fresh read on a specific division:

```powershell
# From the Clarion-Agency directory
python workflows/head_of_growth_runner.py
python workflows/customer_discovery_runner.py
python workflows/scoring_quality_runner.py
# etc.
```

Useful when:
- You want a mid-week signal on a specific area
- A division's data was updated and you want a fresh report
- A weekly run failed for one agent and you want to re-run it alone

Running a standalone agent does not re-trigger the Chief of Staff. If you want an updated brief, run `chief_of_staff_runner.py` manually after.

---

## Monthly-Only Agents

These agents only run on the first Saturday of the month via `monthly_review.py`.
You can also run them standalone at any time:

```powershell
python workflows/revenue_strategy_runner.py
python workflows/market_trends_runner.py
python workflows/retention_intelligence_runner.py
python workflows/dictionary_calibration_runner.py
python workflows/people_ops_runner.py
```

**Dictionary calibration is special:** its output is proposals only.
Never apply phrase dictionary changes without reading the calibration report yourself and making a conscious decision. The agent cannot and will not edit the dictionary directly.

---

## Escalation Notifications

A lightweight notification script scans the most recent CEO brief and logs or emails escalations.

```powershell
# Check for escalations after a weekly run — prints to terminal
python workflows/notify_escalations.py

# Send email notification (requires NOTIFICATION_EMAIL in .env)
python workflows/notify_escalations.py --email
```

The script:
- Reads the most recent `chief_of_staff_*.md` file in `reports/ceo_brief/`
- Extracts STATUS and ESCALATIONS section
- Prints a plain-text summary to the terminal
- Optionally sends a plain-text email via Gmail SMTP (app password required — see `.env.example`)
- Writes an entry to `reports/ceo_brief/escalation_log.jsonl`

No external service required. No webhooks. No Slack. Local-first.

---

## Cost Monitoring

Every agent run logs token usage to `reports/[division]/run_log.jsonl`.
The Cost & Resource agent reads `data/operations/openrouter_usage.csv` weekly and flags overruns.

To check your current month's token spend manually:

```powershell
python workflows/cost_resource_runner.py
```

Approximate costs at default settings (claude-3-haiku via OpenRouter):
- 13 weekly department agents: ~$0.10–0.25/week
- Chief of Staff (claude-3-5-sonnet): ~$0.05–0.15/week
- Monthly agents (5): ~$0.05–0.10/month
- **Total estimated: under $2.00/month at current scale**

These are estimates. Actual cost depends on data volume. Watch the run logs for budget warnings.

---

## Data Intake

Drop updated CSV files into `data/` before each weekly run.
Full details: `DATA_INTAKE_GUIDE.md`

**Minimum viable data drop (weekly):**
- `data/revenue/pipeline_snapshot.csv` — replace
- `data/revenue/mrr_arr.csv` — replace
- `data/customer/account_roster.csv` — replace
- `data/integrity/scoring_output.csv` — append
- `data/integrity/submission_log.csv` — append

If you drop nothing, agents run on empty files and say so. No fabrication.
A thin report on empty data is more useful than a padded report on no data.

---

## Troubleshooting

**An agent failed mid-run.**
Check terminal output for the error. Fix the data file or config entry, then re-run that agent standalone. `weekly_operations.py` will not re-run completed agents from the same session.

**The CEO brief is missing sections.**
One or more department agents failed or produced malformed output. Check `reports/[division]/run_log.jsonl` to find which agent's report was missing.

**Token budget warnings in the terminal.**
A `[BUDGET WARNING]` log means an agent used more than 120% of its `max_output_tokens`. This is not a failure. It means the model produced more output than expected. Trim the data context for that agent if it becomes chronic.

**The Chief of Staff report looks thin.**
Most likely cause: several department agents ran on empty data files. Check what CSVs were populated before the run.

**`OPENROUTER_API_KEY` not set error.**
Copy `.env.example` to `.env` and fill in your key. Run from the `Clarion-Agency/` directory or ensure the `.env` is in the project root.

---

## What the Agent System Cannot Do

These are hard limits. No agent, runner, or workflow in this system will:

- Modify production code, the Flask app, or any backend service
- Edit the phrase dictionary directly
- Send emails, Slack messages, or external communications autonomously
- Access production databases or the live scoring API
- Make purchasing decisions or authorize spend
- Take action on its own findings — all recommendations require human decision

The system produces reports. Humans take action. That is the contract.

---

## Quick Reference

```
Weekly run:     python workflows/weekly_operations.py
Monthly run:    python workflows/monthly_review.py
Check briefs:   reports/ceo_brief/
Notifications:  python workflows/notify_escalations.py
Cost check:     python workflows/cost_resource_runner.py
Data guide:     DATA_INTAKE_GUIDE.md
Agent org:      agent_org.md
```
