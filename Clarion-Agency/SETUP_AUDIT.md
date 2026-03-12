# SETUP_AUDIT.md
# Clarion Agent Office — Cleanup Audit (2026-03-12)

## Root structure: CLEAN
All Agent Office files confirmed inside Clarion-Agency/. No misplaced agent
prompts, memory files, or workflow runners found outside.

## Files moved to _review_moved_files/ (quarantine)
27 one-shot PowerShell and Python patch scripts from C:\Users\beyon\OneDrive\Desktop\CLARION\ root.
These were historical edit scripts used during earlier system build sessions.
They are NOT part of the running Agent Office. Safe to delete if no rollback needed.

## File moved into memory/
- memory_prelaunch_context.md → memory/prelaunch_context.md
  (was sitting loose in Clarion-Agency root — belongs in memory/ with all other context files)

## Files created this session
- run_clarion_agent_office.py   — pre-launch entrypoint (5 stages + fallback brief)
- run_clarion_agent_office.bat  — double-click Windows launcher
- README_RUN_ME_FIRST.md        — plain-language operator guide
- SETUP_AUDIT.md                — this file

## Active pre-launch divisions
  customer_discovery, competitive_intelligence, usage_analyst, content_seo, head_of_growth
  → chief_of_staff synthesis

## Inactive divisions (skipped by runner)
  customer_health_onboarding, voc_product_demand, process_analyst, cost_resource,
  scoring_quality, data_quality, people_ops, sales_development, funnel_conversion

## Safety note
- .env contains a live OpenRouter API key and email credentials in plaintext.
- The file is gitignored but consider rotating the OpenRouter key after any
  session where it was visible.

## Verification status
- Runner path checks: all 5 agent prompt paths confirmed against actual file tree
- Fallback brief: always written to reports/executive_brief_latest.md even on CoS failure
- No external posting wired: content_seo runs in Foundation Mode only
