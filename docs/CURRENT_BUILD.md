# Current Build

Latest completed milestone: `2026-04-12 - Pass 77 - Communication Clarity Truth-Shaping Prep`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `65.03%` agreement, `75/143` clean reviews, `68` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- Pass 77: docs-only truth-shaping prep for `communication_clarity` lane
- all 8 post-Pass-76 clarity disagreement rows classified
- 2 confirmed missing_theme driver candidates: row 105 ("wasn't fully explained"), row 110 ("won't explain why")
- 4 extra-fire rows documented: rows 20, 33, 96 (wrong-lane), row 118 (borderline)
- guard check complete on both phrase seeds -- unique in 143-real set, no guard needed
- prep artifact written to `data/calibration/canonical/communication_clarity_driver_prep_20260412.json`
- no engine edits, no canonical changes, no rerun

Current next pass:
- Pass 78: narrow `communication_clarity` engine pass
- add "wasn't fully explained" to `communication_clarity` negative bucket
- add "won't explain why" to `communication_clarity` negative bucket
- run canonical rerun (gate must hold at 24/24, 0 disagrees)
- run broad rerun (target: communication_clarity bucket 8 -> lower)
- evaluate suppression candidates for extra-fire rows (rows 33, 118) if broad regression appears

Current product truth:
- canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `65.03%` agreement, `75/143` clean reviews, `68` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- Pass 76: guard reroute row 88, added `communicate well` (positive), `run around` (negative), `only heard from them 2 or 3 times` (negative, canonical revert from severe)
- row 107 anchor: explicit chronic non-responsiveness — client called offices and judges themselves while attorney claimed to be waiting
- CR bucket: `8 → 5` broad disagreements after Pass 76 edits
- canonical rerun: `24/24` clean, `0` disagreements — gate held (Pass 76)
- broad rerun: `75/143` clean, `68` disagreements — CR `8 → 5`
- `communication_responsiveness` broad bucket dropped `9 → 8`
- `python -m pytest backend/tests/test_benchmark_engine.py`: `38 passed`

Verification:
- canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad sanity: `65.03%` agreement, `93/143` clean reviews, `69` disagreements
- `benchmark_canonical_v1.json` remained untouched
- run artifacts written to `data/calibration/runs/20260411_comm_responsiveness_narrow_canonical_rerun/` and `data/calibration/runs/20260411_comm_responsiveness_narrow_broad_rerun/`

Current next pass:
- Pass 76: re-audit the remaining `communication_responsiveness` disagreements after this recovery
- evaluate whether the row 88 guard-reroute fix (`lack of communication` currently suppressed by a `continue` in the clarity guard) is worth a targeted guard edit
- run a fresh remaining-lane selection audit across the updated broad bucket counts before committing to a new lane
- do not reopen collection or broaden promotion
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities
