from __future__ import annotations

import os

from flask import Blueprint, jsonify, request, send_from_directory
from flask_login import current_user, login_required

import app as app_module


account_bp = Blueprint("account_routes", __name__)


@account_bp.route("/api/account/plan", methods=["GET"])
@login_required
def api_account_plan():
    try:
        plan = app_module._account_plan_payload(current_user.id)
        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        firm_plan = app_module.get_firm_plan(firm_ctx["firm_id"])
        return jsonify(
            {
                "success": True,
                **plan,
                "firm_plan": firm_plan,
                "plan_limits": app_module.plan_service.get_plan_limits(firm_ctx["firm_id"], app_module.db_connect),
            }
        ), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to load account plan right now.",
            log_message=f"Failed to load account plan for user {current_user.id}",
        )


@account_bp.route("/api/account/profile", methods=["PUT"])
@login_required
def api_account_profile_put():
    try:
        payload = request.get_json(silent=True) or {}
        requested_firm_name = app_module.bleach.clean((payload.get("firm_name") or "").strip(), strip=True)

        if not requested_firm_name:
            return jsonify({"success": False, "error": "firm_name is required."}), 400
        if len(requested_firm_name) < 2 or len(requested_firm_name) > app_module.MAX_FIRM_NAME_LENGTH:
            return jsonify({"success": False, "error": f"Firm name must be 2-{app_module.MAX_FIRM_NAME_LENGTH} characters."}), 400

        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        if not app_module._is_owner(firm_ctx["role"]):
            return jsonify({"success": False, "error": "Only firm owners can update firm profile settings."}), 403

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("UPDATE firms SET name = ? WHERE id = ?", (requested_firm_name, firm_ctx["firm_id"]))
        c.execute("UPDATE users SET firm_name = ? WHERE id = ?", (requested_firm_name, current_user.id))
        app_module._log_audit_event(
            conn,
            firm_ctx["firm_id"],
            current_user.id,
            "member",
            current_user.id,
            "MEMBER_ROLE_CHANGED",
            before_dict={"firm_name": firm_ctx.get("firm_name") or ""},
            after_dict={"firm_name": requested_firm_name},
        )
        conn.commit()
        conn.close()

        user = app_module.load_user(current_user.id)
        return jsonify({"success": True, "user": app_module._user_response_payload(user) if user else app_module._user_response_payload(current_user)}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to update account profile right now.",
            log_message=f"Failed account profile update for user {current_user.id}",
        )


@account_bp.route("/api/account/change-email", methods=["POST"])
@login_required
def api_account_change_email_request():
    try:
        payload = request.get_json(silent=True) or {}
        new_email = str(payload.get("new_email") or "").strip().lower()
        current_password = str(payload.get("current_password") or "")

        if not current_password:
            return jsonify({"success": False, "error": "Current password is required."}), 400
        if not app_module.is_valid_email(new_email):
            return jsonify({"success": False, "error": "A valid new email address is required."}), 400
        if new_email == str(current_user.email or "").strip().lower():
            return jsonify({"success": False, "error": "Enter a different email address."}), 400
        if not app_module._check_password_for_user(current_user.id, current_password):
            return jsonify({"success": False, "error": "Current password is incorrect."}), 403

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            """
            SELECT id
            FROM users
            WHERE id != ?
              AND (email = ? OR username = ?)
            LIMIT 1
            """,
            (current_user.id, new_email, new_email),
        )
        if c.fetchone():
            conn.close()
            return jsonify({"success": False, "error": "That email address is already in use."}), 409

        c.execute(
            """
            SELECT user_id
            FROM pending_email_changes
            WHERE pending_email = ?
              AND user_id != ?
            LIMIT 1
            """,
            (new_email, current_user.id),
        )
        if c.fetchone():
            conn.close()
            return jsonify({"success": False, "error": "That email address already has a pending verification request."}), 409

        now_iso = app_module.datetime.now(app_module.timezone.utc).isoformat()
        c.execute(
            """
            INSERT INTO pending_email_changes (user_id, pending_email, requested_at, last_sent_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                pending_email = excluded.pending_email,
                requested_at = excluded.requested_at,
                last_sent_at = excluded.last_sent_at
            """,
            (current_user.id, new_email, now_iso, now_iso),
        )
        conn.commit()
        conn.close()

        delivery_status = app_module._verification_delivery_status()
        token = app_module.create_pending_email_change_token(current_user.id, new_email)
        verify_link = app_module._public_verify_email_link(token)
        delivery_result = app_module.send_email_verification_link_with_result(
            new_email,
            verify_link,
            str(current_user.firm_name or app_module.app.config.get("FIRM_NAME", "Your Firm")),
            verification_type="email_change",
        )
        refreshed_user = app_module.load_user(current_user.id)
        app_module._log_security_event(current_user.id, "email_change_requested", {"pending_email": new_email})
        return jsonify(
            {
                "success": True,
                "message": "Verify the new email address to finish the change.",
                "verification_sent": bool(delivery_result.success),
                **app_module._verification_delivery_response_payload(delivery_status, delivery_result),
                "user": app_module._user_response_payload(refreshed_user or current_user),
            }
        ), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to start the email change right now.",
            log_message=f"Failed email change request for user {current_user.id}",
        )


