# Current Build

Latest completed milestone: `2026-04-08 - Pass 43 - Wave80 Benchmark-Candidate Human Truth Review`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- reviewed the `15` Wave80 `benchmark_candidate` rows only; no rows added; no row text, ratings, or provenance changed
- kept `12` Wave80 rows as reviewed `benchmark_candidate`
- downgraded `2` rows to `audit_only`: `michaeltroiano_stephanie`, `stamm_anonymous`
- downgraded `1` row to `corpus_only`: `jenniferjamison_derek`
- added reviewed expected labels, polarity / severity, evidence snippets, and short truth notes for all `15` reviewed rows
- Wave80 live role split is now `12` `benchmark_candidate`, `10` `holdout`, `8` `audit_only`, `42` `corpus_only`
- combined dataset (phase1 + wave80) is now `20` `benchmark_candidate`, `14` `holdout`, `13` `audit_only`, `49` `corpus_only`
- batch CSV, label queue, and acquisition status were updated and kept in sync; holdout queue stayed untouched

Verification:
- batch/label queue sync: `0` role mismatches
- row count integrity: `72` batch rows, `72` label rows, `10` holdout queue rows
- reviewed subset integrity: `15` rows reviewed = `12` kept + `2` downgraded to `audit_only` + `1` downgraded to `corpus_only`
- acquisition status updated: combined totals sum to `96` and reviewed benchmark_candidate count is now `20`
- no canonical files touched, no benchmark engine touched, no benchmark reruns run

Current next pass:
- human truth review is complete for the Wave80 candidate subset
- next useful step: decide which of the `12` reviewed Wave80 `benchmark_candidate` rows are clean enough for benchmark-promotion prep
- do not run benchmark reruns or engine edits until promotion decisions are made
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
