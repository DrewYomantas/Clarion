# Current Build

Latest completed milestone: `2026-04-04 - Pass 39 - Wave80 Harvest Mode Throughput Test`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- used the Pass 38 harvest-ready queue to land a materially larger `12`-row real Google Maps block instead of another micro-pass
- pushed Wave80 from `55` to `67` rows while keeping every new row `corpus_only`
- deepened Google Maps-first immigration, disability, estate-planning, and criminal-defense coverage without re-proving registry-backed dead `2-star` lanes
- regenerated normalization, dedupe, acquisition status, source priority, and harvest-ready queue truth after the larger batch landed
- honestly improved throughput while still missing the mixed `4-star` recovery target; Wave80 now needs a narrower mixed `4-star` pass, not another general harvest sweep

Verification:
- canonical rerun: `data/calibration/runs/20260328_lowstar_boundary_cleanup_canonical_rerun/`
- broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- dedupe summary: `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- acquisition status: `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- source priority queue: `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- harvest-ready queue: `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`
- lane registry: `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
- Wave80 live truth: `67` captured rows, `48` `google_maps`, `13` `avvo`, `6` `lawyers_com`, all `corpus_only`
- Wave80 star mix: `1-star 25`, `2-star 12`, `4-star 10`, `5-star 20`
- Wave80 state coverage: `23` states; Pass 39 deepened `AZ`, `OH`, `VA`, `MD`, `NM`, and `UT`

Current next pass:
- keep working from `docs/REVIEW_ACQUISITION_WAVE80.md`
- keep qualification mode narrow and only use it to classify mixed `4-star` recovery lanes or deliberate rechecks
- run the next harvest from the refreshed queue, but bias it toward unresolved `2-star` and mixed `4-star` gaps instead of general one-star / five-star growth
- stay Google Maps-first inside harvest mode and use fallback rows only after the live pass honestly earns them
- keep all Wave80 intake rows `corpus_only` until a later triage pass

Read `PROJECT_STATE.md`.