@account_bp.route("/api/account/change-email/resend", methods=["POST"])
@login_required
def api_account_change_email_resend():
    try:
        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            """
            SELECT pending_email
            FROM pending_email_changes
            WHERE user_id = ?
            """,
            (current_user.id,),
        )
        row = c.fetchone()
        if not row:
            conn.close()
            return jsonify({"success": False, "error": "There is no pending email change to resend."}), 404

        pending_email = str(row[0] or "").strip().lower()
        now_iso = app_module.datetime.now(app_module.timezone.utc).isoformat()
        c.execute("UPDATE pending_email_changes SET last_sent_at = ? WHERE user_id = ?", (now_iso, current_user.id))
        conn.commit()
        conn.close()

        delivery_status = app_module._verification_delivery_status()
        token = app_module.create_pending_email_change_token(current_user.id, pending_email)
        verify_link = app_module._public_verify_email_link(token)
        delivery_result = app_module.send_email_verification_link_with_result(
            pending_email,
            verify_link,
            str(current_user.firm_name or app_module.app.config.get("FIRM_NAME", "Your Firm")),
            verification_type="email_change",
        )
        refreshed_user = app_module.load_user(current_user.id)
        return jsonify(
            {
                "success": True,
                "message": "Verification email sent.",
                "verification_sent": bool(delivery_result.success),
                **app_module._verification_delivery_response_payload(delivery_status, delivery_result),
                "user": app_module._user_response_payload(refreshed_user or current_user),
            }
        ), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to resend the email change verification right now.",
            log_message=f"Failed email change resend for user {current_user.id}",
        )


@account_bp.route("/api/account/change-email", methods=["DELETE"])
@login_required
def api_account_change_email_cancel():
    try:
        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("DELETE FROM pending_email_changes WHERE user_id = ?", (current_user.id,))
        changed = c.rowcount
        conn.commit()
        conn.close()
        if changed:
            app_module._log_security_event(current_user.id, "email_change_cancelled")
        refreshed_user = app_module.load_user(current_user.id)
        return jsonify(
            {
                "success": True,
                "cancelled": bool(changed),
                "user": app_module._user_response_payload(refreshed_user or current_user),
            }
        ), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to cancel the pending email change right now.",
            log_message=f"Failed email change cancel for user {current_user.id}",
        )


@account_bp.route("/api/account/branding", methods=["GET"])
@login_required
def api_account_branding_get():
    try:
        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        firm_plan = app_module.get_firm_plan(firm_ctx["firm_id"])
        branding = app_module._get_account_branding(current_user.id)
        payload = app_module._branding_public_payload(branding)
        payload["branding_editor_enabled"] = firm_plan == app_module.FIRM_PLAN_FIRM
        return jsonify({"success": True, "branding": payload}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to load branding settings right now.",
            log_message=f"Failed to load branding for user {current_user.id}",
        )


