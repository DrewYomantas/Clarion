# Current Build

Latest completed milestone: `2026-04-04 - Pass 35 - Wave80 Honest 2-Star Growth Pass`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- added `8` real Wave80 rows and grew the live batch from `40` to `48`
- kept the pass fully Google Maps-first and landed all `8/8` new rows from Google Maps
- widened capture into four new states: `MD`, `NM`, `UT`, and `OK`
- deepened immigration and criminal-defense evidence without reopening benchmark pressure
- missed the honest `2-star` target because repeated Google Maps lanes surfaced zero visible `2-star` rows, limited-view review panes, or dead lowest-sort flows with no full-text `2-star` body
- normalized and deduped the updated Wave80 batch with `0` exact duplicate groups and `0` likely duplicate pairs
- kept all `48` Wave80 rows `corpus_only`

Verification:
- canonical rerun: `data/calibration/runs/20260328_lowstar_boundary_cleanup_canonical_rerun/`
- broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- dedupe summary: `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- acquisition status: `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- source priority queue: `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- Wave80 live truth: `48` captured rows, `36` `google_maps`, `12` `avvo`, all `corpus_only`
- Wave80 star mix: `1-star 18`, `2-star 5`, `4-star 9`, `5-star 16`
- Wave80 state coverage: `21` states with new live additions in `MD`, `NM`, `UT`, and `OK`

Current next pass:
- keep working from `docs/REVIEW_ACQUISITION_WAVE80.md`
- stay Google Maps-first
- keep pushing honest `2-star` growth from new-state Google Maps lanes, but only where full-text low-star bodies are visibly surfaced
- use controlled Avvo / Lawyers.com gap-fill for mixed `4-star` only after three Google Maps dead lanes in the same pass
- document Lowest-sort and quote-chip dead ends quickly when Google Maps shows `2-star` counts but no body
- keep all Wave80 intake rows `corpus_only` until a later triage pass

Read `PROJECT_STATE.md`.
