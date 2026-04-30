from __future__ import annotations

from datetime import datetime

from flask import flash, redirect, render_template, request, send_from_directory, url_for

import app as app_module


def serve_public_react_route_or_template(template_name, **context):
    if app_module._react_dist_exists:
        return send_from_directory(app_module._REACT_DIST, "index.html")
    return render_template(template_name, **context)


def marketing_home():
    return serve_public_react_route_or_template("marketing_home.html")


def how_it_works():
    return serve_public_react_route_or_template("how_it_works.html")


def features():
    return serve_public_react_route_or_template("features.html")


def case_studies():
    return redirect("/features", 301)


def pricing():
    if app_module._react_dist_exists:
        return send_from_directory(app_module._REACT_DIST, "index.html")

    return render_template(
        "pricing.html",
        trial_limit=app_module.FREE_PLAN_REPORT_LIMIT,
        onetime_price=app_module.app.config["ONETIME_REPORT_PRICE"],
        monthly_price=app_module.app.config["MONTHLY_SUBSCRIPTION_PRICE"],
        annual_price=app_module.app.config["ANNUAL_SUBSCRIPTION_PRICE"],
    )


def privacy():
    return serve_public_react_route_or_template("privacy.html")


def terms():
    return serve_public_react_route_or_template("terms.html")


def security():
    return serve_public_react_route_or_template("security.html")


def index():
    return redirect("/login", 301)


def feedback_form():
    if request.method == "POST":
        date = request.form.get("date") or datetime.now().strftime("%Y-%m-%d")
        rating = request.form.get("rating")
        review_text = request.form.get("review_text") or ""

        if not rating or not review_text:
            flash("Please provide a rating and review text.", "danger")
            return redirect(url_for("feedback_form"))

        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                raise ValueError
        except ValueError:
            flash("Rating must be between 1 and 5.", "danger")
            return redirect(url_for("feedback_form"))

        if len(review_text) > app_module.MAX_REVIEW_TEXT_LENGTH:
            flash(f"Review text is too long. Please keep it under {app_module.MAX_REVIEW_TEXT_LENGTH} characters.", "danger")
            return redirect(url_for("feedback_form"))

        sanitized_review_text = app_module.bleach.clean(review_text, strip=True)

        conn = app_module.db_connect()
        c = conn.cursor()
        c.execute(
            "INSERT INTO public_feedback (date, rating, review_text) VALUES (?, ?, ?)",
            (date, rating, sanitized_review_text),
        )
        conn.commit()
        conn.close()

        flash("Thank you for your feedback!", "success")
        return redirect(url_for("thank_you"))

    return render_template("feedback_form.html")


def thank_you():
    return render_template("thank_you.html")


def forgot_password():
    if app_module._react_dist_exists:
        return send_from_directory(app_module._REACT_DIST, "index.html")
    return redirect(f"{app_module._resolve_public_app_base_url()}/forgot-password", code=302)


def reset_password_legacy_get(token):
    if app_module._react_dist_exists:
        return send_from_directory(app_module._REACT_DIST, "index.html")
    return redirect(f"{app_module._resolve_public_app_base_url()}/reset-password/{token}", code=302)
