from __future__ import annotations

from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request, send_from_directory, session
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

import app as app_module


auth_bp = Blueprint("auth_routes", __name__)


@auth_bp.route("/api/auth/forgot-password", methods=["POST"])
@app_module.limiter.limit("5 per hour")
def api_auth_forgot_password():
    try:
        payload = request.get_json(silent=True) or {}
        email = (payload.get("email") or "").strip().lower()
        if not app_module.is_valid_email(email):
            return jsonify({"success": False, "error": "A valid email address is required."}), 400
        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("SELECT id FROM users WHERE email = ? OR username = ?", (email, email))
        row = c.fetchone()
        if row:
            token = app_module.secrets.token_urlsafe(32)
            expires_at = (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
            c.execute(
                "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
                (row[0], token, expires_at),
            )
            conn.commit()
            reset_link = f"{app_module._resolve_public_app_base_url()}/reset-password/{token}"
            app_module.send_password_reset_email(
                email,
                reset_link,
                app_module.app.config.get("FIRM_NAME", "Clarion"),
            )
        conn.close()
        return jsonify({"success": True, "message": "If that address is registered, a reset link has been sent."}), 200
    except Exception as exc:
        app_module.app.logger.exception("api_auth_forgot_password error: %s", exc)
        return jsonify({"success": False, "error": "Unable to process request. Please try again."}), 500


@auth_bp.route("/api/auth/reset-password/<token>", methods=["GET"])
@app_module.limiter.limit("20 per hour")
def api_auth_reset_password_validate(token):
    try:
        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("SELECT id, expires_at, used_at FROM password_reset_tokens WHERE token = ?", (token,))
        row = c.fetchone()
        conn.close()
        if not row:
            return jsonify({"valid": False, "reason": "invalid"}), 200
        expires_at = datetime.fromisoformat(row[1])
        if row[2]:
            return jsonify({"valid": False, "reason": "used"}), 200
        if expires_at < datetime.now(timezone.utc):
            return jsonify({"valid": False, "reason": "expired"}), 200
        return jsonify({"valid": True}), 200
    except Exception as exc:
        app_module.app.logger.exception("api_auth_reset_password_validate error: %s", exc)
        return jsonify({"valid": False, "reason": "error"}), 500


@auth_bp.route("/api/auth/reset-password/<token>", methods=["POST"])
@app_module.limiter.limit("10 per hour")
def api_auth_reset_password_submit(token):
    try:
        payload = request.get_json(silent=True) or {}
        password = payload.get("password") or ""
        confirm_password = payload.get("confirm_password") or ""
        ok_password, password_msg = app_module.validate_password_strength(password)
        if not ok_password:
            return jsonify({"success": False, "error": password_msg}), 400
        if password != confirm_password:
            return jsonify({"success": False, "error": "Passwords do not match."}), 400
        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("SELECT id, user_id, expires_at, used_at FROM password_reset_tokens WHERE token = ?", (token,))
        row = c.fetchone()
        if not row:
            conn.close()
            return jsonify({"success": False, "error": "Invalid or expired reset token."}), 400
        expires_at = datetime.fromisoformat(row[2])
        if row[3] or expires_at < datetime.now(timezone.utc):
            conn.close()
            return jsonify({"success": False, "error": "This reset link has expired. Please request a new one."}), 400
        password_hash = generate_password_hash(password)
        c.execute("UPDATE users SET password_hash = ? WHERE id = ?", (password_hash, row[1]))
        c.execute(
            "UPDATE password_reset_tokens SET used_at = ? WHERE id = ?",
            (datetime.now(timezone.utc).isoformat(), row[0]),
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Password reset successful. You can now sign in."}), 200
    except Exception as exc:
        app_module.app.logger.exception("api_auth_reset_password_submit error: %s", exc)
        return jsonify({"success": False, "error": "Unable to reset password. Please try again."}), 500


@auth_bp.route("/api/auth/login", methods=["POST"])
@app_module.csrf.exempt
@app_module.limiter.limit("5 per minute")
def api_login():
    try:
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""
        client_ip = app_module._get_client_ip()

        app_module.app.logger.debug(
            "login attempt api remote_addr=%s xff_raw=%s xfp=%s",
            client_ip,
            request.headers.get("X-Forwarded-For", "-"),
            request.headers.get("X-Forwarded-Proto", "-"),
        )

        if not email or not password:
            return jsonify({"success": False, "error": "Email and password are required"}), 400

        backoff_seconds = app_module._login_backoff_seconds(email, client_ip)
        if backoff_seconds > 0:
            app_module.time_module.sleep(backoff_seconds)

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            "SELECT id, password_hash FROM users WHERE email = ? OR username = ?",
            (email, email),
        )
        user_data = c.fetchone()
        conn.close()

        if user_data and check_password_hash(user_data[1], password):
            user = app_module.load_user(user_data[0])
            if user:
                if not app_module.is_email_verified(user.id) and not app_module._allow_dev_auth_shortcuts_for_email(user.email):
                    app_module._record_failed_login(email, client_ip)
                    app_module._log_security_event(user.id, "auth_login_blocked_unverified", metadata={"channel": "api"})
                    return jsonify({"success": False, "error": "Please verify your email before logging in."}), 403
                app_module._clear_failed_login(email, client_ip)
                if app_module._is_two_factor_required(user):
                    challenge_id = app_module._create_two_factor_challenge(user)
                    app_module._log_security_event(user.id, "auth_2fa_required", metadata={"channel": "api"})
                    return jsonify(
                        {
                            "success": True,
                            "requires_2fa": True,
                            "challenge_id": challenge_id,
                            "message": "Enter the 6-digit code sent to your email to complete sign-in.",
                        }
                    ), 202

                login_user(user, remember=True)
                app_module._log_security_event(user.id, "auth_login_success", metadata={"channel": "api"})
                return jsonify({"success": True, "user": app_module._user_response_payload(user)}), 200

        app_module._record_failed_login(email, client_ip)
        app_module._log_security_event(
            None,
            "auth_login_failed",
            metadata={
                "channel": "api",
                "identifier_type": "email" if "@" in email else "username",
                "has_identifier": 1 if bool(email) else 0,
            },
        )
        app_module.app.logger.warning("Failed login attempt ip=%s account=%s", client_ip, app_module._mask_identifier(email))
        return jsonify({"success": False, "error": "Invalid email or password"}), 401
    except Exception:
        return app_module._safe_api_error(
            "Login failed due to a server error. Please try again.",
            log_message="api_login failed",
        )


@auth_bp.route("/api/auth/2fa/verify", methods=["POST"])
@app_module.csrf.exempt
@app_module.limiter.limit("10 per 15 minutes")
def api_verify_two_factor():
    if not app_module.app.config.get("ENABLE_2FA"):
        return jsonify({"success": False, "error": "Two-factor authentication is not enabled."}), 404

    payload = request.get_json(silent=True) or {}
    challenge_id = (payload.get("challenge_id") or "").strip()
    code = (payload.get("code") or "").strip()

    if not challenge_id or not code:
        return jsonify({"success": False, "error": "Challenge ID and code are required."}), 400

    try:
        verification = app_module._verify_two_factor_challenge_code(challenge_id, code)
        if not verification["ok"]:
            app_module._log_security_event(
                None,
                "auth_2fa_failed",
                metadata={"channel": "api", "status": int(verification.get("status") or 0)},
            )
            return jsonify({"success": False, "error": verification["error"]}), verification["status"]

        user = app_module.load_user(verification["user_id"])
        if not user:
            return jsonify({"success": False, "error": "Account not found."}), 404

        login_user(user, remember=True)
        app_module._log_security_event(user.id, "auth_2fa_success", metadata={"channel": "api"})
        return jsonify({"success": True, "user": app_module._user_response_payload(user)}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to verify your security code right now.",
            log_message="api_verify_two_factor failed",
        )


@auth_bp.route("/api/auth/2fa/enable", methods=["POST"])
@login_required
def api_enable_two_factor():
    if not app_module.app.config.get("ENABLE_2FA"):
        return jsonify({"success": False, "error": "Two-factor authentication is not enabled."}), 404

    payload = request.get_json(silent=True) or {}
    password = payload.get("password") or ""
    if not password:
        return jsonify({"success": False, "error": "Password is required."}), 400

    try:
        if not app_module._check_password_for_user(current_user.id, password):
            return jsonify({"success": False, "error": "Invalid password."}), 401

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            """
            UPDATE users
            SET two_factor_enabled = 1, two_factor_method = 'email'
            WHERE id = ?
            """,
            (current_user.id,),
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True, "two_factor_enabled": True}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to enable two-factor authentication.",
            log_message="api_enable_two_factor failed",
        )


