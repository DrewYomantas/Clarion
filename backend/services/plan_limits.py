"""Central, server-authoritative plan limits for Clarion."""

PLAN_LIMITS = {
    "free": {
        "max_users": 1,
        "max_reviews_per_upload": 50,
        "max_reports_per_month": 1,
        "history_days": 90,
        "pdf_watermark": True,
    },
    "team": {
        "max_users": None,  # Unlimited seats
        "max_reviews_per_upload": 250,
        "max_reports_per_month": 10,
        "history_days": 365,
        "pdf_watermark": False,
    },
    "firm": {
        "max_users": None,  # Unlimited seats
        "max_reviews_per_upload": 1000,
        "max_reports_per_month": None,
        "history_days": None,
        "pdf_watermark": False,
    },
}

