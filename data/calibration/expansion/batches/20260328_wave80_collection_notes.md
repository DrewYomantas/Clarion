# Collection Batch Notes

- Batch date: 2026-03-28
- Batch file: `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- Queue file: `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- Holdout file: `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`

## Source mix
- Google Maps: 36
- Trustpilot: 0
- Avvo / Lawyers.com: 16
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
- Any rows marked audit-only immediately: none; all fifty-two rows remain `corpus_only`.
- Any rows that should never drive benchmark truth: the controlled Avvo mixed `4-star` fallback rows, the new 2026-04-04 Google Maps intake rows from Pass 35, and the controlled Avvo / Lawyers.com `2-star` fallback rows captured in Pass 36 should stay out of benchmark pressure until a later Wave80 triage pass.

## Operator notes
- What went smoothly: Pass 36 resolved the repeated `2-star` bottleneck honestly. Six distinct Google Maps lanes were documented as surfacing failures, the controlled fallback threshold triggered cleanly, and four full-text `2-star` rows landed across immigration, disability, estate planning, and criminal defense without touching protected truth.
- What slowed capture down: even in priority lanes with visible `2-star` counts, Google Maps repeatedly dead-ended at the surfacing layer. The six threshold-triggering failures were Bailey Immigration (`OR`), Fakhoury Global Immigration (`MI`), Mary Ann Romero & Associates (`NM`), Randall Law PLLC (`NC`), Jungle Law (`MO`), and Mark C. Cogan, P.C. (`OR`). Additional fallback candidates were also rejected when their filtered `2-star` rows resolved to the wrong practice slice, including William Niffen (`criminal_defense` on an immigration profile), John Eccher (`discrimination`), Shunte Goss (`family`), and Andrew Burrell (`car_accidents`).
- What should change in the next batch: keep Google Maps first for low-star and positive capture, but when a pass logs six distinct Google Maps `2-star` surfacing failures in priority practice lanes, allow controlled Avvo / Lawyers.com `2-star` fallback immediately for the rest of that pass. Keep documenting histogram-only, limited-view, and Lowest-sort dead ends explicitly instead of padding the batch with unrelated sentiment.

