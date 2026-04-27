from __future__ import annotations

import hashlib

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from werkzeug.security import generate_password_hash

import app as app_module


team_bp = Blueprint("team_routes", __name__)


@team_bp.route("/api/team/invite", methods=["POST"])
@login_required
def api_team_invite():
    try:
        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        if not app_module._is_owner(firm_ctx["role"]):
            return jsonify({"success": False, "error": "Only firm owners can invite members."}), 403

        seat_limit_result = app_module.plan_service.enforce_seat_limit(firm_ctx["firm_id"], app_module.db_connect)
        if seat_limit_result:
            return app_module._plan_limit_error(seat_limit_result.get("message") or "Plan seat limit reached.")

        payload = request.get_json(silent=True) or {}
        email = (payload.get("email") or "").strip().lower()
        role = (payload.get("role") or "member").strip().lower()

        if role not in {"partner", "member"}:
            return jsonify({"success": False, "error": "Role must be partner or member."}), 400
        if not app_module.is_valid_email(email):
            return jsonify({"success": False, "error": "A valid email is required."}), 400

        invite_token = app_module.secrets.token_urlsafe(32)
        invite_hash = hashlib.sha256(invite_token.encode("utf-8")).hexdigest()
        now_iso = app_module.datetime.now(app_module.timezone.utc).isoformat()

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1", (email, email))
        user_row = c.fetchone()

        if user_row:
            invited_user_id = int(user_row[0])
            c.execute(
                """
                SELECT 1
                FROM firm_users
                WHERE user_id = ? AND status = 'active' AND firm_id != ?
                LIMIT 1
                """,
                (invited_user_id, firm_ctx["firm_id"]),
            )
            if c.fetchone():
                conn.close()
                return jsonify({"success": False, "error": "User already belongs to another active firm workspace."}), 409
        else:
            c.execute(
                """
                INSERT INTO users (email, username, password_hash, is_verified, created_at, firm_name, is_admin, subscription_type, subscription_status)
                VALUES (?, ?, ?, 0, ?, ?, 0, 'trial', 'trial')
                """,
                (
                    email,
                    email,
                    generate_password_hash(app_module.secrets.token_urlsafe(24)),
                    now_iso,
                    firm_ctx.get("firm_name") or app_module.app.config["FIRM_NAME"],
                ),
            )
            invited_user_id = int(c.lastrowid)

        c.execute(
            """
            INSERT INTO firm_users (
                firm_id, user_id, role, status, invited_by_user_id, invited_at, invite_token_hash
            )
            VALUES (?, ?, ?, 'invited', ?, ?, ?)
            ON CONFLICT(firm_id, user_id) DO UPDATE SET
                role = excluded.role,
                status = 'invited',
                invited_by_user_id = excluded.invited_by_user_id,
                invited_at = excluded.invited_at,
                invite_token_hash = excluded.invite_token_hash
            """,
            (firm_ctx["firm_id"], invited_user_id, role, current_user.id, now_iso, invite_hash),
        )
        app_module._log_audit_event(
            conn,
            firm_ctx["firm_id"],
            current_user.id,
            "member",
            invited_user_id,
            "MEMBER_INVITED",
            before_dict={},
            after_dict={"email": email, "role": role, "status": "invited"},
        )
        conn.commit()
        conn.close()

        resp = {"success": True, "message": "Invitation created."}
        if app_module.app.config.get("DEBUG") or app_module.app.config.get("TESTING"):
            resp["invite_token"] = invite_token
            resp["invite_url"] = f"/invite/accept?token={invite_token}"
        return jsonify(resp), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to invite team member right now.",
            log_message=f"Failed team invite for user {current_user.id}",
        )


@team_bp.route("/api/team/accept", methods=["POST"])
def api_team_accept():
    try:
        payload = request.get_json(silent=True) or {}
        token = (payload.get("token") or "").strip()
        password = payload.get("password") or ""
        if not token:
            return jsonify({"success": False, "error": "Invite token is required."}), 400

        invite_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        now_iso = app_module.datetime.now(app_module.timezone.utc).isoformat()

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            """
            SELECT fu.id, fu.firm_id, fu.user_id, fu.role, u.password_hash
            FROM firm_users fu
            INNER JOIN users u ON u.id = fu.user_id
            WHERE fu.invite_token_hash = ?
              AND fu.status = 'invited'
            LIMIT 1
            """,
            (invite_hash,),
        )
        row = c.fetchone()
        if not row:
            conn.close()
            return jsonify({"success": False, "error": "Invite token is invalid or expired."}), 404

        membership_id = int(row[0])
        firm_id = int(row[1])
        invited_user_id = int(row[2])
        role = str(row[3])

        c.execute(
            """
            SELECT 1
            FROM firm_users
            WHERE user_id = ? AND status = 'active' AND firm_id != ?
            LIMIT 1
            """,
            (invited_user_id, firm_id),
        )
        if c.fetchone():
            conn.close()
            return jsonify({"success": False, "error": "User already belongs to another active firm workspace."}), 409

        if password:
            ok_password, password_msg = app_module.validate_password_strength(password)
            if not ok_password:
                conn.close()
                return jsonify({"success": False, "error": password_msg}), 400
            c.execute(
                """
                UPDATE users
                SET password_hash = ?, is_verified = 1, email_verified = 1
                WHERE id = ?
                """,
                (generate_password_hash(password), invited_user_id),
            )

        c.execute(
            """
            UPDATE firm_users
            SET status = 'active',
                joined_at = ?,
                invite_token_hash = NULL
            WHERE id = ?
            """,
            (now_iso, membership_id),
        )
        app_module._log_audit_event(
            conn,
            firm_id,
            invited_user_id,
            "member",
            invited_user_id,
            "MEMBER_ACTIVATED",
            before_dict={"status": "invited"},
            after_dict={"status": "active", "role": role},
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Invitation accepted."}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to accept invitation right now.",
            log_message="api_team_accept failed",
        )


