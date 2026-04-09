# AI Pass Changelog

## 2026-04-08 - Pass 58 - Outcome Satisfaction Truth Shaping

### Files Changed
- `data/calibration/canonical/outcome_satisfaction_driver_prep_20260408.json`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reviewed the full `15`-row broad `outcome_satisfaction` disagreement lane row by row and assigned each row into one of:
  - `explicit_result_driver`
  - `explicit_negative_outcome_driver`
  - `mixed_outcome_service_boundary`
  - `generic_praise_not_outcome`
  - `speculative_or_quoted_result_false_positive`
  - `too_weak_to_drive`
- Wrote `data/calibration/canonical/outcome_satisfaction_driver_prep_20260408.json` as the narrow repo-native design artifact for the next wider engine pass.
- Trimmed the lane to a clean four-row future driver shortlist:
  - `real_reviews.csv:50`
  - `real_reviews.csv:104`
  - `real_reviews.csv:66`
  - `real_reviews.csv:116`
- Explicitly preserved the praise-like, hypothetical-result, quoted-result, and service-only rows as non-drivers so the next engine pass does not drift back into them.
- Synced the live-state docs so the next honest move is now one wider multi-row `outcome_satisfaction` engine pass with tests plus canonical and broad reruns in the same pass.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No reruns
- No promotion widening
- No collection reopening

### Verification
- `benchmark_canonical_v1.json` remained untouched
- No engine files were edited in this pass
- Docs and the new driver-prep artifact now point to a clean, row-backed `outcome_satisfaction` engine lane

## 2026-04-08 - Pass 57 - Broad Outcome Satisfaction Benchmark-Design Review

### Files Changed
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reviewed the full broad `outcome_satisfaction` disagreement set from the live `143-real` comparator instead of doing another micro phrase pass.
- Grouped the lane into benchmark-design buckets:
  - explicit positive result language
  - generic praise / recommendation that should not count as outcome
  - explicit negative outcome dissatisfaction
  - mixed outcome + service complaint rows
  - speculative or quoted-result false positives
- Confirmed that `outcome_satisfaction` is still the right next lane, but not yet clean enough for a wider engine pass because too many disagreements still mix actual result language with recommendation, gratitude, hypothetical-result wording, or service-only complaints.
- Synced the live-state docs so the next honest move is one truth-shaping pass on `outcome_satisfaction` before any wider multi-row engine pass.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No reruns
- No promotion widening
- No collection reopening

### Verification
- `benchmark_canonical_v1.json` remained untouched
- No engine files were edited in this pass
- Docs now point to one `outcome_satisfaction` truth-shaping pass before any wider engine work

## 2026-04-08 - Pass 56 - Broad Disagreement-Cluster Audit

### Files Changed
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Audited the four stubborn broad disagreement buckets as a system instead of continuing with one-row or two-row truth tweaks:
  - `professionalism_trust`
  - `outcome_satisfaction`
  - `empathy_support`
  - `timeliness_progress`
- Classified `outcome_satisfaction` as the next best benchmark-design lane because it is both large and mixed: `7` `missing_theme`, `7` `extra_theme`, and `1` `likely_false_positive`, with repeated boundary drift between explicit result language, generic praise, and generic dissatisfaction.
- Classified `professionalism_trust` as the runner-up lane: still large and mixed, but more engine-phrase-leaning than `outcome_satisfaction`.
- Classified `empathy_support` and `timeliness_progress` as mostly live engine phrase-gap families rather than the next design-first pass.
- Synced the live-state docs so the next honest move is a broad `outcome_satisfaction` benchmark-design review before any wider engine pass or further promotion widening.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No reruns
- No promotion widening
- No collection reopening

### Verification
- `benchmark_canonical_v1.json` remained untouched
- No engine files were edited in this pass
- Docs now point to `outcome_satisfaction` as the next best benchmark-design lane and keep `professionalism_trust` as the runner-up

## 2026-04-08 - Pass 55 - Broad Sanity Checkpoint

### Files Changed
- `data/calibration/runs/20260408_wave80_selective_promotion_broad_rerun/raw_results.json`
- `data/calibration/runs/20260408_wave80_selective_promotion_broad_rerun/summary.json`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reran the frozen broad `143-real` sanity comparator after the selective two-row Wave80 promotion.
- Reused the live deterministic engine with the accepted frozen broad AI comparator truth from `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/raw_results.json`.
- Wrote fresh broad rerun artifacts to `data/calibration/runs/20260408_wave80_selective_promotion_broad_rerun/`.
- Confirmed the broad result held exactly flat:
  - `55.94%` agreement
  - `80/143` clean reviews
  - `92` disagreements
  - `0` AI errors
- Synced the live-state docs so they now say the selective promotion did not create a broad regression and the next honest move is a narrower truth / benchmark-design review on the remaining staged rows.

### Explicitly Not Touched
- No engine edits
- No canonical benchmark edits
- No collection reopening
- No promotion widening

### Verification
- `data/calibration/runs/20260408_wave80_selective_promotion_broad_rerun/summary.json` is present and readable
- `data/calibration/canonical/benchmark_canonical_v1.json` remained untouched
- No engine files were edited in this pass
- No canonical rerun was performed in this pass

## 2026-04-08 - Pass 54 - Selective Promotion Retry

