# Current Build

Latest completed milestone: `2026-04-08 - Pass 52 - Staged Pressure Re-Triage`.

Current product truth:
- canonical benchmark: `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real sanity benchmark: `55.94%` agreement, `80/143` clean reviews, `92` disagreements, `0` AI errors
- readiness: `improved but not demo-safe`

What changed in the latest pass:
- re-triaged the `7` preserved Wave80 staged rows after the filing-delay truth narrowing and replay
- split the staged set into a narrower live shape:
  - promotion shortlist: `ryangarry_noellevitzthum`, `fulton_kellieprenslow`, `newfrontier_vlopez`
  - keep staged pressure: `morgan_elishaurgent`
  - downgrade out of staged pressure: `kowalski_bradcanard`, `matthewlind_wayne`, `edgardgarcia_anonymous`
- preserved `morgan_elishaurgent` as the one remaining expectation-setting seed because it still carries the cleanest intake-promise reversal signal
- removed the more fragmented rows from active staged pressure so future benchmark-facing decisions are driven by a smaller, cleaner set

Verification:
- canonical benchmark truth remains `100.00%` agreement, `22/22` clean reviews, `0` disagreements
- broad 143-real truth remains `55.94%` agreement, `80/143` clean reviews, `92` disagreements
- staged-pressure artifact and Wave80 label queue now reflect the re-triaged dispositions
- `benchmark_canonical_v1.json` remained untouched in this pass
- no engine edits were made in this pass
- no broad rerun, canonical rerun, or promotion attempt were performed in this pass

Current next pass:
- the failed Wave80 promotion experiment remains staged calibration pressure, not active benchmark truth
- filing-delay no longer inflates staged `expectation_setting` pressure; keep expectation work closed on that lane
- the active staged set is now smaller and cleaner, but do not retry promotion yet
- next useful step is one more narrow truth review on the remaining shortlist / mixed trust-outcome boundary before any selective promotion retry
- do not reopen collection, rerun broad, or attempt another fresh promotion before a cleaner repeated family is proven
- see `docs/REVIEW_ACQUISITION_WAVE80.md` for priorities

Read `PROJECT_STATE.md`.
