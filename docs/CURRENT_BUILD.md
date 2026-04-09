# Current Build

Latest completed milestone: `2026-04-08 - Pass 50 - Filing-Delay Boundary Truth Review`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- reviewed the staged and corpus filing-delay / submission-delay boundary rows row by row
- narrowed the staged truth so filing-delay stops over-pressuring `expectation_setting`:
  - `edgardgarcia_anonymous` now treats the filing-delay complaint as `timeliness_progress`, not `expectation_setting`
  - `newfrontier_vlopez` now treats the delayed-submission complaint as `timeliness_progress`, not `expectation_setting`
- left active canonical truth unchanged because `legacy_106` still carries a real `expectation_setting` complaint on unexplained guidance, even though the same row also contains a timeliness complaint
- confirmed filing-delay is not a reusable `expectation_setting` family; it is mostly `timeliness_progress` or mixed boundary truth

Verification:
- canonical benchmark truth remains `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real truth remains `55.94%` agreement, `80/143` clean reviews, `92` disagreements
- staged-pressure artifact remains preserved and now reflects the narrowed filing-delay truth
- the staged artifact and Wave80 label queue now reflect the narrowed filing-delay truth
- no engine edits were made in this pass
- no broad rerun, canonical rerun, or promotion attempt were performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- the filing-delay truth review is now complete; keep `expectation_setting` engine work closed on this lane
- future pressure from these rows should pivot away from `expectation_setting` and stay with cleaner lanes or timeliness-led review
- treat promise-reversal intake language as still too sparse for a narrow engine pass
- keep the broader negative `expectation_setting` and mixed outcome/trust rows staged for now
- do not reopen collection, rerun broad, or attempt another fresh promotion before a different cleaner pressure lane is identified
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
