# Clarion Backend

Flask backend for Clarion's authentication, workspace data, review upload, governance signal generation, billing hooks, PDF generation, and email delivery.

The primary production surface is the SPA-backed `/api/*` contract. Legacy Flask-rendered pages remain in place as compatibility paths for older flows and operational convenience.

## Setup

```bash
python -m venv venv312
venv312\Scripts\pip install -r requirements.txt
copy config.example.py .env
venv312\Scripts\python.exe app.py
```

On macOS/Linux, use the equivalent `venv312/bin/python` and `venv312/bin/pip` paths.

## Environment

Configuration is read from environment variables. For local development, copy `config.example.py` to `.env` and fill in real values locally. Do not commit `.env`.

Required for a useful local run:

- `SECRET_KEY`
- `ADMIN_EMAIL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `FIRM_NAME`

Required for production features:

- `DATABASE_URL`
- `REDIS_URL`
- `RESEND_API_KEY` or SMTP mail variables
- `STRIPE_SECRET_KEY`
- Stripe price IDs and webhook secret
- `SENTRY_DSN`

## Tests

```bash
venv312\Scripts\pytest tests/
```

From the repository root, the focused benchmark test can also be run with:

```bash
python -m pytest backend/tests/test_benchmark_engine.py
```

The focused PostgreSQL smoke suite is opt-in because it resets the target database schema:

```bash
set CLARION_POSTGRES_TEST_DATABASE_URL=postgresql://clarion:clarion_dev@localhost:5432/clarion_test
venv312\Scripts\pytest tests/test_postgres_smoke.py
```

## Important Files

| Path | Purpose |
| --- | --- |
| `app.py` | Main Flask monolith and route surface |
| `config.py` | Environment-backed runtime configuration |
| `routes/` | Extracted API route lanes for auth, account, team, firms, billing, and support |
| `services/benchmark_engine.py` | Deterministic governance theme classifier |
| `services/governance_insights.py` | Signal and action generation |
| `pdf_generator.py` | ReportLab governance brief PDF generation |
| `tests/` | Backend test suite |

## Production Notes

- Production should set `APP_ENV=production` or `FLASK_ENV=production`.
- `config.py` rejects missing or weak production secrets.
- Local SQLite is for development only; production should use `DATABASE_URL`.
- Redis-backed rate limiting should be configured in production with `REDIS_URL`.
- Focused PostgreSQL smoke verification is still a release gate even though the SQLite regression suite is green.
