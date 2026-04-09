# Current Build

Latest completed milestone: `2026-04-08 - Pass 51 - Post-Narrowing Staged Replay`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- replayed the staged `7`-row Wave80 pressure set against the current live engine after the filing-delay truth narrowing
- confirmed the narrowed filing-delay lane removed `2` staged `expectation_setting` misses:
  - `edgardgarcia_anonymous`
  - `newfrontier_vlopez`
- confirmed the remaining staged miss map is now:
  - `expectation_setting`: `3`
  - `professionalism_trust`: `2`
  - `outcome_satisfaction`: `2`
  - `communication_responsiveness`: `1`
- confirmed `ryangarry_noellevitzthum` and `fulton_kellieprenslow` now score clean against staged truth, while `newfrontier_vlopez` is down to one remaining trust miss
- confirmed the remaining pressure is fragmented rather than one clean repeated engine cluster

Verification:
- canonical benchmark truth remains `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real truth remains `55.94%` agreement, `80/143` clean reviews, `92` disagreements
- staged-pressure artifact remained untouched in this pass
- `benchmark_canonical_v1.json` remained untouched in this pass
- no engine edits were made in this pass
- no broad rerun, canonical rerun, or promotion attempt were performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- filing-delay no longer inflates staged `expectation_setting` pressure; keep expectation work closed on that lane
- the remaining staged pressure is now split across sparse `expectation_setting`, `professionalism_trust`, and `outcome_satisfaction` misses rather than one clean family
- do not retry promotion yet; two rows are now clean and one is near-clean, but the set is still too fragmented for an honest retry
- next useful step is another narrow truth / calibration-design review on the remaining mixed expectation, trust, and outcome rows before any new engine pass
- do not reopen collection, rerun broad, or attempt another fresh promotion before a cleaner repeated family is proven
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
