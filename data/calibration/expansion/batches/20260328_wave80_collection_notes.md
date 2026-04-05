# Collection Batch Notes

- Batch date: 2026-03-28
- Batch file: `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- Queue file: `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- Holdout file: `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`

## Source mix
- Google Maps: 48
- Trustpilot: 0
- Avvo: 13
- Lawyers.com: 6
- Other: 0

## Wave80 targets
- total reviews: 80
- 1-star: 25
- 2-star: 20
- mixed 4-star: 15
- explicit positive outcome: 15
- explicit positive trust: 15
- long-form: 20
- states covered: 6
- practice-area buckets covered: 5
- holdouts: 20
- reviewed benchmark candidates: 30

## Dedupe notes
- Exact duplicates found: 0
- Likely same-source duplicates found: 0
- Cross-platform duplicates found: 0

## Batch caveats
- Any rows with thin metadata: none in the current batch; every row has rating, source URL, state, practice area, collection date, and provenance note.
- Any rows marked audit-only immediately: none; all sixty-seven rows remain `corpus_only`.
- Any rows that should never drive benchmark truth: the controlled Avvo mixed `4-star` fallback rows, the new 2026-04-04 Google Maps intake rows from Passes 35 and 39, the controlled Avvo / Lawyers.com `2-star` fallback rows captured in Pass 36, and the controlled Lawyers.com `2-star` fallback rows captured in Pass 37 should stay out of benchmark pressure until a later Wave80 triage pass.

## Operator notes
- What went smoothly: Pass 39 proved the registry-backed harvest model can land a `12`-row Google Maps block quickly once the parent pass starts from the harvest-ready queue instead of rebuilding lane truth from scratch.
- What slowed capture down: qualifying mixed `4-star` rows still did not surface honestly from the harvested Google Maps lanes, so the pass widened low-star and positive throughput without closing the remaining mixed `4-star` gap.
- What should change in the next batch: keep harvest mode for larger Google Maps blocks, but use the next qualification work narrowly on unresolved mixed `4-star` and `2-star` gaps so the next harvest does not spend another pass mostly deepening already-proven one-star and five-star lanes.