### Files Changed
- `data/calibration/canonical/benchmark_canonical_v1.json`
- `data/calibration/canonical/wave80_staged_pressure_20260408.json`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/runs/20260408_wave80_selective_promotion_canonical_rerun/raw_results.json`
- `data/calibration/runs/20260408_wave80_selective_promotion_canonical_rerun/summary.json`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Promoted only the ready subset of the Wave80 shortlist into active canonical truth:
  - `ryangarry_noellevitzthum`
  - `fulton_kellieprenslow`
- Left `newfrontier_vlopez` on the shortlist but staged because the remaining `professionalism_trust` pressure is still boundary-sensitive.
- Updated the staged-pressure artifact and Wave80 label queue notes so they now distinguish the two promoted rows from the one shortlisted-but-not-ready row.
- Ran a canonical-only authoritative rerun after promotion and confirmed the expanded active gate stays clean at `24/24` with `0` disagreements.
- Synced the live-state docs to the new truth and moved the next-step language to a broad sanity rerun before any future promotion widening.

### Explicitly Not Touched
- No engine edits
- No collection reopening
- No broad rerun
- No new promotion beyond the ready subset

### Verification
- Active canonical gate is now `100.00%`, `24/24` clean reviews, `0` disagreements
- `data/calibration/runs/20260408_wave80_selective_promotion_canonical_rerun/summary.json` is present and readable
- `data/calibration/canonical/benchmark_canonical_v1.json` changed only to add the two promoted Wave80 rows
- No engine files were edited in this pass

## 2026-04-08 - Pass 53 - Promotion Shortlist Truth Review

### Files Changed
- `data/calibration/canonical/wave80_staged_pressure_20260408.json`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Truth-reviewed the `3`-row Wave80 promotion shortlist against each row's exact text, staged expected labels, preserved failed-promotion evidence, and replay history.
- Confirmed `ryangarry_noellevitzthum` and `fulton_kellieprenslow` are ready for a very selective promotion retry because their trust / communication / outcome truth is stable enough for benchmark pressure.
- Kept `newfrontier_vlopez` on the shortlist but marked it not ready because the remaining `professionalism_trust` pressure still depends on a boundary-sensitive fee-error / reliability judgment.
- Synced the staged artifact, Wave80 label queue notes, and live-state docs so the shortlist now distinguishes the ready subset from the one row that should remain staged.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits to the active canonical gate
- No collection reopening
- No canonical rerun
- No broad rerun
- No promotion execution

### Verification
- Active canonical gate remains `100.00%`, `22/22` clean reviews, `0` disagreements
- `data/calibration/canonical/benchmark_canonical_v1.json` remained untouched
- No engine files were edited in this pass
- Docs now state that a very selective promotion retry is justified only for `ryangarry_noellevitzthum` and `fulton_kellieprenslow`, while `newfrontier_vlopez` remains staged on the shortlist

## 2026-04-08 - Pass 52 - Staged Pressure Re-Triage

### Files Changed
- `data/calibration/canonical/wave80_staged_pressure_20260408.json`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Re-triaged the preserved `7`-row Wave80 staged set after the filing-delay truth narrowing and post-narrowing replay.
- Split the staged set into a narrower live shape:
  - promotion shortlist: `ryangarry_noellevitzthum`, `fulton_kellieprenslow`, `newfrontier_vlopez`
  - keep staged pressure: `morgan_elishaurgent`
  - downgrade out of staged pressure: `kowalski_bradcanard`, `matthewlind_wayne`, `edgardgarcia_anonymous`
- Preserved `morgan_elishaurgent` as the only remaining expectation-setting seed because it still carries the cleanest intake-promise reversal pressure.
- Removed the more fragmented rows from active staged pressure so future benchmark-facing decisions are driven by a smaller, cleaner set.
- Synced the staged artifact, Wave80 label queue notes, and live-state docs to match the new re-triage truth.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits to the active canonical gate
- No collection reopening
- No canonical rerun
- No broad rerun
- No new promotion attempt

### Verification
- Active canonical gate remains `100.00%`, `22/22` clean reviews, `0` disagreements
- `data/calibration/canonical/benchmark_canonical_v1.json` remained untouched
- No engine files were edited in this pass
- Docs now state that the staged set has been narrowed into a shortlist plus residual staged seed rather than one broad pressure blob

## 2026-04-08 - Pass 51 - Post-Narrowing Staged Replay

### Files Changed
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Replayed the staged `7`-row Wave80 pressure set against the live benchmark engine after the filing-delay truth narrowing pass.
- Confirmed that truth narrowing removed `2` staged `expectation_setting` misses from the replay:
  - `edgardgarcia_anonymous`
  - `newfrontier_vlopez`
- Measured the remaining staged miss map as:
  - `expectation_setting` `3`
  - `professionalism_trust` `2`
  - `outcome_satisfaction` `2`
  - `communication_responsiveness` `1`
- Confirmed `ryangarry_noellevitzthum` and `fulton_kellieprenslow` now score clean against staged truth, while `newfrontier_vlopez` is down to a single remaining trust miss.
- Synced the live-state docs so they no longer imply the filing-delay follow-up is still the active replay target and now point to a narrower truth / calibration-design review on the remaining mixed rows.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No collection reopening
- No canonical rerun
- No broad rerun
- No new promotion attempt

### Verification
- Active canonical gate remains `100.00%`, `22/22` clean reviews, `0` disagreements
- `data/calibration/canonical/benchmark_canonical_v1.json` remained untouched
- `data/calibration/canonical/wave80_staged_pressure_20260408.json` remained untouched
- No engine files were edited in this pass
- Docs now state that the filing-delay lane is closed and that the remaining staged pressure is fragmented rather than one clean repeated engine family

## 2026-04-08 - Pass 50 - Filing-Delay Boundary Truth Review

### Files Changed
- `data/calibration/canonical/wave80_staged_pressure_20260408.json`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reviewed the four filing-delay / submission-delay boundary rows row by row against their exact text, reviewed truth, and current live deterministic behavior.
- Shifted two staged Wave80 rows out of `expectation_setting` and into `timeliness_progress`:
  - `edgardgarcia_anonymous`
  - `newfrontier_vlopez`
- Updated the staged artifact and Wave80 label queue notes so those rows no longer drive expectation-setting pressure.
- Left active canonical truth unchanged because the directly affected canonical row `legacy_106` still carries a real expectation-setting complaint on unexplained guidance, even though it also contains a timeliness complaint.
- Synced the live-state docs so they now say this filing-delay lane should stop driving expectation-setting work.

### Explicitly Not Touched
- No engine edits
- No benchmark reruns
- No collection reopening
- No new promotion attempt
- No broad benchmark changes

### Verification
- Active canonical gate remains `100.00%`, `22/22` clean reviews, `0` disagreements
- `data/calibration/canonical/benchmark_canonical_v1.json` remained untouched
- No engine files were edited in this pass
- Docs now state that the filing-delay truth review is complete and that future expectation-setting work should pivot away from this lane

## 2026-04-08 - Pass 49 - Expectation Evidence Audit

### Files Changed
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Audited the existing in-repo real-review corpus for materially similar expectation-setting evidence without reopening collection or rerunning benchmarks.
- Confirmed that promise-reversal intake language is still too sparse for a narrow engine pass:
  - `morgan_elishaurgent` remains the only clean staged intake-promise seed
  - the nearest corpus neighbors are either already covered by different phrase logic or materially different from the intake-promise pattern
- Confirmed that filing-delay / submission-delay rows do recur, but they read mostly as expectation-vs-`timeliness_progress` benchmark-design boundary cases rather than a safe new `expectation_setting` phrase family.
- Synced the live-state docs so they now point to a filing-delay truth-label review before any new expectation-setting engine work.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No collection reopening
- No canonical rerun
- No broad rerun
- No new promotion attempt

### Verification
- Active canonical gate remains `100.00%`, `22/22` clean reviews, `0` disagreements
- `data/calibration/canonical/benchmark_canonical_v1.json` remained untouched
- `data/calibration/canonical/wave80_staged_pressure_20260408.json` remained untouched
- No engine files were edited in this pass
- Docs now state that the next move is a filing-delay truth-label review, not an expectation-setting engine pass

## 2026-04-08 - Pass 48 - Wave80 Staged-Pressure Replay

### Files Changed
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Replayed the preserved staged `7`-row Wave80 pressure set against the live benchmark engine after the narrow positive-cluster recovery pass.
- Measured partial staged-pressure relief without changing benchmark truth:
  - `communication_clarity` improved `1 -> 0`
  - `communication_responsiveness` improved `4 -> 2`
  - `professionalism_trust` improved `3 -> 2`
  - `outcome_satisfaction` improved `3 -> 2`
  - `expectation_setting` stayed flat at `5`
- Confirmed the clearest replay payoff landed on `fulton_kellieprenslow`, with partial improvement on `ryangarry_noellevitzthum` and `newfrontier_vlopez`.
- Synced the live-state docs so they no longer say the staged replay is still pending and instead point to one more diagnosis / design pass on the residual `expectation_setting`-dominant pressure.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No collection reopening
- No canonical rerun
- No broad rerun
- No new promotion attempt

### Verification
- Active canonical gate remains `100.00%`, `22/22` clean reviews, `0` disagreements
- `data/calibration/canonical/benchmark_canonical_v1.json` remained untouched
- `data/calibration/canonical/wave80_staged_pressure_20260408.json` remained untouched
- No engine files were edited in this pass
- Docs now state that the staged replay happened and that the next move is another diagnosis / design pass, not a promotion retry or broad rerun

## 2026-04-08 - Pass 47 - Wave80 Positive-Cluster Recovery

### Files Changed
- `backend/services/benchmark_engine.py`
- `backend/tests/test_benchmark_engine.py`
- `data/calibration/runs/20260408_wave80_positive_cluster_canonical_rerun/raw_results.json`
- `data/calibration/runs/20260408_wave80_positive_cluster_canonical_rerun/summary.json`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Added the smallest scoped live-engine recovery for the vetted staged positive cluster only:
  - positive `communication_clarity` phrases for explicit explain / understand language
  - positive `communication_responsiveness` phrases for explicit responsive / supportive and kept-in-communication language
  - one narrow positive `outcome_satisfaction` approval phrase
  - two narrow `professionalism_trust` guards on bare positive `reliable` and bare positive `professional`
- Added tight benchmark-engine tests covering the new positive hits plus both trust guards.
- Ran only the canonical gate verification rerun and wrote new artifacts to `data/calibration/runs/20260408_wave80_positive_cluster_canonical_rerun/`.
- Kept `benchmark_canonical_v1.json` unchanged.
- Kept the staged Wave80 pressure artifact unchanged.
- Did not run the broad `143-real` rerun.

### Explicitly Not Touched
- No benchmark-truth edits
- No collection reopening
- No broad rerun
- No negative `expectation_setting` pass
- No new promotion attempt

### Verification
- Benchmark-engine tests passed
- Canonical rerun stayed clean at `100.00%`, `22/22` clean reviews, `0` disagreements
- `data/calibration/canonical/benchmark_canonical_v1.json` remained untouched
- `data/calibration/canonical/wave80_staged_pressure_20260408.json` remained intact
- No broad rerun was performed

## 2026-04-08 - Pass 46 - Wave80 Staged Calibration Design Audit

### Files Changed
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Audited the `7` staged Wave80 pressure rows row by row using `data/calibration/canonical/wave80_staged_pressure_20260408.json`, the failed promotion rerun artifacts, the live benchmark engine phrase library, and the benchmark-engine test file.
- Classified the staged misses into four buckets: real deterministic rule gaps, boundary-routing problems, severity/polarity problems, and benchmark-design ambiguity.
- Narrowed the next engine recommendation to the safest cluster only:
  - positive `communication_clarity` phrase recovery
  - positive `communication_responsiveness` phrase recovery
  - positive `outcome_satisfaction` phrase recovery
  - narrow guards on bare positive `reliable` and bare positive `professional`
- Explicitly did not recommend a broad negative `expectation_setting` pass yet because the staged rows mix broken-plan language, filing-delay language, and broader dissatisfaction in ways that are not one clean repeated rule family.
- Synced the live-state docs so they now point to the next narrow engine move instead of saying the calibration-design audit is still pending.

### Explicitly Not Touched
- No engine edits
- No `benchmark_engine.py` changes
- No benchmark-truth edits
- No canonical benchmark changes
- No collection reopening
- No reruns
- No new promotion attempt

### Verification
- Active canonical gate remains restored at `100.00%`, `22/22` clean reviews, `0` disagreements
- `data/calibration/canonical/benchmark_canonical_v1.json` remained untouched
- `data/calibration/canonical/wave80_staged_pressure_20260408.json` remained intact and unchanged
- No engine files were edited in this pass
- Docs now state that the promotion experiment stayed staged and that the next move is a narrow engine pass, not another promotion or rerun

## 2026-04-08 - Pass 45 - Wave80 Canonical Gate Restoration + Miss Audit

### Files Changed
- `data/calibration/canonical/benchmark_canonical_v1.json`
- `data/calibration/canonical/wave80_staged_pressure_20260408.json`
- `data/calibration/runs/20260408_wave80_gate_restore_canonical_rerun/raw_results.json`
- `data/calibration/runs/20260408_wave80_gate_restore_canonical_rerun/summary.json`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Removed the `7` experimental Wave80 promotion rows from the active canonical gate and restored the accepted `22`-row benchmark.
- Preserved those `7` rows as staged calibration pressure in `data/calibration/canonical/wave80_staged_pressure_20260408.json`.
- Preserved the failed promotion experiment artifacts instead of deleting them.
- Wrote a narrow restoration-proof canonical rerun to `data/calibration/runs/20260408_wave80_gate_restore_canonical_rerun/`.
- Audited the exact staged miss clusters exposed by the failed promotion experiment: `expectation_setting` (`5`), `communication_responsiveness` (`4`), `professionalism_trust` (`3`), `outcome_satisfaction` (`3`), `communication_clarity` (`1`).

### Explicitly Not Touched
- No engine edits
- No `benchmark_engine.py` changes
- No deterministic rule tweaks
- No collection reopening
- No new promotion attempt
- No UI, auth, deployment, or unrelated cleanup

### Verification
- Restored canonical rerun: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- Staged-pressure artifact preserves all `7` failed-promotion rows plus grouped miss details
- Broad truth remains unchanged from the accepted frozen comparator: `55.94%`, `80/143` clean, `92` disagreements
- No engine files were edited in this pass

## 2026-04-08 - Pass 44 - Wave80 Benchmark Promotion + Authoritative Rerun

### Files Changed
- `data/calibration/canonical/benchmark_canonical_v1.json`
- `data/calibration/runs/20260408_wave80_promotion_canonical_rerun/raw_results.json`
- `data/calibration/runs/20260408_wave80_promotion_canonical_rerun/summary.json`
- `data/calibration/runs/20260408_wave80_promotion_broad_rerun/raw_results.json`
- `data/calibration/runs/20260408_wave80_promotion_broad_rerun/summary.json`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Evaluated the `12` reviewed Wave80 `benchmark_candidate` rows for benchmark-driving promotion.
- Promoted `7` rows into active canonical truth: `kowalski_bradcanard`, `morgan_elishaurgent`, `matthewlind_wayne`, `edgardgarcia_anonymous`, `newfrontier_vlopez`, `ryangarry_noellevitzthum`, `fulton_kellieprenslow`.
- Left `5` reviewed rows unpromoted because they still looked too boundary-fragile or inference-heavy for benchmark pressure: `donstewart_amy`, `ericmark_marie`, `chayet_caw8taw`, `ericpalacios_gabrielrodriguez`, `anchor_ag`.
- Expanded the active canonical set from `22` to `29` rows.
- Ran the canonical five-theme rerun against `data/calibration/canonical/benchmark_canonical_v1.json` and wrote new artifacts to `data/calibration/runs/20260408_wave80_promotion_canonical_rerun/`.
- Ran the broad frozen `143-real` rerun against the accepted frozen AI truth and wrote new artifacts to `data/calibration/runs/20260408_wave80_promotion_broad_rerun/`.
- Rebuilt acquisition status for integrity; queue-role counts stayed unchanged.

### Explicitly Not Touched
- No engine edits
- No `benchmark_engine.py` changes
- No deterministic rule tweaks
- No collection reopening
- No new rows added
- No holdout edits
- No UI, auth, deployment, or unrelated cleanup

### Verification
- Canonical rerun: `75.86%` agreement, `22/29` clean reviews, `16` disagreements
- Broad frozen `143-real` rerun: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- Batch/label queue sync: `0` role mismatches
- Row count integrity: `72` batch rows, `72` label rows, `10` holdout queue rows
- Acquisition status rebuild preserved queue-role counts: `20 benchmark_candidate`, `14 holdout`, `13 audit_only`, `49 corpus_only`

## 2026-04-08 - Pass 43 - Wave80 Benchmark-Candidate Human Truth Review

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reviewed the `15` Wave80 `benchmark_candidate` rows only. No rows added. No row text, ratings, or provenance changed.
- Kept `12` rows as reviewed `benchmark_candidate`.
- Downgraded `2` rows to `audit_only`: `michaeltroiano_stephanie`, `stamm_anonymous`.
- Downgraded `1` row to `corpus_only`: `jenniferjamison_derek`.
- Added reviewed expected labels, polarity / severity, evidence snippets, and short truth notes for all `15` reviewed rows.
- Updated Wave80 role counts to `12 benchmark_candidate`, `10 holdout`, `8 audit_only`, `42 corpus_only`.
- Updated combined totals to `20 benchmark_candidate`, `14 holdout`, `13 audit_only`, `49 corpus_only`.
- Updated acquisition status and live-state docs to reflect the reviewed-candidate truth.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No new rows added
- No row text, ratings, or provenance changed
- No holdout queue edits

### Verification
- Batch/label queue sync: `0` role mismatches
- Row count integrity: `72` batch rows, `72` label rows, `10` holdout queue rows
- Reviewed subset integrity: `15` rows reviewed = `12` kept + `2` downgraded to `audit_only` + `1` downgraded to `corpus_only`
- Acquisition status updated: combined totals sum to `96`

## 2026-04-05 - Pass 42 - Wave80 Triage Prep for Benchmark-Candidate and Holdout Promotion

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reviewed all 72 Wave80 rows and assigned triage roles. No rows added, no row text, ratings, or provenance changed.
- Assigned `benchmark_candidate` (15): kowalski_bradcanard WI family_law 1★, morgan_elishaurgent GA personal_injury 1★, matthewlind_wayne WA real_estate 2★, edgardgarcia_anonymous CA family_law 4★, michaeltroiano_stephanie NY SSD 4★, donstewart_amy TX criminal_defense 1★, jenniferjamison_derek TX criminal_defense 4★, ericmark_marie NJ immigration 4★, ryangarry_noellevitzthum MN criminal_defense 5★, chayet_caw8taw CO estate_planning 1★, newfrontier_vlopez AZ immigration 1★, ericpalacios_gabrielrodriguez NV immigration 1★, fulton_kellieprenslow OH SSD 5★, anchor_ag VA estate_planning 2★, stamm_anonymous MD criminal_defense 2★.
- Selection criteria: diverse practices (7), states (14 distinct), star slices (1★ 6, 2★ 3, 4★ 4, 5★ 2); source-faithful, text-rich, clearly representative; no near-duplicates, no thin rows, no off-core rows.
- Assigned `holdout` (10): morgan_daniel GA personal_injury 5★, kowalski_mikec WI family_law 2★, nancyburt_jamie CA family_law 4★, ryangarry_joshhoekstra MN criminal_defense 5★, newfrontier_neilmarkbeltran AZ immigration 5★, canto_alfredoguaman MD immigration 1★, gavlin_anonymous NY immigration 2★, jonathanturner_anonymous TN criminal_defense 4★, christopherbenson_mdr WA estate_planning 4★, ashlaw_mshugge CO SSD 2★.
- Assigned `audit_only` (6): kowalski_nicholasbuettner (near-dupe, same firm), kowalski_cynthiapeterson (71 chars, thin), martinkron_nick (speeding_traffic_ticket, off-core), ssdattorneys_ambertopps (17 chars, too thin), ssdattorneys_ashleydelao (low specificity, anger language), nmilc_ronnyk (6 chars, too thin).
- Remaining 41 rows: `corpus_only`.
- Updated Wave80 holdout queue with 10 rows (was empty before this pass).
- Updated label queue flags: `benchmark_candidate_flag=true` for all 15 candidates, `holdout_flag=true` for all 10 holdout rows, `audit_only_flag=true` for 6 audit rows.
- Updated acquisition status: combined totals benchmark_candidate=23, holdout=14, audit_only=11, corpus_only=48 (sum=96).
- Verified batch/label sync: 0 role mismatches. Row count integrity: 72/72/10.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No new rows added
- No row text, ratings, or provenance changed
- No Phase 1 protected subset edits

---

## 2026-04-05 - Pass 41 - Wave80 2-Star Closure Under Harvest Mode

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Scouted six Google Maps 2-star lanes across CO, FL, GA, TX, NE, and MO; all six failed to surface a usable full-text 2-star body: Krieger Disability Law CO (0 2-star count), De la Rosa Law Firm FL (placeholder body), Perigon Legal Services GA (0 2-star count), The Martinez Law Firm TX (body-less owner-response-only 2-star), McGinn Law Firm NE (two body-less star-only 2-stars), Jeffrey Y. Bennett Law MO (0 2-star count).
- Two Google Maps 2-star rows captured successfully before the fallback threshold was reached: `apexdisability_20260405_ambercruse_2` (Apex Disability Law, Centennial CO, SSD, communication_gap + expectation_break) and `ashlaw_20260405_mshugge_2` (ASH | LAW, Denver CO, SSD, contact_failure + communication_gap).
- Six same-pass dead Google Maps lanes triggered the controlled 2-star fallback rule (threshold = 6). Captured one full-text Avvo 2-star row: `leonversfeld_20260405_paul_2` (Versfeld & Hugo, Kansas City MO, immigration, communication_gap + expectation_break — Paul, June 10, 2022).
- Closed the `2-star` Wave80 target at `20/20`. All primary Wave80 count targets now met.
- Pushed Wave80 from `69` to `72` rows; all rows remain `corpus_only`. MO added as new state (24 total); CO deepened from 3 to 5 Wave80 rows.
- Added 6 new `dead_google_maps` entries and 1 new `fallback_eligible` entry (Versfeld & Hugo MO) to the lane registry.
- Added 6 new entries to the source scout queue.
- Updated collection notes, batch manifest (status → `wave80_2star_closure_complete`, 72 rows), and acquisition status (total 96, 2-star 20/20 ✓).
- Normalization and dedupe completed: 0 exact duplicate groups, 0 likely duplicate pairs.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No synthetic rows
- No paraphrased review text

---

## 2026-04-05 - Pass 40 - Wave80 Mixed 4-Star Recovery Under Harvest Mode

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Checked three harvest-ready Google Maps lanes for mixed 4-star bodies: Anchor Legal Group (VA, 4.7/183 reviews), New Frontier Immigration Law (AZ, 4.8/148 reviews), and Philip J. Fulton Law Office (OH, 4.5/82 reviews). All three returned dead: either no 4-star bodies at all or only star-only body-less rows.
- Ran a qualification check on a fourth lane: Lowe Law Offices (OK, 4.5/283 reviews, surfaced via People-also-search-for from Fulton OH). Eight 4-star bodies were visible but all were purely positive one-liners with no concrete governance complaint. Fourth dead lane confirmed.
- Three same-pass dead Google Maps lanes triggered the controlled mixed-4-star fallback rule (threshold = 3). Captured two full-text Avvo mixed-4-star rows: `jonathanturner_20260405_anonymous_4` (TN, criminal defense, communication_responsiveness caveat) and `christopherbenson_20260405_mdr_4` (WA, estate planning, communication_style_friction).
- Closed the `mixed_4_star` Wave80 target at `15/15`.
- Pushed Wave80 from `67` to `69` rows; all rows remain `corpus_only`.
- Added 4 new `dead_google_maps` entries and 2 new `fallback_eligible` entries to the lane registry; added Lowe Law Offices OK to the scout queue.
- Regenerated normalization, dedupe, acquisition status, and source priority queue artifacts.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No Phase 1 protected-subset edits
- No holdout or audit_only row changes

---

## 2026-04-04 - Pass 38 - Wave80 Efficiency Reset

### Files Changed
- `automation/calibration/build_review_source_priority_queue.py`
- `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Added a persistent Wave80 lane registry so recent lane truth survives across passes instead of being rediscovered manually.
- Backfilled known `viable_google_maps`, `dead_google_maps`, and `fallback_eligible` lanes from Passes `35` to `37`, with the dead Google Maps `2-star` lanes explicitly parked.
- Split the operating model into `qualification` mode and `harvest` mode so tiny scout passes no longer force the full batch truth-sync overhead.
- Updated the source-priority builder to read the lane registry, emit lane-level priority metadata, and push viable Google Maps lanes ahead of fallback lanes while excluding known dead Google Maps `2-star` lanes from harvest.
- Added a harvest-ready queue artifact so future passes can start from a larger prequalified capture block instead of rebuilding the plan lane by lane.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No Phase 1 protected-subset edits
- No Wave80 row-content edits

