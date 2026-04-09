# Clarion Project State

_This file tracks current repo truth. Historical pass detail lives in `CHANGELOG_AI.md`. Product identity lives in `NORTH_STAR.md`. Working rules and protected-system handling live in `AI_WORKING_RULES.md`._

---

## Startup Reads (Every Session)
1. `NORTH_STAR.md`
2. `PROJECT_STATE.md`
3. `AI_WORKING_RULES.md`
4. `ENGINEERING_PRACTICES.md`

---

## Repository & Deployment

- GitHub: https://github.com/DrewYomantas/Clarion
- Live site: https://law-firm-feedback-saas.onrender.com
- Local git remote: confirmed pointed at `DrewYomantas/Clarion`

### Render Truth
- Render may still be on a stale deploy.
- Repo auth/session fixes for the Postgres row bug and single-worker guard exist in repo truth.
- Benchmark credibility is still the higher-priority product blocker, and the active repo lane is now a focused miss-cluster / calibration-design audit on the staged Wave80 pressure rows, not another collection pass.

---

## Repository Structure

- `backend/` - Flask monolith, APIs, services, templates, PDF generation
- `frontend/src/` - React/TypeScript/Vite app
- `Clarion-Agency/` - internal agent office runtime
- `automation/calibration/` - calibration scripts and benchmark workflow
- `data/calibration/` - canonical benchmark, expansion corpus, run artifacts
- `docs/` - current-state and pass-history docs

---

## Current Phase

**A wider outcome_satisfaction engine pass is now the active repo priority.**

