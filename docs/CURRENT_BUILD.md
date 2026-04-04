# Current Build

Latest completed milestone: `2026-04-03 - Wave80 Google Maps-First Growth Pass`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- added `12` real Wave80 rows and grew the live batch from `28` to `40`
- kept Google Maps first with `10/12` new rows from Google Maps and used controlled Avvo only for the two mixed `4-star` recovery slots
- widened capture into six new states: `AZ`, `NV`, `OH`, `VA`, `FL`, and `PA`
- deepened immigration, disability, estate-planning, and criminal-defense evidence without reopening benchmark pressure
- hit the mixed `4-star` dead-lane rule on Google Maps in `NV`, `OH`, and `FL`, then used controlled Avvo gap-fill for the remaining `4-star` slice
- normalized and deduped the updated Wave80 batch with `0` exact duplicate groups and `0` likely duplicate pairs
- kept all `40` Wave80 rows `corpus_only`

Verification:
- canonical rerun: `data/calibration/runs/20260328_lowstar_boundary_cleanup_canonical_rerun/`
- broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- dedupe summary: `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- acquisition status: `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- source priority queue: `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- Wave80 live truth: `40` captured rows, `28` `google_maps`, `12` `avvo`, all `corpus_only`
- Wave80 star mix: `1-star 14`, `2-star 5`, `4-star 9`, `5-star 12`
- Wave80 state coverage: `17` states with new live additions in `AZ`, `NV`, `OH`, `VA`, `FL`, and `PA`

Current next pass:
- keep working from `docs/REVIEW_ACQUISITION_WAVE80.md`
- stay Google Maps-first
- keep pushing honest `2-star` growth from new-state Google Maps lanes
- use controlled Avvo / Lawyers.com gap-fill for mixed `4-star` only after three Google Maps dead lanes in the same pass
- keep all Wave80 intake rows `corpus_only` until a later triage pass

Read `PROJECT_STATE.md`.