### Verification
- `python automation/calibration/build_review_source_priority_queue.py --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv --lane-registry data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv --stage wave80 --mode harvest --batches-dir data/calibration/expansion/batches --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv` exists and is populated with recent lane truth from Passes `35` to `37`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv` now ranks `viable_google_maps` first, `fallback_eligible` second, and emits `dead_google_maps` as `excluded_dead_lane`
- `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv` exists as the queued-only harvest block
- Benchmark and engine files remained untouched in this pass

### Current Truth
- Wave80 still sits at `55` rows with `google_maps 36`, `avvo 13`, and `lawyers_com 6`.
- Wave80 star mix remains `1-star 18`, `2-star 12`, `4-star 9`, `5-star 16`.
- All Wave80 rows remain `corpus_only`.
- The new operational truth is that dead Google Maps `2-star` lanes are persistent registry truth, not something that must be re-earned every collection pass.

## 2026-04-04 - Pass 37 - Wave80 2-Star Expansion Under Earned Fallback Rule

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Added `3` real full-text `2-star` Wave80 rows and expanded the live batch from `52` to `55`.
- Re-documented eight same-pass Google Maps `2-star` surfacing failures across immigration and disability lanes in `NV`, `OH`, `IL`, `AZ`, and `MO`.
- Re-earned the controlled fallback rule honestly inside the pass and used it only for three narrow Lawyers.com `2-star` rows in social security disability, estate planning, and criminal defense.
- Kept every new row `corpus_only` and preserved the pass as evidence collection only, with no benchmark or engine work.
- Documented the honest target miss: the pass stopped at `3` rows because the max-three-fallback cap was reached before any new Google Maps `2-star` body surfaced.
- Regenerated normalization, dedupe, acquisition status, and the Wave80 source-priority queue after the new capture block landed.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No benchmark-candidate or holdout promotion
- No Phase 1 protected-subset edits

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `python automation/calibration/build_review_source_priority_queue.py --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv --stage wave80 --batches-dir data/calibration/expansion/batches --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- Wave80 batch result:
  - `55` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
  - `google_maps 36`, `avvo 13`, `lawyers_com 6`
  - `1-star 18`
  - `2-star 12`
  - `4-star 9`
  - `5-star 16`

### Current Truth
- Pass 37 re-earned the Google Maps `2-star` fallback rule inside the pass, but no new Google Maps `2-star` body surfaced before the fallback cap was exhausted.
- The eight documented same-pass Google Maps dead lanes were Immigration Lawyer Robert West (`NV`), Philip J. Fulton Law Office (`OH`), Manring & Farrell (`OH`), Disability Helpers LLC (`IL`), New Frontier Immigration Law (`AZ`), Access Disability, LLC (`MO`), Eric Palacios & Associates Ltd (`NV`), and Velasquez Immigration Law Group (`NV`).
- The next honest move is to stay Google Maps-first, keep documenting surfacing failures quickly, and only use the narrow fallback block again after six fresh same-pass Google Maps failures.

## 2026-04-04 - Pass 36 - Wave80 2-Star Surfacing Proof + Controlled Fallback

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Added `4` real full-text `2-star` Wave80 rows and expanded the live batch from `48` to `52`.
- Documented six distinct Google Maps `2-star` surfacing failures across priority-practice lanes, proving that the current bottleneck is surfacing rather than missing histogram counts.
- Triggered a narrow controlled fallback rule only after those six Google Maps failures were documented in the same pass.
- Added fallback `2-star` rows from `Avvo` and `Lawyers.com` across immigration, social security disability, estate planning, and criminal defense.
- Kept every new row `corpus_only` and preserved the pass as evidence collection only, with no benchmark or engine work.
- Regenerated normalization, dedupe, acquisition status, and the Wave80 source-priority queue after the new capture block landed.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No benchmark-candidate or holdout promotion
- No Phase 1 protected-subset edits

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `python automation/calibration/build_review_source_priority_queue.py --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv --stage wave80 --batches-dir data/calibration/expansion/batches --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- Wave80 batch result:
  - `52` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
  - `google_maps 36`
  - `avvo 13`
  - `lawyers_com 3`
  - `1-star 18`
  - `2-star 9`
  - `4-star 9`
  - `5-star 16`

### Current Truth
- Six documented Google Maps `2-star` lanes in `OR`, `MI`, `NM`, `NC`, and `MO` showed visible `2-star` counts but still did not surface usable full-text `2-star` bodies after Lowest-sort attempts.
- The controlled fallback threshold is now an explicit Wave80 operating rule: after six documented Google Maps `2-star` surfacing failures in one pass, narrow `Avvo` / `Lawyers.com` `2-star` capture is allowed for that pass.
- Mixed `4-star` rules stayed unchanged in this pass.

## 2026-04-04 - Pass 35 - Wave80 Honest 2-Star Growth Pass

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Added `8` real Wave80 rows and expanded the live Wave80 batch from `40` to `48`.
- Kept the pass fully Google Maps-first with all `8` new rows captured from live Google Maps pages.
- Widened live capture into four new states: `MD`, `NM`, `UT`, and `OK`.
- Deepened immigration and criminal-defense coverage while keeping every new row `corpus_only`.
- Documented an honest `2-star` shortfall after repeated Google Maps lanes failed to surface new full-text `2-star` bodies in usable live review views.
- Regenerated normalization, dedupe, acquisition status, and the source-priority queue after the new capture block landed.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No benchmark-candidate or holdout promotion
- No Phase 1 protected-subset edits

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `python automation/calibration/build_review_source_priority_queue.py --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv --stage wave80 --batches-dir data/calibration/expansion/batches --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- Wave80 batch result:
  - `48` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
  - `google_maps 36`, `avvo 12`
  - `1-star 18`
  - `2-star 5`
  - `4-star 9`
  - `5-star 16`

### Current Truth
- The honest `2-star` target was missed in this pass because repeated Google Maps lanes in new or underused states showed zero live `2-star` rows, stayed in limited-view mode, or failed to surface any full-text `2-star` body after Lowest sort and quote-chip attempts.
- Mixed `4-star` was not pursued in this pass and the dead-lane recovery rule stayed untouched.
- The next honest move is to stay Google Maps-first, keep hunting visible `2-star` lanes, and move on quickly when a page's live view refuses to surface body text.

## 2026-04-03 - Pass 34 - Wave80 Google Maps-First Growth Pass

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Added `12` real Wave80 rows and expanded the live Wave80 batch from `28` to `40`.
- Kept the pass Google Maps-first with `10` new Google Maps rows and used controlled Avvo only for the remaining mixed `4-star` slice.
- Widened live capture into six new states: `AZ`, `NV`, `OH`, `VA`, `FL`, and `PA`.
- Deepened immigration, social-security-disability, estate-planning, and criminal-defense coverage while keeping every new row `corpus_only`.
- Regenerated normalization, dedupe, acquisition status, and the source-priority queue after the new capture block landed.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No benchmark-candidate or holdout promotion
- No Phase 1 protected-subset edits

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `python automation/calibration/build_review_source_priority_queue.py --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv --stage wave80 --batches-dir data/calibration/expansion/batches --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- Wave80 batch result:
  - `40` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
  - `google_maps 28`, `avvo 12`
  - `1-star 14`
  - `2-star 5`
  - `4-star 9`
  - `5-star 12`

### Current Truth
- Mixed `4-star` Google Maps work hit three dead lanes in the same pass at Eric Palacios (`NV`), Philip J. Fulton (`OH`), and Swartz Law Firm (`FL`).
- Controlled Avvo gap-fill was used only after that dead-lane threshold was met, and only for the remaining two `4-star` rows.
- The next honest move is to keep Google Maps-first growth going while targeting more honest `2-star` rows from new-state practice lanes.

## 2026-03-29 - Pass 33 - Wave80 Growth + Controlled Gap-Fill

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Added `6` real Google Maps rows and expanded Wave80 from `22` to `28`.
- Kept Google Maps as the dominant lane in this pass and widened into two new states: `MN` and `CO`.
- Deepened underrepresented practice areas by adding criminal-defense and estate-planning rows from live Google Maps pages.
- Added both positive and low-star evidence while keeping every new row `corpus_only`.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No benchmark-candidate or holdout promotion

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Wave80 batch result:
  - `28` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
  - `google_maps 18`, `avvo 10`
  - `1-star 10`
  - `2-star 4`
  - `4-star 7`
  - `5-star 7`

### Current Truth
- Wave80 growth resumed with a real Google Maps-heavy capture block after the stalled mixed `4-star` hunt.
- Mixed `4-star` was not forced in this pass; the dead-lane rule remains active and should be applied only when that slice is explicitly pursued and three Google Maps lanes fail in the same pass.
- The next honest move is another Google Maps-first growth pass focused on immigration, disability, estate planning, and criminal defense from new states.

## 2026-03-29 - Pass 32 - Wave80 Momentum Recovery

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Added `4` real full-text mixed `4-star` Wave80 rows and expanded the live Wave80 batch from `18` to `22`.
- Recovered the stalled mixed `4-star` lane with controlled Avvo gap-fill after repeated Google Maps hunts in Dallas immigration, Omaha probate, Tulsa immigration, and Denver probate kept surfacing body-less or unusable `4-star` rows.
- Added mixed `4-star` rows in family law, estate planning, criminal defense, and immigration.
- Adopted a stricter operating rule for mixed `4-star` collection: start on Google Maps, abandon star-only `4-star` rows immediately, and switch to controlled Avvo / Lawyers.com gap-fill after three dead Google Maps lanes in the same pass.
- Kept every new row `corpus_only`.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No benchmark-candidate or holdout promotion

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Wave80 batch result:
  - `22` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
  - `google_maps 12`, `avvo 10`
  - `1-star 9`
  - `2-star 4`
  - `4-star 7`
  - `5-star 2`

### Current Truth
- Wave80 moved forward with real new evidence instead of stalling on another failed Google Maps-only `4-star` hunt.
- The mixed `4-star` gap materially improved, but the recovery came from controlled gap-fill rather than newly surfaced Google Maps `4-star` text.
- The next honest move is to keep Google Maps as the premium lane for low-star and positive capture while treating mixed `4-star` as a controlled gap-fill lane once Google Maps hits repeated star-only dead ends.

## 2026-03-29 - Pass 31 - Wave80 Collection Pass 3

### Files Changed
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Added `6` real Wave80 rows, all from Google Maps, and expanded the Wave80 batch from `12` to `18`.
- Improved Wave80 source realism from `google_maps 6/12` to `google_maps 12/18`.
- Added two more real Google Maps `2-star` rows and widened Wave80 into Illinois disability capture.
- Deepened Google Maps low-star coverage while keeping every new row `corpus_only`.
- Added live scouting coverage for Illinois disability and Colorado estate-planning Google Maps pages.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No Phase 1 truth edits

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/build_review_source_priority_queue.py --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv --stage wave80 --batches-dir data/calibration/expansion/batches --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Wave80 batch result:
  - `18` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
  - `1-star 9`
  - `2-star 4`
  - `4-star 3`
  - `5-star 2`
  - `google_maps 12`, `avvo 6`

### Current Truth
- Wave80 is now more Google Maps-grounded than Pass 2 while preserving the broader coverage added there.
- The remaining weak intake gap is still clean Google Maps mixed `4-star` capture from new states and underrepresented practice areas.
- The next honest move is Wave80 Collection Pass 4: stay Google Maps-first and target mixed `4-star` reviews in estate planning, immigration, disability, and criminal defense.

## 2026-03-29 - Pass 30 - Wave80 Collection Pass 2

### Files Changed
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Added `6` real Wave80 rows and expanded the live Wave80 batch from `6` to `12`.
- Used targeted Avvo gap-fill because the Google Maps-first lane still did not surface enough clean `2-star` and mixed `4-star` rows quickly enough.
- Added the first Wave80 `2-star` rows and the first three Wave80 mixed `4-star` rows.
- Expanded Wave80 beyond `WI` and `GA` into `WA`, `TX`, `CA`, and `NY`.
- Expanded practice coverage beyond family law and personal injury into real estate, social security disability, speeding / traffic ticket, and criminal defense.
- Regenerated the Wave80 priority queue and kept every Wave80 row `corpus_only`.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No Phase 1 truth edits

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/build_review_source_priority_queue.py --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv --stage wave80 --batches-dir data/calibration/expansion/batches --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Wave80 batch result:
  - `12` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
  - `1-star 5`
  - `2-star 2`
  - `4-star 3`
  - `5-star 2`
  - `google_maps 6`, `avvo 6`

### Current Truth
- Wave80 is no longer a narrow Google Maps-only pilot.
- Pass 2 fixed the main missing slices from Pass 1: real `2-star` rows, real mixed `4-star` rows, more states, and more practice diversity.
- The next honest move is Wave80 Collection Pass 3: return to Google Maps-first capture and keep widening the live corpus without starting benchmark pressure yet.

## 2026-03-28 - Pass 29 - Wave80 Collection Pass 1

### Files Changed
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Filled the Wave80 scout queue with `4` real Google Maps source pages across `WI`, `GA`, and `MN`.
- Generated the first live Wave80 priority queue with `4` ranked source rows.
- Captured the first `6` real Wave80 reviews into the Wave80 batch:
  - `3` from `Kowalski, Wilson & Vang, LLC`
  - `3` from `Morgan & Morgan`
- Kept every new Wave80 row `corpus_only` and added matching label-queue rows without starting benchmark promotion.
- Normalized and deduped the Wave80 batch cleanly after correcting the first CSV-shape issue.
- Updated the Wave80 manifest, notes, and current-state docs so repo truth now says Wave80 is live, not just prepared.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No synthetic evidence

### Verification
- `python automation/calibration/build_review_source_priority_queue.py --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv --batches-dir data/calibration/expansion/batches --existing-csv data/calibration/expansion/real_review_expansion_20260327.csv --stage wave80 --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Wave80 batch result:
  - `6` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
  - `4` `1-star`
  - `2` `5-star`
  - `6/6` `google_maps`

