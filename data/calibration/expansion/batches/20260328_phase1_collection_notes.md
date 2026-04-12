# Collection Batch Notes

- Batch date: 2026-03-28
- Batch file: `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
- Queue file: `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
- Holdout file: `data/calibration/expansion/queues/20260328_phase1_holdout_queue.csv`

## Source mix
- Google Maps: 10
- Trustpilot: 11
- Avvo / Lawyers.com: 3
- Other:

## Phase 1 target
- total reviews: 24
- 1-star: 7
- 2-star: 5
- mixed 4-star: 4
- explicit positive outcome: 4
- explicit positive trust: 4
- long-form: 8
- states covered: 3
- practice-area buckets covered: 3
- max source share: 70%

## Dedupe notes
- Exact duplicates found: 0
- Likely same-source duplicates found: 0
- Cross-platform duplicates found: 0

## Batch caveats
- Any rows with thin metadata:
- Phase 1 intake, triage, and narrow candidate review are complete.
- Protected subset counts now sit at `8` reviewed `benchmark_candidate`, `4` `holdout`, `5` `audit_only`, and `7` `corpus_only`.
- The final batch is still slightly Trustpilot-led, but it stays under the `70%` single-source cap and is no longer missing the low-star or mixed `4-star` quotas.
- Any rows marked audit-only immediately:
- Any rows that should never drive benchmark truth: no Phase 1 row has been promoted into benchmark truth or canonical truth.

## Operator notes
- What went smoothly: Google Maps-first capture closed the remaining 1-star and 2-star gaps, and Avvo worked as a narrow gap-fill for the last mixed `4-star` rows.
- What slowed capture down: Google Maps review extraction is still the slowest part because full review bodies often require sorting, expanding, and manual transcription one row at a time.
- What should change in the next batch: Leave Phase 1 closed and start Wave80 from a new dated batch, scout queue, and source-priority queue rather than extending this file.

## Current progress snapshot
- total reviews: 24 / 24
- 1-star: 7 / 7
- 2-star: 5 / 5
- mixed 4-star: 4 / 4
- explicit positive outcome: 7 / 4
- explicit positive trust: 10 / 4
- long-form: 11 / 8
- states covered: 6 / 3 (`FL`, `CA`, `WI`, `AZ`, `TX`, `OH`)
- practice-area buckets covered: 5 / 3 (`disability_ssi`, `estate_planning`, `immigration`, `debt_defense`, `family_law`)

## Final triage snapshot
- reviewed `benchmark_candidate`: 8
- `holdout`: 4
- `audit_only`: 5
- `corpus_only`: 7
