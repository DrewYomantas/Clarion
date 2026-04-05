# Collection Batch Notes

- Batch date: 2026-03-28
- Batch file: `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- Queue file: `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- Holdout file: `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`

## Source mix
- Google Maps: 50
- Trustpilot: 0
- Avvo: 16
- Lawyers.com: 6
- Other: 0

## Wave80 targets
- total reviews: 80 ✓ (corpus has 96 across wave80 + phase1)
- 1-star: 25 ✓ (32 total)
- 2-star: 20 ✓ (20 total — closed in Pass 41)
- mixed 4-star: 15 ✓ (15 total — closed in Pass 40)
- explicit positive outcome: 15 ✓ (21 total)
- explicit positive trust: 15 ✓ (35 total)
- long-form: 20 ✓ (29 total)
- states covered: 6 ✓ (24 states)
- practice-area buckets covered: 5 ✓ (10 areas)
- holdouts: 20 (14 total — Wave80 triage block opened in Pass 42: 10 wave80 + 4 phase1)
- reviewed benchmark candidates: 30 (23 total — Wave80 triage block opened in Pass 42: 15 wave80 + 8 phase1)

## Pass 42 triage state (as of 2026-04-05)
- Wave80 batch triage complete: 15 `benchmark_candidate`, 10 `holdout`, 6 `audit_only`, 41 `corpus_only`
- Combined dataset (phase1 + wave80): 23 `benchmark_candidate`, 14 `holdout`, 11 `audit_only`, 48 `corpus_only`
- 14 distinct states represented across benchmark_candidate rows
- benchmark_candidate slice distribution: 1-star 6, 2-star 3, 4-star 4, 5-star 2
- benchmark_candidate practice distribution: criminal_defense 4, immigration 3, family_law 2, estate_planning 2, SSD 2, personal_injury 1, real_estate 1

## Dedupe notes
- Exact duplicates found: 0
- Likely same-source duplicates found: 0
- Cross-platform duplicates found: 0

## Batch caveats
- Any rows with thin metadata: none in the current batch; every row has rating, source URL, state, practice area, collection date, and provenance note.
- Any rows marked audit-only in Pass 42 triage: 6 rows — 3 too thin (71, 17, 6 chars), 1 off-core practice (speeding_traffic_ticket), 1 near-duplicate of stronger row from same firm, 1 low-specificity ("complete trash") narrative.
- Any rows that should never drive benchmark truth: the controlled Avvo mixed `4-star` fallback rows, the new 2026-04-04 Google Maps intake rows from Passes 35 and 39, the controlled Avvo / Lawyers.com `2-star` fallback rows captured in Pass 36, and the controlled Lawyers.com `2-star` fallback rows captured in Pass 37 should stay out of benchmark pressure until a later Wave80 triage pass.

## Operator notes
- What went smoothly: Pass 39 proved the registry-backed harvest model can land a `12`-row Google Maps block quickly once the parent pass starts from the harvest-ready queue instead of rebuilding lane truth from scratch.
- What slowed capture down: qualifying mixed `4-star` rows still did not surface honestly from the harvested Google Maps lanes, so the pass widened low-star and positive throughput without closing the remaining mixed `4-star` gap.
- What should change in the next batch: keep harvest mode for larger Google Maps blocks, but use the next qualification work narrowly on unresolved mixed `4-star` and `2-star` gaps so the next harvest does not spend another pass mostly deepening already-proven one-star and five-star lanes.

### Pass 40 — Mixed 4-Star Recovery Under Harvest Mode (2026-04-05)
- What went smoothly: controlled Avvo fallback rule correctly triggered after three confirmed dead Google Maps mixed-4-star lanes and produced two qualifying rows (Turner TN criminal defense, Benson WA estate planning); mixed_4_star target closed at 15/15.
- What slowed capture down: all three harvest-ready Google Maps lanes checked (Anchor VA, New Frontier AZ, Fulton OH) were too highly rated (4.5–4.8) and either surfaced no 4-star bodies at all or returned only star-only body-less rows; a fourth qualification lane (Lowe OK, 4.5/283) showed visible 4-star bodies but all were purely positive thin one-liners with no concrete governance complaint.
- What should change in the next batch: mixed_4_star is now closed; next pass should focus narrowly on the remaining 2-star gap (17/20) before any general low-star or positive sweep.

### Pass 41 — Wave80 2-Star Closure Under Harvest Mode (2026-04-05)
- What went smoothly: two full-text 2-star Google Maps rows captured from Denver CO SSD firms (Apex Disability Law, ASH | LAW); controlled Avvo fallback correctly triggered after six documented same-pass Google Maps surfacing failures and produced one qualifying row (Leon Versfeld / Versfeld & Hugo, MO immigration); 2-star target closed at 20/20.
- What slowed capture down: six distinct Google Maps 2-star lanes failed before fallback was earned — Krieger CO (0 2-star count), De la Rosa FL (placeholder body), Perigon GA (0 2-star count), Martinez TX (body-less owner-response-only 2-star), McGinn Law NE (two body-less star-only 2-stars), Jeffrey Y. Bennett MO (0 2-star count); Louisville KY and New Orleans LA searches returned only 4.7–5.0 firms with no visible low-star bands.
- What should change in the next batch: 2-star is now closed at 20/20; Wave80 collection targets are now met for all primary count categories; next pass should open Wave80 triage — promote rows to benchmark_candidate and holdout status rather than continuing raw intake.

### Pass 42 — Wave80 Triage Prep for Benchmark-Candidate and Holdout Promotion (2026-04-05)
- What went smoothly: all 72 Wave80 rows were reviewed; 31 rows were assigned non-corpus_only roles; no new rows were added; no text/provenance was modified; batch/label queue stayed in exact sync.
- Triage posture: selective, not generous — preferred rows that were source-faithful, text-rich, good slice representatives, and not near-duplicates of stronger rows; excluded thin (<100 chars) rows, off-core practices, and near-duplicates from benchmark pressure.
- Benchmark_candidate decisions: favored diverse practices (7 areas), diverse states (14 distinct), and diverse star slices (1★ 6, 2★ 3, 4★ 4, 5★ 2). Strongest long-form rows selected in each slice.
- Holdout decisions: 10 rows reserved across 5 star slices, 7 practices, and 10 states; skewed toward rows that contrast with or complement benchmark_candidate rows from the same firms.
- Audit_only decisions: 6 rows flagged — 3 extremely thin (6, 17, 71 chars), 1 off-core practice (speeding_traffic_ticket), 1 near-dupe from same WI family_law firm, 1 low-specificity anger language with weak governance signal density.
- What should change in the next pass: triage is now open; next useful move is human truth review of the 15 benchmark_candidate rows, then promote to canonical after human review cycle.

