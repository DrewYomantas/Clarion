# Current Build

Latest completed milestone: `2026-04-04 - Pass 37 - Wave80 2-Star Expansion Under Earned Fallback Rule`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- documented eight same-pass Google Maps `2-star` surfacing failures in priority practice lanes and re-earned the controlled fallback rule honestly
- added `3` new Wave80 rows and grew the live batch from `52` to `55`
- kept every new row `corpus_only` and preserved the pass as a pure evidence-collection milestone
- landed three full-text `2-star` rows from controlled Lawyers.com fallback across disability, estate planning, and criminal defense
- confirmed that the current bottleneck is still Google Maps surfacing, and the pass honestly stopped short of the `4` to `6` row target band because the max-three-fallback guard was hit before any new Google Maps `2-star` body surfaced
- normalized and deduped the updated Wave80 batch with `0` exact duplicate groups and `0` likely duplicate pairs
- kept all `55` Wave80 rows `corpus_only`

Verification:
- canonical rerun: `data/calibration/runs/20260328_lowstar_boundary_cleanup_canonical_rerun/`
- broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- dedupe summary: `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- acquisition status: `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- source priority queue: `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- Wave80 live truth: `55` captured rows, `36` `google_maps`, `13` `avvo`, `6` `lawyers_com`, all `corpus_only`
- Wave80 star mix: `1-star 18`, `2-star 12`, `4-star 9`, `5-star 16`
- Wave80 state coverage: `23` states; Pass 37 added `TN` and `SC` while deepening `PA`

Current next pass:
- keep working from `docs/REVIEW_ACQUISITION_WAVE80.md`
- stay Google Maps-first
- keep pushing honest `2-star` growth from new-state Google Maps lanes, but trigger controlled Avvo / Lawyers.com `2-star` fallback once six distinct Google Maps surfacing failures are documented in the same pass
- use controlled Avvo / Lawyers.com gap-fill for mixed `4-star` only after three Google Maps dead lanes in the same pass
- document Lowest-sort and quote-chip dead ends quickly when Google Maps shows `2-star` counts but no body, and do not fake a fourth row once the fallback cap is spent
- keep all Wave80 intake rows `corpus_only` until a later triage pass

Read `PROJECT_STATE.md`.

