# Current Build

Latest completed milestone: `2026-04-08 - Pass 45 - Wave80 Canonical Gate Restoration + Miss Audit`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- removed the `7` experimental Wave80 promotion rows from the active canonical gate and restored the accepted `22`-row active benchmark
- preserved those same `7` rows in a dedicated staged-pressure artifact: `data/calibration/canonical/wave80_staged_pressure_20260408.json`
- kept the failed promotion experiment artifacts intact for audit: `data/calibration/runs/20260408_wave80_promotion_canonical_rerun/` and `data/calibration/runs/20260408_wave80_promotion_broad_rerun/`
- wrote a narrow restoration-proof canonical rerun to `data/calibration/runs/20260408_wave80_gate_restore_canonical_rerun/`
- audited the staged miss clusters: `expectation_setting` (`5`), `communication_responsiveness` (`4`), `professionalism_trust` (`3`), `outcome_satisfaction` (`3`), `communication_clarity` (`1`)
- left queues and collection data unchanged; the `7` rows remain reviewed Wave80 evidence, just not active canonical truth

Verification:
- restored canonical rerun: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real truth remains `55.94%` agreement, `80/143` clean reviews, `92` disagreements, unchanged by the failed promotion experiment
- staged-pressure artifact exists and preserves all `7` rows plus grouped miss details
- no engine files were edited in this pass

Current next pass:
- the failed Wave80 promotion experiment is now preserved as staged calibration pressure, not active benchmark truth
- next useful step: run a focused miss-cluster audit / calibration-design pass on the `7` staged Wave80 rows
- do not reopen collection or attempt another fresh promotion before that diagnosis
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