@auth_bp.route("/api/auth/2fa/disable", methods=["POST"])
@login_required
def api_disable_two_factor():
    if not app_module.app.config.get("ENABLE_2FA"):
        return jsonify({"success": False, "error": "Two-factor authentication is not enabled."}), 404

    payload = request.get_json(silent=True) or {}
    password = payload.get("password") or ""
    if not password:
        return jsonify({"success": False, "error": "Password is required."}), 400

    try:
        if not app_module._check_password_for_user(current_user.id, password):
            return jsonify({"success": False, "error": "Invalid password."}), 401

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            """
            UPDATE users
            SET two_factor_enabled = 0
            WHERE id = ?
            """,
            (current_user.id,),
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True, "two_factor_enabled": False}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to disable two-factor authentication.",
            log_message="api_disable_two_factor failed",
        )


@auth_bp.route("/api/auth/register", methods=["POST"])
@app_module.csrf.exempt
@app_module.limiter.limit("5 per minute")
def api_register():
    try:
        data = request.get_json() or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""
        full_name = (data.get("full_name") or "").strip()
        firm_name = (data.get("firm_name") or "").strip()
        errors = {}

        if not app_module.is_valid_email(email):
            errors["email"] = "Enter a valid business email address."
        if firm_name and (len(firm_name) < 2 or len(firm_name) > app_module.MAX_FIRM_NAME_LENGTH):
            errors["firm_name"] = f"Firm name must be 2-{app_module.MAX_FIRM_NAME_LENGTH} characters."
        if len(full_name) < 2 or len(full_name) > 120:
            errors["full_name"] = "Enter your full name (2-120 characters)."

        ok_password, password_msg = app_module.validate_password_strength(password)
        if not ok_password:
            errors["password"] = password_msg

        if errors:
            return jsonify({"success": False, "error": "Validation failed", "errors": errors}), 400

        sanitized_firm_name = app_module.bleach.clean(firm_name, strip=True)
        stored_firm_name = sanitized_firm_name or app_module.app.config.get("FIRM_NAME", "Your Firm")
        password_hash = generate_password_hash(password)
        created_at = datetime.now(timezone.utc).isoformat()

        user_id = None
        for attempt in range(2):
            conn = None
            try:
                conn = app_module.db_connect()
                c = conn.cursor()
                c.execute("SELECT id FROM users WHERE email = ? OR username = ?", (email, email))
                existing = c.fetchone()
                if existing:
                    conn.close()
                    return jsonify({"success": False, "error": "An account with that email already exists"}), 409

                c.execute(
                    """
                    INSERT INTO users (
                        username,
                        email,
                        firm_name,
                        password_hash,
                        subscription_type,
                        created_at,
                        email_verified
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        email,
                        email,
                        stored_firm_name,
                        password_hash,
                        "trial",
                        created_at,
                        1 if app_module._allow_dev_auth_shortcuts_for_email(email) else 0,
                    ),
                )
                user_id = c.lastrowid
                c.execute("UPDATE users SET trial_limit = ? WHERE id = ?", (3, user_id))
                conn.commit()
                conn.close()
                break
            except app_module._DB_OPERATIONAL_ERRORS as exc:
                if conn is not None:
                    try:
                        conn.close()
                    except Exception:
                        pass
                missing_schema = "no such table" in str(exc).lower()
                if attempt == 0 and missing_schema:
                    app_module.app.logger.warning("api_register detected missing schema; running init_db() before retry.")
                    app_module.init_db()
                    continue
                raise

        delivery_status = app_module._verification_delivery_status()
        email_sent = False
        delivery_result = None
        if app_module._allow_dev_auth_shortcuts_for_email(email):
            app_module.app.logger.info("DEV_MODE internal auth shortcut: email verification skipped for %s", email)
        else:
            verification_token = app_module.create_email_verification_token(user_id, email)
            verify_link = app_module._public_verify_email_link(verification_token)
            delivery_result = app_module.send_email_verification_link_with_result(email, verify_link, stored_firm_name)
            email_sent = delivery_result.success

        delivery_payload = app_module._verification_delivery_response_payload(delivery_status, delivery_result)

        return jsonify(
            {
                "success": True,
                "verified": bool(app_module._allow_dev_auth_shortcuts_for_email(email)),
                "requires_verification": not app_module._allow_dev_auth_shortcuts_for_email(email),
                "verification_sent": bool(email_sent),
                **delivery_payload,
                "support_email": app_module.SUPPORT_EMAIL,
                "email": email,
            }
        ), 201
    except Exception as reg_exc:
        import traceback as reg_tb

        app_module.app.logger.error("[api_register] EXCEPTION: %s", reg_exc)
        app_module.app.logger.error("[api_register] %s", reg_tb.format_exc())

        return app_module._safe_api_error(
            "Registration failed due to a server error.",
            log_message="api_register failed",
        )


@auth_bp.route("/api/auth/me", methods=["GET"])
def api_get_me():
    if not current_user.is_authenticated:
        session.clear()
        return jsonify({"success": False, "error": "Not authenticated"}), 401

    try:
        if app_module._has_suspended_membership_without_active(current_user.id):
            logout_user()
            session.clear()
            return jsonify({"success": False, "error": "Session is no longer valid for this account."}), 403
        return jsonify({"success": True, "user": app_module._user_response_payload(current_user)}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to load session details.",
            log_message="api_get_me failed",
        )


@auth_bp.route("/api/auth/verify-email/<token>", methods=["GET"])
@app_module.csrf.exempt
@app_module.limiter.limit("30 per hour")
def api_verify_email(token):
    token_data, token_error = app_module.decode_email_verification_token(token)
    if token_error:
        return jsonify({"verified": False, "error": token_error}), 400

    try:
        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("SELECT id, email FROM users WHERE id = ?", (token_data["user_id"],))
        user_row = c.fetchone()
        if not user_row:
            conn.close()
            return jsonify({"verified": False, "error": "Verification token is not valid for an active account."}), 400

        now_iso = datetime.now(timezone.utc).isoformat()
        user_email = str(user_row[1] or "").strip().lower()
        purpose = token_data.get("purpose") or "signup"

        if purpose == "email_change":
            c.execute(
                """
                SELECT pending_email
                FROM pending_email_changes
                WHERE user_id = ?
                """,
                (token_data["user_id"],),
            )
            pending_row = c.fetchone()
            if not pending_row:
                conn.close()
                return jsonify({"verified": False, "error": "No pending email change was found for this account."}), 400

            pending_email = str(pending_row[0] or "").strip().lower()
            if pending_email != token_data["email"]:
                conn.close()
                return jsonify({"verified": False, "error": "Verification token does not match the pending email change."}), 400

            c.execute(
                """
                SELECT id
                FROM users
                WHERE id != ?
                  AND (email = ? OR username = ?)
                LIMIT 1
                """,
                (token_data["user_id"], pending_email, pending_email),
            )
            if c.fetchone():
                conn.close()
                return jsonify({"verified": False, "error": "That email address is already in use."}), 409

            c.execute("SELECT username FROM users WHERE id = ?", (token_data["user_id"],))
            username_row = c.fetchone()
            current_username = str(username_row[0] or "").strip().lower() if username_row else ""
            next_username = pending_email if current_username == user_email else (username_row[0] if username_row else pending_email)

            c.execute(
                """
                UPDATE users
                SET email = ?, username = ?, email_verified = 1, is_verified = 1
                WHERE id = ?
                """,
                (pending_email, next_username, token_data["user_id"]),
            )
            c.execute("DELETE FROM pending_email_changes WHERE user_id = ?", (token_data["user_id"],))
        else:
            if user_email != token_data["email"]:
                conn.close()
                return jsonify({"verified": False, "error": "Verification token does not match this account."}), 400

            c.execute("UPDATE users SET email_verified = 1, is_verified = 1 WHERE id = ?", (token_data["user_id"],))

        c.execute(
            """
            INSERT INTO user_email_verification (user_id, verified_at)
            VALUES (?, ?)
            ON CONFLICT(user_id) DO UPDATE SET verified_at = excluded.verified_at
            """,
            (token_data["user_id"], now_iso),
        )
        conn.commit()
        conn.close()
        verified_user = app_module.load_user(str(token_data["user_id"]))
        if verified_user:
            login_user(verified_user, remember=True)
        return jsonify(
            {
                "verified": True,
                "purpose": purpose,
                "user": app_module._user_response_payload(verified_user) if verified_user else None,
            }
        ), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to verify email right now.",
            log_message="api_verify_email failed",
        )


@auth_bp.route("/api/onboarding/complete", methods=["POST"])
@login_required
def api_onboarding_complete():
    try:
        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("UPDATE users SET onboarding_complete = 1 WHERE id = ?", (current_user.id,))
        conn.commit()
        conn.close()
        refreshed_user = app_module.load_user(str(current_user.id))
        if refreshed_user:
            login_user(refreshed_user, remember=True)
        return jsonify(
            {
                "success": True,
                "user": app_module._user_response_payload(refreshed_user) if refreshed_user else None,
            }
        ), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to finish onboarding right now.",
            log_message="api_onboarding_complete failed",
        )


@auth_bp.route("/api/auth/resend-verification", methods=["POST"])
@app_module.csrf.exempt
@app_module.limiter.limit("5 per minute")
def api_resend_verification():
    generic_response = {"message": "If the email exists, a verification link has been sent."}
    try:
        caller_ip = app_module.get_remote_address() or request.remote_addr or "unknown"
        if app_module._is_resend_verification_rate_limited(caller_ip):
            return jsonify({"error": "Too many verification requests. Please wait before trying again."}), 429

        payload = request.get_json(silent=True) or {}
        email = (payload.get("email") or "").strip().lower()
        delivery_status = app_module._verification_delivery_status()
        response_payload = {
            **generic_response,
            **app_module._verification_delivery_response_payload(delivery_status),
            "support_email": app_module.SUPPORT_EMAIL,
        }
        if not app_module.is_valid_email(email):
            return jsonify(response_payload), 200

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("SELECT id, firm_name, email_verified FROM users WHERE email = ? OR username = ?", (email, email))
        row = c.fetchone()
        conn.close()

        if not row:
            return jsonify(response_payload), 200

        user_id = int(row[0])
        if int(row[2] or 0) == 1:
            return jsonify(response_payload), 200

        token = app_module.create_email_verification_token(user_id, email)
        verify_link = app_module._public_verify_email_link(token)
        delivery_result = app_module.send_email_verification_link_with_result(
            email,
            verify_link,
            str(row[1] or app_module.app.config.get("FIRM_NAME", "Your Firm")),
        )
        return jsonify(
            {
                **response_payload,
                "verification_sent": bool(delivery_result.success),
                **app_module._verification_delivery_response_payload(delivery_status, delivery_result),
            }
        ), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to resend verification email right now.",
            log_message="api_resend_verification failed",
        )


@auth_bp.route("/api/auth/logout", methods=["POST"])
@app_module.csrf.exempt
def api_logout():
    try:
        logout_user()
        return jsonify({"success": True}), 200
    except Exception:
        return app_module._safe_api_error(
            "Logout failed due to a server error.",
            log_message="api_logout failed",
        )
