# Current Build

Latest completed milestone: `2026-04-08 - Pass 54 - Selective Promotion Retry`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- promoted the ready subset of the Wave80 shortlist into active canonical truth:
  - `ryangarry_noellevitzthum`
  - `fulton_kellieprenslow`
- left `newfrontier_vlopez` staged on the shortlist because the remaining `professionalism_trust` pressure is still boundary-sensitive
- reran the authoritative canonical benchmark only and confirmed the expanded active gate stays clean at `24/24`
- synced the canonical benchmark file, staged-pressure artifact, Wave80 label queue notes, and live-state docs to the new selective-retry truth

Verification:
- canonical benchmark truth is now `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real truth remains `55.94%` agreement, `80/143` clean reviews, `92` disagreements and was not rerun in this pass
- staged-pressure artifact and Wave80 label queue now reflect the selective promotion retry outcome
- `benchmark_canonical_v1.json` was updated only to add the two promoted ready rows
- no engine edits were made in this pass
- no broad rerun was performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- filing-delay no longer inflates staged `expectation_setting` pressure; keep expectation work closed on that lane
- the active canonical gate now includes the two clean Wave80 positive rows and remains fully clean
- keep `newfrontier_vlopez` on the shortlist but staged until its remaining trust ambiguity is resolved
- keep `morgan_elishaurgent` staged as the lone expectation-setting seed
- next useful step is a broad `143-real` sanity rerun before any future promotion widening or new engine work
- do not reopen collection or broaden promotion beyond the already accepted ready subset
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
