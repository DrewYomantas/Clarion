# Current Build

Latest completed milestone: `2026-04-08 - Pass 55 - Broad Sanity Checkpoint`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- reran the broad frozen `143-real` sanity comparator after the selective `2`-row Wave80 promotion
- confirmed the current live engine holds broad performance exactly flat:
  - `55.94%` agreement
  - `80/143` clean reviews
  - `92` disagreements
- wrote fresh broad rerun artifacts for this checkpoint without touching the active canonical gate
- synced live-state docs to the post-promotion broad-checkpoint truth

Verification:
- canonical benchmark truth is now `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real truth reran and stayed flat at `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- new broad rerun artifacts exist at `data/calibration/runs/20260408_wave80_selective_promotion_broad_rerun/`
- `benchmark_canonical_v1.json` remained untouched in this pass
- no engine edits were made in this pass
- no canonical rerun or promotion widening was performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- filing-delay no longer inflates staged `expectation_setting` pressure; keep expectation work closed on that lane
- the active canonical gate now includes the two clean Wave80 positive rows and remains fully clean
- keep `newfrontier_vlopez` on the shortlist but staged until its remaining trust ambiguity is resolved
- keep `morgan_elishaurgent` staged as the lone expectation-setting seed
- the broad sanity checkpoint held flat, so the selective promotion did not create a broad regression
- next useful step is a narrow truth / benchmark-design review on the remaining staged rows before any further promotion widening or new engine work
- do not reopen collection or broaden promotion beyond the already accepted ready subset
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
