# Current Build

Latest completed milestone: `2026-04-09 - Pass 59 - Benchmark Baseline Reconciliation`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- reconciled committed `backend/services/benchmark_engine.py` to the live dirty-worktree baseline that the repo docs had already been using
- verified the committed baseline now reproduces the documented canonical gate at `100.00%`, `24/24`, `0` disagreements
- verified the broad `143-real` sanity state still holds at `55.94%`, `80/143`, `92` disagreements
- wrote fresh verification artifacts:
  - `data/calibration/runs/20260409_baseline_reconcile_canonical_rerun/`
  - `data/calibration/runs/20260409_baseline_reconcile_broad_rerun/`
- kept the blocked wider `outcome_satisfaction` family pass out of this commit; this pass only stabilized the committed engine baseline

Verification:
- canonical benchmark truth is now reproducible from committed repo state at `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real truth remains reproducible at `55.94%` agreement, `80/143` clean reviews, `92` disagreements
- `benchmark_canonical_v1.json` remained untouched in this pass
- no promotion widening or new family-level calibration work was performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- filing-delay no longer inflates staged `expectation_setting` pressure; keep expectation work closed on that lane
- the active canonical gate now includes the two clean Wave80 positive rows and remains fully clean
- keep `newfrontier_vlopez` on the shortlist but staged until its remaining trust ambiguity is resolved
- keep `morgan_elishaurgent` staged as the lone expectation-setting seed
- the broad sanity checkpoint held flat, so the selective promotion did not create a broad regression
- `outcome_satisfaction` is still the next real lane and is now narrowed to a clean driver shortlist
- committed repo truth now matches the documented live benchmark baseline
- next useful step is still one wider multi-row `outcome_satisfaction` engine pass using only the prepared driver set, with tests plus canonical rerun plus broad rerun in the same pass
- treat `professionalism_trust` as the likely runner-up lane, with `empathy_support` and `timeliness_progress` held as later engine-phrase candidates rather than the immediate design pass
- do not reopen collection or broaden promotion beyond the already accepted ready subset
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
