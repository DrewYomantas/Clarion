# Clarion Agent Instructions

## Working Root

This file lives at the repository root. Use this directory as the working root:

```text
C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main
```

The parent `CLARION/` folder is not the repo root.

## Product Truth

Clarion is a law-firm client-feedback governance platform. It turns uploaded feedback into a partner-ready governance brief, assigned follow-through, and a repeatable review cycle.

The governance brief is the product. Treat dashboards, signals, upload, PDF, and email as supporting surfaces.

Read these before meaningful changes:

1. `docs/NORTH_STAR.md`
2. `docs/PROJECT_STATE.md`
3. `docs/AI_WORKING_RULES.md`
4. `docs/ENGINEERING_PRACTICES.md`

## Stack

- Backend: Python/Flask in `backend/`
- Frontend: React/TypeScript/Vite in `frontend/`
- Local database: SQLite
- Production database: PostgreSQL
- Deployment: Render

## Commands

```bash
# Frontend
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run test

# Backend
cd backend
venv312\Scripts\pip install -r requirements.txt
venv312\Scripts\python.exe app.py
venv312\Scripts\pytest tests/
```

## Guardrails

- Keep changes scoped to the requested surface.
- Prefer repo patterns over new abstractions.
- Do not commit `.env`, database files, logs, generated PDFs, or local run artifacts.
- Do not reset or overwrite local databases without explicit approval.
- `backend/app.py`, `backend/services/governance_insights.py`, `backend/services/benchmark_engine.py`, and `backend/pdf_generator.py` are high-blast-radius files. Read surrounding code and tests before editing them.
- If changing product copy or UX, keep the brief-first product thesis intact.
