# Current Build

Latest completed milestone: `2026-04-04 - Pass 38 - Wave80 Efficiency Reset`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- added a persistent lane registry at `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
- backfilled known viable Google Maps lanes, known dead Google Maps `2-star` lanes, and fallback-eligible non-Google `2-star` lanes from Passes `35` to `37`
- updated source-priority generation so harvest mode now ranks `viable_google_maps` first, `fallback_eligible` second, and `dead_google_maps` last as explicit exclusions
- added `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv` so larger harvest passes can pull from a prequalified queue instead of rebuilding live truth from scratch
- kept Wave80 row counts, star mix, source mix, and `corpus_only` status unchanged

Verification:
- canonical rerun: `data/calibration/runs/20260328_lowstar_boundary_cleanup_canonical_rerun/`
- broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- dedupe summary: `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- acquisition status: `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- source priority queue: `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- harvest-ready queue: `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`
- lane registry: `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
- Wave80 live truth: `55` captured rows, `36` `google_maps`, `13` `avvo`, `6` `lawyers_com`, all `corpus_only`
- Wave80 star mix: `1-star 18`, `2-star 12`, `4-star 9`, `5-star 16`
- Wave80 state coverage: `23` states; Pass 37 added `TN` and `SC` while deepening `PA`

Current next pass:
- keep working from `docs/REVIEW_ACQUISITION_WAVE80.md`
- run qualification mode only to classify new lanes or deliberate rechecks and update the lane registry
- run harvest mode only when the harvest-ready queue can support a `10` to `15` row block
- stay Google Maps-first inside harvest mode and use fallback rows only after the live pass honestly earns them
- keep all Wave80 intake rows `corpus_only` until a later triage pass

Read `PROJECT_STATE.md`.

