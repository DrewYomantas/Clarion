# Clarion Project State

This file tracks current repo truth. Historical pass detail lives in `CHANGELOG_AI.md`. Product identity lives in `NORTH_STAR.md`. Working rules and protected-system handling live in `AI_WORKING_RULES.md`.

---

## Startup Reads

1. `NORTH_STAR.md`
2. `PROJECT_STATE.md`
3. `AI_WORKING_RULES.md`
4. `ENGINEERING_PRACTICES.md`

---

## Repository & Deployment

- GitHub: https://github.com/DrewYomantas/Clarion
- Live site: https://law-firm-feedback-saas.onrender.com
- Local git remote: `https://github.com/DrewYomantas/Clarion.git`
- Working branch: `main`

### Render Truth

- Public Render routes are reachable as of the v1.0 readiness check: `/`, `/demo`, and `/demo/reports/sample` returned HTTP 200.
- Deeper authenticated production smoke still requires known credentials and environment verification.
- Required production env truth still needs a final dashboard check before launch claims: `DATABASE_URL`, `SECRET_KEY`, `ADMIN_PASSWORD`, `INTERNAL_BENCHMARK_SECRET`, and worker/concurrency settings.

---

## Current Phase

Clarion is a **v1.0 candidate with known caveats**.

What is true now:

- The public product surfaces are reachable.
- The repository has been cleaned for senior technical review.
- The canonical benchmark gate is clean.
- The broader benchmark still has known disagreement limits.
- The product should not be described as fully launch-proven until authenticated production smoke, Render env verification, and deployment hook verification are complete.

The active lane is v1.0 readiness and launch packaging, not open-ended calibration phrase chasing.

---

## Repository Structure

- `backend/` - Flask monolith, APIs, services, templates, PDF generation, backend tests
- `frontend/src/` - React/TypeScript/Vite app
- `Clarion-Agency/` - internal agent-office experiment and operating docs
- `automation/calibration/` - calibration scripts and benchmark workflow
- `data/calibration/` - canonical benchmark, expansion corpus, calibration metadata
- `docs/` - current-state and pass-history docs
- `tools/` - local smoke-test and seeded-workspace helpers

---

## Benchmark Truth

Current accepted benchmark state:

- Canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements.
- Broad 143-real sanity benchmark: `69.23%` agreement, `99/143` clean reviews, `60` disagreements, `0` AI errors.
- Broad disagreement buckets: `professionalism_trust 11`, `empathy_support 9`, `expectation_setting 8`, `outcome_satisfaction 8`, `timeliness_progress 6`, `communication_clarity 6`, `communication_responsiveness 5`, `office_staff_experience 4`, `billing_transparency 2`, `fee_value 1`.

Known benchmark caveats:

- The canonical gate is clean, but the broader `143-real` set still has disagreement limits.
- Broad low-rating narratives still blur `expectation_setting`, `outcome_satisfaction`, and `professionalism_trust` in some cases.
- Remaining broad disagreements should be handled as bounded benchmark-design work, not automatic phrase additions.

Authoritative route / engine story:

- `/internal/benchmark` is the authoritative calibration route.
- `backend/services/benchmark_engine.py` is the live deterministic calibration engine.
- `backend/services/bench/deterministic_tagger.py` is legacy and only reachable through the frozen `/internal/bench` compatibility path when `BENCH_ENABLED=1`.
- `/internal/bench` is not a second live benchmark story.

Canonical dataset truth:

- Canonical set: `data/calibration/canonical/benchmark_canonical_v1.json`
- Canonical benchmark is real-only and human-audited.
- Expansion corpus stays separate unless records are explicitly promoted.
- Star rating is part of benchmark context and is preserved in analysis.

---

## v1.0 Readiness Checklist

Done:

- Public, demo, and sample report routes return HTTP 200.
- Frontend production build passes.
- Frontend lint has no blocking errors.
- Focused benchmark engine tests pass.
- Repo-facing README and setup docs are current enough for senior technical review.
- Old one-shot script quarantine under `Clarion-Agency/_review_moved_files/` has been removed.

Still required before stronger launch claims:

- Authenticated production smoke with a known test account.
- Render environment-variable verification.
- Stripe path verification if billing is part of the v1.0 launch promise.
- Final deployment hook/domain cutover check if moving from the Render URL to a branded domain.
