from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from flask_limiter.util import get_remote_address

import app as app_module


support_bp = Blueprint("support_routes", __name__)


@support_bp.route("/api/support/tickets", methods=["POST"])
@app_module.limiter.limit("3 per 10 minutes", key_func=lambda: f"user:{current_user.id}" if getattr(current_user, "is_authenticated", False) else get_remote_address())
@app_module.limiter.limit("10 per hour", key_func=lambda: f"user:{current_user.id}" if getattr(current_user, "is_authenticated", False) else get_remote_address())
def api_support_ticket_create():
    try:
        payload = request.get_json(silent=True) or {}
        is_authenticated_user = bool(getattr(current_user, "is_authenticated", False))

        category = app_module._normalize_support_category(payload.get("category"))
        urgency = app_module._normalize_support_urgency(payload.get("urgency"))
        source = str(payload.get("source") or "contact").strip().lower()
        if source not in ("contact", "dashboard"):
            source = "contact"

        subject = app_module.bleach.clean(str(payload.get("subject") or "").strip(), strip=True)
        message = app_module.bleach.clean(str(payload.get("message") or "").strip(), strip=True)
        requester_name = app_module.bleach.clean(str(payload.get("name") or "").strip(), strip=True)
        firm_name = app_module.bleach.clean(str(payload.get("firm_name") or "").strip(), strip=True)

        if is_authenticated_user:
            requester_email = (getattr(current_user, "email", None) or getattr(current_user, "username", "") or "").strip().lower()
            if not firm_name:
                firm_name = app_module.bleach.clean(str(getattr(current_user, "firm_name", "") or "").strip(), strip=True)
        else:
            requester_email = app_module.bleach.clean(str(payload.get("email") or "").strip().lower(), strip=True)

        if not app_module.is_valid_email(requester_email):
            return jsonify({"success": False, "error": "Enter a valid email address."}), 400
        if len(subject) < 6:
            return jsonify({"success": False, "error": "Add a short subject so support can triage the request."}), 400
        if len(subject) > 180:
            return jsonify({"success": False, "error": "Subject is too long."}), 400
        if len(message) < 20:
            return jsonify({"success": False, "error": "Add enough detail for support to reproduce or understand the issue."}), 400
        if len(message) > 5000:
            return jsonify({"success": False, "error": "Message is too long."}), 400

        triage = app_module._triage_support_ticket(category, urgency, subject, message)
        now_iso = datetime.now(timezone.utc).isoformat()
        ticket_ref = app_module._support_ticket_ref()

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            """
            INSERT INTO support_tickets (
                ticket_ref, user_id, requester_name, requester_email, firm_name, source, category, urgency,
                subject, message, status, priority, escalation_level, escalation_reason, auto_response_template,
                auto_response_sent, handled_by_user_id, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?)
            """,
            (
                ticket_ref,
                current_user.id if is_authenticated_user else None,
                requester_name or None,
                requester_email,
                firm_name or None,
                source,
                category,
                urgency,
                subject,
                message,
                triage["status"],
                triage["priority"],
                triage["escalation_level"],
                triage["escalation_reason"] or None,
                triage["auto_response_template"],
                now_iso,
                now_iso,
            ),
        )
        ticket_id = c.lastrowid
        conn.commit()
        conn.close()

        ticket = app_module._load_support_tickets_for_user(
            current_user.id if is_authenticated_user else None,
            requester_email=requester_email,
            include_all=False,
            limit=1,
        )[0]

        auto_response_sent = app_module._send_support_ticket_autoresponse(ticket)
        support_notification_sent = app_module._notify_support_ticket(ticket)

        if auto_response_sent:
            conn = app_module.db_connect()
            c = conn.cursor()
            c.execute(
                "UPDATE support_tickets SET auto_response_sent = 1, updated_at = ? WHERE id = ?",
                (datetime.now(timezone.utc).isoformat(), ticket_id),
            )
            conn.commit()
            conn.close()
            ticket["auto_response_sent"] = True

        return jsonify(
            {
                "success": True,
                "ticket": ticket,
                "support_email": app_module.SUPPORT_EMAIL,
                "security_email": app_module.SECURITY_CONTACT_EMAIL,
                "auto_response_email_sent": bool(auto_response_sent),
                "support_notification_sent": bool(support_notification_sent),
            }
        ), 201
    except Exception:
        return app_module._safe_api_error(
            "Unable to create support request right now.",
            log_message="Failed to create support ticket",
        )


@support_bp.route("/api/support/tickets", methods=["GET"])
@login_required
def api_support_tickets_list():
    try:
        scope = str(request.args.get("scope") or "").strip().lower()
        include_all = bool(current_user.is_admin and scope == "queue")
        tickets = app_module._load_support_tickets_for_user(
            current_user.id,
            requester_email=current_user.email or current_user.username,
            include_all=include_all,
            limit=50 if include_all else 20,
        )
        escalated_count = sum(1 for ticket in tickets if ticket and ticket.get("escalation_level") not in (None, "", "none"))
        open_count = sum(1 for ticket in tickets if ticket and ticket.get("status") != "resolved")

        return jsonify(
            {
                "success": True,
                "scope": "queue" if include_all else "self",
                "tickets": tickets,
                "summary": {"open_count": open_count, "escalated_count": escalated_count},
                "support_email": app_module.SUPPORT_EMAIL,
                "security_email": app_module.SECURITY_CONTACT_EMAIL,
            }
        ), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to load support tickets right now.",
            log_message=f"Failed to load support tickets for user {current_user.id}",
        )


@support_bp.route("/api/support/tickets/<int:ticket_id>", methods=["PATCH"])
@login_required
def api_support_ticket_update(ticket_id):
    if not current_user.is_admin:
        return jsonify({"success": False, "error": "Forbidden"}), 403

    try:
        payload = request.get_json(silent=True) or {}
        next_status = str(payload.get("status") or "").strip().lower()
        next_priority = str(payload.get("priority") or "").strip().lower()

        updates = []
        params = []

        if next_status:
            if next_status not in app_module.SUPPORT_TICKET_STATUSES:
                return jsonify({"success": False, "error": "Invalid support ticket status."}), 400
            updates.append("status = ?")
            params.append(next_status)

        if next_priority:
            if next_priority not in app_module.SUPPORT_TICKET_PRIORITIES:
                return jsonify({"success": False, "error": "Invalid support ticket priority."}), 400
            updates.append("priority = ?")
            params.append(next_priority)

        if not updates:
            return jsonify({"success": False, "error": "No supported updates were provided."}), 400

        updates.append("handled_by_user_id = ?")
        params.append(current_user.id)
        updates.append("updated_at = ?")
        params.append(datetime.now(timezone.utc).isoformat())
        params.append(ticket_id)

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(f"UPDATE support_tickets SET {', '.join(updates)} WHERE id = ?", params)
        if c.rowcount <= 0:
            conn.close()
            return jsonify({"success": False, "error": "Support ticket not found."}), 404
        conn.commit()
        conn.close()

        updated_ticket = next(
            (row for row in app_module._load_support_tickets_for_user(current_user.id, include_all=True, limit=100) if int(row["id"]) == int(ticket_id)),
            None,
        )
        return jsonify({"success": True, "ticket": updated_ticket}), 200
    except Exception:
        return app_module._safe_api_error(
            "Unable to update support ticket right now.",
            log_message=f"Failed to update support ticket {ticket_id} by admin {current_user.id}",
        )
