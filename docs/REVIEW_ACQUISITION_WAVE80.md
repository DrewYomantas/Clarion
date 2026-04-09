# Clarion Review Acquisition Wave80

_Live execution doc for the next real collection stage. Wave80 is the first serious reopening checkpoint after the completed Phase 1 seed batch._

---

## Wave80 Goal

Reach an `80`-review acquisition state with enough repeated real evidence to reopen benchmark-design work honestly.

Wave80 target:
- `80` total real reviews
- `25` `1-star`
- `20` `2-star`
- `15` mixed `4-star`
- `15` explicit positive outcome rows
- `15` explicit positive trust / professionalism rows
- `20` long-form rows
- `6` states
- `5` practice-area buckets
- `20` holdouts
- `30` reviewed benchmark candidates

Wave80 starts from the completed Phase 1 corpus and grows with new dated Wave80 artifacts. Do not keep extending the Phase 1 batch as if it were still active.

---

## Protected Inputs

Keep these protected from casual benchmark pressure:
- `8` reviewed `benchmark_candidate` rows from Phase 1
- `4` `holdout` rows from Phase 1
- `5` `audit_only` rows from Phase 1

These rows can inform later benchmark-design work, but none of them should be promoted into canonical truth during Wave80 collection passes.

---

## Live Wave80 Files

Start from these files:
- `data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_lane_registry.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_harvest_ready_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`

---

## First Collection Priorities

Start Wave80 by collecting:
1. more `1-star` and `2-star` rows
2. Google Maps first
3. mixed `4-star` rows with one concrete governance complaint
4. explicit positive outcome rows
5. explicit positive trust / professionalism rows stronger than generic praise

Bias first capture toward:
- `communication_responsiveness`
- `communication_clarity`
- `expectation_setting`
- `professionalism_trust`
- `outcome_satisfaction`

Especially where:
- low-star reviews show boundary overlap
- positive reviews use explicit result language
- positive reviews use explicit trust language stronger than recommendation alone

---

## Operator Workflow

Agents own:
- discovery
- source-page scouting
- source-priority queue generation
- first-pass capture
- normalization
- dedupe suggestions
- first-pass triage prep

Human review stays narrow:
- spot-check source faithfulness
- resolve duplicate conflicts
- approve benchmark-candidate promotions
- resolve ambiguity before truth review

---

## Wave80 Operating Modes

### Qualification mode

Use qualification mode when the job is to scout or classify lanes, not to grow the live row count immediately.

Qualification mode rules:
1. scout new Google Maps, Avvo, or Lawyers.com lanes
2. classify each lane into the lane registry as:
   - `viable_google_maps`
   - `dead_google_maps`
   - `fallback_eligible`
3. record the lane's target slice (`general`, `2_star`, or `mixed_4_star`) and why the status was earned
4. stop after the registry and scout truth is updated
5. do not pay full batch-manifest and broad doc-sync overhead for a tiny scouting-only result

### Harvest mode

Use harvest mode only when the queue can support a real capture block.

Harvest mode rules:
1. build from `20260328_wave80_harvest_ready_queue.csv`
2. take `viable_google_maps` lanes first
3. take `fallback_eligible` lanes second, and only after the live pass honestly earns fallback
4. keep `dead_google_maps` lanes excluded unless the pass has an explicit recheck reason
5. target larger `10` to `15` row blocks before running normalization, manifest refresh, and the full doc sync

---

## Lane Registry Rules

The lane registry is now the persistent truth for repeated lane behavior.

Registry rules:
1. a known dead Google Maps `2-star` lane does not need to be re-proven in every future pass
2. a source can stay `viable_google_maps` for general low-star or positive harvesting even if its dedicated Google Maps `2-star` lane is dead
3. fallback eligibility can persist in the registry once a lane has already produced a source-faithful full-text row after an honestly earned fallback trigger
4. fallback stays narrow:
   - Google Maps remains the premium default lane
   - fallback is still limited to the specific slice that needed it
   - fallback does not turn Avvo or Lawyers.com into the new default

---

## First Pass Checklist

