# Clarion Review Acquisition Phase 1

_Phase 1 is complete. This file is now the closed-phase reference for the first acquisition batch. Use `docs/REVIEW_ACQUISITION_WAVE80.md` for the next live collection stage._

---

## Final Phase 1 Outcome

Phase 1 closed with:
- `24` real reviews captured
- `8` reviewed `benchmark_candidate`
- `4` `holdout`
- `5` `audit_only`
- `7` `corpus_only`

Protected subsets:
- `benchmark_candidate` rows are benchmark-prep evidence, not canonical truth
- `holdout` rows stay reserved for later evaluation and should not be casually relabeled
- `audit_only` rows stay out of rule-driving pressure unless a later truth decision explicitly changes that

Phase 1 did not change:
- `data/calibration/inputs/real_reviews.csv`
- `data/calibration/canonical/benchmark_canonical_v1.json`
- the benchmark engine

---

## Final Batch Truth

Files:
- `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
- `data/calibration/expansion/queues/20260328_phase1_holdout_queue.csv`
- `data/calibration/expansion/batches/20260328_phase1_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_batch_manifest.csv`
- `data/calibration/expansion/manifests/20260328_acquisition_status.json`

Final coverage:
- `1-star`: `7`
- `2-star`: `5`
- mixed `4-star`: `4`
- explicit positive outcome rows: `7`
- explicit positive trust rows: `10`
- long-form rows: `17`
- states: `6`
- practice-area buckets: `5`
- source mix: `11` Trustpilot / `10` Google Maps / `3` Avvo
- dedupe result: `0` exact duplicate groups, `0` likely duplicate pairs

---

## Why Phase 1 Is Closed

Phase 1 proved the acquisition workflow end to end:
- agent-driven discovery and capture worked
- normalization and dedupe worked
- first-pass triage worked
- narrow human-truth review on the candidate subset worked

The next live stage is not "more Phase 1." It is `wave80`.

---

## What Carries Forward

Carry forward these Phase 1 truths:
- the `8` reviewed candidates are protected benchmark-prep evidence
- the `4` holdouts stay reserved
- the `5` audit-only rows stay non-rule-driving
- the `7` corpus-only rows remain usable corpus evidence but not benchmark-prep evidence

Use Phase 1 as:
- a completed seed batch
- a source of reviewed examples
- a baseline for Wave80 coverage planning

Do not use Phase 1 as:
- the live active capture checklist
- a reason to mutate the completed Phase 1 batch instead of opening a new Wave80 batch

---

## Exit Gate Met

Phase 1 exit conditions are complete:
- `24` rows captured
- slice mix satisfied
- metadata complete enough for triage
- dedupe pass complete
- first-pass triage complete
- candidate subset human-truth reviewed

Next live operator doc:
- `docs/REVIEW_ACQUISITION_WAVE80.md`
