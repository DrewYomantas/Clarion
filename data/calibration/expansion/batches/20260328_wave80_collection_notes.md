# Collection Batch Notes

- Batch date: 2026-03-28
- Batch file: `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- Queue file: `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- Holdout file: `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`

## Source mix
- Google Maps: 36
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
- Any rows marked audit-only immediately: none; all fifty-five rows remain `corpus_only`.
- Any rows that should never drive benchmark truth: the controlled Avvo mixed `4-star` fallback rows, the new 2026-04-04 Google Maps intake rows from Pass 35, the controlled Avvo / Lawyers.com `2-star` fallback rows captured in Pass 36, and the controlled Lawyers.com `2-star` fallback rows captured in Pass 37 should stay out of benchmark pressure until a later Wave80 triage pass.

## Operator notes
- What went smoothly: Pass 38 converted the recent Google Maps surfacing truth into a persistent lane registry and a harvest-ready queue. The repo now separates qualification from harvesting instead of forcing every small scout pass to redo full Wave80 truth-sync work.
- What slowed capture down: recent passes kept rediscovering the same Google Maps `2-star` failures. Those dead lanes are now parked in `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv` instead of being re-proved from scratch.
- What should change in the next batch: run small qualification passes only to classify new lanes or deliberate rechecks, update the lane registry, and stop there. Run full harvest passes only after there is a `10` to `15` row plan ready in `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`, with viable Google Maps lanes first and fallback lanes only after the live pass honestly earns them.

