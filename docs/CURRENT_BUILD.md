# Current Build

Latest completed milestone: `2026-04-05 - Pass 42 - Wave80 Triage Prep for Benchmark-Candidate and Holdout Promotion`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- opened Wave80 triage on the full `72`-row Wave80 corpus; no rows added, no text changed
- role assignments: `15` `benchmark_candidate`, `10` `holdout`, `6` `audit_only`, `41` `corpus_only`
- combined dataset (phase1 + wave80): `23` `benchmark_candidate`, `14` `holdout`, `11` `audit_only`, `48` `corpus_only` — all `96` rows accounted for
- Wave80 holdout queue populated with `10` rows for the first time
- benchmark_candidate selection is selective: diverse across `7` practices, `14` states, all `4` star slices; strongest long-form rows per slice; no thin, off-core, or near-duplicate rows
- audit_only flagged: `3` extremely thin rows (6–71 chars), `1` off-core practice (traffic ticket), `1` near-dupe, `1` low-specificity anger language
- batch CSV, label queue, holdout queue, collection notes, batch manifest, acquisition status all updated and in sync

Verification:
- batch/label queue sync: `0` role mismatches
- row count integrity: `72` batch rows, `72` label rows, `10` holdout queue rows
- role distribution confirmed: `benchmark_candidate 15`, `holdout 10`, `audit_only 6`, `corpus_only 41`
- acquisition status updated: combined totals sum to `96` ✓
- no canonical files touched, no benchmark engine touched, no rows added or removed

Current next pass:
- triage is open — `15` Wave80 rows are `benchmark_candidate`
- next useful step: human truth review of the `15` benchmark_candidate rows
- after human truth review, promote clean rows toward the canonical benchmark
- do not run benchmark reruns or engine edits until human truth review passes rows through the promotion gate
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.

