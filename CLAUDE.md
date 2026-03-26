# CLARION — Claude Code Instructions

## What This Is
Law-firm client feedback governance platform. Turns uploaded feedback into structured partner-ready briefs, action records, and repeatable review cycles.
- **Not** analytics software. **Not** a dashboard. The governance brief is the product.
- Live on Render: https://law-firm-feedback-saas.onrender.com
- GitHub: https://github.com/DrewYomantas/Clarion

## ⚠️ Working Directory
This file lives at `law-firm-insights-main/`. Always open this directory as your working root.
The parent `CLARION/` directory contains backup folders — those are NOT canonical source.

## Tech Stack
- **Backend:** Python/Flask (`backend/app.py` — Flask monolith)
- **Frontend:** React + TypeScript + Vite (`frontend/src/`) — use `bun`, not npm, for frontend deps
- **Database:** SQLite (`backend/lawfirm_feedback.db`) — do not delete, reset, or overwrite carelessly
- **Agent office:** `Clarion-Agency/` — 21-agent autonomous ops system

## Session Startup (every session)
Read these four docs before touching code:
1. `docs/NORTH_STAR.md` — product identity and design direction
2. `docs/PROJECT_STATE.md` — live state and current pass priorities
3. `docs/AI_WORKING_RULES.md` — pass discipline, scope rules, protected systems
4. `docs/ENGINEERING_PRACTICES.md` — hygiene standards and known debt

## Commands
```bash
# Backend
cd law-firm-insights-main
source backend/venv312/bin/activate  # or: backend/venv312/Scripts/activate (Windows)
python backend/app.py

# Frontend
cd frontend
bun install
bun dev           # dev server
bun build         # production build → frontend/dist/

# E2E tests
bun test:e2e      # requires reset scripts — see frontend/package.json
```

## Key Files
| Path | Purpose |
|------|---------|
| `backend/app.py` | Flask monolith — all routes |
| `backend/lawfirm_feedback.db` | SQLite DB — protected |
| `frontend/src/pages/` | React page components |
| `docs/PROJECT_STATE.md` | Current live state — read first |
| `Clarion-Agency/` | Agent office runtime |

## Protected Systems
- `lawfirm_feedback.db` — never drop tables, truncate, or reset without explicit approval
- `docs/CHANGELOG_AI.md` — append-only, never edit past entries
- Pass discipline: one goal per pass. See `docs/AI_WORKING_RULES.md`.

## Git
- Remote: `origin → https://github.com/DrewYomantas/Clarion.git`
- Branch: main
- Render may need manual redeploy if webhook is stale — see PROJECT_STATE.md

## Hygiene
- `diag_*.py` scripts in repo root are diagnostic utilities — read before running, confirm not destructive
- `backend/exports/`, `backend/logs/`, `data/calibration/runs/` are gitignored
- Backup folders in parent `CLARION/` directory are stale and can be deleted