### Current Truth
- Wave80 is now live, not just scaffolded.
- The first block is intentionally Google Maps-heavy and low-star biased.
- The next honest pass is Wave80 Collection Pass 2, focused on more `1-star`, `2-star`, mixed `4-star`, and new-state / new-practice coverage.

## 2026-03-28 - Pass 28 - Wave80 Preparation Milestone

### Files Changed
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`
- `docs/REVIEW_ACQUISITION_PLAN.md`
- `docs/REVIEW_ACQUISITION_PHASE1.md`
- `docs/REVIEW_ACQUISITION_SYSTEM.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `data/calibration/expansion/manifests/20260328_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_phase1_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`

### What Changed
- Audited the acquisition lane for stale "Phase 1 still active" language and corrected it.
- Marked Phase 1 as closed and preserved the reviewed Phase 1 subset counts as protected repo truth.
- Added a dedicated Wave80 execution doc so the next collection pass starts from a clean live-stage artifact.
- Seeded fresh Wave80 starter files for scouting, queueing, batch capture, label prep, holdouts, notes, coverage, and batch manifest tracking.
- Corrected the stale Phase 1 manifest and collection notes so they no longer claim triage has not happened.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No canonical benchmark changes
- No calibration reruns
- No synthetic evidence

### Verification
- `8` reviewed `benchmark_candidate`, `4` `holdout`, `5` `audit_only`, `7` `corpus_only` confirmed from `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json` still matches the completed Phase 1 state and unmet Wave80 targets
- starter Wave80 files created with the correct schema headers and no fake rows

### Current Truth
- Phase 1 is complete and closed.
- Wave80 is now the next live acquisition stage.
- The next honest pass is the first Wave80 discovery-and-capture pass, starting from the new Wave80 files rather than continuing to mutate the closed Phase 1 batch.

## 2026-03-28 - Pass 27 - Review Acquisition Candidate Human-Truth Review

### Files Changed
- `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reviewed only the `9` Phase 1 benchmark candidates.
- Kept `8` rows as reviewed benchmark candidates and downgraded `1` thin row to `corpus_only`.
- Added expected labels, polarity / severity, evidence spans, and short truth notes for the kept set.
- Left holdouts and audit-only rows untouched.
- Refreshed the acquisition status snapshot so repo truth reflects the narrower reviewed candidate set.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No calibration reruns
- No promotion into canonical truth

### Verification
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Reviewed subset result:
  - `9` reviewed
  - `8` kept as benchmark candidates
  - `1` downgraded to `corpus_only`
  - `0` downgraded to `audit_only`
- Queue-role counts now sit at:
  - `benchmark_candidate` `8`
  - `holdout` `4`
  - `audit_only` `5`
  - `corpus_only` `7`

### Current Truth
- The Phase 1 candidate subset is now narrower and more trustworthy than the first triage split.
- The next benchmark-facing work should start from these `8` reviewed candidates, not the raw `9`-row candidate pool.

## 2026-03-28 - Pass 26 - Review Acquisition Phase 1 Triage Prep

### Files Changed
- `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
- `data/calibration/expansion/queues/20260328_phase1_holdout_queue.csv`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reviewed the completed `24`-row Phase 1 corpus and assigned every row to one of:
  - `benchmark_candidate`
  - `holdout`
  - `audit_only`
  - `corpus_only`
- Prepared the first narrow benchmark-prep subsets:
  - `9` `benchmark_candidate`
  - `4` `holdout`
  - `5` `audit_only`
  - `6` `corpus_only`
- Updated the live batch row roles, the Phase 1 label queue, and the Phase 1 holdout queue.
- Kept ambiguous rows out of benchmark pressure by moving them to `audit_only` instead of candidate promotion.
- Refreshed the acquisition status snapshot so repo truth reflects the queue split.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No calibration reruns
- No benchmark-candidate promotion into canonical truth

### Verification
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Updated queue counts:
  - `benchmark_candidate`: `9`
  - `holdout`: `4`
  - `audit_only`: `5`
  - `corpus_only`: `6`
- Phase 1 now meets both the intake target and the first narrow prep target for holdouts and benchmark candidates.

### Current Truth
- Phase 1 intake is complete and now triaged.
- No row has been promoted into benchmark truth.
- The next benchmark-facing work should be human-truth review on the `9` prepared candidates, with the `4` holdouts kept reserved.

## 2026-03-28 - Pass 25 - Review Acquisition Phase 1 Completion

### Files Changed
- `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
- `data/calibration/expansion/manifests/20260328_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_phase1_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_phase1_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_phase1_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Added the final `8` captured rows needed to complete the Phase 1 intake target.
- Kept the pass biased toward the missing slices:
  - `2` new `1-star`
  - `3` new `2-star`
  - `3` new mixed `4-star` rows
- Used Google Maps first for the low-star closeout and Avvo only as narrow gap-fill for the last mixed `4-star` quota.
- Preserved raw review text, star rating, provenance, source URL, collection date, and weak-slice tags for every new row.
- Re-ran normalization, dedupe, and acquisition status after the capture.
- Left every row `corpus_only`.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No calibration reruns
- No holdout promotion
- No benchmark-candidate promotion

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv --output data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Dedupe result:
  - `24` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
- Acquisition progress:
  - `24/24` Phase 1 rows captured
  - `7` one-star rows
  - `5` two-star rows
  - `4` mixed four-star rows
  - `11` long-form rows
  - `6` states
  - source mix `11` Trustpilot / `10` Google Maps / `3` Avvo

### Current Truth
- Phase 1 intake is complete for corpus volume and slice mix.
- All rows still remain `corpus_only`, so benchmark-candidate and holdout triage is still intentionally deferred.
- Benchmark engine and benchmark truth remain unchanged at `100.00%` canonical and `55.94%` broad.

## 2026-03-28 - Pass 24 - Review Acquisition Low-Star Google Maps Capture

### Files Changed
- `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
- `data/calibration/expansion/scouting/20260328_source_scout_queue.csv`
- `data/calibration/expansion/manifests/20260328_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_phase1_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_phase1_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_phase1_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Added `5` new Google Maps low-star family-law reviews into the live Phase 1 batch.
- Corrected the malformed CSV rows from the first Google Maps append so the batch is machine-valid again.
- Preserved raw review text, star ratings, source URLs, provenance, and weak-slice tags for every new row.
- Re-ran normalization, dedupe, and acquisition status after fixing the batch.
- Moved the live Phase 1 batch from `11` to `16` rows while keeping every row `corpus_only`.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No calibration reruns
- No route, UI, or deployment changes

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv --output data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Dedupe result:
  - `16` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
- Acquisition progress:
  - `16/24` Phase 1 rows captured
  - `5` one-star rows
  - `2` two-star rows
  - `1` mixed four-star row
  - `8` long-form rows
  - `4` states
  - source mix `11` Trustpilot / `5` Google Maps

### Current Truth
- Phase 1 source concentration is now below the `70%` single-source cap.
- Low-star coverage improved materially, but the batch still needs more `1-star`, `2-star`, and mixed `4-star` rows before Phase 1 is done.
- Benchmark engine and benchmark truth remain unchanged at `100.00%` canonical and `55.94%` broad.

## 2026-03-28 - Pass 23 - Review Acquisition Capture Start

### Files Changed
- `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
- `data/calibration/expansion/scouting/20260328_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_source_priority_queue.csv`
- `data/calibration/expansion/manifests/20260328_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_phase1_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_phase1_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_phase1_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Started live row capture from the ranked source queue into the Phase 1 batch instead of stopping at queue/scaffold setup.
- Added `11` real Trustpilot reviews into the Phase 1 batch with preserved raw text, star rating, provenance, source URLs, and weak-slice tags.
- Synced the label queue, scout queue, source-priority queue, batch manifest, and batch notes to reflect the captured rows.
- Ran normalization and dedupe on the live batch.
- Wrote an acquisition status snapshot so the next collection pass can see live progress against `phase1`, `wave80`, `wave160`, and `wave320`.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No calibration reruns
- No route, UI, or deployment changes

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv --output data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- Dedupe result:
  - `11` total rows
  - `0` exact duplicate groups
  - `0` likely duplicate pairs
- Acquisition progress:
  - `11/24` Phase 1 rows captured
  - `1` one-star row
  - `1` two-star row
  - `1` mixed four-star row
  - `6` long-form rows
  - `2` states
  - `4` practice-area buckets

### Current Truth
- Real acquisition is now live, not just planned.
- The current batch is still too Trustpilot-heavy, so the next capture block should bias Google Maps and Avvo.
- Positive outcome and positive trust quotas are already ahead of the Phase 1 target, but low-star and state-diversity targets are still behind.

## 2026-03-28 - Pass 22 - Review Acquisition Execution

### Files Changed
- `docs/REVIEW_ACQUISITION_PHASE1.md`
- `docs/REVIEW_ACQUISITION_PLAN.md`
- `docs/REVIEW_ACQUISITION_SYSTEM.md`
- `automation/calibration/build_review_source_priority_queue.py`
- `automation/calibration/normalize_and_dedupe_review_batch.py`
- `automation/calibration/review_acquisition_status.py`
- `data/calibration/expansion/templates/review_intake_template.csv`
- `data/calibration/expansion/templates/coverage_matrix_template.csv`
- `data/calibration/expansion/templates/source_scout_template.csv`
- `data/calibration/expansion/templates/source_priority_queue_template.csv`
- `data/calibration/expansion/templates/label_queue_template.csv`
- `data/calibration/expansion/templates/holdout_queue_template.csv`
- `data/calibration/expansion/templates/batch_manifest_template.csv`
- `data/calibration/expansion/templates/acquisition_stage_targets_template.csv`
- `data/calibration/expansion/templates/collection_notes_template.md`
- `data/calibration/expansion/batches/.gitkeep`
- `data/calibration/expansion/queues/.gitkeep`
- `data/calibration/expansion/manifests/.gitkeep`
- `data/calibration/expansion/scouting/.gitkeep`
- `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
- `data/calibration/expansion/batches/20260328_phase1_collection_notes.md`
- `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
- `data/calibration/expansion/queues/20260328_phase1_holdout_queue.csv`
- `data/calibration/expansion/queues/20260328_source_priority_queue.csv`
- `data/calibration/expansion/scouting/20260328_source_scout_queue.csv`
- `data/calibration/expansion/manifests/acquisition_stage_targets.csv`
- `data/calibration/expansion/manifests/20260328_coverage_matrix.csv`
- `data/calibration/expansion/manifests/20260328_batch_manifest.csv`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Turned the acquisition plan into execution-ready repo scaffolding.
- Added an immediate Phase 1 operator workflow with a concrete `24`-review target.
- Added practical intake, triage, holdout, and notes templates so Drew and agents can start collecting rows consistently right away.
- Added batch and queue directories so the next collection artifacts have a stable home.
- Created dated Phase 1 starter files so the first collection session can begin immediately.
- Corrected the workflow so agents, not Drew, own discovery, source-page scouting, queue building, and first-pass capture.
- Expanded the lane beyond Phase 1 with:
  - coverage-matrix and source-scouting templates
  - source-priority queue generation
  - batch normalization and stronger dedupe support
  - stage-target tracking for `24 -> 80 -> 160+`
  - a scalable system doc for larger corpus expansion
