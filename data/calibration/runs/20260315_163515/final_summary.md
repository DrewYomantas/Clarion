# Clarion Calibration Run Summary
**Run:** `2026-03-15T21:35:28.085559Z`
**AI Benchmark:** enabled

## Review Counts
| Source | Count |
|--------|-------|
| Real   | 59 |
| Synthetic | 0 |
| **Total submitted** | **59** |

## Per-Star Distribution
| Star | Real | Synthetic | Total |
|------|------|-----------|-------|
| 1★ | 11 | 0 | 11 |
| 2★ | 8 | 0 | 8 |
| 3★ | 8 | 0 | 8 |
| 4★ | 14 | 0 | 14 |
| 5★ | 18 | 0 | 18 |

## Batch Execution
- Chunks run: 3
- Succeeded: 0
- Failed/timed out: 3

### Failed Chunks
- Chunk 1: HTTPConnectionPool(host='localhost', port=5000): Max retries exceeded with url: /internal/benchmark/batch (Caused by NewConnectionError("HTTPConnection(host='localhost', port=5000): Failed to establish a new connection: [WinError 10061] No connection could be made because the target machine actively refused it")) (4.1s)
- Chunk 2: HTTPConnectionPool(host='localhost', port=5000): Max retries exceeded with url: /internal/benchmark/batch (Caused by NewConnectionError("HTTPConnection(host='localhost', port=5000): Failed to establish a new connection: [WinError 10061] No connection could be made because the target machine actively refused it")) (4.0s)
- Chunk 3: HTTPConnectionPool(host='localhost', port=5000): Max retries exceeded with url: /internal/benchmark/batch (Caused by NewConnectionError("HTTPConnection(host='localhost', port=5000): Failed to establish a new connection: [WinError 10061] No connection could be made because the target machine actively refused it")) (4.1s)

## Next Actions
- Collect more real reviews for: 1★ (+4), 2★ (+7), 3★ (+12), 4★ (+6), 5★ (+12)
- Re-run failed chunks after checking backend logs
- ⚠️ Only 59 real reviews — aim for 75+ before trusting calibration results