@account_bp.route("/api/account/branding/logo", methods=["GET"])
@login_required
def api_account_branding_logo_get():
    branding = app_module._get_account_branding(current_user.id)
    logo_filename = branding.get("logo_filename")
    logo_path = branding.get("logo_path")
    if not logo_filename or not logo_path:
        return jsonify({"success": False, "error": "No logo configured."}), 404
    return send_from_directory(
        app_module.BRANDING_UPLOAD_DIR,
        os.path.basename(logo_filename),
        as_attachment=False,
        max_age=300,
    )


@account_bp.route("/api/account/branding/logo", methods=["POST"])
@login_required
def api_account_branding_logo_put():
    try:
        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        firm_plan = app_module.get_firm_plan(firm_ctx["firm_id"])
        if firm_plan != app_module.FIRM_PLAN_FIRM:
            return jsonify({"success": False, "error": "Custom branding is available on the Firm plan.", "upgrade_required": True}), 403

        logo_file = request.files.get("logo")
        if not logo_file or not logo_file.filename:
            return jsonify({"success": False, "error": "No logo file uploaded."}), 400

        original_name = app_module.secure_filename(logo_file.filename)
        if "." not in original_name:
            return jsonify({"success": False, "error": "Unsupported file format. Use PNG or JPG."}), 400
        extension = original_name.rsplit(".", 1)[1].lower()
        if extension not in app_module.ALLOWED_LOGO_EXTENSIONS:
            return jsonify({"success": False, "error": "Unsupported file format. Use PNG or JPG. SVG is not accepted."}), 400

        logo_file.stream.seek(0, os.SEEK_END)
        file_size = logo_file.stream.tell()
        logo_file.stream.seek(0)
        if file_size > app_module.MAX_BRANDING_LOGO_BYTES:
            return jsonify({"success": False, "error": "Logo file is too large. Limit is 5MB."}), 400

        stored_name = f"user_{current_user.id}_{int(app_module.time_module.time())}_{app_module.secrets.token_hex(4)}.{extension}"
        save_path = os.path.join(app_module.BRANDING_UPLOAD_DIR, stored_name)
        logo_file.save(save_path)

        branding = app_module._save_account_branding(current_user.id, logo_filename=stored_name)
        return jsonify({"success": True, "branding": app_module._branding_public_payload(branding)}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to upload logo right now.",
            log_message=f"Failed branding logo upload for user {current_user.id}",
        )


@account_bp.route("/api/account/branding/logo", methods=["DELETE"])
@login_required
def api_account_branding_logo_delete():
    try:
        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        firm_plan = app_module.get_firm_plan(firm_ctx["firm_id"])
        if firm_plan != app_module.FIRM_PLAN_FIRM:
            return jsonify({"success": False, "error": "Custom branding is available on the Firm plan.", "upgrade_required": True}), 403

        branding = app_module._save_account_branding(current_user.id, remove_logo=True)
        return jsonify({"success": True, "branding": app_module._branding_public_payload(branding)}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to remove logo right now.",
            log_message=f"Failed branding logo delete for user {current_user.id}",
        )


@account_bp.route("/api/account/branding/theme", methods=["PUT"])
@login_required
def api_account_branding_theme_put():
    try:
        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        firm_plan = app_module.get_firm_plan(firm_ctx["firm_id"])
        if firm_plan != app_module.FIRM_PLAN_FIRM:
            return jsonify({"success": False, "error": "Custom branding is available on the Firm plan.", "upgrade_required": True}), 403

        payload = request.get_json(silent=True) or {}
        requested_theme = (payload.get("accent_theme") or "").strip().lower()
        if requested_theme not in app_module.BRANDING_THEME_PRESETS:
            return jsonify({"success": False, "error": "Unsupported accent theme.", "theme_options": app_module._branding_theme_options()}), 400

        branding = app_module._save_account_branding(current_user.id, accent_theme=requested_theme)
        return jsonify({"success": True, "branding": app_module._branding_public_payload(branding)}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to update branding theme right now.",
            log_message=f"Failed branding theme update for user {current_user.id}",
        )
