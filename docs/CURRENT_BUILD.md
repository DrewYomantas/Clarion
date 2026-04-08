# Current Build

Latest completed milestone: `2026-04-08 - Pass 44 - Wave80 Benchmark Promotion + Authoritative Rerun`.

Current product truth:
- canonical benchmark: `75.86%` agreement, `22/29` clean reviews, `16` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- promoted `7` reviewed Wave80 rows into the active canonical benchmark: `kowalski_bradcanard`, `morgan_elishaurgent`, `matthewlind_wayne`, `edgardgarcia_anonymous`, `newfrontier_vlopez`, `ryangarry_noellevitzthum`, `fulton_kellieprenslow`
- left `5` reviewed Wave80 rows unpromoted: `donstewart_amy`, `ericmark_marie`, `chayet_caw8taw`, `ericpalacios_gabrielrodriguez`, `anchor_ag`
- expanded the active canonical set from `22` to `29` rows and reran the canonical five-theme gate against the promoted truth
- reran the broad frozen `143-real` comparator against the accepted March 28 frozen AI truth
- wrote new run artifacts to `data/calibration/runs/20260408_wave80_promotion_canonical_rerun/` and `data/calibration/runs/20260408_wave80_promotion_broad_rerun/`
- rebuilt acquisition status for integrity; queue-role counts stayed unchanged at `20 benchmark_candidate`, `14 holdout`, `13 audit_only`, `49 corpus_only`

Verification:
- batch/label queue sync: `0` role mismatches
- row count integrity: `72` batch rows, `72` label rows, `10` holdout queue rows
- canonical rerun: `75.86%` agreement, `22/29` clean reviews, `16` disagreements
- broad 143-real rerun: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- no engine files were edited in this pass

Current next pass:
- promotion review is complete for the strongest reviewed Wave80 rows
- next useful step: inspect the `7` newly promoted canonical misses and decide whether a narrow engine pass is warranted
- do not reopen collection before that benchmark-facing diagnosis
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