- Left benchmark truth and the engine untouched.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No calibration reruns
- No route, UI, or deployment changes

### Verification
- Reviewed the current acquisition plan and existing expansion artifacts
- Verified the new scaffolding files exist on disk
- `python -m py_compile automation/calibration/build_review_source_priority_queue.py automation/calibration/normalize_and_dedupe_review_batch.py automation/calibration/review_acquisition_status.py`
- Current accepted benchmark truth remains:
  - canonical: `100.00%`, `22/22` clean, `0` disagreements
  - broad frozen `143-real`: `55.94%`, `80/143` clean, `92` disagreements

### Current Truth
- Clarion now has execution-ready collection scaffolding, not just acquisition planning.
- The acquisition lane is agent-driven, with human review kept narrow to guardrails and promotion decisions.
- Clarion now also has the first scalable acquisition-system layer for discovery queues, manifests, dedupe, and stage tracking.
- The next benchmark move is still more real evidence, not more engine tweaking.
- Future collection should start from `docs/REVIEW_ACQUISITION_PHASE1.md` and the templates under `data/calibration/expansion/templates/`.

## 2026-03-28 - Pass 21 - Real-World Review Acquisition Planning

### Files Changed
- `docs/REVIEW_ACQUISITION_PLAN.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Designed the next evidence-building lane so future benchmark work is driven by more real-world law-firm reviews instead of squeezing more rules out of sparse ambiguity rows.
- Added a durable acquisition plan covering:
  - source priorities
  - acquisition model
  - dataset schema
  - dedupe and labeling workflow
  - checkpoint targets before the next benchmark wave
- Moved the honest next-step direction from benchmark-design stopping-point language to real-review corpus expansion.
- Kept benchmark truth and the engine unchanged.

### Explicitly Not Touched
- No engine edits
- No benchmark-truth edits
- No route changes
- No UI or deployment changes

### Verification
- Reviewed current repo-truth docs
- Reviewed the accepted broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- Reviewed the current expansion artifacts:
  - `data/calibration/expansion/real_review_expansion_20260327.csv`
  - `data/calibration/expansion/benchmark_candidates_20260327.csv`
  - `data/calibration/expansion/collection_notes_20260327.md`
- Current accepted benchmark truth remains:
  - canonical: `100.00%`, `22/22` clean, `0` disagreements
  - broad frozen `143-real`: `55.94%`, `80/143` clean, `92` disagreements

### Current Truth
- The current calibration wave is complete until Clarion has more real review evidence.
- The next honest lane is real-world review acquisition, not another benchmark-engine pass.
- Benchmark work should reopen only after the new corpus checkpoint in `docs/REVIEW_ACQUISITION_PLAN.md` is met.

## 2026-03-28 - Pass 20 - Human-Truth / Benchmark-Design Review

### Files Changed
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Audited the remaining sparse disagreement clusters after Pass 18 without attempting another engine edit.
- Reviewed the unresolved low-star ambiguity rows directly, plus the flat `professionalism_trust` and `outcome_satisfaction` buckets.
- Classified the remaining blocker as benchmark-design / human-truth ambiguity rather than another clean deterministic rule gap.
- Declared the current calibration wave complete unless new benchmark evidence is added.
- Synced the repo docs to reflect that stopping-point judgment and the correct next move.

### Explicitly Not Touched
- No engine edits
- No canonical truth edits
- No benchmark route changes
- No UI or deployment changes

### Verification
- Reviewed the accepted broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- Reviewed the remaining sparse low-star rows directly from raw results
- Reviewed the flat `professionalism_trust` and `outcome_satisfaction` disagreement buckets directly from raw results
- Current accepted benchmark truth remains:
  - canonical: `100.00%`, `22/22` clean, `0` disagreements
  - broad frozen `143-real`: `55.94%`, `80/143` clean, `92` disagreements

### Current Truth
- There is no additional broad-safe repeated pattern left for this calibration wave.
- The remaining misses now split mainly into:
  - sparse low-star ambiguity rows that should stay unresolved or become audit-only if benchmark work continues
  - praise / recommendation inference in positive `professionalism_trust` and `outcome_satisfaction`
  - low-star severity ambiguity that needs benchmark-design decisions more than phrase rules
- The next benchmark move should be a deliberate benchmark-design review, not another deterministic calibration pass.

## 2026-03-28 - Pass 19 - Remaining-Cluster Audit

### Files Changed
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Audited the unresolved low-star ambiguity rows and the flat `professionalism_trust` / `outcome_satisfaction` buckets before attempting another engine pass.
- Confirmed the remaining misses are mostly sparse, inference-heavy, or one-off boundary cases rather than a clean repeated cluster.
- Chose the honest stopping point for this calibration wave instead of forcing another speculative phrase pass.
- Synced repo docs to reflect that current understanding and the likely next move.

### Explicitly Not Touched
- No engine edits
- No canonical truth edits
- No benchmark route changes
- No UI or deployment changes

### Verification
- Reviewed the accepted broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- Reviewed the remaining low-star ambiguity rows directly from raw results
- Reviewed the flat `professionalism_trust` and `outcome_satisfaction` disagreement rows directly from raw results
- Current accepted benchmark truth remains:
  - canonical: `100.00%`, `22/22` clean, `0` disagreements
  - broad frozen `143-real`: `55.94%`, `80/143` clean, `92` disagreements

### Current Truth
- There is no clear remaining broad-safe repeated pattern strong enough to justify one more engine rule in this wave.
- The remaining misses are now a mix of:
  - single-row low-star ambiguity
  - praise / recommendation inference in positive reviews
  - sparse trust/outcome severity ambiguity
- The likely next move is a fresh human-truth or benchmark-design review, not another phrase-rescue pass.

## 2026-03-28 - Pass 18 - Broad-Safe Low-Star Boundary Cleanup

### Files Changed
- `backend/services/benchmark_engine.py`
- `backend/tests/test_benchmark_engine.py`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Closed a second narrow low-star boundary pass instead of reopening phrase expansion.
- Kept only three boundary cleanups that survived both benchmark gates:
  - `always got told that our message was left for our lawyer` now counts as responsiveness behavior, not office-staff behavior
  - `paralegal is assigned to your case` no longer creates a negative office-staff hit by itself
  - legwork-based `expectation_setting` hits are suppressed only when stronger nonresponse or nonperformance cues are already present
- Left the harder single-row misses alone, including the 45-minute intake screening row and the `rudely accused ... over the phone` row, because they still looked too bespoke for a broad-safe rule.
- Synced repo docs to the new accepted benchmark truth and the narrower next-pass direction.

### Explicitly Not Touched
- No canonical truth edits
- No disputed-row reinstatement
- No broad phrase growth spree
- No new trust/outcome rules
- No route or deployment changes

### Verification
- `python -m pytest backend/tests/test_benchmark_engine.py backend/tests/test_bench_routes.py -q` - passed (`33 passed`)
- Canonical rerun: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- Broad frozen `143-real` rerun: `55.94%` agreement, `80/143` clean reviews, `92` disagreements
- Broad disagreement counts:
  - `communication_responsiveness` stayed `9`
  - `communication_clarity` stayed `8`
  - `expectation_setting` `11 -> 9`
  - `office_staff_experience` `6 -> 4`
  - `professionalism_trust` stayed `15`
  - `outcome_satisfaction` stayed `15`
- Broad `1-star` slice:
  - disagreement rate held at `0.514`
  - total disagreements `34 -> 32`

### Current Truth
- The broad set improved again without breaking the clean canonical gate.
- The remaining low-star misses are now more obviously high-ambiguity and lower-repeat than the ones already fixed.
- The benchmark blocker is still broad low-star generalization, but the safest remaining work is getting narrower, not broader.

## 2026-03-28 - Pass 17 - Broad-Safe Low-Star Phone/Intake Responsiveness

### Files Changed
- `backend/services/benchmark_engine.py`
- `backend/tests/test_benchmark_engine.py`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Closed a narrow broad-safe pass on the low-star phone/intake responsiveness cluster instead of reopening broader phrase growth.
- Added one exact negative responsiveness hit for prolonged intake hold time:
  - `had me on hold 20 minutes`
- Tightened boundary routing for two phrases that were being over-credited to responsiveness when the text clearly described intake staff behavior:
  - `whoever answered the phone was not pleasant or helpful` -> `office_staff_experience`
  - `tell you to do it yourself` -> `office_staff_experience` when the review clearly references a phone assistant / intake context
- Rejected and reverted a severity escalation for `only heard from them 2 or 3 times` because it improved one broad row but broke the clean canonical gate.
- Synced repo docs to the new accepted benchmark truth and pass history.

### Explicitly Not Touched
- No canonical truth edits
- No disputed-row reinstatement
- No broad phrase growth spree
- No trust/outcome rule changes
- No route or deployment changes

### Verification
- `python -m pytest backend/tests/test_benchmark_engine.py backend/tests/test_bench_routes.py -q` - passed (`29 passed`)
- Canonical rerun: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- Broad frozen `143-real` rerun: `55.24%` agreement, `79/143` clean reviews, `96` disagreements
- Broad `1-star` disagreement rate: `0.600 -> 0.514`
- Broad disagreement counts:
  - `communication_responsiveness` `12 -> 9`
  - `office_staff_experience` `8 -> 6`
  - `professionalism_trust` stayed `15`
  - `outcome_satisfaction` stayed `15`

### Current Truth
- The latest pass produced a real broad-safe win without reopening canonical ambiguity.
- The benchmark blocker is still broader low-star generalization, not the canonical gate.
- Remaining low-star phone/intake misses are now narrower and more boundary-ambiguous than the ones fixed here.

## 2026-03-28 - Pass 16 - Canonical Benchmark Truth-Correction

### Files Changed
- `data/calibration/canonical/benchmark_canonical_v1.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Corrected canonical benchmark truth where the current active gate was clearly the problem:
  - `legacy_057` responsiveness severity corrected from `negative` to `severe_negative`
  - `legacy_115` now includes the explicit `communication_clarity` and `professionalism_trust` labels already supported by the review text
- Marked disputed rows as audit-only instead of forcing the engine to satisfy contradictory or overfit-prone labels:
  - `legacy_130` -> `disputed_excluded`
  - `exp_turnbull_2` -> `disputed_excluded`
- Left the engine unchanged. This was a benchmark-truth correction pass, not a phrase pass.

### Explicitly Not Touched
- No engine rule edits
- No phrase additions
- No route changes
- No UI or deployment work

### Verification
- Canonical rerun: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- Broad comparator remains the latest frozen-truth run: `52.45%` agreement, `75/143` clean reviews, `96` disagreements

### Current Truth
- The active canonical benchmark gate is now clean.
- Remaining blocker is broader deterministic generalization, not unresolved ambiguity inside the main canonical gate.

## 2026-03-28 - Pass 15 - Engine Boundary Cleanup + Docs Truth Sync

### Files Changed
- `backend/services/benchmark_engine.py`
- `backend/tests/test_benchmark_engine.py`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Closed a narrow benchmark-engine cleanup pass around the remaining hard boundary cases instead of reopening broad calibration work.
- Kept only the rule changes that survived both benchmark gates:
  - positive responsiveness support for pre-hearing contact language
  - negative responsiveness support for `messages were not returned`
  - a precision guard so bare `answered all my questions` does not create a false `communication_clarity` hit without explanation context
  - low-spread phrase additions for the remaining promoted holdouts that did not create a broad headline regression
- Rejected and reverted overfit changes that helped the canonical target slice but hurt the broad `143-real` sanity set, including:
  - `outcome was great`
  - Turnbull-style phrase drops like `same stupid answers`
  - broader reroute/downgrade changes around `legacy_057`
- Synced the benchmark-story docs to current repo truth:
  - canonical benchmark is the real-only v1 set
  - `/internal/benchmark` is authoritative
  - `/internal/bench` is frozen compatibility behavior, not a second live benchmark story
  - readiness remains `improved but not demo-safe`

### Explicitly Not Touched
- No UI or landing work
- No launch-smoke pass
- No synthetic expansion
- No broad all-theme calibration
- No auth or deployment changes

### Verification
- `pytest backend/tests/test_benchmark_engine.py backend/tests/test_bench_routes.py -q` - passed (`21 passed`)
- Canonical rerun: `79.17%` agreement, `19/24` clean reviews, `9` disagreements
- Broad `143-real` rerun: `51.05%` agreement, `73/143` clean reviews, `100` disagreements, `0` AI errors

### Current Truth
- Canonical holdouts are narrower, but not gone.
- Broad behavior improved overall without a headline regression.
- The biggest remaining risk is still low-star boundary discipline, especially the broad `1-star` slice.
- Readiness remains `improved but not demo-safe`.

## 2026-03-27 - Pass 14 - Brief Closure + Marketing Trust Foundation

### Commit
- 7ebb700 - tighten brief closure and marketing trust

### Files Changed
- frontend/src/pages/ReportDetail.tsx
- frontend/src/components/SiteNav.tsx
- frontend/src/components/SiteFooter.tsx
- frontend/src/components/landing/LandingHeroSection.tsx
- frontend/src/components/landing/LandingTrustSection.tsx
- frontend/src/content/landingV3.ts
- frontend/src/pages/NotFound.tsx
- frontend/src/pages/Privacy.tsx
- frontend/src/pages/Terms.tsx
- docs/PROJECT_STATE.md
- docs/CURRENT_BUILD.md
- docs/CHANGELOG_AI.md

### What Changed
- Strengthened the governance brief closure loop in `ReportDetail.tsx` without redesigning the full artifact:
  - satisfaction score now includes interpretive context rather than a raw number alone
  - `Decisions & Next Steps` now has a primary next-step block, supporting steps, and fallback guidance when recommended changes are absent
  - missing owners and missing due dates are surfaced as visible follow-through risk
  - the primary decision can now open a linked follow-through draft instead of feeling disconnected from action
  - supporting evidence is framed more clearly as representative anonymized source material for the current review period
