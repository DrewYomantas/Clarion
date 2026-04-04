# Collection Batch Notes

- Batch date: 2026-03-28
- Batch file: `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- Queue file: `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- Holdout file: `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`

## Source mix
- Google Maps: 36
- Trustpilot: 0
- Avvo / Lawyers.com: 12
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
- Any rows marked audit-only immediately: none; all forty-eight rows remain `corpus_only`.
- Any rows that should never drive benchmark truth: the controlled Avvo mixed `4-star` fallback rows, plus the new 2026-04-04 intake rows captured during the honest `2-star` shortfall pass, should stay out of benchmark pressure until a later Wave80 triage pass.

## Operator notes
- What went smoothly: this pass added eight real Google Maps rows, widened live Wave80 capture into `MD`, `NM`, `UT`, and `OK`, and materially deepened immigration and criminal-defense coverage without touching protected truth.
- What slowed capture down: repeated Google Maps `2-star` lanes in `NV`, `MO`, `TN`, and other underused-state scouting slices either showed zero live `2-star` reviews, kept the page in limited-view mode, or showed `2-star` counts without surfacing any full-text body after Lowest sort and quote-chip attempts.
- What should change in the next batch: keep Google Maps-first capture, keep pushing honest `2-star` growth, prioritize lanes where low-star quote chips or visible `2-star` bodies are already surfaced, and document histogram-plus-Lowest dead ends quickly instead of forcing synthetic balance.