Recent passes established a real-only canonical benchmark, improved recall on the five target governance themes, cleaned up the stale benchmark route story, ran a disciplined generalization pass, completed a benchmark truth-correction pass to remove disputed gate pressure from the main canonical set, shipped two narrow broad-safe low-star boundary passes, completed a short remaining-cluster audit, finished a benchmark-design review of the remaining sparse disagreement clusters, laid out a concrete real-world review acquisition plan, completed the full Phase 1 acquisition batch, triaged the Phase 1 corpus into protected subsets, ran a narrow human-truth review on the candidate subset to shrink it to a more trustworthy benchmark-prep core, started Wave80 live with the first captured Google Maps block, completed Wave80 Collection Pass 2 with a targeted Avvo gap-fill to cover missing `2-star` and mixed `4-star` slices, completed Wave80 Collection Pass 3 with a Google Maps-first rebalance that doubled Google Maps share in the live Wave80 batch, recovered momentum after the stalled Google Maps mixed `4-star` hunt by adding controlled full-text Avvo mixed `4-star` gap-fill rows, completed a broader Wave80 growth pass that added six new Google Maps rows while widening into Minnesota and Colorado, completed a milestone-scale Google Maps-first growth pass that took the live Wave80 batch to `40` rows while widening into `AZ`, `NV`, `OH`, `VA`, `FL`, and `PA`, completed Pass 35 on `2026-04-04` with an honest Google Maps-first fallback block that pushed Wave80 to `48` rows while documenting that live `2-star` capture still did not honestly surface, completed Pass 36 on `2026-04-04` by proving the Google Maps `2-star` surfacing bottleneck with six documented dead lanes and adding four controlled fallback `2-star` rows across immigration, disability, estate planning, and criminal defense, completed Pass 37 on `2026-04-04` by re-earning that fallback rule inside the pass, adding three more controlled `2-star` rows, and honestly stopping short of the target band when no new Google Maps `2-star` body surfaced before the fallback cap was exhausted, completed Pass 38 on `2026-04-04` by converting those repeated lane results into a persistent registry-backed qualification and harvest model, completed Pass 39 on `2026-04-04` by using that harvest model to land the first materially larger `12`-row Google Maps-heavy block, completed Pass 40 on `2026-04-05` by closing the `mixed_4_star` gap at `15/15` via controlled Avvo fallback after four confirmed dead Google Maps mixed-4-star lanes, completed Pass 41 on `2026-04-05` by closing the `2-star` gap at `20/20` with two Google Maps rows from Denver CO SSD firms and one controlled Avvo fallback row from Kansas City MO immigration — all primary Wave80 count targets are now met — completed Pass 42 on `2026-04-05` by opening Wave80 triage with `15` `benchmark_candidate`, `10` `holdout`, `6` `audit_only`, and `41` `corpus_only` rows assigned from the `72`-row Wave80 corpus, completed Pass 43 on `2026-04-08` by human-reviewing those `15` Wave80 candidates, keeping `12` as reviewed `benchmark_candidate`, downgrading `2` to `audit_only`, and downgrading `1` to `corpus_only`, completed Pass 44 on `2026-04-08` by promoting `7` reviewed Wave80 rows into canonical truth and rerunning both the canonical five-theme gate and the frozen broad `143-real` comparator without changing the engine, completed Pass 45 on `2026-04-08` by restoring the clean active canonical gate, preserving those `7` rows as staged pressure evidence, and auditing the exposed miss clusters without changing the engine, completed Pass 46 on `2026-04-08` by classifying those staged misses into real rule candidates versus staged-only boundary cases and narrowing the next engine pass to the safest positive phrase cluster plus two trust guards, completed Pass 47 on `2026-04-08` by implementing that narrow positive-cluster recovery pass, adding only the scoped trust guards, and preserving the active canonical gate at `22/22` clean with `0` disagreements, completed Pass 48 on `2026-04-08` by replaying the staged `7`-row Wave80 pressure set against the updated live engine, confirming partial relief in the positive clusters, and deciding to keep the set staged because `expectation_setting` still dominates the remaining pressure, completed Pass 49 on `2026-04-08` by auditing the existing real corpus for repeated expectation-setting evidence, confirming that promise-reversal intake language is still sparse while filing-delay language recurs mostly as a benchmark-design boundary with `timeliness_progress`, completed Pass 50 on `2026-04-08` by reviewing those filing-delay rows row by row, shifting two staged Wave80 rows out of `expectation_setting`, and confirming that this lane should stop driving expectation-setting work, completed Pass 51 on `2026-04-08` by replaying the staged `7` rows again after that truth narrowing and confirming that the remaining pressure is now fragmented across smaller residual clusters rather than one clean repeated lane, completed Pass 52 on `2026-04-08` by re-triaging that staged set into a narrower `3`-row promotion shortlist, `1` remaining staged seed, and `3` downgraded fragmented rows, completed Pass 53 on `2026-04-08` by truth-reviewing the `3`-row shortlist and confirming that `ryangarry_noellevitzthum` and `fulton_kellieprenslow` are ready for a very selective promotion retry while `newfrontier_vlopez` remains shortlisted but not yet trust-stable enough, completed Pass 54 on `2026-04-08` by promoting only that ready subset into active canonical truth and rerunning the canonical five-theme gate without touching the engine, completed Pass 55 on `2026-04-08` by rerunning the frozen broad `143-real` sanity comparator against the post-promotion live engine state and confirming the broad result held exactly flat, completed Pass 56 on `2026-04-08` by auditing the four stubborn broad disagreement clusters as a system and selecting `outcome_satisfaction` as the next best benchmark-design lane, and completed Pass 57 on `2026-04-08` by reviewing the full broad `outcome_satisfaction` disagreement set and confirming that the lane still needs one truth-shaping pass before any wider engine work.

