# Collection Batch Notes

- Batch date: 2026-03-28
- Batch file: `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- Queue file: `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- Holdout file: `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`

## Source mix
- Google Maps: 36
- Trustpilot: 0
- Avvo / Lawyers.com: 19
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
- What went smoothly: Pass 37 re-earned the Google Maps `2-star` fallback threshold inside the pass, stayed disciplined about the narrow fallback cap, and still landed three clean full-text `2-star` rows in social security disability (`TN`), estate planning (`SC`), and criminal defense (`PA`) without touching protected truth.
- What slowed capture down: Google Maps `2-star` surfacing remained the blocker. The same-pass dead lanes documented here were Immigration Lawyer Robert West (`NV`), Philip J. Fulton Law Office (`OH`), Manring & Farrell (`OH`), Disability Helpers LLC (`IL`), New Frontier Immigration Law (`AZ`), Access Disability, LLC (`MO`), Eric Palacios & Associates Ltd (`NV`), and Velasquez Immigration Law Group (`NV`). After those failures, fallback was earned again, but the max-three-fallback guard meant the pass honestly stopped at three new rows because no new Google Maps `2-star` body surfaced before the fallback budget was exhausted.
- What should change in the next batch: keep Google Maps first, especially in underused disability and estate lanes, but keep treating histogram-without-body, limited-view panes, no-review-tab states, and quote-chip mismatches as immediate dead lanes. If a fresh pass re-documents six distinct Google Maps `2-star` surfacing failures, use the narrow fallback rule again, but do not fake a fourth row if Google Maps still refuses to surface a usable `2-star` body.

