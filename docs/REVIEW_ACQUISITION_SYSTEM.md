# Clarion Review Acquisition System

_This is the scalable operating doc for the agent-driven acquisition lane. Use it with `docs/REVIEW_ACQUISITION_PLAN.md`, `docs/REVIEW_ACQUISITION_PHASE1.md`, and `docs/REVIEW_ACQUISITION_WAVE80.md`._

---

## Purpose

Clarion now needs an acquisition system that can scale beyond a small manually sourced batch.

This system is built for:
- coverage-matrix driven discovery
- agent-owned source scouting
- queue generation from actual corpus gaps
- batch management across hundreds of rows
- normalization and dedupe before any benchmark influence
- narrow human checkpoints only where benchmark credibility actually depends on them

---

## Core Principle

Agents do the volume work.

Human review stays narrow:
- guardrails
- spot checks
- duplicate conflict resolution
- final promotion into benchmark-candidate review

Drew should not be the firm-discovery bottleneck.

---

## System Components

### Discovery inputs
- `data/calibration/expansion/manifests/20260328_coverage_matrix.csv`
- `data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv`
- `data/calibration/expansion/scouting/20260328_source_scout_queue.csv`
- `data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv`

### Queue outputs
- `data/calibration/expansion/queues/20260328_source_priority_queue.csv`
- `data/calibration/expansion/queues/20260328_phase1_label_queue.csv`
- `data/calibration/expansion/queues/20260328_phase1_holdout_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_label_queue.csv`
- `data/calibration/expansion/queues/20260328_wave80_holdout_queue.csv`

### Batch inputs
- `data/calibration/expansion/batches/20260328_phase1_real_review_batch.csv`
- `data/calibration/expansion/batches/20260328_phase1_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_batch_manifest.csv`
- `data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv`
- `data/calibration/expansion/batches/20260328_wave80_collection_notes.md`
- `data/calibration/expansion/manifests/20260328_wave80_batch_manifest.csv`

### Templates
- `data/calibration/expansion/templates/coverage_matrix_template.csv`
- `data/calibration/expansion/templates/source_scout_template.csv`
- `data/calibration/expansion/templates/source_priority_queue_template.csv`
- `data/calibration/expansion/templates/review_intake_template.csv`
- `data/calibration/expansion/templates/label_queue_template.csv`
- `data/calibration/expansion/templates/holdout_queue_template.csv`
- `data/calibration/expansion/templates/batch_manifest_template.csv`
- `data/calibration/expansion/templates/acquisition_stage_targets_template.csv`

### Automation
- `automation/calibration/build_review_source_priority_queue.py`
- `automation/calibration/normalize_and_dedupe_review_batch.py`
- `automation/calibration/review_acquisition_status.py`

---

## Operating Flow

1. `Set the target stage`
   - `phase1`
   - `wave80`
   - `wave160`
   - later larger corpus stages

2. `Update the coverage matrix`
   - target the slices Clarion actually lacks
   - raise or lower weights as benchmark priorities change

3. `Scout source pages`
   - agents fill the source scout queue
   - each row records what the page appears to contain before capture begins

4. `Generate the source priority queue`
   - run:
   ```bash
   python automation/calibration/build_review_source_priority_queue.py ^
     --coverage data/calibration/expansion/manifests/20260328_wave80_coverage_matrix.csv ^
     --scouting data/calibration/expansion/scouting/20260328_wave80_source_scout_queue.csv ^
     --batches-dir data/calibration/expansion/batches ^
     --existing-csv data/calibration/expansion/real_review_expansion_20260327.csv ^
     --stage wave80 ^
     --output data/calibration/expansion/queues/20260328_wave80_source_priority_queue.csv
   ```

5. `Capture reviews`
   - agents work the queue from the top down
   - captured rows go into the dated batch CSV

6. `Normalize and dedupe`
   - run:
   ```bash
   python automation/calibration/normalize_and_dedupe_review_batch.py ^
     --batch data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv ^
     --output data/calibration/expansion/batches/20260328_wave80_real_review_batch.csv ^
     --report-dir data/calibration/expansion/manifests
   ```

7. `Prepare triage`
   - agents fill label and holdout queues

8. `Run progress status`
   - run:
   ```bash
   python automation/calibration/review_acquisition_status.py ^
     --batches-dir data/calibration/expansion/batches ^
     --queues-dir data/calibration/expansion/queues ^
     --targets data/calibration/expansion/manifests/acquisition_stage_targets.csv ^
     --output data/calibration/expansion/manifests/20260328_acquisition_status.json
   ```

9. `Human checkpoint`
   - spot-check a sample
   - resolve duplicate conflicts
   - approve benchmark-candidate promotion subset

---

## Scaling Path

### Phase 1
- `24` reviews
- prove the system works end to end
- now complete as a closed seed batch

### Wave 80
- `80` reviews
- first serious reopening checkpoint
- enough repeated evidence to justify another benchmark-design decision cycle
- now the next live collection stage

### Wave 160
- `160` reviews
- stronger state and practice diversification
- enough volume to revisit broader generalization claims

### Larger corpus expansion
- `320+`
- multiple batches
- multiple queues
- more stable source-mix control
- enough volume to support holdouts without starving benchmark candidates

The scripts and manifests are built so Clarion can keep adding batches instead of replacing them.

---

## Human Bottleneck Avoidance

This system avoids making Drew the bottleneck by moving these tasks to agents:
- discovery
- scouting
- priority queue generation
- first-pass capture
- normalization
- weak-slice tagging
- first-pass dedupe
- first-pass triage

Human review stays only at:
- spot checks
- duplicate conflict resolution
- ambiguity resolution
- benchmark-candidate promotion

---

## Current Stage Truth

Current repo truth:
- Phase 1 is closed
- Wave80 is the next live collection stage
- the `8` reviewed candidates, `4` holdouts, and `5` audit-only Phase 1 rows are protected subsets, not canonical truth
- new collection should start from the Wave80 starter files, not by continuing to extend the Phase 1 batch

---

## Non-Negotiable Guardrails

- no synthetic rows disguised as real
- no auto-promotion into benchmark truth
- no overwriting raw review text with normalized text
- no benchmark-engine edits during acquisition passes
- no calibration reopening until stage targets are actually met