**Current benchmark truth as of 2026-04-08**
- Canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` total disagreements after the selective retry promoted `ryangarry_noellevitzthum` and `fulton_kellieprenslow` into the active gate. `legacy_130` and `exp_turnbull_2` remain preserved in the file as `disputed_excluded`, not active gate rows.
- Broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` total disagreements, `0` AI errors, unchanged by the failed Wave80 promotion experiment.
- The `7` attempted Wave80 promotion rows are preserved outside the active gate in `data/calibration/canonical/wave80_staged_pressure_20260408.json`.
- The narrow positive-cluster recovery pass is now in the live engine, and the active canonical gate stayed clean at `100.00%`, `22/22`, `0` disagreements.
- The staged replay after that engine pass showed partial relief only: `communication_clarity` `1 -> 0`, `communication_responsiveness` `4 -> 2`, `professionalism_trust` `3 -> 2`, `outcome_satisfaction` `3 -> 2`, while `expectation_setting` stayed flat at `5`.
- The corpus audit after that replay found no clean repeated intake-promise lane for `expectation_setting`; the only promising seed remains `morgan_elishaurgent`, while filing-delay rows recur mainly as expectation-vs-`timeliness_progress` boundary cases.
- The filing-delay boundary truth review then narrowed two staged rows — `edgardgarcia_anonymous` and `newfrontier_vlopez` — from `expectation_setting` to `timeliness_progress`, while leaving active canonical truth unchanged because the directly affected canonical row `legacy_106` still carries a real expectation-setting complaint separate from its delay language.
- The fresh staged replay after that narrowing now leaves only `3` staged `expectation_setting` misses, `2` `professionalism_trust` misses, `2` `outcome_satisfaction` misses, and `1` `communication_responsiveness` miss; `ryangarry_noellevitzthum` and `fulton_kellieprenslow` are now clean against staged truth, and `newfrontier_vlopez` is down to one remaining trust miss.
- The staged re-triage after that replay now keeps only `4` rows in the active staged set shape: `3` promotion-shortlist rows (`ryangarry_noellevitzthum`, `fulton_kellieprenslow`, `newfrontier_vlopez`) plus `1` remaining staged expectation-setting seed (`morgan_elishaurgent`), while `kowalski_bradcanard`, `matthewlind_wayne`, and `edgardgarcia_anonymous` were downgraded out of staged pressure.
- The shortlist truth review after that re-triage now marks `ryangarry_noellevitzthum` and `fulton_kellieprenslow` as ready for a very selective promotion retry, while `newfrontier_vlopez` stays on the shortlist but not ready because the remaining `professionalism_trust` pressure is still boundary-sensitive.
- The selective promotion retry then promoted exactly those two ready rows into active canonical truth, and the canonical five-theme gate stayed perfect at `24/24` clean with `0` disagreements.
- The post-promotion broad sanity checkpoint then reran the frozen `143-real` comparator and held exactly flat at `55.94%`, `80/143` clean reviews, and `92` disagreements, so the selective two-row promotion did not create a broad regression.
- The broad disagreement-cluster audit then showed the next best lane is not another micro phrase pass: `outcome_satisfaction` is the clearest large mixed bucket, while `professionalism_trust` is the runner-up and `empathy_support` / `timeliness_progress` look more like later engine phrase lanes than the immediate design pass.
- The broad `outcome_satisfaction` benchmark-design review then showed the lane is real but still mixed: explicit result rows exist, but the current disagreement set also includes recommendation, gratitude, hypothetical-result, and service-only rows that should not drive phrase work yet.
- The truth-shaping follow-up then wrote `data/calibration/canonical/outcome_satisfaction_driver_prep_20260408.json`, preserving a clean four-row future driver shortlist and an explicit rejected-row list so the next pass can be a real wider engine pass without drifting back into praise-like or service-only rows.
- Honest readiness: `improved but not demo-safe`.

**Why readiness is still not demo-safe**
- The active canonical gate is clean again, but the broader `143-real` set is still weak.
- Broad `1-star` performance is still weak.
- `expectation_setting`, `outcome_satisfaction`, and `professionalism_trust` still bleed into each other in low-rating narratives on the broader set.

---

## Canonical Benchmark Truth

### Authoritative Route / Engine Story
- `/internal/benchmark` is the authoritative calibration route.
- `backend/services/benchmark_engine.py` is the live deterministic calibration engine.
- `backend/services/bench/deterministic_tagger.py` is legacy and only reachable through the frozen `/internal/bench` compatibility path when `BENCH_ENABLED=1`.
- `/internal/bench` is not a second live benchmark story. It is a frozen compatibility surface and should not be used for current benchmark claims.

### Canonical Dataset Truth
- Canonical set: `data/calibration/canonical/benchmark_canonical_v1.json`
- Canonical benchmark is real-only and human-audited.
- Expansion corpus stays separate unless records are explicitly promoted.
- Star rating is part of benchmark context and is preserved in analysis.

