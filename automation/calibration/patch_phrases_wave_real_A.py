"""
Patch script: inject confirmed new phrases from real_reviews_master_A.csv
into THEME_PHRASES in benchmark_engine.py.

Approach: string-based insertion at unique anchor comments.
Each anchor is a calibration comment block that already exists at the
end of the relevant phrase list. We insert new tuples before the closing
bracket of each list.

Run from repo root:
  python automation/calibration/patch_phrases_wave_real_A.py
"""
import pathlib, re, sys

ENGINE = pathlib.Path(__file__).resolve().parent.parent.parent / "backend" / "services" / "benchmark_engine.py"

if not ENGINE.exists():
    sys.exit(f"Not found: {ENGINE}")

src = ENGINE.read_text(encoding="utf-8")
original_len = len(src)

# ── helpers ──────────────────────────────────────────────────────────────────

def insert_before(src: str, anchor: str, new_lines: str) -> str:
    """Insert new_lines immediately before the first occurrence of anchor."""
    idx = src.find(anchor)
    if idx == -1:
        raise ValueError(f"Anchor not found: {anchor!r}")
    return src[:idx] + new_lines + src[idx:]

changes = []

# ═══════════════════════════════════════════════════════════════════════════
# 1. communication_responsiveness / severe_negative
#    Anchor: the last phrase in the list
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_CR_SEV = '            ("stopped returning my calls", 2.0),\n            ("never heard from them for over a year", 2.0),\n        ],'
NEW_CR_SEV = '''\
            # --- real-reviews wave A ---
            ("hung up on me", 2.0),
            ("hung up on me", 2.0),
'''
# Note: dedup guard: only add if not already present
if '("hung up on me"' not in src:
    NEW_CR_SEV_CLEAN = '''\
            # --- real-reviews wave A ---
            ("hung up on me", 2.0),
'''
    src = insert_before(src, ANCHOR_CR_SEV, NEW_CR_SEV_CLEAN)
    changes.append("communication_responsiveness/severe_negative: hung up on me")


# ═══════════════════════════════════════════════════════════════════════════
# 2. empathy_support / positive
#    Anchor: last calibration block comment in positive
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_ES_POS = '            ("very friendly and also very helpful", 1.0),\n        ],'
if ANCHOR_ES_POS in src and '("saved my life"' not in src:
    NEW_ES_POS = '''\
            # --- real-reviews wave A ---
            ("saved my life", 2.0),
            ("never gave up on me", 2.0),
            ("toughest times in my life", 2.0),
            ("in my corner all the way", 1.5),
            ("at my very bottom", 1.5),
            ("world had turned upside down", 1.5),
'''
    src = insert_before(src, ANCHOR_ES_POS, NEW_ES_POS)
    changes.append("empathy_support/positive: saved my life, never gave up on me, +4")


# ═══════════════════════════════════════════════════════════════════════════
# 3. empathy_support / severe_negative
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_ES_SEV = '            ("left a lot to be desired in terms of personal attention", 1.5),\n        ],'
if ANCHOR_ES_SEV in src and '("zero compassion"' not in src:
    NEW_ES_SEV = '''\
            # --- real-reviews wave A ---
            ("zero compassion", 2.0),
            ("no compassion either", 2.0),
            ("sensitivity training", 2.0),
            ("no idea how to deal with a client", 2.0),
            ("complete attitude every call", 2.0),
            ("rude and has zero compassion", 2.0),
'''
    src = insert_before(src, ANCHOR_ES_SEV, NEW_ES_SEV)
    changes.append("empathy_support/severe_negative: zero compassion, sensitivity training, +4")


# ═══════════════════════════════════════════════════════════════════════════
# 4. professionalism_trust / positive
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_PT_POS = '            ("smart, strategic", 1.0),\n        ],'
if ANCHOR_PT_POS in src and '("second to none"' not in src:
    NEW_PT_POS = '''\
            # --- real-reviews wave A ---
            ("second to none", 2.0),
            ("dedicated advocate", 1.5),
            ("fearless", 1.5),
            ("deep understanding of the legal complexities", 1.5),
            ("deep understanding", 1.0),
            ("passion, professionalism, determination", 2.0),
            ("never gave up on", 1.5),
            ("definition of what a defense attorney should be", 2.0),
'''
    src = insert_before(src, ANCHOR_PT_POS, NEW_PT_POS)
    changes.append("professionalism_trust/positive: second to none, dedicated advocate, fearless, +5")


# ═══════════════════════════════════════════════════════════════════════════
# 5. professionalism_trust / severe_negative
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_PT_SEV = '            ("charged me the full amount and left me without legal counsel", 2.0),\n        ],'
if ANCHOR_PT_SEV in src and '("inexperienced son"' not in src:
    NEW_PT_SEV = '''\
            # --- real-reviews wave A ---
            ("inexperienced son", 2.0),
            ("sent his inexperienced son", 2.0),
            ("threw my folder", 2.0),
            ("thrown out of their office", 2.0),
            ("rude and condescending", 2.0),
            ("deal with your kind all the time", 2.0),
            ("absolute nightmare to deal with", 2.0),
'''
    src = insert_before(src, ANCHOR_PT_SEV, NEW_PT_SEV)
    changes.append("professionalism_trust/severe_negative: inexperienced son, threw folder, rude condescending, +4")


# ═══════════════════════════════════════════════════════════════════════════
# 6. billing_transparency / negative
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_BT_NEG = '            ("dealing with the billing department is a nightmare", 2.0),\n        ],'
if ANCHOR_BT_NEG in src and '("administration fees"' not in src:
    NEW_BT_NEG = '''\
            # --- real-reviews wave A ---
            ("administration fees", 1.5),
            ("per hour rate", 1.0),
            ("not disclose", 1.5),
            ("racked up over", 1.5),
            ("nothing was completed", 1.5),
            ("never gave a timeframe", 1.5),
'''
    src = insert_before(src, ANCHOR_BT_NEG, NEW_BT_NEG)
    changes.append("billing_transparency/negative: administration fees, per hour rate, not disclose, +3")


# ═══════════════════════════════════════════════════════════════════════════
# 7. billing_transparency / severe_negative
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_BT_SEV = '            ("charged for consultation appointment", 2.0),\n        ],'
if ANCHOR_BT_SEV in src and '("non-refundable"' not in src:
    NEW_BT_SEV = '''\
            # --- real-reviews wave A ---
            ("non-refundable", 2.0),
            ("never received a refund", 2.0),
            ("charged $250", 2.0),
            ("racked up over $7,000", 2.0),
            ("inflated charges", 2.0),
'''
    src = insert_before(src, ANCHOR_BT_SEV, NEW_BT_SEV)
    changes.append("billing_transparency/severe_negative: non-refundable, never received a refund, +3")


# ═══════════════════════════════════════════════════════════════════════════
# 8. timeliness_progress / severe_negative
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_TP_SEV = '            ("taken more then 2 years", 2.0),\n        ],'
if ANCHOR_TP_SEV in src and '("two years and still waiting"' not in src:
    NEW_TP_SEV = '''\
            # --- real-reviews wave A ---
            ("two years and still waiting", 2.0),
            ("more then 2 years", 2.0),
            ("over two years and still", 2.0),
            ("went 2 and a half years", 2.0),
            ("five months with no progress", 1.5),
'''
    src = insert_before(src, ANCHOR_TP_SEV, NEW_TP_SEV)
    changes.append("timeliness_progress/severe_negative: two years and still waiting, +4")


# ═══════════════════════════════════════════════════════════════════════════
# 9. outcome_satisfaction / negative
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_OS_NEG = '            ("had to hire another attorney", 1.5),\n        ],'
if ANCHOR_OS_NEG in src and '("never received a refund"' not in src:
    # Note: "never received a refund" already added to billing — use different phrase
    pass  # already handled by billing; outcome covered by "had to hire another attorney" already present

# Also add "stuck without legal counsel" which maps to outcome
ANCHOR_OS_NEG2 = '            ("had to hire another attorney", 1.5),\n        ],'
if ANCHOR_OS_NEG2 in src and '("stuck without legal counsel"' not in src:
    NEW_OS_NEG2 = '''\
            # --- real-reviews wave A ---
            ("stuck without legal counsel", 2.0),
            ("never got proper legal help from him", 2.0),
            ("nothing was completed at all", 1.5),
            ("had to hire another attorney", 1.5),
'''
    # Only insert if anchor still present AND "stuck without legal counsel" not yet there
    # Check: "had to hire another attorney" is already in phrases - don't double-add
    if '("stuck without legal counsel"' not in src:
        # Find the existing entry and insert after it instead
        existing = '            ("had to hire another attorney", 1.5),'
        if existing in src and '("stuck without legal counsel"' not in src:
            src = src.replace(
                existing,
                existing + '\n            ("stuck without legal counsel", 2.0),\n            ("never got proper legal help from him", 2.0),\n            ("nothing was completed at all", 1.5),',
                1
            )
            changes.append("outcome_satisfaction/negative: stuck without legal counsel, never got proper legal help, +1")


# ═══════════════════════════════════════════════════════════════════════════
# 10. office_staff_experience / negative  
# ═══════════════════════════════════════════════════════════════════════════
ANCHOR_OSE_NEG = '            ("not friendly at all", 1.5),\n            ("waiting room felt outdated and unprofessional", 1.0),\n        ],'
if ANCHOR_OSE_NEG in src and '("complete attitude"' not in src:
    NEW_OSE_NEG = '''\
            # --- real-reviews wave A ---
            ("complete attitude", 1.5),
            ("complete attitude every call", 2.0),
            ("absolutely no compassion", 1.5),
            ("paralegal is assigned to your case", 1.0),
            ("you can't ever talk to an actual lawyer", 1.5),
            ("completely inept at their job", 1.5),
'''
    src = insert_before(src, ANCHOR_OSE_NEG, NEW_OSE_NEG)
    changes.append("office_staff_experience/negative: complete attitude, paralegal assigned, +4")


# ═══════════════════════════════════════════════════════════════════════════
# Write + report
# ═══════════════════════════════════════════════════════════════════════════
if not changes:
    print("No changes needed — all phrases already present.")
    sys.exit(0)

ENGINE.write_text(src, encoding="utf-8")
print(f"Patched {ENGINE.name}: {len(src) - original_len:+d} bytes")
print(f"{len(changes)} phrase groups added:")
for c in changes:
    print(f"  + {c}")
