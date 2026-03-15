# Clarion Calibration — Disagreement Analysis
**Run:** `final`
**Generated:** 2026-03-15 21:35 UTC
**Total disagreements:** 0

---

## 1. By Disagreement Type

| Type | Count | % |
|------|-------|---|

## 2. By Theme

| Theme | Count | Top Type |
|-------|-------|----------|

## 3. Priority-4 Issues (Production Risk)
*0 issues requiring immediate attention*

## 4. Phrase Candidates (missing_theme patterns)
*Patterns appearing ≥2x where AI tagged a theme the deterministic engine missed*

_No phrase candidates at this frequency threshold._
---
## 5. Next Steps

1. Review Priority-4 issues above — these have the highest production risk
2. For each `missing_theme`: evaluate suggested phrases and add approved ones to `THEME_PHRASES` in `backend/services/benchmark_engine.py`
3. For `likely_false_positive` / `likely_context_guard_failure`: review context guards in `score_review_deterministic()`
4. Re-run calibration after phrase additions and compare disagreement counts
5. Target: <15% overall disagreement rate, 0 P4 issues

Full phrase candidates: `final/phrase_candidates.json`