### Latest Accepted Benchmark Artifacts
- Canonical rerun: `data/calibration/runs/20260408_wave80_gate_restore_canonical_rerun/`
- Broad 143-real comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`

---

## Current Benchmark Findings

### What Improved
- The active canonical gate is restored and clean again at `22/22` with `0` disagreements.
- The benchmark file still separates stable gate rows from disputed audit rows instead of forcing the engine to satisfy contradictory labels.
- The failed Wave80 promotion experiment is preserved as explicit staged pressure instead of being discarded.
- Broad 143-real agreement remains `55.94%`, with `80/143` clean reviews, so the failed promotion experiment did not expose a broad regression.
- Broad target-theme disagreement counts on the accepted broad comparator now sit at:
  - `communication_responsiveness` held at `9`
  - `communication_clarity` held at `8`
  - `expectation_setting` `11 -> 9`
  - `office_staff_experience` `6 -> 4`
  - `professionalism_trust` stayed `15`
  - `outcome_satisfaction` stayed `15`
- Broad `1-star` disagreement rate held at `0.514`, while total `1-star` disagreements dropped from `34` to `32`.

### What Still Fails
- Broad `1-star` review disagreement is still the biggest risk slice.
- Broad `professionalism_trust` remains stubborn at `15` disagreements.
- Broad `outcome_satisfaction` also remains stubborn at `15` disagreements and now looks more benchmark-design-heavy than phrase-heavy.
- The `outcome_satisfaction` lane is now narrowed for the next pass, but the broader frozen comparator still has unresolved trust, empathy, and timeliness buckets outside that lane.
- The staged Wave80 pressure rows no longer justify treating filing-delay as active `expectation_setting` pressure; the remaining expectation lane is narrower and cleaner than the original staged replay count suggested.
- The negative `expectation_setting` slice is still not one clean rule family; promise-reversal intake language is sparse, while filing-delay language now sits explicitly under `timeliness_progress` or boundary truth instead of expectation pressure.
- The two staged trust false positives from bare positive `reliable` and bare positive `professional` now have narrow live guards.
- The remaining ambiguity is no longer in the active canonical gate; it now lives in preserved disputed rows like `legacy_130` and `exp_turnbull_2`, plus the newly staged Wave80 pressure rows.
- The remaining broad misses are now mostly sparse, inference-heavy, or one-off boundary cases rather than a clean repeated cluster.
- The current blocker is no longer whether the ready Wave80 positives can enter active truth; it is whether broad `outcome_satisfaction` truth is too loose and boundary-heavy to support the next larger engine pass safely.

### Current Boundary Problem
- low-star phone/intake edge cases that still split across responsiveness, office staff, clarity, and expectation
- the hardest remaining misses now look more bespoke than repeated
- `expectation_setting` vs `outcome_satisfaction`
- `professionalism_trust` vs `outcome_satisfaction` in low-star narratives
- broader low-star narrative interpretation in the frozen `143-real` sanity set
- recommendation / praise inference in positive `professionalism_trust` and `outcome_satisfaction`

---

## Active / Next Passes

### Closed Milestones
1. Canonical benchmark unification - complete.
2. Recall recovery on the five target governance themes - complete.
3. Canonical generalization pass - complete.
4. Engine boundary cleanup + docs truth sync - complete.

### Current Next Pass
5. Honest next move:
   - latest completed milestone is Pass 58 (`2026-04-08`)
   - keep collection closed; the active canonical gate restoration is complete
   - treat Phase 1 as complete and protected, not as the live active batch
   - use [REVIEW_ACQUISITION_WAVE80.md](C:/Users/beyon/OneDrive/Desktop/CLARION/law-firm-insights-main/docs/REVIEW_ACQUISITION_WAVE80.md) plus `data/calibration/canonical/wave80_staged_pressure_20260408.json` as the source of truth for the staged Wave80 pressure set
   - use [REVIEW_ACQUISITION_SYSTEM.md](C:/Users/beyon/OneDrive/Desktop/CLARION/law-firm-insights-main/docs/REVIEW_ACQUISITION_SYSTEM.md) for the scalable queueing, batch, and status model
   - use an agent-driven model where agents own capture + triage prep and human review stays narrow
   - protect the completed Phase 1 subsets:
     - `8` reviewed `benchmark_candidate`
     - `4` `holdout`
     - `5` `audit_only`
     - `7` `corpus_only`
   - do not let disputed audit rows like `legacy_130` or `exp_turnbull_2` drive phrase work without more evidence
   - current live acquisition status:
     - Phase 1 is complete at `24/24`
     - Wave80 is live with `72` captured rows in `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
     - Wave80 source mix is now `google_maps 48`, `avvo 13`, `lawyers_com 6`
     - Wave80 lane registry now records the recent operating truth in `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
     - Wave80 harvest-ready queue now lives in `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`
     - Wave80 live role split is `12 benchmark_candidate`, `10 holdout`, `8 audit_only`, `42 corpus_only`
     - combined totals are `20 benchmark_candidate`, `14 holdout`, `13 audit_only`, `49 corpus_only`
     - the failed `7`-row Wave80 promotion experiment is preserved outside the active gate in `data/calibration/canonical/wave80_staged_pressure_20260408.json`
     - `5` reviewed Wave80 rows remain unpromoted
   - the staged-only replay is complete and the filing-delay truth review is complete
   - a fresh replay after that narrowing is also complete, and the staged set is now re-triaged into:
     - `3` promotion-shortlist rows
     - `1` keep-staged-pressure row
     - `3` downgraded-out rows
   - the shortlist truth review is complete and the selective promotion retry is complete:
     - promoted into active canonical truth: `ryangarry_noellevitzthum`, `fulton_kellieprenslow`
     - keep on shortlist but not ready: `newfrontier_vlopez`
   - the broad `143-real` sanity checkpoint is complete and held flat
   - the broad disagreement-cluster audit is also complete:
     - `outcome_satisfaction` is the next best benchmark-design lane
     - `professionalism_trust` is the runner-up
     - `empathy_support` and `timeliness_progress` are better treated as later engine-phrase lanes
   - the broad `outcome_satisfaction` benchmark-design review is also complete:
     - explicit result rows exist and are usable future engine pressure
     - recommendation, gratitude, hypothetical-result, and service-only rows still contaminate the lane
   - the truth-shaping follow-up is also complete:
     - clean future drivers now live in `data/calibration/canonical/outcome_satisfaction_driver_prep_20260408.json`
     - recommendation, gratitude, hypothetical-result, and service-only rows are explicitly preserved there as non-drivers
   - next useful step is one wider multi-row `outcome_satisfaction` engine pass using only that prepared driver set, with tests plus canonical rerun plus broad rerun in the same pass
   - keep promise-reversal intake language staged through `morgan_elishaurgent` until more repeated real evidence exists
   - keep `newfrontier_vlopez` staged on the shortlist until its trust ambiguity is resolved
   - keep the downgraded fragmented rows out of active staged pressure unless a later benchmark-design pass reopens them deliberately

### Later
6. Deployed launch-truth pass on Render after benchmark credibility improves further.
7. Setup-dependent delivery proof.
8. Domain cutover to `clarion.co`.
9. Agent Office audit.
10. Frontend bundle/code-splitting work.

---

## Locked Architecture Truths

- Live deterministic calibration engine: `backend/services/benchmark_engine.py`
- Frozen legacy compatibility path: `backend/routes/bench_routes.py`
- Authoritative benchmark route: `/internal/benchmark`
- Canonical benchmark file: `data/calibration/canonical/benchmark_canonical_v1.json`
- Broad sanity set: `data/calibration/inputs/real_reviews.csv`
- Stack: Flask monolith backend + React/TypeScript/Vite frontend
- Data layer: SQLite locally with Postgres compatibility scaffolding for production

---

## Operator Smoke State

- Local seeded product smoke remains historically confirmed.
- Current product blocker is not basic workspace flow comprehension.
- Current blocker is benchmark credibility plus the need for more repeated real-world review evidence.

---

## Public Surface State

- `/` - public landing
- `/demo/reports/:id` - sample governance brief proof
- `/demo` - secondary mechanics proof
- `/features`, `/how-it-works`, `/pricing`, `/security`, `/privacy`, `/terms` - React-owned public routes

---

## Domain Cutover Checklist

- [ ] Render custom domain configuration
- [ ] Stripe webhook URL update
- [ ] Resend domain verification
- [ ] Frontend `VITE_API_BASE_URL` update
- [ ] CORS allowed origins update in `backend/app.py`

---

## Last Completed Passes

### 2026-03-28 - Wave80 Preparation Milestone
- Audited the acquisition-lane docs, manifests, queues, and notes for Phase 1 truth drift.
- Marked Phase 1 as closed instead of still-active.
- Synced the repo docs to the actual protected subset counts:
  - `8` reviewed `benchmark_candidate`
  - `4` `holdout`
  - `5` `audit_only`
  - `7` `corpus_only`
- Added a dedicated Wave80 execution doc and fresh Wave80 starter artifacts so the next collection pass starts from new Wave80 files instead of extending the closed Phase 1 batch.
- Corrected the stale Phase 1 batch manifest and notes so they no longer claim triage has not started.
- Verification:
  - label-queue role counts still match acquisition status
  - Phase 1 files remain unchanged as evidence and are now treated as closed-stage artifacts
  - benchmark engine and benchmark truth remained unchanged

### 2026-03-28 - Review Acquisition Candidate Human-Truth Review
- Reviewed the `9` Phase 1 benchmark candidates only.
- Kept `8` as reviewed benchmark candidates and downgraded `1` thin row to `corpus_only`.
- Added expected labels, polarity / severity, evidence spans, and short truth notes into the label queue for the kept set.
- Updated the live batch row roles plus:
  - `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
  - `data/calibration/expansion/queues/20260328_phase1_holdout_queue.csv`
