# Current Build

Latest completed milestone: `2026-04-11 - Pass 75 - Narrow Communication Responsiveness Engine Pass`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `65.03%` agreement, `93/143` clean reviews, `69` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- added `("would always say they were waiting", 1.5)` to the `communication_responsiveness` negative bucket in `benchmark_engine.py`
- row 107 anchor: explicit chronic non-responsiveness — client called offices and judges themselves while attorney claimed to be waiting
- left `lack of communication` (row 88) untouched — already in `communication_clarity` negative with a suppress-guard; guard-reroute fix deferred to Pass 76
- canonical rerun: `24/24` clean, `0` disagreements — gate held
- broad rerun: `93/143` clean, `69` disagreements — improved from `91/143` / `72` disagreements
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
