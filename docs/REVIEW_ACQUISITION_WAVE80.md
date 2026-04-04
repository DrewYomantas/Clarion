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
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
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

Mixed `4-star` recovery rule:
1. start on Google Maps
2. target firms roughly `3.5` to `4.5` overall and sort reviews by `Lowest`
3. capture only full-text `4-star` rows
4. treat body-less star-only `4-star` rows as dead ends immediately
5. after three dead Google Maps lanes in one pass, switch mixed `4-star` work to controlled Avvo / Lawyers.com gap-fill for the rest of that pass
6. keep Google Maps as the premium default for low-star and positive rows even when mixed `4-star` uses gap-fill

Current next pass priorities:
1. stay Google Maps-first
2. keep mixed `4-star` capture on the controlled gap-fill rule when Google Maps turns into body-less dead ends
3. keep pushing honest `2-star` growth from new-state practice lanes
4. widen practice-area coverage in immigration, disability, estate planning, and criminal defense without forcing synthetic balance
5. keep pushing new-state capture instead of deepening only WI and GA
6. keep Wave80 at intake discipline only; no benchmark pressure yet

---

## Non-Negotiables

- no engine edits
- no benchmark-truth edits
- no canonical benchmark changes
- no calibration reruns during collection passes
- no synthetic rows
- no paraphrased raw review text
- no automatic promotion from corpus intake into benchmark truth