- Kept ambiguous or weak evidence out of rule-driving pressure by downgrading instead of forcing a truth decision.
- Verification:
  - acquisition status snapshot rewritten to `data/calibration/expansion/manifests/20260328_acquisition_status.json`
  - Phase 1 still meets both the intake target and the initial holdout / benchmark-candidate prep target
  - benchmark engine and benchmark truth remained unchanged

### 2026-03-28 - Review Acquisition Capture Start
- Started live row capture from the ranked source queue instead of stopping at scaffolding.
- Seeded `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv` with `11` real Trustpilot rows across:
  - disability / SSI
  - estate planning / probate
  - immigration
  - debt defense
- Preserved raw review text, star ratings, source URLs, collection metadata, provenance notes, and weak-slice tags.
- Synced capture progress into:
  - `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
  - `data/calibration/expansion/scouting/20260328_source_scout_queue.csv`
  - `data/calibration/expansion/queues/20260328_source_priority_queue.csv`
  - `data/calibration/expansion/manifests/20260328_batch_manifest.csv`
  - `data/calibration/expansion/batches/20260328_phase1_collection_notes.md`
- Verification:
  - normalization and dedupe completed cleanly with `0` exact duplicate groups and `0` likely duplicate pairs
  - acquisition status snapshot written to `data/calibration/expansion/manifests/20260328_acquisition_status.json`
  - benchmark engine and benchmark truth remained unchanged

### 2026-03-28 - Review Acquisition Execution Pass
- Turned the acquisition plan into execution-ready repo scaffolding.
- Added:
  - `docs/REVIEW_ACQUISITION_PHASE1.md`
  - `data/calibration/expansion/templates/review_intake_template.csv`
  - `data/calibration/expansion/templates/label_queue_template.csv`
  - `data/calibration/expansion/templates/holdout_queue_template.csv`
  - `data/calibration/expansion/templates/collection_notes_template.md`
  - `data/calibration/expansion/batches/`
  - `data/calibration/expansion/queues/`
- Created dated Phase 1 starter files:
  - `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
  - `data/calibration/expansion/batches/20260328_phase1_collection_notes.md`
  - `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
  - `data/calibration/expansion/queues/20260328_phase1_holdout_queue.csv`
- Locked the first live collection batch to a Phase 1 target of `24` real reviews with explicit low-star, mixed `4-star`, positive outcome, and positive trust quotas.
- Corrected the workflow so Drew is not the firm-discovery bottleneck:
  - agents own discovery, queue building, first-pass capture, normalization, and triage
  - human review is now limited to guardrails, spot-checks, duplicate resolution, and final promotion decisions
- Expanded the scaffolding beyond Phase 1:
  - added automation for source-priority queue generation, batch normalization / dedupe, and acquisition status tracking
  - added coverage matrix, scouting, queue, manifest, and stage-target artifacts
  - added a scalable system doc covering `24 -> 80 -> 160+`
- Verification:
  - no engine edits in this pass
  - no benchmark-truth edits in this pass
  - collection scaffolding now exists on disk and matches `docs/REVIEW_ACQUISITION_PLAN.md`

### 2026-03-28 - Real-World Review Acquisition Planning Pass
- Designed the next evidence-building lane so future benchmark work is driven by more real law-firm reviews instead of squeezing sparse ambiguity rows harder.
- Added a durable working plan in `docs/REVIEW_ACQUISITION_PLAN.md`.
- Locked the recommended acquisition model to:
  - manual-first source selection and benchmark promotion by Drew
  - agent-assisted normalization, weak-slice triage, and dedupe support
  - limited semi-automation only on stable public review pages
- Set the next reopening checkpoint at `80` new real reviews with explicit low-star, mixed `4-star`, positive outcome, and positive trust quotas before another benchmark-design or calibration wave.
- Verification:
  - no engine edits in this pass
  - no benchmark-truth edits in this pass
  - current accepted truth remains `100.00%` canonical and `55.94%` broad on the frozen comparator

### 2026-03-28 - Human-Truth / Benchmark-Design Review Pass
- Audited the remaining sparse disagreement clusters after Pass 18 without attempting another engine edit.
- Reviewed four remaining cluster types:
  - sparse low-star ambiguity rows
  - positive `professionalism_trust` praise / recommendation inference
  - positive `outcome_satisfaction` praise / recommendation inference
  - low-star trust/outcome severity ambiguity
- Conclusion:
  - no additional clean repeated pattern remains for the current calibration wave
  - the main blocker is now benchmark design and human-truth ambiguity, not an obvious deterministic rule gap
  - the wave should stop here unless new benchmark evidence is added or benchmark expectations are revised deliberately
- Verification:
  - no engine edits in this pass
  - accepted benchmark truth remains `100.00%` canonical and `55.94%` broad on the frozen comparator

### 2026-03-28 - Remaining-Cluster Audit Pass
- Audited the unresolved low-star ambiguity rows and the flat `professionalism_trust` / `outcome_satisfaction` buckets before attempting another engine pass.
- Found no additional broad-safe repeated pattern strong enough to justify another rule in the current wave.
- Confirmed the remaining misses are mostly:
  - single-row low-star boundary complaints like the 45-minute intake screening row and the `rudely accused ... over the phone` row
  - recommendation / praise inference in positive `professionalism_trust` and `outcome_satisfaction`
  - sparse severity or boundary ambiguity in low-star narratives
- Verification:
  - no engine edits in this pass
  - current accepted benchmark truth remains `100.00%` canonical and `55.94%` broad on the frozen comparator

### 2026-03-28 - Broad-Safe Low-Star Boundary Cleanup Pass
- Kept the canonical gate clean while improving the frozen broad comparator again.
- Re-routed `always got told that our message was left for our lawyer` away from `office_staff_experience` and into responsiveness behavior.
- Suppressed the neutral `paralegal is assigned to your case` office-staff false positive.
- Suppressed legwork-based `expectation_setting` hits only when stronger nonresponse or nonperformance cues were already present.
- Verification:
  - canonical rerun: `100.00%`, `22/22` clean, `0` disagreements
  - broad rerun: `55.94%`, `80/143` clean, `92` disagreements
  - broad `1-star` disagreement rate held at `0.514`

### 2026-03-28 - Broad-Safe Low-Star Phone/Intake Responsiveness Pass
- Kept the canonical gate clean while improving the frozen broad `143-real` comparator.
- Added one narrow responsiveness miss for prolonged intake hold time.
- Re-routed two explicit phone-intake complaints from `communication_responsiveness` to `office_staff_experience` when the wording clearly targeted intake staff behavior.
- Verification:
  - canonical rerun: `100.00%`, `22/22` clean, `0` disagreements
  - broad rerun: `55.24%`, `79/143` clean, `96` disagreements
  - broad `1-star` disagreement rate: `0.600 -> 0.514`

### 2026-03-28 - Canonical Benchmark Truth-Correction Pass
- Corrected canonical truth for `legacy_057` and `legacy_115`.
- Marked `legacy_130` and `exp_turnbull_2` as `disputed_excluded` so they remain visible for audit but no longer drive the main benchmark gate.
- Verification:
  - canonical rerun: `100.00%`, `22/22` clean, `0` disagreements
  - no engine edits in this pass

### 2026-03-28 - Canonical Generalization Pass
- Improved canonical benchmark to `79.17%`.
- Improved broad 143-real sanity benchmark to `49.65%`.
- Established positive-only canonical slice recovery without broad headline regression.

### 2026-03-28 - Canonical v1 Gap-Closure + Benchmark Story Cleanup
- Improved canonical benchmark to `54.17%`.
- Hard-froze `/internal/bench` as a legacy compatibility path.
- Clarified `/internal/benchmark` as the live authoritative route.