- fill `20260328_wave80_source_scout_queue.csv`
- generate `20260328_wave80_source_priority_queue.csv`
- capture new rows into `20260328_wave80_real_review_batch.csv`
- preserve raw review text, rating, source URL, provenance, and metadata
- run normalization and dedupe
- keep new rows `corpus_only` by default
- prepare later triage only after the first Wave80 capture block exists

Wave80 Collection Pass 1 is complete:
- `4` live scout rows seeded
- `4` ranked source queue rows generated
- `6` real Google Maps rows captured into the Wave80 batch
- all `6` left `corpus_only`
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Wave80 Collection Pass 2 is now complete:
- `6` additional real rows captured
- targeted Avvo gap-fill added the first Wave80 `2-star` rows and the first real mixed `4-star` rows
- Wave80 now covers `WI`, `GA`, `WA`, `TX`, `CA`, and `NY`
- practice-area coverage now includes family law, personal injury, real estate, social security disability, speeding / traffic ticket, and criminal defense
- all `12` rows remain `corpus_only`
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Wave80 Collection Pass 3 is now complete:
- `6` additional real Google Maps rows captured
- Google Maps share improved from `6/12` to `12/18`
- Wave80 added two more real Google Maps `2-star` rows and widened into Illinois disability capture
- all `18` rows remain `corpus_only`
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Wave80 Momentum Recovery is now complete:
- `4` additional real full-text mixed `4-star` rows captured
- controlled Avvo gap-fill added clean mixed `4-star` rows in family law, estate planning, criminal defense, and immigration
- Wave80 now sits at `22` rows with `google_maps 12`, `avvo 10`
- all `22` rows remain `corpus_only`
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Wave80 Growth + Controlled Gap-Fill is now complete:
- `6` additional real Google Maps rows captured
- Wave80 grew from `22` to `28` rows and kept Google Maps as the dominant lane at `18/28`
- new-state capture widened into Minnesota and Colorado
- underrepresented practice coverage deepened in criminal defense and estate planning
- all `28` rows remain `corpus_only`
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Wave80 Google Maps-First Growth Pass is now complete:
- `12` additional real rows captured
- Wave80 grew from `28` to `40` rows and kept Google Maps first at `28/40`
- new-state capture widened into `AZ`, `NV`, `OH`, `VA`, `FL`, and `PA`
- immigration, disability, estate-planning, and criminal-defense coverage all deepened in the live batch
- Google Maps mixed `4-star` work hit three dead lanes in `NV`, `OH`, and `FL`, so the final two `4-star` rows used controlled Avvo gap-fill
- all `40` rows remain `corpus_only`
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Pass 35 - Wave80 Honest 2-Star Growth Pass is now complete:
- `8` additional real Google Maps rows captured
- Wave80 grew from `40` to `48` rows and stayed Google Maps-first at `36/48`
- new-state capture widened into `MD`, `NM`, `UT`, and `OK`
- immigration and criminal-defense coverage deepened materially in the live batch
- the honest `2-star` target was missed because repeated Google Maps lanes in new or underused states showed zero visible `2-star` rows, limited-view review panes, or dead Lowest-sort flows that never surfaced a new full-text `2-star` body
- mixed `4-star` was not pursued in this pass
- all `48` rows remain `corpus_only`
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Pass 36 - Wave80 2-Star Surfacing Proof + Controlled Fallback is now complete:
- `4` additional real full-text `2-star` rows captured
- Wave80 grew from `48` to `52` rows while keeping every row `corpus_only`
- six distinct Google Maps `2-star` lanes in priority practices and new or underused states showed visible `2-star` counts but still failed to surface a usable full-text `2-star` body after Lowest-sort attempts
- the six threshold-triggering dead lanes were `Bailey Immigration (OR)`, `Fakhoury Global Immigration (MI)`, `Mary Ann Romero & Associates (NM)`, `Randall Law PLLC (NC)`, `Jungle Law (MO)`, and `Mark C. Cogan, P.C. (OR)`
- that proof activated a narrow controlled fallback rule and added four full-text `2-star` rows from `Avvo` and `Lawyers.com` across immigration, social security disability, estate planning, and criminal defense
- the pass proved that the current `2-star` bottleneck is Google Maps surfacing, not an absence of visible `2-star` histogram counts in target lanes
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Pass 37 - Wave80 2-Star Expansion Under Earned Fallback Rule is now complete:
- `3` additional real full-text `2-star` rows captured
- Wave80 grew from `52` to `55` rows while keeping every row `corpus_only`
- Google Maps stayed first in the pass logic, but eight same-pass Google Maps `2-star` lanes still failed to surface a usable full-text body: `Immigration Lawyer Robert West (NV)`, `Philip J. Fulton Law Office (OH)`, `Manring & Farrell (OH)`, `Disability Helpers LLC (IL)`, `New Frontier Immigration Law (AZ)`, `Access Disability, LLC (MO)`, `Eric Palacios & Associates Ltd (NV)`, and `Velasquez Immigration Law Group (NV)`
- that same-pass proof re-earned the controlled fallback rule and added three full-text `2-star` rows from `Lawyers.com` across social security disability, estate planning, and criminal defense
- the pass honestly missed the `4` to `6` row target band because the max-three-fallback guard was reached before any new Google Maps `2-star` body surfaced
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Pass 38 - Wave80 Efficiency Reset is now complete:
- `0` new rows were added by design
- Wave80 stayed at `55` rows while keeping every row `corpus_only`
- the pass converted Passes `35` to `37` into a persistent lane registry and a harvest-ready queue
- known dead Google Maps `2-star` lanes became parked registry truth instead of something every future pass has to re-prove
- qualification mode and harvest mode are now split so tiny scouting checks no longer force full Wave80 manifest and doc sync overhead
- normalization and dedupe stayed clean with `0` exact duplicate groups and `0` likely duplicate pairs

