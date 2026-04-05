# Current Build

Latest completed milestone: `2026-04-05 - Pass 41 - Wave80 2-Star Closure Under Harvest Mode`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- closed the `2-star` target at `20/20` using 2 Google Maps rows (Apex Disability Law CO, ASH | LAW CO) and 1 controlled Avvo fallback row (Versfeld & Hugo MO immigration) after six documented same-pass Google Maps surfacing failures
- pushed Wave80 from `69` to `72` rows while keeping every row `corpus_only`
- all primary Wave80 count targets are now met: `1-star 25/25 ✓`, `2-star 20/20 ✓`, `mixed_4_star 15/15 ✓`
- updated lane registry with `6` new dead_google_maps entries and `1` new fallback_eligible entry (Versfeld & Hugo MO)
- updated source scout queue, collection notes, batch manifest, and acquisition status
- MO added as new state (24 total); CO deepened from 3 to 5 Wave80 rows

Verification:
- canonical rerun: `data/calibration/runs/20260328_lowstar_boundary_cleanup_canonical_rerun/`
- broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- acquisition status: `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- source priority queue: `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- harvest-ready queue: `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`
- lane registry: `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
- Wave80 live truth: `72` captured rows, `50` `google_maps`, `16` `avvo`, `6` `lawyers_com`, all `corpus_only`
- Wave80 star mix: `1-star 25`, `2-star 15`, `4-star 12`, `5-star 20`
- Wave80 state coverage: `24` states

Current next pass:
- keep working from `docs/REVIEW_ACQUISITION_WAVE80.md`
- `2-star` is closed at `20/20` — do not reopen
- `mixed_4_star` is closed at `15/15` — do not reopen
- all primary count targets met — next pass opens Wave80 triage
- triage pass: promote rows from `corpus_only` to `benchmark_candidate` and `holdout`
- do not run benchmark reruns or engine edits during triage

Read `PROJECT_STATE.md`.

Read `PROJECT_STATE.md`.