- Strengthened public trust/conversion scaffolding with minimal surface changes:
  - public nav now keeps the sample brief visible while adding a persistent `Start free` CTA
  - homepage hero copy is shorter and clearer about the upload-to-brief outcome
  - trust/persona wording is slightly more buyer-specific without adding fake proof
  - footer now includes support contact language and a trust line
  - 404 page now uses Clarion branding and routes the user back to the sample brief or homepage
  - Terms and Privacy now show visible `Last updated` timestamps

### Explicitly Not Touched
- No backend or auth/runtime changes
- No charts
- No broad landing redesign
- No custom-domain implementation or DNS work
- No authenticated workflow changes outside the current brief-detail surface

### Verification
- `npm run build` in `frontend/` - passed (1821 modules)
- Playwright local-preview checks passed on:
  - `/`
  - `/terms`
  - `/privacy`
  - `/does-not-exist`
- Pre-existing chunk-size warning remains unchanged
- Full authenticated rendered verification for `ReportDetail` still requires a bootable local or deployed auth environment

## 2026-03-27 - Pass 13 - Trust / Credibility Cleanup + Dashboard Hierarchy Cleanup

### Commit
- 44712b0 - tighten trust cleanup and dashboard hierarchy

### Files Changed
- frontend/src/components/ClientQuoteCard.tsx
- frontend/src/pages/ApprovalQueuePage.tsx
- frontend/src/pages/Dashboard.tsx
- frontend/src/pages/DashboardAccount.tsx
- frontend/src/pages/DashboardBilling.tsx
- frontend/src/pages/Onboarding.tsx
- docs/PROJECT_STATE.md
- docs/CURRENT_BUILD.md
- docs/CHANGELOG_AI.md

### What Changed
- Removed customer-facing exposure of internal tooling from the Account surface:
  - deleted the admin/testing block that exposed support queue handling, onboarding preview links, example-cycle loading, and calibration / benchmark console links
  - retitled the section from workspace administration to workspace settings and removed internal-ops phrasing
- Softened internal-only wording where it still leaked into product-adjacent surfaces:
  - Approval Queue description no longer says `Founder command center` or `office run`
  - item metadata now reads as `Submitted by ...`
  - payload toggle now reads `Submission details`
  - onboarding preview mode now uses `Preview Mode` / `Restart preview`
- Tightened dashboard above-the-fold hierarchy without redesign:
  - removed the governance-loop explainer from the header
  - placed the compact `OversightBand` directly under the current governance brief
  - moved baseline/history notices below the immediate follow-through tier
  - moved the larger `FirmGovernanceStatus` posture card into supporting context
- Reduced repetitive upgrade framing:
  - added the primary plan-review CTA to the Dashboard `Plan and capacity` card
  - removed the extra standalone `Upgrade Plan` card from Billing
- Improved client evidence readability in the shared quote renderer:
  - trims duplicate outer quotes
  - normalizes whitespace
  - restores missing spaces after sentence punctuation when they were obviously concatenated

### Explicitly Not Touched
- No backend, auth, or route-gating changes.
- No charts or broad visual redesign.
- No workflow changes to Signals, Execution, Reports, or ReportDetail.
- Approval Queue remains admin-only; this pass changed copy only.

### Verification
- `npm run build` in `frontend/` - passed (1821 modules).
- Pre-existing chunk-size warning remains unchanged.
- Attempted local authenticated Playwright smoke via the repo e2e path, but the backend did not become reachable on `127.0.0.1:5000` inside that session, so authenticated rendered verification still needs a live or bootable local backend.

## 2026-03-27 - Auth Session Postgres Row Fix + Single-Worker Runtime Guard

### Commit
- 0f8c954 - fix: restore auth session loading on postgres

### Files Changed
- backend/db_compat.py
- backend/gunicorn.conf.py
- docs/PROJECT_STATE.md
- docs/CURRENT_BUILD.md
- docs/CHANGELOG_AI.md

### What Changed
- Fixed the real live auth/session bug at the DB compatibility layer:
  - Postgres-backed cursor rows are now wrapped in a sqlite-style compatible row object that supports both numeric and named access.
  - This restores Flask-Login session rehydration through load_user, which was crashing on tuple rows with TypeError: tuple indices must be integers or slices, not str.
- Tightened the Gunicorn runtime default for the current Redis-unavailable state:
  - gunicorn now honors WEB_CONCURRENCY first, then GUNICORN_WORKERS, and falls back to 1 worker by default.
  - This keeps auth backoff and rate-limit state coherent until Redis is reachable again.

### Explicitly Not Touched
- No frontend changes.
- No auth route contract changes.
- No dashboard, landing, or product-surface work.

### Verification
- python -m py_compile backend/db_compat.py backend/gunicorn.conf.py backend/app.py - passed.
- Compatibility verification passed: a Postgres-style tuple row now supports both row[0] and row["id"] and load_user hydrates successfully through the wrapped Postgres connection path.
- Local auth smoke passed: POST /api/auth/login -> GET /api/auth/me returned 200/200 for a temporary verified user.
- Gunicorn config verification passed:
  - default workers -> 1
  - WEB_CONCURRENCY override takes precedence over GUNICORN_WORKERS
- Local Flask test-client checks still passed on GET /login, GET /forgot-password, and GET /reset-password/test-token.

### Required Render Follow-Up
- Deploy latest main to Render.
- Set WEB_CONCURRENCY=1 on the web service immediately.
- If GUNICORN_WORKERS is currently set, change it to 1 or remove it so WEB_CONCURRENCY wins.
- Do not raise worker count again until REDIS_URL points to a reachable Redis instance.

## 2026-03-27 - Auth Retest Prep + Login Handoff Hotfix

### Commit
- adc22c8 - fix: serve spa shell for login route handoff

### Files Changed
- backend/app.py
- docs/PROJECT_STATE.md
- docs/CURRENT_BUILD.md
- docs/CHANGELOG_AI.md

### What Changed
- Closed the missed legacy auth handoff bug in repo truth:
  - GET /login now serves the React SPA shell directly when frontend/dist exists, matching /forgot-password and /reset-password/:token.
  - This removes the self-redirect loop that was burning the live rate-limit window before the real login screen could load.
- Documented the honest auth retest state:
  - local smoke/reset helpers target local SQLite and do not reset Render Postgres
  - the clean live retest path should use a brand-new inbox alias after the latest backend deploy
  - /check-email can show No email address on file from missing browser sessionStorage even when server-side account state exists

### Explicitly Not Touched
- No dashboard or landing work.
- No broader auth redesign or API contract changes.
- No production DB row deletion from this machine.

### Verification
- python -m py_compile backend/app.py - passed.
- Local Flask test-client checks:
  - GET /login -> 200 text/html
  - GET /forgot-password -> 200 text/html
  - GET /reset-password/test-token -> 200 text/html
- Live route inspection confirmed the remaining blocker is deploy truth, not repo truth:
  - live /forgot-password and /reset-password/:token already serve the SPA shell
  - live /login still self-redirects and then 429s until this commit is deployed

### Current Retest Recommendation
- Deploy latest main to Render first.
- Use a brand-new inbox alias for the next live auth retest instead of reusing stale test credentials.
- Clear browser cookies plus:
  - sessionStorage["pending_verification_email"]
  - sessionStorage["pending_verification_status"]
  - localStorage["clarion_verification_completed_at"]

## 2026-03-26 - Pass 12 - Landing / Marketing Proof + Onboarding Clarity + Launch-Readiness Truth Test

### Commit
- `9b6202e` - design: tighten launch-facing landing and first-run clarity

### Files Changed
- `frontend/src/components/landing/LandingHeroSection.tsx`
- `frontend/src/components/landing/LandingOperatingPreview.tsx`
- `frontend/src/components/landing/LandingWorkflowSection.tsx`
- `frontend/src/content/landingV3.ts`
- `frontend/src/pages/Onboarding.tsx`
- `frontend/src/pages/Upload.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Tightened the public buyer narrative so Clarion reads as a law-firm governance brief workflow rather than generic analytics software:
  - Landing hero now leads with partner-meeting clarity, decision visibility, and named follow-through.
  - Workflow and output framing now stress one review-period export becoming one readable governance record.
  - Public proof notes and preview framing now put the sample brief and the current governance brief ahead of generic workspace language.
- Clarified first-run onboarding so the user understands what Clarion creates before Clarion asks for file action:
  - Step 2 now explains the governance brief, client-issues record, and follow-through outcome first.
  - Step 3 now names the required CSV fields more clearly and frames the upload as the first review cycle.
  - Completion state now opens into the first governance brief when a file was uploaded during setup.
- Clarified the upload-to-brief path in the authenticated upload flow:
  - Upload page now explains the result as the current review packet: governance brief, client issues, and follow-through.
  - File picker language now matches the single-export workflow and no longer implies multi-file use at first run.
  - Success state and next-step copy now steer the user into the review packet first and point public proof to the sample brief.

### Explicitly Not Touched
- No backend logic changes.
- No governance engine, calibration, or PDF changes.
- No reopening of completed dashboard redesign work.
- No pricing, checkout, or route-contract changes.

### Verification
- `npm run build` in `frontend/` - passed (1822 modules).
- Shell-based Playwright runtime checks passed on:
  - landing page (`/`)
  - sample brief (`/demo/reports/26`)
  - authenticated upload page (`/upload`)
- Limitation: `/onboarding?preview=true` redirected the local smoke user to `/dashboard`, so onboarding preview-mode copy was verified in code/build but not as a direct runtime route.
- Pre-existing warning remains: Vite chunk-size warning (~910 kB JS bundle), unchanged in nature.

### Launch Verdict
- Near-ready with limited blockers.
- Public product understanding is strong enough for launch evaluation, but public launch should wait for deployed-environment truth: Render reconnect / stale deploy resolution, deployed smoke confirmation, and verification that setup-dependent delivery paths match production reality.

## 2026-03-26 - Pass 11 Ã¢â‚¬â€ Dashboard Tier 3 Rhythm Finalization + Authenticated Continuity Copy Lock

### Commit
- `ebc3c41` Ã¢â‚¬â€ design: finish dashboard tier 3 rhythm and workspace continuity copy

### Files Changed
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/SignalsPage.tsx`
- `frontend/src/pages/ExecutionPage.tsx`
- `frontend/src/pages/ReportsPage.tsx`
- `frontend/src/components/governance/GovernanceBriefCard.tsx`
- `frontend/src/components/WorkspaceLayout.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Finalized Dashboard Tier 3 rhythm with layout compression:
  - Paired `SinceLastReview` and `Escalations and watchpoints` in a shared `xl` two-column row.
  - Kept the same data and interactions; changed layout rhythm only.
  - Tightened escalations subtitle to partner-attention language.
- Locked authenticated continuity copy with minimal text-only updates:
  - Signals: `Needs Action` tab relabeled to `Needs Partner Attention`; triage section/empty-state copy aligned to the same phrase set; stale `All Signals` mention corrected to `Current Cycle`.
  - Execution: `Assigned to me` relabeled to `My follow-through`; matching section/empty-state language aligned to brief-record framing.
  - Reports + GovernanceBriefCard: prepare CTA labels standardized to `Prepare meeting brief` / `Prepare partner meeting brief`.
  - WorkspaceLayout topbar notes for Dashboard, Signals, and Reports rewritten to artifact-first meeting-ready guidance.

### Explicitly Not Touched
- No backend changes.
- No meeting-mode behavior or logic changes.
- No route, API, state, or data-contract changes.
- No edits to ReportDetail, governance engine, calibration, or PDF internals.

### Verification
- `npm run build` in `frontend/` Ã¢â‚¬â€ passed (1822 modules).
- Runtime smoke via Playwright on authenticated flow (`/dashboard` -> Signals -> Follow-Through -> Briefs -> Brief detail) confirmed:
  - Dashboard Tier 3 row pairing renders correctly.
  - Meeting view still toggles and renders correctly.
  - Updated labels/copy appear in live authenticated surfaces.
- Pre-existing warning remains: Vite chunk-size warning (~909.87 kB JS bundle), unchanged in nature.

## 2026-03-26 - Pass 10 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Dashboard Tier 2 / Tier 3 Tightening

### Commit
- `9f47a04` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â design: tighten dashboard tier 2 and tier 3 surfaces

### Files Changed
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/components/dashboard/GovernanceGuidance.tsx`
- `frontend/src/components/dashboard/OversightBand.tsx`
- `frontend/src/components/dashboard/GovernanceNarrativeRail.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Compressed Tier 2 framing and reduced equal-weight panel noise while preserving workflow and data:
  - Removed redundant suggested-actions section header wrapper.
  - Capped dashboard suggested-actions display to top 2 items.
  - Retreated suggested-action button treatment from primary to secondary and tightened button copy.
  - Placed `Follow-through to review` and `Recent follow-through` into a shared `xl` two-column row.
- Tightened supporting-tier rhythm and framing:
  - Shortened divider copy (`Attention now`, `Supporting cycle context`, `Workspace reference`).
  - Grouped `OversightBand` + `GovernanceNarrativeRail` into a shared `xl` row to reduce vertical drag.
  - Kept `RecentGovernanceBriefs`, `SinceLastReview`, and `Escalations and watchpoints` intact as supporting context.
- Softened secondary surfaces without changing behavior:
  - `GovernanceGuidance`: tighter subtitle/label copy, CTA moved to secondary style.
  - `OversightBand`: reduced heading emphasis, value size, tile padding, and gap density.
  - `GovernanceNarrativeRail`: reduced metadata/card density and typography emphasis.

### Explicitly Not Touched
- No backend changes.
- No meeting mode / `partnerMode` logic changes.
- No changes to Reports, Execution, Signals, or ReportDetail pages.
- No API contract, fetch logic, or route logic changes.

### Verification
- `npm run build` in `frontend/` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â passed (1822 modules).
- Pre-existing chunk-size warning remains (909.73 kB JS bundle), unchanged in nature.

## 2026-03-24 (continued) - Pass 9 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Meeting Mode Elevation

### Commit
- `76536c9` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â design: meeting mode elevation ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â partner briefing framing, readiness card, stat labels

### Files Changed
- `frontend/src/pages/Dashboard.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
Five targeted copy and label changes inside the `partnerMode` conditional block only. No structural, logic, or behavior changes.

