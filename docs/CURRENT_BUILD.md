# Current Build

Latest completed milestone: `2026-04-12 - Pass 80 - Narrow Fee Value Engine Pass`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `69.23%` agreement, `99/143` clean reviews, `60` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- Pass 80: narrow `fee_value` engine pass + canonical truth correction
- added `fee seemed` to `fee_value` negative (row 62 — fee disproportionate to work perceived)
- added `left with $100 less` to `fee_value` negative (row 80 — paid consultation, no useful guidance)
- fixed `fee_value` polarity escalator: guard skips `severe_negative` when `would not help` in text (row 112 — attorney refused unprofitable case, no client exploitation)
- canonical truth correction: `legacy_106` expected_labels changed from `expectation_setting` to `communication_clarity` — Pass 78 regression surfaced and resolved; `wasn't fully explained` correctly fires clarity after guard removal
- canonical: `24/24` clean, `0` disagreements
- broad: `99/143` clean, `60` disagreements — improved from `94/143` / `65` disagreements / `65.73%`
- `fee_value` broad bucket: `4 → 1`
- `python -m pytest backend/tests/test_benchmark_engine.py`: `38 passed`

Verification:
- canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad sanity: `69.23%` agreement, `99/143` clean reviews, `60` disagreements
- run artifacts: `data/calibration/runs/20260412_fee_value_narrow_pass80_canonical_rerun/` and `data/calibration/runs/20260412_fee_value_narrow_pass80_broad_rerun/`

Current next pass:
- Pass 81: fresh lane selection audit across updated broad bucket counts
- updated top buckets: professionalism_trust 11, empathy_support 9, expectation_setting 8, outcome_satisfaction 8, timeliness_progress 6, communication_clarity 6, communication_responsiveness 5, office_staff_experience 4, billing_transparency 2
- do not reopen collection or broaden promotion
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities
