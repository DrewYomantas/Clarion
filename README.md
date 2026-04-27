# Clarion

Client-feedback governance software for law firms.

Clarion turns uploaded client reviews into structured governance signals, assigned follow-through, and a partner-ready brief that can be reviewed on screen, exported to PDF, or sent by email.

The core product is the governance brief. The dashboard, signal views, action records, billing, and calibration tools exist to support that repeatable review cycle.

## Live Surfaces

| Surface | URL |
| --- | --- |
| Public site | https://law-firm-feedback-saas.onrender.com |
| Sample governance brief | https://law-firm-feedback-saas.onrender.com/demo/reports/sample |
| Sample workspace | https://law-firm-feedback-saas.onrender.com/demo |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Python, Flask |
| Database | SQLite for local development, PostgreSQL for production |
| Hosting | Render |
| Billing | Stripe |
| Email | Resend / SMTP-compatible mail configuration |
| PDF | ReportLab |
| Monitoring | Sentry |

## Repository Structure

```text
backend/              Flask app, services, PDF generation, tests
frontend/             React/Vite app, Playwright and Vitest tests
docs/                 Product state, engineering rules, launch notes
automation/           Calibration and benchmark workflow scripts
data/calibration/     Canonical benchmark inputs and calibration metadata
Clarion-Agency/       Internal agent-office experiment and operating docs
tools/                Local smoke-test and seeded-workspace helpers
```

The SPA plus `/api/*` backend is the primary product path. Legacy Flask-rendered pages still exist for compatibility and local operational flows, but they are no longer the architectural center of the product.

## Local Setup

Requirements:

- Python 3.11+
- Node.js 18+
- npm

Backend:

```bash
cd backend
python -m venv venv312
venv312\Scripts\pip install -r requirements.txt
copy config.example.py .env
venv312\Scripts\python.exe app.py
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies `/api/*` requests to the Flask backend.

## Useful Commands

```bash
# Frontend
cd frontend
npm run build
npm run lint
npm run test

# Backend focused tests
cd backend
venv312\Scripts\pytest tests/

# Benchmark engine tests from repo root
python -m pytest backend/tests/test_benchmark_engine.py
```

## Current State

Clarion is an active solo-dev product, not a polished open-source package. The main app is usable and deployed, but the codebase still carries deliberate early-stage tradeoffs:

- `backend/app.py` is a large Flask monolith.
- Auth, account, team, billing, support, and firm-creation API lanes are now split into `backend/routes/` modules while the main app keeps the existing app/session model.
- Calibration data and benchmark artifacts are still evolving.
- Production deployment runs on Render and may require manual redeploy checks.
- The authenticated product has been through several visual and workflow passes, but broader cleanup remains planned.
- PostgreSQL is the production target, but launch claims still depend on focused Postgres smoke verification for critical flows.

For current product truth, read:

1. `docs/NORTH_STAR.md`
2. `docs/PROJECT_STATE.md`
3. `docs/AI_WORKING_RULES.md`
4. `docs/ENGINEERING_PRACTICES.md`

## Security Notes

- Do not commit `.env`, database files, logs, generated PDFs, or local run artifacts.
- Real credentials belong outside the repo.
- `backend/config.py` reads secrets from environment variables and rejects weak production secrets.
- Local SQLite files are intentionally ignored.

## License

MIT. See `backend/LICENSE.txt`.
