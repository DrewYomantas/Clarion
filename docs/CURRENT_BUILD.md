# Current Build

Latest completed milestone: `2026-04-09 - Pass 60 - Outcome Satisfaction Family Pass`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `57.34%` agreement, `82/143` clean reviews, `86` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- ran the first wider family-level engine pass on `outcome_satisfaction` only
- added two explicit driver recoveries:
  - `getting my social security disability approved`
  - `my settlement amount suffered`
- kept the pass narrow with false-positive guards for:
  - quoted `approved for` disability language
  - generic `everything went well because of ...` praise
  - service-only `never got proper legal help`, `had to hire another attorney`, `nothing but wasting my time and money`, and `nothing was completed at all` rows
- wrote fresh verification artifacts:
  - `data/calibration/runs/20260409_outcome_satisfaction_family_canonical_rerun/`
  - `data/calibration/runs/20260409_outcome_satisfaction_family_broad_rerun/`
- reduced the broad `outcome_satisfaction` disagreement bucket from `15` to `9` without regressing the canonical gate

Verification:
- benchmark-engine tests now pass at `17 passed`
- canonical benchmark stayed clean at `100.00%` agreement, `24/24` clean reviews, `0` disagreements
- broad 143-real truth improved to `57.34%` agreement, `82/143` clean reviews, `86` disagreements
- `benchmark_canonical_v1.json` remained untouched in this pass
- no promotion widening or benchmark-truth edits were performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- filing-delay no longer inflates staged `expectation_setting` pressure; keep expectation work closed on that lane
- the active canonical gate now includes the two clean Wave80 positive rows and remains fully clean
- keep `newfrontier_vlopez` on the shortlist but staged until its remaining trust ambiguity is resolved
- keep `morgan_elishaurgent` staged as the lone expectation-setting seed
- committed repo truth now matches the documented live benchmark baseline
- the wider `outcome_satisfaction` family pass is now complete and broad improved without canonical regression
- next useful step is a fresh broad disagreement-cluster re-audit; `professionalism_trust` is now the likely next lane, but it should be confirmed against the updated broad rerun before new engine work
- treat `professionalism_trust` as the likely runner-up lane, with `empathy_support` and `timeliness_progress` held as later engine-phrase candidates rather than the immediate design pass
- do not reopen collection or broaden promotion beyond the already accepted ready subset
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
