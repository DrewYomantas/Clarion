# Clarion Real-World Review Acquisition Plan

_Working plan for the next evidence-building lane. This is not a benchmark-engine spec. It defines how Clarion should collect more real law-firm reviews so the next benchmark-design and calibration wave is driven by stronger repeated evidence._

---

## Why This Exists

Current repo truth:
- Canonical benchmark is clean: `100.00%`, `22/22` clean, `0` disagreements.
- Broad frozen `143-real` benchmark is still weak: `55.94%`, `80/143` clean, `92` disagreements.
- The current blocker is no longer a clearly repeated deterministic rule gap. It is sparse evidence, benchmark-design ambiguity, and underrepresented review slices.

The next honest move is not another phrase pass. It is building a larger, metadata-complete, real-review corpus that future benchmark work can trust.

---

## Collection Priorities

Collect in this order:

1. `1-star` and `2-star` reviews with explicit contact failure, unclear guidance, broken promises, or weak advocacy.
2. `4-star` mixed reviews with one real governance complaint inside an otherwise positive narrative.
3. `4-star` and `5-star` reviews with explicit positive outcome language.
4. `4-star` and `5-star` reviews with explicit trust / professionalism language stronger than generic praise.
5. `3-star` partial-satisfaction reviews where expectation, fee/value, and outcome tension are all visible.

What the next corpus most needs:
- low-star responsiveness vs clarity vs expectation overlap
- trust vs outcome ambiguity in low-star narratives
- explicit positive outcome language that is stronger than generic gratitude
- explicit positive professionalism / trust language that is stronger than "highly recommend"
- longer narratives with multiple governance signals in one review
- better metadata coverage for geography, practice area, and source provenance

Practice-area targets:
- family law
- personal injury
- disability / SSI
- criminal defense
- estate planning / probate
- immigration
- debt defense / bankruptcy

Coverage targets:
- multiple states, not just FL / IL / WI
- solo / small / regional firms, not just large consumer-facing firms
- short, medium, and long reviews

---

## Recommended Acquisition Model

Use a `hybrid` model:

- `Agent-driven` for firm discovery, source-page scouting, queue building, first-pass capture, normalization, weak-slice tagging, and dedupe suggestions.
- `Semi-automated` where public review pages are stable enough to capture safely with source URLs and exact star ratings.
- `Human review` only for guardrails, spot-checking, and final benchmark-truth promotion decisions.

Recommended source priority:

1. `Google Maps / Google Business Profile reviews`
   - Highest realism because the original benchmark corpus was built from Google Maps reviews.
   - Use manual browser capture, not unattended scraping.
   - Best source for local-firm geography coverage.

2. `Trustpilot`
   - Best operational source right now because Clarion already proved this workflow in `data/calibration/expansion/real_review_expansion_20260327.csv`.
   - Good for explicit star ratings, review dates, reviewer labels, and stable URLs.

3. `Avvo` and `Lawyers.com`
   - Use as targeted gap-fill sources for practice areas or geographies that Trustpilot and Google do not cover well.
   - Treat them as secondary, not the backbone.

4. `Yelp` or `BBB`
   - Use only as scouting or audit-only sources unless a review is easy to capture cleanly with explicit star rating and full text.
   - Do not build the main workflow around them.

Do not use firm-owned testimonial pages as benchmark-candidate sources.

---

## Discovery Strategy

Agents should own discovery.

Discovery loop:
1. Start from a coverage matrix by:
   - star band
   - practice area
   - state
   - firm size proxy
   - review type
2. Build firm queues for missing cells first, not just whatever pages are easiest to find.
3. For each candidate firm, agents should scout public review pages and record:
   - source platform
   - source URL
   - visible star-band availability
   - whether long-form reviews are present
   - whether the page looks useful for low-star, mixed, positive-outcome, or positive-trust targets
4. Agents should then prioritize firms/pages that add new coverage, not duplicate the same debt/bankruptcy-heavy lane repeatedly.

Discovery output should be a queue, not a finished benchmark.

---

## Recommended Artifact Structure

Keep the broader corpus separate from benchmark truth.

Recommended working artifacts:
- `data/calibration/expansion/batches/YYYYMMDD_real_review_batch.csv`
- `data/calibration/expansion/batches/YYYYMMDD_collection_notes.md`
- `data/calibration/expansion/queues/YYYYMMDD_label_queue.csv`
- `data/calibration/expansion/queues/YYYYMMDD_holdout_queue.csv`
- `data/calibration/expansion/queues/YYYYMMDD_source_priority_queue.csv`
- `data/calibration/expansion/scouting/YYYYMMDD_source_scout_queue.csv`
- `data/calibration/expansion/manifests/YYYYMMDD_coverage_matrix.csv`
- `data/calibration/expansion/manifests/YYYYMMDD_batch_manifest.csv`
- `data/calibration/expansion/manifests/acquisition_stage_targets.csv`
- `data/calibration/expansion/templates/review_intake_template.csv`
- `data/calibration/expansion/templates/coverage_matrix_template.csv`
- `data/calibration/expansion/templates/source_scout_template.csv`
- `data/calibration/expansion/templates/source_priority_queue_template.csv`
- `data/calibration/expansion/templates/label_queue_template.csv`
- `data/calibration/expansion/templates/holdout_queue_template.csv`
- `data/calibration/expansion/templates/batch_manifest_template.csv`
- `data/calibration/expansion/templates/acquisition_stage_targets_template.csv`
- `data/calibration/expansion/templates/collection_notes_template.md`
- `docs/REVIEW_ACQUISITION_PHASE1.md`
- `docs/REVIEW_ACQUISITION_WAVE80.md`
- `docs/REVIEW_ACQUISITION_SYSTEM.md`

This keeps:
- raw collected corpus
- provenance notes
- human labeling queue
- holdout pool

separate from:
- `data/calibration/inputs/real_reviews.csv`
- `data/calibration/canonical/benchmark_canonical_v1.json`

Nothing new should influence benchmark truth directly from a raw collection batch.

Current stage truth:
- Phase 1 is complete and closed
- Wave80 is the next live collection stage
- the Phase 1 reviewed-candidate, holdout, and audit-only subsets stay protected while new Wave80 collection expands the corpus

---

## Dataset Schema

Use the current expansion CSV as the base shape, then add the fields Clarion now needs.

Required capture fields:
- `record_id`
- `collection_batch`
- `source_platform`
- `source_url`
- `source_capture_method`
- `firm_name`
- `attorney_name` if present
- `practice_area_primary`
- `practice_area_secondary` if present
- `city`
- `state`
- `review_rating`
- `review_date`
- `collection_date`
- `reviewer_label`
- `review_text_raw`
- `owner_response_raw` if present
- `provenance_note`

Required normalized / workflow fields:
- `review_text_normalized`
- `normalized_text_hash`
- `source_firm_key`
- `length_bucket`
- `weak_slice_tags`
- `dataset_role`
- `human_review_status`
- `dedupe_status`
- `dedupe_group_id`
- `duplicate_of_record_id`

Required benchmark-promotion fields for shortlisted rows only:
- `benchmark_candidate_flag`
- `holdout_flag`
- `audit_only_flag`
- `sentiment_mix_tag`
- `expected_labels_json`
- `labeler`
- `label_reviewed_at`
- `truth_decision_note`

Rules:
- `review_text_raw` must stay source-faithful.
- If any normalization happens, keep both raw and normalized text.
- Future benchmark candidates should be promoted only from verbatim rows with intact source provenance.

---

## Dedupe And Hygiene Rules

Run dedupe before any labeling work.

Required dedupe rules:
- Exact duplicate: same `normalized_text_hash` -> keep one primary row, mark others as duplicates.
- Likely same-review duplicate: same firm, same rating, same reviewer label or same date window, and near-identical text -> keep one primary row, cross-link the rest.
- Cross-platform duplicate: do not silently delete; keep one primary row and mark the others as `duplicate_cross_platform`.

Required hygiene rules:
- No row without explicit star rating.
- No row without preserved source URL or source page note.
- No benchmark-candidate row with edited or paraphrased review text.
- Do not merge owner responses into the review text.
- Normalize firm, city, state, and practice-area names into flat fields.
- Keep a provenance note whenever the source text needed light cleanup for CSV safety.

---

## Labeling Workflow

Use a two-stage human workflow.

### Stage 1: Corpus Intake
- Capture the raw review and metadata.
- Normalize fields.
- Run dedupe.
- Tag likely weak slices:
  - `low_star_contact_failure`
  - `low_star_expectation_break`
  - `trust_vs_outcome_ambiguity`
  - `mixed_4_star`
  - `explicit_positive_outcome`
  - `explicit_positive_trust`
  - `long_form`
- Default new rows to `dataset_role=corpus_only`.

### Stage 2: Benchmark Triage
- Human-review the row for source faithfulness, star rating, and metadata completeness.
- Assign one of:
  - `benchmark_candidate`
  - `holdout`
  - `audit_only`
  - `corpus_only`
- Only benchmark candidates get full expected-label review.

### Stage 3: Human Truth Review
- For benchmark candidates only:
  - assign expected theme labels
  - assign polarity / severity
  - store evidence spans
  - write a short truth note
- If a row is too ambiguous, keep it as `audit_only` instead of forcing benchmark truth.

Promotion rule:
- No row influences canonical truth or the next benchmark-design wave until it passes human review and keeps intact provenance.

---

## Scaling Workflow

Use a pipeline that can scale from tens to hundreds to thousands of reviews:

1. `Discovery queue build`
   - agents generate source-page targets from the coverage matrix
   - agents rank pages by expected value for missing slices
2. `First-pass capture`
   - agents collect review rows into the intake CSV
   - agents preserve raw text, star rating, dates, URLs, and provenance
3. `Normalization`
   - agents fill normalized fields, length bucket, source firm key, and weak-slice tags
4. `Dedupe checkpoint`
   - agents compute exact and likely-duplicate flags before labeling
5. `Triage queue`
   - agents assign default queue status and candidate reasons
   - benchmark influence remains blocked at this stage
6. `Human checkpoint`
   - Drew or a later human reviewer spot-checks a sample, resolves ambiguous rows, and approves which rows are allowed into benchmark-candidate review
7. `Promotion checkpoint`
   - only a small, human-reviewed subset can move toward benchmark-truth work

This keeps the high-volume work agent-owned while preserving a narrow human decision point where it actually matters.

---

## Quality-Control Checkpoints

Required agent-owned checkpoints:
- `discovery QC`
  - no queue should over-concentrate in one source, one state, or one practice area unless that is the explicit target
- `capture QC`
  - no row without explicit star rating, raw text, and source URL / provenance
- `dedupe QC`
  - exact duplicate flags before any labeling
  - likely duplicate flags before any promotion
- `triage QC`
  - every row gets a `dataset_role`
  - benchmark candidates require a concrete candidate reason

Required human checkpoints:
- spot-check a sample from each batch for source faithfulness
- approve any benchmark-candidate promotion
- resolve ambiguous or disputed rows that might affect benchmark truth

No direct auto-ingest into `real_reviews.csv` or the canonical benchmark.

---

## Checkpoint Before The Next Benchmark Wave

Do not reopen benchmark-design or calibration work until Clarion has at least:

- `80` new real reviews
- all `80` are metadata-complete and deduped
- at least `45` low-star reviews:
  - `25` `1-star`
  - `20` `2-star`
- at least `15` `4-star` mixed reviews
- at least `15` reviews with explicit positive outcome language
- at least `15` reviews with explicit positive trust / professionalism language stronger than generic praise
- at least `20` long-form reviews
- at least `6` states represented
- at least `5` practice-area buckets represented
- no single source platform exceeds `60%` of the batch
- at least `20` rows reserved as `holdout`
- at least `30` benchmark-candidate rows fully human-labeled

These quotas can overlap. The point is not pure volume. The point is repeated evidence in the slices Clarion actually lacks.

---

## Honest Stopping Rule

If Drew cannot collect enough rows with intact provenance and explicit star ratings, do not fake the corpus with synthetic substitutes.

If Google Maps proves too operationally expensive, keep Google as the premium lane and use Trustpilot plus targeted Avvo / Lawyers.com gap-fill to hit the checkpoint honestly.

The next benchmark wave should begin only when there is enough new real evidence to change the benchmark conversation, not just enough rows to feel busy.

For immediate execution, use `docs/REVIEW_ACQUISITION_PHASE1.md`.
For the scalable operating model, use `docs/REVIEW_ACQUISITION_SYSTEM.md`.
