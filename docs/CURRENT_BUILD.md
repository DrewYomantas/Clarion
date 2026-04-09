# Current Build

Latest completed milestone: `2026-04-08 - Pass 53 - Promotion Shortlist Truth Review`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- truth-reviewed the `3` Wave80 promotion-shortlist rows against their exact text, expected labels, staged replay history, and preserved failed-promotion evidence
- confirmed `ryangarry_noellevitzthum` and `fulton_kellieprenslow` are now genuinely ready for a very selective promotion retry
- kept `newfrontier_vlopez` on the shortlist but marked it not ready because the remaining `professionalism_trust` pressure still depends on a boundary-sensitive fee-error / reliability judgment
- synced the staged-pressure artifact, Wave80 label queue notes, and live-state docs so the shortlist now distinguishes ready rows from the one row that should remain staged

Verification:
- canonical benchmark truth remains `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real truth remains `55.94%` agreement, `80/143` clean reviews, `92` disagreements
- staged-pressure artifact and Wave80 label queue now reflect the shortlist truth review outcome
- `benchmark_canonical_v1.json` remained untouched in this pass
- no engine edits were made in this pass
- no broad rerun, canonical rerun, or promotion attempt were performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- filing-delay no longer inflates staged `expectation_setting` pressure; keep expectation work closed on that lane
- the active staged set is now smaller and cleaner
- next useful step is a very selective promotion retry on the ready subset only: `ryangarry_noellevitzthum` and `fulton_kellieprenslow`
- keep `newfrontier_vlopez` on the shortlist but staged until its remaining trust ambiguity is resolved
- do not reopen collection, rerun broad, or broaden the retry beyond the ready subset
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
