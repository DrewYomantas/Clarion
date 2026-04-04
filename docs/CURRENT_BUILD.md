# Current Build

Latest completed milestone: `2026-04-04 - Pass 36 - Wave80 2-Star Surfacing Proof + Controlled Fallback`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- documented six distinct Google Maps `2-star` surfacing failures in priority practice lanes and triggered the controlled fallback rule honestly
- added `4` new Wave80 rows and grew the live batch from `48` to `52`
- kept every new row `corpus_only` and preserved the pass as a pure evidence-collection milestone
- landed four full-text `2-star` rows from controlled Avvo / Lawyers.com fallback across immigration, disability, estate planning, and criminal defense
- proved that the current bottleneck is Google Maps surfacing, not lack of visible `2-star` histogram counts in the targeted lanes
- normalized and deduped the updated Wave80 batch with `0` exact duplicate groups and `0` likely duplicate pairs
- kept all `52` Wave80 rows `corpus_only`

Verification:
- canonical rerun: `data/calibration/runs/20260328_lowstar_boundary_cleanup_canonical_rerun/`
- broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- dedupe summary: `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- acquisition status: `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- source priority queue: `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- Wave80 live truth: `52` captured rows, `36` `google_maps`, `13` `avvo`, `3` `lawyers_com`, all `corpus_only`
- Wave80 star mix: `1-star 18`, `2-star 9`, `4-star 9`, `5-star 16`
- Wave80 state coverage: `21` states; Pass 36 increased `MD`, `NY`, and `UT` depth while proving the `2-star` fallback lane

Current next pass:
- keep working from `docs/REVIEW_ACQUISITION_WAVE80.md`
- stay Google Maps-first
- keep pushing honest `2-star` growth from new-state Google Maps lanes, but trigger controlled Avvo / Lawyers.com `2-star` fallback once six distinct Google Maps surfacing failures are documented in the same pass
- use controlled Avvo / Lawyers.com gap-fill for mixed `4-star` only after three Google Maps dead lanes in the same pass
- document Lowest-sort and quote-chip dead ends quickly when Google Maps shows `2-star` counts but no body
- keep all Wave80 intake rows `corpus_only` until a later triage pass

Read `PROJECT_STATE.md`.

