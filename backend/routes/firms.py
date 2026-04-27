from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required, login_user

import app as app_module


firms_bp = Blueprint("firms_routes", __name__)


@firms_bp.route("/api/firms/create", methods=["POST"])
@login_required
def api_create_firm():
    try:
        existing_ctx, _ = app_module._require_firm_context()
        if existing_ctx:
            return jsonify(
                {
                    "success": True,
                    "firm_id": existing_ctx["firm_id"],
                    "firm_name": existing_ctx.get("firm_name") or app_module.app.config["FIRM_NAME"],
                }
            ), 200

        payload = request.get_json(silent=True) or {}
        requested_name = app_module.bleach.clean((payload.get("name") or "").strip(), strip=True)
        practice_area = app_module.bleach.clean((payload.get("practice_area") or "").strip(), strip=True)
        firm_size = app_module.bleach.clean((payload.get("firm_size") or "").strip(), strip=True)

        if not requested_name:
            return jsonify({"success": False, "error": "Firm name is required."}), 400
        if len(requested_name) < 2 or len(requested_name) > app_module.MAX_FIRM_NAME_LENGTH:
            return jsonify({"success": False, "error": f"Firm name must be 2-{app_module.MAX_FIRM_NAME_LENGTH} characters."}), 400
        if len(practice_area) > 120:
            return jsonify({"success": False, "error": "Practice area must be 120 characters or fewer."}), 400
        allowed_sizes = {"1-2", "3-5", "6-10", "10+"}
        if firm_size and firm_size not in allowed_sizes:
            return jsonify({"success": False, "error": "Firm size must be one of 1-2, 3-5, 6-10, or 10+."}), 400

        now_iso = datetime.now(timezone.utc).isoformat()
        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            """
            INSERT INTO firms (name, created_at, created_by_user_id, practice_area, firm_size)
            VALUES (?, ?, ?, ?, ?)
            """,
            (requested_name, now_iso, current_user.id, practice_area or None, firm_size or None),
        )
        firm_id = int(c.lastrowid)
        c.execute(
            """
            INSERT INTO firm_users (
                firm_id, user_id, role, status, invited_by_user_id, invited_at, joined_at
            )
            VALUES (?, ?, 'owner', 'active', ?, ?, ?)
            """,
            (firm_id, current_user.id, current_user.id, now_iso, now_iso),
        )
        c.execute("UPDATE users SET firm_name = ? WHERE id = ?", (requested_name, current_user.id))
        app_module._log_audit_event(
            conn,
            firm_id,
            current_user.id,
            "member",
            current_user.id,
            "MEMBER_ROLE_CHANGED",
            before_dict={"firm_name": current_user.firm_name or ""},
            after_dict={"firm_name": requested_name, "role": "owner"},
        )
        conn.commit()
        conn.close()

        refreshed_user = app_module.load_user(current_user.id)
        if refreshed_user:
            login_user(refreshed_user, remember=True)

        return jsonify({"success": True, "firm_id": firm_id, "user": app_module._user_response_payload(refreshed_user or current_user)}), 201
    except Exception:
        return app_module._safe_api_error(
            "Unable to create firm right now.",
            log_message=f"Failed onboarding firm create for user {current_user.id}",
        )
