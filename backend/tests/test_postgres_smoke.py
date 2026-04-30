import os
import uuid
from io import BytesIO

import pytest

os.environ.setdefault("SECRET_KEY", "test-secret")

from app import app, create_email_verification_token, db_connect, init_db
import app as app_module
from db_compat import DatabaseConnector
from services.email_service import EmailDeliveryResult


POSTGRES_URL_ENV = "CLARION_POSTGRES_TEST_DATABASE_URL"


def _postgres_test_url():
    database_url = (os.environ.get(POSTGRES_URL_ENV) or "").strip()
    if not database_url:
        pytest.skip(f"set {POSTGRES_URL_ENV} to run the Postgres smoke suite")

    lowered = database_url.lower()
    if not lowered.startswith(("postgres://", "postgresql://")):
        pytest.skip(f"{POSTGRES_URL_ENV} must be a PostgreSQL URL")

    local_target = any(host in lowered for host in ("localhost", "127.0.0.1", "::1"))
    if not local_target and os.environ.get("CLARION_ALLOW_REMOTE_POSTGRES_TEST") != "1":
        pytest.skip("remote Postgres smoke requires CLARION_ALLOW_REMOTE_POSTGRES_TEST=1")

    return database_url


def _reset_public_schema(connector):
    conn = connector.connect()
    c = conn.cursor()
    c.execute("DROP SCHEMA IF EXISTS public CASCADE")
    c.execute("CREATE SCHEMA public")
    conn.commit()
    conn.close()


@pytest.fixture()
def postgres_client(monkeypatch):
    database_url = _postgres_test_url()
    connector = DatabaseConnector(database_url)
    assert connector.is_postgres

    _reset_public_schema(connector)

    original_connector = app_module._db_connector
    app_module._db_connector = connector
    app.config.update(
        DATABASE_URL=database_url,
        TESTING=True,
        WTF_CSRF_ENABLED=False,
        MAIL_ENABLED=False,
    )
    monkeypatch.setattr(
        app_module,
        "send_verification_email_with_result",
        lambda *args, **kwargs: EmailDeliveryResult(success=True, provider="test", from_email="Clarion <test@example.com>"),
    )

    with app.app_context():
        init_db()

    try:
        with app.test_client() as client:
            yield client
    finally:
        app_module._db_connector = original_connector
        connector._engine.dispose()


def _verify_email(client, email):
    conn = db_connect()
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE email = ?", (email,))
    row = c.fetchone()
    conn.close()
    assert row is not None
    token = create_email_verification_token(row[0], email)
    response = client.get(f"/api/auth/verify-email/{token}")
    assert response.status_code in (200, 302)


def test_postgres_launch_critical_flow(postgres_client):
    email = f"pg-smoke-{uuid.uuid4().hex[:10]}@example.com"
    password = "StrongPass1!"

    register_response = postgres_client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Postgres Smoke User",
            "firm_name": "Postgres Smoke LLP",
        },
    )
    assert register_response.status_code == 201
    assert register_response.get_json().get("success") is True

    _verify_email(postgres_client, email)

    login_response = postgres_client.post("/api/auth/login", json={"email": email, "password": password})
    assert login_response.status_code == 200
    assert login_response.get_json().get("success") is True

    firm_response = postgres_client.post("/api/firms/create", json={"name": "Postgres Smoke LLP"})
    assert firm_response.status_code in (200, 201)
    firm_body = firm_response.get_json()
    assert firm_body.get("success") is True
    firm_id = int(firm_body.get("firm_id") or 0)
    assert firm_id > 0

    csv_payload = "\n".join(
        [
            "date,rating,review_text",
            "2026-04-01,5,The team communicated clearly and kept us informed.",
            "2026-04-02,2,Progress updates were slow and expectations were unclear.",
            "2026-04-03,4,The result was strong after the partner got involved.",
        ]
    ).encode("utf-8")
    upload_response = postgres_client.post(
        "/api/upload",
        data={"file": (BytesIO(csv_payload), "postgres-smoke.csv")},
        content_type="multipart/form-data",
    )
    assert upload_response.status_code == 200
    upload_body = upload_response.get_json()
    assert upload_body.get("success") is True
    report_id = int((upload_body.get("summary") or {}).get("report_id") or 0)
    assert report_id > 0

    detail_response = postgres_client.get(f"/api/reports/{report_id}")
    assert detail_response.status_code == 200
    detail_body = detail_response.get_json()
    assert detail_body.get("success") is True
    assert int((detail_body.get("report") or {}).get("id") or 0) == report_id

    pdf_response = postgres_client.get(f"/api/reports/{report_id}/pdf")
    assert pdf_response.status_code == 200
    assert pdf_response.data.startswith(b"%PDF")

    conn = db_connect()
    c = conn.cursor()
    c.execute("SELECT pdf_blob FROM report_pdf_artifacts WHERE report_id = ?", (report_id,))
    artifact_row = c.fetchone()
    conn.close()
    assert artifact_row is not None
    assert bytes(artifact_row[0]).startswith(b"%PDF")
