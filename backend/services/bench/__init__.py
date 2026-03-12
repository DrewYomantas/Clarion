"""
services/bench
==============
Internal calibration harness.  Compares the deterministic keyword scoring
engine against AI benchmark labels from OpenRouter.

NOT imported by any production path.  Loaded only when the /internal/bench
routes are registered at startup (controlled by BENCH_ENABLED env var).
"""