@team_bp.route("/api/team/members", methods=["GET"])
@login_required
def api_team_members():
    try:
        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            """
            SELECT fu.user_id, u.email, fu.role, fu.status, fu.joined_at, fu.invited_at
            FROM firm_users fu
            INNER JOIN users u ON u.id = fu.user_id
            WHERE fu.firm_id = ?
            ORDER BY fu.status DESC, fu.joined_at DESC, fu.id DESC
            """,
            (firm_ctx["firm_id"],),
        )
        rows = c.fetchall()
        conn.close()
        members = [
            {
                "user_id": int(r[0]),
                "email": r[1],
                "role": r[2],
                "status": r[3],
                "joined_at": r[4],
                "invited_at": r[5],
            }
            for r in rows
        ]
        return jsonify({"success": True, "firm_id": firm_ctx["firm_id"], "members": members}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to load team members right now.",
            log_message=f"Failed team members list for user {current_user.id}",
        )


@team_bp.route("/api/team/member/<int:user_id>/role", methods=["POST"])
@login_required
def api_team_member_role(user_id):
    try:
        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        if not app_module._is_owner(firm_ctx["role"]):
            return jsonify({"success": False, "error": "Only firm owners can manage member roles."}), 403

        payload = request.get_json(silent=True) or {}
        next_role = (payload.get("role") or "").strip().lower()
        if next_role not in {"owner", "partner", "member"}:
            return jsonify({"success": False, "error": "Role must be owner, partner, or member."}), 400

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("SELECT role, status FROM firm_users WHERE firm_id = ? AND user_id = ?", (firm_ctx["firm_id"], user_id))
        row = c.fetchone()
        if not row:
            conn.close()
            return jsonify({"success": False, "error": "Member not found in this firm."}), 404

        before_role = str(row[0])
        c.execute("UPDATE firm_users SET role = ? WHERE firm_id = ? AND user_id = ?", (next_role, firm_ctx["firm_id"], user_id))
        app_module._log_audit_event(
            conn,
            firm_ctx["firm_id"],
            current_user.id,
            "member",
            user_id,
            "MEMBER_ROLE_CHANGED",
            before_dict={"role": before_role},
            after_dict={"role": next_role},
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to update member role right now.",
            log_message=f"Failed role update for member {user_id} by user {current_user.id}",
        )


@team_bp.route("/api/team/member/<int:user_id>/status", methods=["POST"])
@login_required
def api_team_member_status(user_id):
    try:
        firm_ctx, err = app_module._require_firm_context()
        if err:
            return err
        if not app_module._is_owner(firm_ctx["role"]):
            return jsonify({"success": False, "error": "Only firm owners can manage member status."}), 403

        payload = request.get_json(silent=True) or {}
        next_status = (payload.get("status") or "").strip().lower()
        if next_status not in {"active", "suspended"}:
            return jsonify({"success": False, "error": "Status must be active or suspended."}), 400

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute("SELECT status FROM firm_users WHERE firm_id = ? AND user_id = ?", (firm_ctx["firm_id"], user_id))
        row = c.fetchone()
        if not row:
            conn.close()
            return jsonify({"success": False, "error": "Member not found in this firm."}), 404

        before_status = str(row[0])
        c.execute("UPDATE firm_users SET status = ? WHERE firm_id = ? AND user_id = ?", (next_status, firm_ctx["firm_id"], user_id))
        event_type = "MEMBER_ACTIVATED" if next_status == "active" else "MEMBER_SUSPENDED"
        app_module._log_audit_event(
            conn,
            firm_ctx["firm_id"],
            current_user.id,
            "member",
            user_id,
            event_type,
            before_dict={"status": before_status},
            after_dict={"status": next_status},
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to update member status right now.",
            log_message=f"Failed status update for member {user_id} by user {current_user.id}",
        )
