# Current Build

Latest completed milestone: `2026-04-08 - Pass 46 - Wave80 Staged Calibration Design Audit`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- audited the `7` staged Wave80 pressure rows in `data/calibration/canonical/wave80_staged_pressure_20260408.json` against the failed promotion rerun evidence and the live phrase library
- confirmed the safest next engine lane is a narrow positive-phrase recovery pass, not a broad negative expectation-setting pass
- identified the high-confidence candidate cluster as positive `communication_clarity`, positive `communication_responsiveness`, positive `outcome_satisfaction`, plus two narrow positive `professionalism_trust` guards for the existing bare `reliable` and bare `professional` phrases
- classified the heavier negative `expectation_setting` misses as mixed and not ready for one blunt phrase wave; several should stay staged until a later calibration-design review
- left the active canonical gate, staged artifact, rerun artifacts, queues, and collection data unchanged

Verification:
- restored canonical rerun still stands at `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real truth remains `55.94%` agreement, `80/143` clean reviews, `92` disagreements
- staged-pressure artifact remains intact and unchanged
- no engine files were edited in this pass
- no new rerun or promotion attempt was performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- next useful step: run one narrow engine pass against the safest staged cluster only:
  - recover positive `communication_clarity` / `communication_responsiveness` / `outcome_satisfaction` phrases from the `5-star` staged rows
  - add narrow guards so bare positive `reliable` and bare positive `professional` stop creating trust extras in negative or generic praise contexts
- keep the broader negative `expectation_setting` and mixed outcome/trust rows staged for now
- do not reopen collection, rerun broad, or attempt another fresh promotion before that narrow engine pass lands
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
