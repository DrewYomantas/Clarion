"""Legacy smoke tests kept compatible with current UX copy and CSRF settings."""

import os
import tempfile
from io import BytesIO

import pytest

os.environ.setdefault('SECRET_KEY', 'test-secret')

from app import app, db_connect, init_db
import app as app_module
from config import _redact_url_credentials as redact_config_url_credentials
from db_compat import DatabaseConnector


@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    sqlite_url = f'sqlite:///{db_path}'
    original_connector = app_module._db_connector
    app_module._db_connector = DatabaseConnector(sqlite_url)
    app.config.update(
        DATABASE_URL=sqlite_url,
        TESTING=True,
        WTF_CSRF_ENABLED=False,
        MAIL_ENABLED=False,
    )
    with app.app_context():
        init_db()
    with app.test_client() as c:
        yield c
    app_module._db_connector = original_connector
    os.close(db_fd)
    os.unlink(db_path)


def login_admin(client):
    conn = db_connect()
    c = conn.cursor()
    c.execute("UPDATE users SET email_verified = 1 WHERE username = 'admin'")
    conn.commit()
    conn.close()
    return client.post('/login', data={'username': 'admin', 'password': 'changeme123'}, follow_redirects=True)


def test_connection_url_redaction_helpers_hide_credentials():
    raw = 'postgresql://clarion:secret-pass@localhost:5433/clarion_test'
    expected = 'postgresql://***:***@localhost:5433/clarion_test'
    assert app_module._redact_url_credentials(raw) == expected
    assert redact_config_url_credentials(raw) == expected
    assert 'secret-pass' not in app_module._redact_url_credentials(raw)


def test_two_factor_mail_disabled_only_logs_codes_in_dev_or_test(client):
    user = app_module.load_user(1)
    assert user is not None

    original_testing = app.config.get('TESTING')
    original_debug = app.config.get('DEBUG')
    original_mail_enabled = app.config.get('MAIL_ENABLED')
    try:
        app.config.update(TESTING=False, DEBUG=False, MAIL_ENABLED=False)
        with pytest.raises(RuntimeError, match='MAIL_ENABLED'):
            app_module._create_two_factor_challenge(user)
    finally:
        app.config.update(TESTING=original_testing, DEBUG=original_debug, MAIL_ENABLED=original_mail_enabled)


def test_home_page_loads(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'Clarion' in response.data


def test_feedback_form_loads(client):
    response = client.get('/feedback')
    assert response.status_code == 200


def test_login_page_loads(client):
    response = client.get('/login')
    assert response.status_code == 200


def test_invalid_login(client):
    response = client.post('/login', data={'username': 'wronguser', 'password': 'wrongpass'}, follow_redirects=False)
    assert response.status_code == 302
    assert response.headers['Location'].endswith('/login')


def test_csv_upload_requires_auth(client):
    response = client.get('/upload')
    assert response.status_code == 302


def test_invalid_csv_upload(client):
    login_admin(client)
    conn = db_connect(); cur = conn.cursor()
    cur.execute("INSERT OR REPLACE INTO user_email_verification (user_id, verified_at) VALUES (1, '2024-01-01T00:00:00+00:00')")
    conn.commit(); conn.close()
    response = client.post('/upload', data={'file': (BytesIO(b'test'), 'test.txt')}, content_type='multipart/form-data', follow_redirects=False)
    assert response.status_code == 302
    assert response.headers['Location'].endswith('/upload')


def test_csv_upload_with_valid_data(client):
    login_admin(client)
    conn = db_connect(); cur = conn.cursor()
    cur.execute("INSERT OR REPLACE INTO user_email_verification (user_id, verified_at) VALUES (1, '2024-01-01T00:00:00+00:00')")
    conn.commit(); conn.close()
    csv_data = b'date,rating,review_text\n2024-01-15,5,Great legal services'
    response = client.post('/upload', data={'file': (BytesIO(csv_data), 'reviews.csv')}, content_type='multipart/form-data', follow_redirects=True)
    assert response.status_code == 200


def test_pdf_download_without_reviews(client):
    login_admin(client)
    response = client.get('/download-pdf', follow_redirects=False)
    assert response.status_code == 302
    assert response.headers['Location'].endswith('/dashboard')