Pass 39 - Wave80 Harvest Mode Throughput Test is now complete:
- `12` additional real Google Maps rows captured
- Wave80 grew from `55` to `67` rows and stayed Google Maps-first at `48/67`
- the pass landed a materially larger harvest block than the recent micro-passes and proved the registry-backed harvest model can move faster without lowering evidence quality
- new Google Maps rows deepened `AZ`, `OH`, `VA`, `MD`, `NM`, and `UT` while keeping the pass inside the priority practices
- all `12` new rows remained `corpus_only`
- the pass improved low-star throughput honestly, but it did not solve the remaining mixed `4-star` gap; mixed `4-star` stayed at `10` Wave80 rows and still needs a narrower recovery pass
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs

Pass 40 - Wave80 Mixed 4-Star Recovery Under Harvest Mode is now complete:
- `2` additional real full-text mixed `4-star` rows captured via controlled Avvo fallback
- Wave80 grew from `67` to `69` rows while keeping every row `corpus_only`
- three Google Maps mixed-4-star lanes were dead in this pass: `Anchor Legal Group (VA)`, `New Frontier Immigration Law (AZ)`, `Philip J. Fulton Law Office (OH)` — all rated `4.5`–`4.8` with no full-text 4-star body surfacing after Lowest-sort attempts
- a fourth qualification lane `Lowe Law Offices (OK)` showed eight visible 4-star bodies but all were purely positive one-liners with no concrete governance complaint
- three same-pass dead Google Maps lanes triggered the controlled fallback rule; two Avvo mixed-4-star rows captured: `Jonathan William Turner (TN, criminal defense)` with explicit communication_responsiveness caveat and `Law Offices of Christopher A. Benson, PLLC (WA, estate planning)` with communication_style_friction complaint
- `mixed_4_star` target closed at `15/15` — this gap is now resolved
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs
- remaining open Wave80 gap: `2-star` at `17/20`

Mixed `4-star` recovery rule:
1. start on Google Maps
2. target firms roughly `3.5` to `4.5` overall and sort reviews by `Lowest`
3. capture only full-text `4-star` rows
4. treat body-less star-only `4-star` rows as dead ends immediately
5. after three dead Google Maps lanes in one pass, switch mixed `4-star` work to controlled Avvo / Lawyers.com gap-fill for the rest of that pass
6. keep Google Maps as the premium default for low-star and positive rows even when mixed `4-star` uses gap-fill

