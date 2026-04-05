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
- Benchmark credibility is still the higher-priority product blocker, but the active repo lane is now Wave80 real-review acquisition execution, not another deterministic-engine tweak pass.

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

**Wave80 real-review acquisition is the active repo priority.**

Recent passes established a real-only canonical benchmark, improved recall on the five target governance themes, cleaned up the stale benchmark route story, ran a disciplined generalization pass, completed a benchmark truth-correction pass to remove disputed gate pressure from the main canonical set, shipped two narrow broad-safe low-star boundary passes, completed a short remaining-cluster audit, finished a benchmark-design review of the remaining sparse disagreement clusters, laid out a concrete real-world review acquisition plan, completed the full Phase 1 acquisition batch, triaged the Phase 1 corpus into protected subsets, ran a narrow human-truth review on the candidate subset to shrink it to a more trustworthy benchmark-prep core, started Wave80 live with the first captured Google Maps block, completed Wave80 Collection Pass 2 with a targeted Avvo gap-fill to cover missing `2-star` and mixed `4-star` slices, completed Wave80 Collection Pass 3 with a Google Maps-first rebalance that doubled Google Maps share in the live Wave80 batch, recovered momentum after the stalled Google Maps mixed `4-star` hunt by adding controlled full-text Avvo mixed `4-star` gap-fill rows, completed a broader Wave80 growth pass that added six new Google Maps rows while widening into Minnesota and Colorado, completed a milestone-scale Google Maps-first growth pass that took the live Wave80 batch to `40` rows while widening into `AZ`, `NV`, `OH`, `VA`, `FL`, and `PA`, completed Pass 35 on `2026-04-04` with an honest Google Maps-first fallback block that pushed Wave80 to `48` rows while documenting that live `2-star` capture still did not honestly surface, completed Pass 36 on `2026-04-04` by proving the Google Maps `2-star` surfacing bottleneck with six documented dead lanes and adding four controlled fallback `2-star` rows across immigration, disability, estate planning, and criminal defense, completed Pass 37 on `2026-04-04` by re-earning that fallback rule inside the pass, adding three more controlled `2-star` rows, and honestly stopping short of the target band when no new Google Maps `2-star` body surfaced before the fallback cap was exhausted, and completed Pass 38 on `2026-04-04` by converting those repeated lane results into a persistent registry-backed qualification and harvest model.

**Current benchmark truth as of 2026-03-28**
- Canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` total disagreements after human-truth correction. `legacy_130` and `exp_turnbull_2` are preserved in the file as `disputed_excluded`, not active gate rows.
- Broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` total disagreements, `0` AI errors, compared against frozen AI truth from the accepted `20260328_final_hardcase_143real_rerun` artifact.
- Honest readiness: `improved but not demo-safe`.

**Why readiness is still not demo-safe**
- The canonical gate is now clean, but the broader `143-real` set is still weak.
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
- Canonical rerun: `data/calibration/runs/20260328_lowstar_boundary_cleanup_canonical_rerun/`
- Broad 143-real comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`

---

## Current Benchmark Findings

### What Improved
- The canonical gate is clean after human-truth correction: `22/22` clean, `0` disagreements.
- The benchmark file now separates stable gate rows from disputed audit rows instead of forcing the engine to satisfy contradictory labels.
- Broad 143-real agreement improved to `55.94%`, with `80/143` clean reviews.
- The latest broad-safe pass cleaned up additional low-star boundary mistakes without breaking the clean canonical gate.
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
- The remaining ambiguity is no longer in the active canonical gate; it now lives in preserved disputed rows like `legacy_130` and `exp_turnbull_2`.
- The remaining broad misses are now mostly sparse, inference-heavy, or one-off boundary cases rather than a clean repeated cluster.
- The current blocker now looks more like benchmark-design and human-truth ambiguity plus insufficient repeated real evidence than another clean deterministic rule gap.

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
   - keep the current calibration wave closed unless new benchmark evidence is added
   - keep Wave80 collection moving
   - use Google Maps as the default capture lane
   - use Avvo / Lawyers.com only as targeted gap-fill when Google Maps does not surface enough clean `2-star` or mixed `4-star` evidence
   - keep all Wave80 intake rows `corpus_only` until a later triage pass
   - treat Phase 1 as complete and protected, not as the live active batch
   - start Wave80 from [REVIEW_ACQUISITION_WAVE80.md](C:/Users/beyon/OneDrive/Desktop/CLARION/law-firm-insights-main/docs/REVIEW_ACQUISITION_WAVE80.md)
   - use [REVIEW_ACQUISITION_SYSTEM.md](C:/Users/beyon/OneDrive/Desktop/CLARION/law-firm-insights-main/docs/REVIEW_ACQUISITION_SYSTEM.md) for the scalable queueing, batch, and status model
   - use an agent-driven model:
     - agents own firm discovery, source-page scouting, queue building, first-pass capture, normalization, and first-pass triage
     - Google Maps remains the premium realism lane, with Trustpilot and Avvo / Lawyers.com used as controlled gap-fill lanes
     - human review stays narrow: spot-checking, duplicate resolution, and benchmark-candidate approval
   - protect the completed Phase 1 subsets:
     - `8` reviewed `benchmark_candidate`
     - `4` `holdout`
     - `5` `audit_only`
     - `7` `corpus_only`
   - do not let disputed audit rows like `legacy_130` or `exp_turnbull_2` drive phrase work without more evidence
   - current live acquisition status:
     - Phase 1 is complete at `24/24`
     - Wave80 is live with `55` captured rows in `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
     - Wave80 source mix is now `google_maps 36`, `avvo 13`, `lawyers_com 6`
     - Wave80 lane registry now records the recent operating truth in `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
     - Wave80 harvest-ready queue now lives in `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`
     - all Wave80 rows remain `corpus_only`
     - no Phase 1 row has been promoted into benchmark truth or canonical truth
   - Wave80 Momentum Recovery established the new mixed `4-star` operating rule:
     - start mixed `4-star` hunts on Google Maps
     - abandon body-less star-only `4-star` rows immediately
     - after three dead Google Maps lanes in one pass, switch mixed `4-star` work to controlled Avvo / Lawyers.com gap-fill
     - keep Google Maps as the premium default lane for low-star and positive capture
   - next live Wave80 pass should use a two-mode operating model:
     - qualification mode:
       - scout new lanes or deliberate rechecks only
       - update the lane registry with `viable_google_maps`, `dead_google_maps`, or `fallback_eligible` truth
       - do not pay full batch-manifest or broad doc-sync overhead for tiny scouting-only results
     - harvest mode:
       - pull first from registry-backed `viable_google_maps` lanes
       - pull second from registry-backed `fallback_eligible` lanes only after the live pass earns fallback honestly
       - treat registry-backed `dead_google_maps` `2-star` lanes as excluded unless there is an explicit reason to recheck them
       - target larger `10` to `15` row capture blocks before running the full normalization / manifest / doc sync

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

