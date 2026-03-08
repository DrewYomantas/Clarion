# Clarion

A Flask-based SaaS application for collecting and analyzing client feedback for law firms.

## Features

- **Client Feedback Submission**: Public form for clients to leave reviews
- **CSV Upload**: Bulk import historical reviews via CSV
- **Analysis Dashboard**: View statistics, themes, and insights
- **PDF Reports**: Generate professional PDF summaries
- **Admin Authentication**: Secure access to admin features

## Quick Start

### 1. Set up Python environment

> **Important:** This project requires the `venv312` virtual environment located at
> `backend/venv312/`. Always use `venv312\Scripts\python.exe` (Windows) or
> `venv312/bin/python` (Linux/macOS) — never the system `python` or `py` commands.
> The project dependencies (`python-dotenv`, `resend`, `flask`, etc.) are installed
> only in `venv312`. Using system Python will silently skip `.env` loading and cause
> email delivery to report "not configured".

```bash
# Create virtual environment (only needed if venv312 is missing)
python -m venv venv312

# Activate — Windows PowerShell:
venv312\Scripts\Activate.ps1
# Activate — Windows CMD:
venv312\Scripts\activate.bat
# Activate — macOS/Linux:
source venv312/bin/activate
```

### 2. Install dependencies

```bash
# With venv312 activated:
pip install -r requirements.txt

# Or explicitly without activation:
venv312\Scripts\pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the `backend/` directory (see `config.example.py` for all variables):

```bash
cp config.example.py .env   # then edit .env
```

Required at minimum:
- `SECRET_KEY`: Random string for session security
- `ADMIN_USERNAME` / `ADMIN_PASSWORD`: Admin login credentials
- `FIRM_NAME`: Your law firm name
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL`: For transactional email delivery

### 4. Run the application

**Development (Windows — recommended):**
```bat
cd backend
start.bat
```
`start.bat` guards against wrong-interpreter startup automatically.

**Development (explicit interpreter):**
```bash
# Windows CMD/PowerShell — always use venv312 explicitly:
cd backend
venv312\Scripts\python.exe app.py
```

**Production (Gunicorn via venv312):**
```bash
cd backend
venv312\Scripts\gunicorn -c gunicorn.conf.py app:app
```

The app will be available at `http://localhost:5000` (dev) or the port set by `PORT` env var (prod).

## CSV Format

When uploading reviews via CSV, use this format:

```csv
date,rating,review_text
2024-01-15,5,"Excellent service and communication throughout my case."
2024-01-14,4,"Very professional and knowledgeable attorneys."
2024-01-13,2,"Response times could be better."
```

**Required columns:**
- `date`: Date in YYYY-MM-DD format
- `rating`: Integer from 1 to 5
- `review_text`: Review content (use quotes if contains commas)

## Running Tests

```bash
# Always run pytest through venv312:
venv312\Scripts\pytest tests/
```

## Deployment

## Launch runbook

For production go-live, use the launch checklist at [`docs/launch-day-runbook.md`](docs/launch-day-runbook.md).


### Render/Railway

1. Connect your Git repository
2. Set environment variables in the platform dashboard
3. The app will automatically detect `PORT` from environment
4. Deploy command: `gunicorn -c gunicorn.conf.py app:app`
   (Platform build step installs requirements.txt into the platform's managed venv — no manual venv path needed in cloud deployments.)

### Environment Variables for Production

```
SECRET_KEY=<random-secret-key>
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<secure-password>
FIRM_NAME=<Your Law Firm Name>
DATABASE_PATH=feedback.db
FLASK_ENV=production
RESEND_API_KEY=<your-resend-key>
RESEND_FROM_EMAIL=Clarion <noreply@yourdomain.com>
```

## Project Structure

```
law-firm-feedback/
├── app.py                  # Main Flask application
├── config.py               # Configuration settings
├── gunicorn.conf.py        # Gunicorn worker config
├── start.bat               # Windows venv312-pinned launcher (dev)
├── pdf_generator.py        # PDF report generation
├── requirements.txt        # Python dependencies
├── venv312/                # Project virtual environment (Python 3.12)
├── templates/              # HTML templates
├── static/
│   └── css/
│       └── main.css       # Styling
├── tests/                 # Test files
└── scripts/               # Admin/ops utilities
```

## Default Admin Credentials

**Username:** `admin`
**Password:** `changeme123`

⚠️ **Important:** Change these immediately in production!

## Features Overview

### Client-Facing
- **Landing Page** (`/`): Introduction and call-to-action
- **Feedback Form** (`/feedback`): Submit new reviews
- **Thank You Page** (`/thank-you`): Confirmation after submission

### Admin Dashboard
- **Login** (`/login`): Secure admin access
- **Dashboard** (`/dashboard`): View analysis and statistics
- **CSV Upload** (`/upload`): Bulk import reviews
- **PDF Download** (`/download-pdf`): Generate report

## Support

For issues or questions, please open an issue in the repository.

## License

MIT License
