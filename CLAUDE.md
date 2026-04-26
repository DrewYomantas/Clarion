# Clarion Claude Code Instructions

## Working Directory

Use `law-firm-insights-main/` as the working root. The parent `CLARION/` directory contains local support files and is not the canonical source tree.

## Product Direction

Clarion is a law-firm client-feedback governance platform. It turns uploaded feedback into structured governance signals, assigned follow-through, and a partner-ready brief.

The governance brief is the product. It is not a generic analytics dashboard or AI-insights demo.

## Startup Reads

Read these before meaningful code changes:

1. `docs/NORTH_STAR.md`
2. `docs/PROJECT_STATE.md`
3. `docs/AI_WORKING_RULES.md`
4. `docs/ENGINEERING_PRACTICES.md`

## Stack

- Backend: Python/Flask in `backend/`
- Frontend: React/TypeScript/Vite in `frontend/`
- Database: SQLite locally, PostgreSQL in production
- Deployment: Render
- Internal agent-office experiment: `Clarion-Agency/`

## Commands

```bash
# Backend
cd backend
venv312\Scripts\pip install -r requirements.txt
venv312\Scripts\python.exe app.py
venv312\Scripts\pytest tests/

# Frontend
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run test
```

## Protected Systems

- Do not reset or overwrite local database files without explicit approval.
- Do not commit `.env`, database files, logs, generated PDFs, or local run artifacts.
- Treat `backend/app.py`, `backend/services/governance_insights.py`, `backend/services/benchmark_engine.py`, and `backend/pdf_generator.py` as high-blast-radius files.
- Keep product copy grounded in the actual state shown by the app.

## Git

- Remote: `https://github.com/DrewYomantas/Clarion.git`
- Branch: `main`
- Commit messages should be concise and imperative.