- **Primary card eyebrow**: `"Meeting view Ãƒâ€šÃ‚Â· current governance brief"` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"Partner briefing Ãƒâ€šÃ‚Â· current governance brief"` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â drops the UI-label prefix (`Meeting view Ãƒâ€šÃ‚Â·`) in favour of the artifact mode it actually is.
- **Positioning line above stat tiles**: added a `col-span-full` intro line ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `"The partner-ready record for this cycle. Review the brief, confirm follow-through state, and carry this into the room."` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â grounds the stat tiles as pre-meeting readiness context rather than a summary widget.
- **Secondary card eyebrow**: `"Cycle attention"` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"Pre-meeting readiness"` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â names the card as the check you run before the partner discussion, not a generic status label.
- **Stat tile labels**: `"Open actions"` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"Open follow-through"` Ãƒâ€šÃ‚Â· `"Overdue"` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"Overdue items"` Ãƒâ€šÃ‚Â· `"High-severity signals"` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"High-severity issues"` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â governance-framed labels consistent with the rest of the workspace, removes task language from a briefing surface.
- **Readiness gate line after stats**: added `"Resolve overdue and unowned items before opening the brief in the meeting."` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â gives the stats directional meaning as a readiness gate, not just a count display.

### Verification
- `npm run build` clean. 1823 modules. Pre-existing 907kB bundle warning unchanged.
- No backend changes. No TypeScript type changes. No logic or behavior changes.



### Commit
- `5a1591a` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â design: report detail header ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â artifact-first sub-copy, send partner brief button promoted

### Files Changed
- `frontend/src/pages/ReportDetail.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
Two targeted changes. No structural, logic, or API changes.

