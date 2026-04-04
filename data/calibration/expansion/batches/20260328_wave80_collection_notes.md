# Collection Batch Notes

- Batch date: 2026-03-28
- Batch file: `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- Queue file: `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- Holdout file: `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`

## Source mix
- Google Maps: 28
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
- Any rows marked audit-only immediately: none; all forty rows remain `corpus_only`.
- Any rows that should never drive benchmark truth: the Virginia estate / probate lane rows and the controlled Avvo mixed `4-star` fallback rows should stay out of benchmark pressure until a later Wave80 triage pass.

## Operator notes
- What went smoothly: this pass added twelve real rows, kept Google Maps first with ten Google Maps captures, widened into `AZ`, `NV`, `OH`, `VA`, `FL`, and `PA`, and materially deepened immigration, disability, estate-planning, and criminal-defense evidence without touching protected truth.
- What slowed capture down: Google Maps mixed `4-star` work hit three dead lanes in the same pass at Eric Palacios (`NV`), Philip J. Fulton (`OH`), and Swartz Law Firm (`FL`), where review filters either failed to switch cleanly or surfaced no usable full-text `4-star` body.
- What should change in the next batch: keep Google Maps-first capture for low-star and positive rows, keep pursuing honest `2-star` growth, and use controlled Avvo / Lawyers.com only after three dead Google Maps mixed `4-star` lanes appear in the same pass.