Controlled `2-star` fallback rule:
1. scout broadly on Google Maps first
2. prefer firms with a visible `2-star` count and use `Lowest` sort plus quote-chip or expansion controls where available
3. treat histogram-without-body, limited-view panes, no-review-tab states, and Lowest-sort dead ends as explicit surfacing failures
4. after six distinct Google Maps `2-star` surfacing failures in one pass, controlled `Avvo` / `Lawyers.com` fallback is allowed for that pass
5. if the same dead lane was already documented in the lane registry from a recent pass, do not spend time re-proving it unless there is a specific recheck reason
6. fallback may capture only full-text `2-star` rows and should stay inside the priority practices
7. keep fallback narrow, source-faithful, and `corpus_only`

Pass 41 - Wave80 2-Star Closure Under Harvest Mode is now complete:
- `3` additional real full-text `2-star` rows captured
- Wave80 grew from `69` to `72` rows while keeping every row `corpus_only`
- two Google Maps 2-star rows captured: `Apex Disability Law (CO, SSD)` with communication_gap and expectation_break complaint (Amber cruse) and `ASH | LAW (CO, SSD)` with contact_failure and communication_gap complaint (MSHUGGE)
- six Google Maps 2-star surfacing failures documented in this pass: `Krieger Disability Law (CO)` — 0 2-star count; `De la Rosa Law Firm (FL)` — placeholder body; `Perigon Legal Services (GA)` — 0 2-star count; `The Martinez Law Firm TX` — body-less owner-response-only 2-star; `McGinn Law Firm (NE)` — two body-less star-only 2-stars; `Jeffrey Y. Bennett Law (MO)` — 0 2-star count
- six failures triggered the controlled fallback rule; one Avvo 2-star row captured: `Versfeld & Hugo (MO, immigration)` — attorney Leon Versfeld, 2-star from Paul (June 10, 2022) with minimal updates and billing error complaint
- `2-star` target closed at `20/20` — this gap is now resolved
- normalization and dedupe completed with `0` exact duplicate groups and `0` likely duplicate pairs
- **all primary Wave80 count targets are now met**

Pass 42 - Wave80 Triage Prep for Benchmark-Candidate and Holdout Promotion is now complete:
- reviewed all `72` Wave80 rows; no new rows added; no text, ratings, or provenance changed
- assigned subset roles: `15` `benchmark_candidate`, `10` `holdout`, `6` `audit_only`, `41` `corpus_only`
- combined dataset (phase1 + wave80): `23` `benchmark_candidate`, `14` `holdout`, `11` `audit_only`, `48` `corpus_only`
- `benchmark_candidate` selection: diverse practices (7 areas), diverse states (14 distinct), diverse star slices (1★ 6, 2★ 3, 4★ 4, 5★ 2); only source-faithful, text-rich, clearly representative rows promoted; no near-duplicates, no thin rows, no off-core rows
- `holdout` selection: `10` rows across `5` star slices, `7` practice areas, `10` states; reserved for future evaluation
- `audit_only` selection: `6` rows — `3` too thin, `1` off-core practice, `1` near-duplicate of stronger row, `1` low-specificity anger language
- Wave80 holdout queue populated with `10` rows for the first time
- acquisition status updated to reflect combined role counts (`96` total rows accounted for)

Pass 43 - Wave80 Benchmark-Candidate Human Truth Review is now complete:
- reviewed the `15` Wave80 `benchmark_candidate` rows only; no new rows added; no text, ratings, or provenance changed
- kept `12` rows as reviewed `benchmark_candidate`
- downgraded `2` rows to `audit_only`: `michaeltroiano_stephanie`, `stamm_anonymous`
- downgraded `1` row to `corpus_only`: `jenniferjamison_derek`
- added reviewed expected labels, polarity / severity, evidence snippets, and short truth notes for all `15` reviewed rows
- Wave80 live role split is now `12` `benchmark_candidate`, `10` `holdout`, `8` `audit_only`, `42` `corpus_only`
- combined dataset (phase1 + wave80) is now `20` `benchmark_candidate`, `14` `holdout`, `13` `audit_only`, `49` `corpus_only`
- holdout queue stayed untouched; acquisition status was updated and kept in sync

