# Current Build

Latest completed milestone: `2026-04-05 - Pass 40 - Wave80 Mixed 4-Star Recovery Under Harvest Mode`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- closed the `mixed_4_star` target at `15/15` using controlled Avvo fallback after three confirmed dead Google Maps lanes (Anchor VA, New Frontier AZ, Fulton OH) and one qualification dead lane (Lowe OK)
- added `2` new Avvo mixed-4-star rows: Turner TN criminal defense (communication_responsiveness caveat) and Benson WA estate planning (communication_style_friction)
- pushed Wave80 from `67` to `69` rows while keeping every row `corpus_only`
- updated lane registry with `4` new dead_google_maps entries and `2` new fallback_eligible entries
- regenerated normalization, dedupe, acquisition status, and source priority queue truth

Verification:
- canonical rerun: `data/calibration/runs/20260328_lowstar_boundary_cleanup_canonical_rerun/`
- broad comparator: `data/calibration/runs/20260328_lowstar_boundary_cleanup_broad_rerun/`
- dedupe summary: `data/calibration/expansion/manifests/20260328_wave80_real_review_batch_dedupe_summary.json`
- acquisition status: `data/calibration/expansion/manifests/20260328_acquisition_status.json`
- source priority queue: `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- harvest-ready queue: `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`
- lane registry: `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
- Wave80 live truth: `69` captured rows, `48` `google_maps`, `15` `avvo`, `6` `lawyers_com`, all `corpus_only`
- Wave80 star mix: `1-star 25`, `2-star 12`, `4-star 12`, `5-star 20`
- Wave80 state coverage: `23` states

Current next pass:
- keep working from `docs/REVIEW_ACQUISITION_WAVE80.md`
- `mixed_4_star` is closed — do not reopen
- run the next harvest narrowly targeting the `2-star` gap (`17/20`, `3` short)
- stay Google Maps-first; use controlled fallback only after six fresh Google Maps `2-star` surfacing failures
- keep all Wave80 intake rows `corpus_only` until a later triage pass

Read `PROJECT_STATE.md`.

