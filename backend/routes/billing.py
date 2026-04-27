from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

import stripe

import app as app_module


billing_bp = Blueprint("billing_routes", __name__)


@billing_bp.route("/api/billing/checkout", methods=["POST"])
@app_module.limiter.limit("20 per hour")
@login_required
def api_billing_checkout():
    payload = request.get_json(silent=True) or {}
    requested_plan, plan = app_module._normalize_checkout_plan(payload.get("plan"))

    if plan not in ("team_monthly", "team_annual", "firm_monthly", "firm_annual"):
        return jsonify({"success": False, "error": "Invalid plan. Choose team or firm."}), 400

    if not app_module.app.config.get("STRIPE_SECRET_KEY"):
        return jsonify({"success": False, "error": "Billing is not configured on this server."}), 503

    price_id_map = {
        "team_monthly": app_module.app.config.get("STRIPE_PRICE_ID_TEAM_MONTHLY"),
        "team_annual": app_module.app.config.get("STRIPE_PRICE_ID_TEAM_ANNUAL"),
        "firm_monthly": app_module.app.config.get("STRIPE_PRICE_ID_FIRM_MONTHLY"),
        "firm_annual": app_module.app.config.get("STRIPE_PRICE_ID_FIRM_ANNUAL"),
    }
    price_id = price_id_map.get(plan)
    if not price_id:
        return jsonify({"success": False, "error": "Price configuration is missing for this plan."}), 503

    try:
        customer_id = app_module._ensure_stripe_customer_id()
        frontend_origin = app_module._resolve_frontend_origin()
        success_url = (
            f"{frontend_origin}/pricing?checkout=success&plan={requested_plan or plan}"
            "&session_id={CHECKOUT_SESSION_ID}"
        )
        cancel_url = f"{frontend_origin}/pricing?checkout=canceled&plan={requested_plan or plan}"

        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=success_url,
            cancel_url=cancel_url,
            client_reference_id=str(current_user.id),
            metadata={"user_id": str(current_user.id), "plan": plan},
        )
        app_module._log_security_event(current_user.id, "billing_checkout_created", metadata={"plan": plan, "channel": "api"})
        return jsonify({"success": True, "checkout_url": checkout_session.url}), 200
    except Exception:
        app_module.app.logger.exception("Failed to create checkout session for user %s plan %s", current_user.id, plan)
        return jsonify({"success": False, "error": "Unable to start checkout right now."}), 500


@billing_bp.route("/api/billing/checkout/finalize", methods=["POST"])
@app_module.limiter.limit("30 per hour")
@login_required
def api_billing_checkout_finalize():
    payload = request.get_json(silent=True) or {}
    session_id = payload.get("session_id")
    requested_plan, plan = app_module._normalize_checkout_plan(payload.get("plan"))

    if not session_id or plan not in ("team_monthly", "team_annual", "firm_monthly", "firm_annual"):
        return jsonify({"success": False, "error": "Missing session_id or invalid plan."}), 400

    if not app_module.app.config.get("STRIPE_SECRET_KEY"):
        return jsonify({"success": False, "error": "Billing is not configured on this server."}), 503

    if not current_user.stripe_customer_id:
        return jsonify({"success": False, "error": "No Stripe customer found for this account."}), 400

    try:
        checkout_session = stripe.checkout.Session.retrieve(session_id)
    except Exception:
        app_module.app.logger.exception("Failed to retrieve checkout session %s for user %s", session_id, current_user.id)
        return jsonify({"success": False, "error": "Unable to verify checkout session."}), 500

    if str(checkout_session.customer) != str(current_user.stripe_customer_id):
        app_module._log_security_event(
            current_user.id,
            "billing_checkout_mismatch",
            metadata={"route": "api_billing_checkout_finalize", "session_id": session_id, "reason": "customer_mismatch"},
        )
        return jsonify({"success": False, "error": "Checkout session does not match this account."}), 403

    ref_id = getattr(checkout_session, "client_reference_id", "") or ""
    meta = getattr(checkout_session, "metadata", {}) or {}
    meta_uid = meta.get("user_id", "") if isinstance(meta, dict) else ""
    if ref_id and ref_id != str(current_user.id):
        app_module._log_security_event(
            current_user.id,
            "billing_checkout_mismatch",
            metadata={"route": "api_billing_checkout_finalize", "session_id": session_id, "reason": "client_reference_mismatch"},
        )
        return jsonify({"success": False, "error": "Checkout session does not belong to this account."}), 403
    if not ref_id and meta_uid and meta_uid != str(current_user.id):
        app_module._log_security_event(
            current_user.id,
            "billing_checkout_mismatch",
            metadata={"route": "api_billing_checkout_finalize", "session_id": session_id, "reason": "metadata_user_mismatch"},
        )
        return jsonify({"success": False, "error": "Checkout session does not belong to this account."}), 403

    conn = app_module.db_connect()
    c = conn.cursor()
    try:
        conn.execute("BEGIN")
        subscription_id = getattr(checkout_session, "subscription", None)
        if not subscription_id:
            conn.rollback()
            conn.close()
            return jsonify({"success": False, "error": "Subscription checkout is not complete yet."}), 400

        c.execute(
            """
            UPDATE users
            SET stripe_subscription_id = ?,
                subscription_status = 'active',
                subscription_type = ?
            WHERE id = ?
            """,
            (subscription_id, plan, current_user.id),
        )
        target_firm_plan = app_module.FIRM_PLAN_FIRM if plan in ("firm_monthly", "firm_annual") else app_module.FIRM_PLAN_TEAM
        app_module._set_firm_plan_for_user(c, current_user.id, target_firm_plan)

        conn.commit()
        conn.close()
        app_module._log_security_event(current_user.id, "billing_checkout_finalized", metadata={"plan": plan, "session_id": session_id, "channel": "api"})
        response_plan = "firm" if plan in ("firm_monthly", "firm_annual") else "team"
        return jsonify({"success": True, "plan": response_plan}), 200
    except Exception:
        conn.rollback()
        conn.close()
        app_module.app.logger.exception("Failed to finalize checkout for user %s session %s", current_user.id, session_id)
        return jsonify({"success": False, "error": "Unable to finalize checkout."}), 500