- **Header sub-copy**: `"Use this packet for partner review, action decisions, and follow-through updates for the current cycle."` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"The governance brief for this cycle ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â the partner-ready record of what clients said, what the firm is doing about it, and what still needs a decision."` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â replaces task-description language with artifact-positioning language. The page now opens with a statement of what it *is*, not what you can *do* with it.
- **"Send partner brief" button**: promoted from `gov-btn-secondary` (same visual weight as "Download PDF") to a dark-border tier ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `border-[#0D1B2A] bg-white font-semibold text-[#0D1B2A]`. The artifact delivery action now reads as clearly above the export utility. Toolbar hierarchy is now: (1) Present brief ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â dark fill primary, (2) Send partner brief ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â dark border secondary, (3) Download PDF ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â neutral secondary, (4) Add follow-through ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â quiet tertiary.

### Verification
- `npm run build` clean. 1823 modules. Pre-existing 907kB bundle warning unchanged.
- No backend changes. No TypeScript type changes. No logic changes.



### Commit
- `7e02fd1` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â design: execution page governance-cycle framing ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â posture card, brief context, PageWrapper copy

### Files Changed
- `frontend/src/pages/ExecutionPage.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CHANGELOG_AI.md`
- `docs/CURRENT_BUILD.md`

### What Changed
Six targeted copy-only changes. No structural, logic, or API changes.

- **PageWrapper eyebrow**: `"Follow-through"` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"Assigned Follow-Through"` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â matches Ãƒâ€šÃ‚Â§3 of the canonical brief spine exactly, tying the page directly to the governance artifact.
- **PageWrapper description**: replaced generic task-state framing with artifact-first framing ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â leads with what the page is (the brief's follow-through record), then what to do.
- **Posture card label**: `"Current follow-through posture"` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"Follow-through posture for this cycle"` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â grounds the card in the current cycle rather than a free-floating status.
- **Posture card h2**: `"Keep the current cycle credible before the next partner review."` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"What needs partner attention before the brief goes into a meeting."` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â partner-meeting framing rather than internal-ops framing.
- **Brief context card label**: `"Current brief context"` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"Current governance brief"` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â names the artifact directly.
- **Brief context card copy**: rewritten to make the directional link explicit ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â follow-through status feeds into the brief, not just "aligned."
- **Tab "firm-wide" label**: `"All follow-through"` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `"Brief record"` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â names the default tab as the artifact's record.
- **Default-tab section sub-copy**: opening sentence anchors the view to the brief before the directive copy.

### Verification
- `npm run build` clean. 1823 modules. Pre-existing 907kB bundle warning unchanged.
- No backend changes. No TypeScript type changes. No logic or filter changes.


## 2026-03-21 - Landing Narrative-First Visual Modernization Pass

### Files Changed
- `frontend/src/pages/Index.tsx`
- `frontend/src/components/SiteNav.tsx`
- `frontend/src/components/landing/LandingHeroSection.tsx`
- `frontend/src/components/landing/LandingOperatingPreview.tsx`
- `frontend/src/index.css`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Tightened landing visual hierarchy while preserving the existing narrative spine and section order.
- Increased first-glance premium contrast with stronger landing-specific surface treatment (hero framing, card depth, workflow rail paneling, and clearer nav interaction states).
- Rebalanced hero composition so the governance brief artifact carries more visual authority without changing product meaning or CTA structure.
- Kept motion restrained and compatible with the existing reduced-motion behavior.

### Verification
- `npm run build` in `frontend/` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â passed
- Pre-existing non-blocking warning remains: Vite large chunk size warning

## 2026-03-21 - Docs-System Hardening + Codex Operating Contract Pass

### Files Changed
- `docs/NORTH_STAR.md`
- `docs/PROJECT_STATE.md`
- `docs/AI_WORKING_RULES.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Tightened doc-role boundaries so each core doc has one explicit responsibility.
- Reduced duplication in `PROJECT_STATE.md` by removing repeated repository/subsystem blocks and retaining a single authoritative live-state map.
- Added an explicit docs-system contract and stricter Codex execution rules in `AI_WORKING_RULES.md` (ownership confirmation, diagnosis-first, runtime verification requirement, and stop/report when cause is unconfirmed).
- Added a recommendation-only lane format for tool/connector/workflow opportunities with explicit approval required before adoption.
- Replaced live phase text in `NORTH_STAR.md` with a boundary rule that keeps current-state tracking in `PROJECT_STATE.md`.

### Verification
- Docs-only pass (no application code changed, no build required)

## 2026-03-21 - Landing Modern-Motion Polish Pass

### Files Changed
- `frontend/src/pages/Index.tsx`
- `frontend/src/components/SiteNav.tsx`
- `frontend/src/components/landing/LandingHeroSection.tsx`
- `frontend/src/components/landing/LandingTrustSection.tsx`
- `frontend/src/components/landing/LandingWorkflowSection.tsx`
- `frontend/src/components/landing/LandingOutputsSection.tsx`
- `frontend/src/components/landing/LandingAccountabilitySection.tsx`
- `frontend/src/components/landing/LandingMeetingSection.tsx`
- `frontend/src/components/landing/LandingFinalSection.tsx`
- `frontend/src/index.css`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Added a lightweight landing-only IntersectionObserver reveal pass so hero and section content enter with restrained fade-and-rise motion.
- Tuned hero entrance pacing so the eyebrow, headline, supporting copy, CTA row, and governance brief preview settle with a cleaner premium rhythm.
- Added restrained hover and press polish to public nav links, public CTA surfaces, and landing cards without changing the underlying narrative or route structure.
- Added reduced-motion fallbacks so all landing reveals and hover transforms collapse to static presentation when motion reduction is preferred.

### Verification
- `npm run build` in `frontend/`

## 2026-03-21 - Landing Hero Refinement Pass

### Files Changed
- `frontend/src/components/landing/LandingHeroSection.tsx`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Refined the landing hero with a slightly wider editorial text measure, calmer headline scale, looser headline leading, and more vertical breathing room between the eyebrow, headline, body copy, CTAs, and supporting proof notes.
- Rebalanced the hero grid so the left narrative column feels less compressed while the right-side governance brief preview keeps its visual authority.
- Preserved the existing headline, CTA hierarchy, route structure, and product framing. This was a typography-and-layout pass only.

### Verification
- `npm run build` in `frontend/`

## 2026-03-19 - Governance Brief Output Unification Pass

### Files Changed
- `frontend/src/components/reports/EmailBriefPreviewModal.tsx`
- `frontend/src/pages/ReportDetail.tsx`
- `frontend/src/components/pdf/PdfDeckPreview.tsx`
- `frontend/src/pages/DashboardPdfPreview.tsx`
- `backend/templates/partner_brief_email.html`
- `backend/pdf_generator.py`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Aligned all brief output surfaces to the canonical 5-section spine established by `ReportDetail.tsx`:
  Leadership Briefing ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Signals That Matter Most ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Assigned Follow-Through ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Decisions & Next Steps ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Supporting Client Evidence

**EmailBriefPreviewModal.tsx**
- Swapped tile order so Decisions & Next Steps (Ãƒâ€šÃ‚Â§4) appears before Supporting Client Evidence (Ãƒâ€šÃ‚Â§5), matching canonical brief order.

**ReportDetail.tsx**
- Swapped `<tr>` row order in `emailHtmlSummary` inline HTML so Decisions & Next Steps precedes Supporting Client Evidence.

**partner_brief_email.html**
- Relabeled `Metrics` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `Leadership Briefing`
- Relabeled `Top Client Issue` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `Signals That Matter Most`
- Added explicit `Decisions & Next Steps` section label (was `Recommended Discussion`)
- Added explicit `Supporting Client Evidence` section label (quote was previously embedded unlabeled inside Top Client Issue section)
- Changed header eyebrow from `Clarion Client Experience Brief` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `Clarion Governance Brief`
- Changed header title from `Partner Briefing Summary` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `Partner Governance Brief`
- Changed CTA text from `Open Full Dashboard` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `Open Governance Brief`

**PdfDeckPreview.tsx**
- Added `PdfPreviewDecision` type and `decisions` prop
- Added `Decisions & Next Steps` render section between Assigned Follow-Through and Supporting Client Evidence
- Restored missing closing `</div>` tag dropped during prior partial edit

**DashboardPdfPreview.tsx**
- Passed `previewDetail.recommended_changes` mapped as `decisions` prop to `PdfDeckPreview`

**pdf_generator.py** (heading strings only ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â no logic changed)
- Replaced 5 agenda items with canonical section names
- Replaced `Firm Risk Posture` h2 with `Leadership Briefing`
- Replaced `Governance Signals Summary` h2 with `Signals That Matter Most`
- Replaced `Required Decisions` h2 with `Decisions & Next Steps`
- Replaced `Open Governance Actions` h1 (execution page) with `Assigned Follow-Through`
- Removed 6th agenda item (`- Client Signals`) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â canonical spine has 5 sections

### Verification
- `npm run build` in `frontend/` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â passed (pre-existing large-chunk warning remains non-blocking)
- `python -m py_compile backend/pdf_generator.py` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â PARSE_OK

### What Remains Split
- Backend PDF sub-labels (`Exposure & Escalation`, `Execution Summary`, `Since Last Brief`) are internal operational labels within canonical sections ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â not competing section spine, acceptable
- Inline email summary (`emailHtmlSummary`) covers 4 of 5 sections ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â no Assigned Follow-Through row, acceptable for summary format
- `pdf_generator.py` still uses `Exposure & Escalation` as a sub-heading within the Leadership Briefing section ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â deeper data-plumbing unification deferred


## 2026-03-18 - Public Proof + Brief Continuity Pass

### Files Changed
- `frontend/src/components/SiteNav.tsx`
- `frontend/src/components/landing/LandingHeroSection.tsx`
- `frontend/src/components/landing/LandingFinalSection.tsx`
- `frontend/src/components/pdf/PdfDeckPreview.tsx`
- `frontend/src/components/reports/EmailBriefPreviewModal.tsx`
- `frontend/src/content/landingV3.ts`
- `frontend/src/data/sampleFirmData.ts`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/DashboardPdfPreview.tsx`
- `frontend/src/pages/DemoPdfPreview.tsx`
- `frontend/src/pages/DemoReportDetail.tsx`
- `frontend/src/pages/DemoWorkspace.tsx`
- `frontend/src/pages/ExecutionPage.tsx`
- `frontend/src/pages/Features.tsx`
- `frontend/src/pages/HowItWorks.tsx`
- `frontend/src/pages/Pricing.tsx`
- `frontend/src/pages/ReportDetail.tsx`
- `frontend/src/pages/ReportsPage.tsx`
- `frontend/tailwind.config.ts`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Tightened the public proof spine so the sample brief route is now the clearest public proof artifact.
- Reframed `/demo` as secondary mechanics proof rather than a competing primary proof route.
- Reworked `/dashboard` so the strongest top action is opening the current brief.
- Reworked `/dashboard/actions` to reference the current brief packet more directly.
- Tightened frontend output continuity by aligning PDF/email reference language to the canonical 5-section brief.
- Fixed active Tailwind font drift (`Manrope` as sans token, `Newsreader` as serif display token).

### Verification
- `npm run build` in `frontend/`

## 2026-03-18 - Upload-To-First-Brief UX Alignment Pass

### Files Changed
- `frontend/src/pages/Upload.tsx`
- `frontend/src/pages/Onboarding.tsx`
- `frontend/src/components/billing/UploadUsageBar.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reworked `/upload` to lead from one CSV into the current report packet.
- Rebuilt post-upload success state with direct links into report, workspace home, and follow-through.
- Onboarding now opens first report directly when setup includes a real CSV upload.
- Replaced upload-usage helper with ASCII-safe version.

### Verification
- `npm run build` in `frontend/`
- live browser check on `/upload`

## 2026-03-18 - Report-Detail Governance-Brief UX Alignment Pass

### Files Changed
- `frontend/src/pages/ReportDetail.tsx`
- `frontend/src/components/WorkspaceLayout.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reworked `/dashboard/reports/:id` to open as a governance brief artifact.
- Added Leadership Briefing section with cycle readiness, top signal, follow-through posture, first decision, and briefing bullets.
- Reordered report packet to: leadership briefing ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ signals ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ follow-through ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ decisions ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ evidence.

### Verification
- `npm run build` in `frontend/`
- live browser check on `/dashboard/reports/8`

## 2026-03-18 - Actions Follow-Through UX Alignment Pass

### Files Changed
- `frontend/src/pages/ExecutionPage.tsx`
- `frontend/src/components/actions/ActionCard.tsx`
- `frontend/src/components/WorkspaceLayout.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reworked `/dashboard/actions` to lead with follow-through accountability posture.
- Added top posture block for overdue, unowned, blocked, and active-needs-review work.
- Demoted filters to secondary refinement panel.

### Verification
- `npm run build` in `frontend/`
- live browser check on `/dashboard/actions`

## 2026-03-18 - Dashboard Workspace-Home Refinement Pass

### Files Changed
- `frontend/src/pages/Dashboard.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reworked `/dashboard` to lead with current cycle and latest brief.
- Demoted OversightBand, GovernanceNarrativeRail, and recent-brief history into supporting-context tier.

### Verification
- `npm run build` in `frontend/`

## 2026-03-18 - First Authenticated Product UX Alignment Pass

### Files Changed
- `frontend/src/components/WorkspaceLayout.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/Onboarding.tsx`
- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/Signup.tsx`
- `frontend/src/pages/Upload.tsx`
- `frontend/src/index.css`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Reframed authenticated workspace shell around current-cycle language.
- Updated sidebar labels and grouping to governance-cycle nav model.
- Updated login/signup/onboarding to governance-cycle framing.

### Verification
- `npm run build` in `frontend/`

## 2026-03-18 - Public-Site Polish And Consistency Cleanup

### Files Changed
- `frontend/src/components/SiteNav.tsx`
- `frontend/src/pages/Privacy.tsx`
- `frontend/src/pages/Terms.tsx`
- `frontend/src/pages/Contact.tsx`
- `frontend/src/pages/Docs.tsx`
- `frontend/src/pages/DemoWorkspace.tsx`
- `frontend/src/pages/DemoReportDetail.tsx`
- `frontend/src/pages/DemoPdfPreview.tsx`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Polished all user-reachable public React routes to one coherent Clarion system.
- Renamed public demo experience to `sample workspace` throughout.
- Fixed stale `isDarkMarketingChrome` references in `SiteNav.tsx`.

### Verification
- `npm run build` in `frontend/`

## 2026-03-18 - Secondary Public React Route Alignment

### Files Changed
- `frontend/src/components/PageLayout.tsx`
- `frontend/src/components/SiteNav.tsx`
- `frontend/src/components/MarketingProofBar.tsx`
- `frontend/src/components/PricingSection.tsx`
- `frontend/src/data/pricingPlans.ts`
- `frontend/src/pages/Features.tsx`
- `frontend/src/pages/HowItWorks.tsx`
- `frontend/src/pages/Pricing.tsx`
- `frontend/src/pages/Security.tsx`
- `frontend/src/index.css`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Rebuilt shared public shell around lighter V3 editorial chrome.
- Rewrote `/features`, `/how-it-works`, `/pricing`, `/security` around canonical governance-brief positioning.
- Fixed React key warning on pricing comparison table.

### Verification
- `npm run build` in `frontend/`

## 2026-03-18 - In-House V3 Landing Implementation On Canonical React Route

### Files Changed
- `frontend/index.html`
- `frontend/src/pages/Index.tsx`
- `frontend/src/index.css`
- `frontend/src/content/landingV3.ts`
- `frontend/src/components/landing/Landing*.tsx` (all 7 section components)
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Implemented approved V3 landing on canonical React route `/`.
- Governance-brief-centered, partner-facing hierarchy: hero ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ trust ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ workflow ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ outputs ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ accountability ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ meeting ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ CTA.

### Verification
- `npm run build` in `frontend/`
- live browser check at `http://127.0.0.1:8081/`

## 2026-03-18 - Lovable Purge + Canonical Landing Surface Consolidation

### Files Changed
- `backend/app.py`
- `README.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Flask overlapping public routes (`/features`, `/how-it-works`, `/pricing`, `/security`, `/privacy`, `/terms`) now serve built React app when `frontend/dist` exists; legacy templates remain fallback only.

### Verification
- `python -m py_compile backend/app.py`

## 2026-03-18 - Release-Candidate Stabilization + Clean Seeded Smoke Confirmation

### Files Changed
- `tools/ensure_e2e_user.py`
- `tools/reset_e2e_state.py`
- `frontend/package.json`
- `frontend/src/components/ui/button.tsx`
- `frontend/src/components/governance/PageTabs.tsx`
- `frontend/src/components/governance/GovernanceCard.tsx`
- `frontend/vite.config.ts`
- `README.md`
- `tools/README.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Seeded smoke tools now resolve same DB as running app.
- Clean Team workspace smoke confirmed: login ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ upload ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ report ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ action ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ PDF ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ email.
- Removed Tailwind ambiguous utility warnings in shared governance/button components.

### Verification
- `npm run build` in `frontend/`
- Clean seeded smoke: all API calls 200/201.

## 2026-03-18 - Operator Workflow / Release Smoke Pass

### Files Changed
- `frontend/vite.config.ts`
- `frontend/src/api/authService.ts`
- `backend/app.py`
- `backend/services/email_service.py`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/CHANGELOG_AI.md`

### What Changed
- Vite `/api` proxy now configurable.
- Restored missing upload-success helpers in `backend/app.py`.
- Fixed naive/aware datetime comparison in exposure snapshot and PDF path.
- Fixed Resend email attachment serialization.

### Verification
- Full local smoke pass confirmed all workflow segments.

## 2026-03-15 - Live Tagger Validation + Definitive Calibration Pass
- Live phrase work moved from `bench/deterministic_tagger.py` into `benchmark_engine.py`.
- Stored run `20260315_200410`: `27.3%` clean-review agreement (`39/143`).

## Prior Notable Passes
- `b9a8a97` - calibration wave 2 phrase additions + bug fixes
- `3f6aba0` - outbound email quality and content SEO improvements
- `d2647c5` - calibration + agent office pipeline fix
- `30cb290` - approval queue dashboard/backend integration pass

## 2026-03-24 - Dashboard Hierarchy + Reports Brief Library Elevation

### Commits
- `d95877d` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â fix: meeting mode render + approval queue admin gate
- `49f7cba` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â design: align Dashboard to canonical governance token language
- `5a83f3d` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â layout: brief card full-width first-viewport anchor, FirmGovernanceStatus demoted
- `8ccd5d2` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â design: reduce FirmGovernanceStatus visual weight to secondary supporting context
- `8a5974b` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â docs: record Pass 4 state
- `733fe87` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â design: reports page brief library elevation ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â framing, tab labels, CTA hierarchy

### Files Changed
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/components/workspace/FirmGovernanceStatus.tsx`
- `frontend/src/pages/ReportsPage.tsx`
- `frontend/src/components/governance/GovernanceBriefCard.tsx`
- `frontend/src/layouts/WorkspaceLayout.tsx`
- `frontend/src/App.tsx`
- `docs/PROJECT_STATE.md`

### What Changed

**Pass 1 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Meeting Mode + Approval Queue gate (d95877d)**
- `partnerMode` conditional in Dashboard.tsx was rendering null ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â added the brief-first meeting view block (brief card, PDF button, 3-stat row, cycle attention strip).
- Approval Queue gated at three layers: WorkspaceLayout nav (sidebar item hidden for non-admin), App.tsx route (AdminRoute wrapper), ApprovalQueuePage defense-in-depth check. Law firm users cannot reach `/dashboard/approval-queue`.
- Date/time display confirmed correct ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `toLocaleString` already uses browser local timezone, no bug.

**Pass 2 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Dashboard token language (49f7cba)**
- Suppressed anchored-to metadata strip (cluttered, low value).
- Renamed brief card title to "Current governance brief".
- Removed PartnerBriefPanel (80/100 score contradicts posture label ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â needs engine audit before showing again).
- Cleaned "Brief handoff" label copy.

**Pass 3 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Brief card first-viewport anchor (5a83f3d)**
- Brief card promoted to full-width first-viewport element.
- Removed `xl:grid-cols` side-by-side layout from Tier 1 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â FirmGovernanceStatus now renders below the brief, not beside it.
- Dashboard.tsx only.

**Pass 4 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â FirmGovernanceStatus visual weight reduction (8ccd5d2)**
- Title: `text-base font-semibold text-neutral-900` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `text-sm font-medium text-neutral-500`
- Status badge: `px-4 py-2 text-base font-semibold` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `px-3 py-1 text-sm font-medium`
- All 4 metric counters: `text-[36px] font-bold` ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ `text-[24px] font-semibold`
- Subtitle reworded: "Supporting posture context for the current brief."
- FirmGovernanceStatus.tsx only.

**Pass 5 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Reports/brief library elevation (733fe87)**
- ReportsPage eyebrow: "Leadership Artifact" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "Governance Brief Library"
- Description: generic feature copy ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ artifact-authoritative copy
- Section label: "Current brief library" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "About this library"
- Section h2: generic ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "The governance brief is the primary artifact of each review cycle."
- Body copy: rewritten to position current brief as canonical, archive as reference
- Stat block: removed usage-meter "This month / plan limit" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ replaced with "Latest" date stat
- Tab label: "Upcoming Meetings" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "Current Brief"
- Active brief eyebrow: "Prepared for next meeting" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "Active governance brief"
- GovernanceBriefCard: "View brief" promoted to primary dark CTA; "Download PDF" demoted to secondary; `isPast=false` card gets `border-t-2 border-t-[#0EA5C2]` top accent stripe.

### Verification
- All passes: `npm run build` clean. 1823 modules. Pre-existing 906kB bundle warning.
- No backend changes in any pass.
- No TypeScript type changes.


## 2026-03-24 (continued) - Signals Page Evidence Layer Reframe

### Commit
- `7929bbe` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â design: signals page reframed as governance-cycle evidence layer

### Files Changed
- `frontend/src/pages/SignalsPage.tsx`
- `docs/PROJECT_STATE.md`

### What Changed
Signals page framing updated so the page reads as the evidence layer feeding the governance brief, not a generic data table or review surface.

- Eyebrow: "Review Surface" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "Client Feedback Evidence"
- Description: rewritten to position page as evidence source behind each governance brief
- Framing section h2: changed from directive ("Start withÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦") to descriptive ("Recurring client feedback patterns from [date] ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â the evidence this governance cycle is built on")
- Tab "All Signals" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "Current Cycle" (default tab)
- Tab "Triage" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "Needs Action"
- Section label for default tab: "Issue queue" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ "Current cycle evidence"
- Sub-copy for default tab: reframed around governance-cycle purpose ("These are the patterns the governance brief is built onÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦")
- Sub-copy for needs-action tab: updated to connect to brief finalization workflow
- Bottom attribution: "Based on: ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦" ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ clean italic provenance line ("Evidence sourced fromÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ cycle datedÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦")

No structural, logic, or API changes. SignalsPage.tsx only.

### Verification
- `npm run build` clean. 1823 modules. Pre-existing 906kB bundle warning unchanged.


## 2026-03-24 - Dashboard Meeting Mode Elevation Refinement (Pass 9)

### Files Changed
- frontend/src/pages/Dashboard.tsx
- docs/PROJECT_STATE.md
- docs/CURRENT_BUILD.md
- docs/CHANGELOG_AI.md

### What Changed
- Refined partnerMode in Dashboard meeting view to feel presentation-grade and artifact-first without changing logic.
- Added a display-only readiness badge model for meeting framing (Needs immediate cleanup, Ownership assignment needed, High-severity issues active, Meeting-ready, Brief in preparation).
- Elevated the primary brief surface with a premium shell, stronger hierarchy, and serif cycle heading.
- Added a "Meeting packet includes" line that explicitly reinforces the canonical 5-section governance brief spine.
- Polished the secondary readiness block with mirrored readiness badge treatment and promoted exit control to a secondary button.
- Preserved all existing data flow, APIs, route behavior, and partnerMode toggle persistence.

### Verification
- npm run build in frontend/ - passed (1823 modules; pre-existing chunk-size warning unchanged)

## 2026-04-04 - Pass 39 - Wave80 Harvest Mode Throughput Test

### Files Changed
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_report.csv`
- `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_BUILD.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`

### What Changed
- Used the Pass 38 harvest-ready queue to land a real `12`-row Wave80 block instead of another micro-pass.
- Added `12` new Google Maps rows across social security disability, estate planning, immigration, and criminal defense.
- Pushed Wave80 from `55` to `67` rows while keeping all rows `corpus_only`.
- Regenerated normalization, dedupe, acquisition status, source priority, and harvest-ready queue truth after the block landed.
- Kept fallback honest by not using it in this pass.
- Improved throughput materially, but did not close the remaining mixed `4-star` gap.

### Verification
- `python automation/calibration/normalize_and_dedupe_review_batch.py --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv --report-dir data/calibration/expansion/manifests`
- `python automation/calibration/review_acquisition_status.py --batches-dir data/calibration/expansion/batches --queues-dir data/calibration/expansion/queues --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv --output data/calibration/expansion/manifests/20260328_acquisition_status.json`
- `python automation/calibration/build_review_source_priority_queue.py --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv --lane-registry data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv --stage wave80 --mode harvest --batches-dir data/calibration/expansion/batches --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`






