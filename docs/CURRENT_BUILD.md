# Current Build

Latest completed milestone: `2026-04-08 - Pass 47 - Wave80 Positive-Cluster Recovery`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- added one narrow positive-cluster recovery pass in the live benchmark engine:
  - positive `communication_clarity` coverage for explicit explain / understand phrasing
  - positive `communication_responsiveness` coverage for explicit responsive / supportive and kept-in-communication phrasing
  - narrow positive `outcome_satisfaction` coverage for `my case was approved`
  - guards so bare positive `reliable` and bare positive `professional` stop creating the staged trust false positives they triggered in the Wave80 audit
- added tight benchmark-engine tests for the intended hits and both new trust guards
- wrote a new canonical-only verification artifact to `data/calibration/runs/20260408_wave80_positive_cluster_canonical_rerun/`
- left the active canonical gate file, staged Wave80 pressure artifact, and broad benchmark truth unchanged

Verification:
- canonical rerun after the engine pass: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real truth remains `55.94%` agreement, `80/143` clean reviews, `92` disagreements
- staged-pressure artifact remains intact and unchanged
- benchmark-engine tests passed
- no broad rerun and no promotion attempt were performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- next useful step: rerun the staged `7`-row Wave80 pressure set against the updated live engine and inspect whether the positive-cluster recovery materially reduced staged disagreement pressure before any renewed promotion discussion
- keep the broader negative `expectation_setting` and mixed outcome/trust rows staged for now
- do not reopen collection, rerun broad, or attempt another fresh promotion before that staged-only check
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