Pass 44 - Wave80 Benchmark Promotion + Authoritative Rerun is now complete:
- promoted `7` reviewed Wave80 rows into active canonical truth: `kowalski_bradcanard`, `morgan_elishaurgent`, `matthewlind_wayne`, `edgardgarcia_anonymous`, `newfrontier_vlopez`, `ryangarry_noellevitzthum`, `fulton_kellieprenslow`
- left `5` reviewed rows unpromoted because they still looked too boundary-fragile or inference-heavy for benchmark-driving pressure: `donstewart_amy`, `ericmark_marie`, `chayet_caw8taw`, `ericpalacios_gabrielrodriguez`, `anchor_ag`
- active canonical benchmark expanded from `22` to `29` rows
- canonical five-theme rerun landed at `75.86%` agreement, `22/29` clean reviews, `16` disagreements
- broad frozen `143-real` rerun held flat at `55.94%` agreement, `80/143` clean reviews, `92` disagreements
- no queue-role changes were made; acquisition status was rebuilt for integrity only

Pass 45 - Wave80 Canonical Gate Restoration + Miss Audit is now complete:
- restored the active canonical benchmark to the last clean accepted `22`-row gate
- preserved the `7` failed-promotion rows in `data/calibration/canonical/wave80_staged_pressure_20260408.json` instead of leaving them in active canonical truth
- wrote a narrow restoration-proof canonical rerun to `data/calibration/runs/20260408_wave80_gate_restore_canonical_rerun/`
- grouped the exposed staged miss clusters: `expectation_setting` (`5`), `communication_responsiveness` (`4`), `professionalism_trust` (`3`), `outcome_satisfaction` (`3`), `communication_clarity` (`1`)
- broad truth was left unchanged; the failed promotion experiment remains preserved as audit evidence, not accepted benchmark truth

Current next pass priorities:
1. `2-star` is closed at `20/20` - do not reopen
2. `mixed_4_star` is closed at `15/15` - do not reopen
3. the failed `7`-row Wave80 promotion experiment is now preserved as staged calibration pressure, not accepted canonical truth
4. `5` reviewed Wave80 rows remain unpromoted and should stay outside active benchmark truth unless a later promotion gate is explicitly reopened
5. the narrow positive phrase recovery pass is now complete and the active canonical gate stayed clean
6. the staged-only replay is complete and the filing-delay truth review is complete
7. `edgardgarcia_anonymous` and `newfrontier_vlopez` now treat their filing-delay complaints as `timeliness_progress`, not `expectation_setting`
8. the staged re-triage after that replay now yields:
   - promotion shortlist: `ryangarry_noellevitzthum`, `fulton_kellieprenslow`, `newfrontier_vlopez`
   - keep staged pressure: `morgan_elishaurgent`
   - downgrade out of staged pressure: `kowalski_bradcanard`, `matthewlind_wayne`, `edgardgarcia_anonymous`
9. the shortlist truth review is now complete:
   - ready for a very selective promotion retry: `ryangarry_noellevitzthum`, `fulton_kellieprenslow`
   - keep on shortlist but not ready: `newfrontier_vlopez`
10. keep promise-reversal intake language staged through `morgan_elishaurgent`
11. keep the downgraded fragmented rows out of active staged pressure unless a later benchmark-design pass reopens them deliberately
12. the selective promotion retry is now complete:
   - promoted into active canonical truth: `ryangarry_noellevitzthum`, `fulton_kellieprenslow`
   - keep on shortlist but not ready: `newfrontier_vlopez`
13. do not reopen collection or widen promotion beyond the already accepted ready subset
14. next useful benchmark-facing step is a broad `143-real` sanity rerun before any further promotion widening or new engine work

---

## Non-Negotiables

- no engine edits
- no benchmark-truth edits
- no canonical benchmark changes
- no calibration reruns during collection passes
- no synthetic rows
- no paraphrased raw review text
- no automatic promotion from corpus intake into benchmark truth
