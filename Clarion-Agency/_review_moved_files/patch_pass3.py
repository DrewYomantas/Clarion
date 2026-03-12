"""
Pass 3 patch: extract helpers from the two upload handlers and tighten them.
Operates on raw bytes to avoid encoding issues with the CRLF/replacement-char file.
"""
import sys

path = r'C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\backend\app.py'
with open(path, 'rb') as f:
    src = f.read()

CRLF = b'\r\n'

# ---------------------------------------------------------------------------
# 1. Insert new shared helpers just before the upload() route decorator.
#    Anchor: the blank line immediately before "@app.route('/upload',"
# ---------------------------------------------------------------------------

NEW_HELPERS = (
    b'# ---------------------------------------------------------------------------' + CRLF +
    b'# Upload shared helpers' + CRLF +
    b'# ---------------------------------------------------------------------------' + CRLF +
    CRLF +
    b'_ALLOWED_UPLOAD_EXTENSIONS = {".csv"}' + CRLF +
    CRLF +
    CRLF +
    b'def _validate_csv_file(file):' + CRLF +
    b'    """Return an error string if the uploaded file fails basic validation, else None."""' + CRLF +
    b'    if not file or file.filename == \'\':' + CRLF +
    b'        return \'No file selected. Choose a CSV file with review text and rating columns.\'' + CRLF +
    b'    if (file.mimetype or \'\').lower() not in ALLOWED_CSV_MIME_TYPES:' + CRLF +
    b'        return \'Invalid file type. Please upload a CSV file.\'' + CRLF +
    b'    if not file.filename.lower().endswith(\'.csv\'):' + CRLF +
    b'        return \'Unsupported file type. Please upload a .csv file and try again.\'' + CRLF +
    b'    return None' + CRLF +
    CRLF +
    CRLF +
    b'def _check_upload_credits(user_id, access_type):' + CRLF +
    b'    """Return (ok, trial_usage_count) where ok=False means the user has no upload credits."""' + CRLF +
    b'    trial_usage_count, trial_limit = _get_trial_usage_count(user_id, current_user.trial_limit)' + CRLF +
    b'    if current_user.has_active_subscription() or current_user.has_unused_one_time_reports():' + CRLF +
    b'        return True, trial_usage_count' + CRLF +
    b'    if access_type == \'trial\' and trial_usage_count < trial_limit:' + CRLF +
    b'        return True, trial_usage_count' + CRLF +
    b'    return False, trial_usage_count' + CRLF +
    CRLF +
    CRLF +
    b'def _fetch_user_usage(user_id):' + CRLF +
    b'    """Return a usage dict for the API response after a successful upload."""' + CRLF +
    b'    conn = db_connect()' + CRLF +
    b'    c = conn.cursor()' + CRLF +
    b'    c.execute(' + CRLF +
    b'        \'SELECT trial_reviews_used, trial_limit, one_time_reports_purchased, one_time_reports_used, subscription_type\'' + CRLF +
    b'        \' FROM users WHERE id = ?\',' + CRLF +
    b'        (user_id,),' + CRLF +
    b'    )' + CRLF +
    b'    row = c.fetchone()' + CRLF +
    b'    conn.close()' + CRLF +
    b'    purchased = row[2] if row else 0' + CRLF +
    b'    used_ot = row[3] if row else 0' + CRLF +
    b'    return {' + CRLF +
    b'        \'trial_reviews_used\': max(' + CRLF +
    b'            int(row[0] or 0) if row else 0,' + CRLF +
    b'            _get_trial_report_snapshot_count(user_id),' + CRLF +
    b'        ),' + CRLF +
    b'        \'trial_limit\': row[1] if row else FREE_PLAN_REPORT_LIMIT,' + CRLF +
    b'        \'one_time_reports_used\': used_ot,' + CRLF +
    b'        \'one_time_reports_remaining\': max(0, purchased - used_ot),' + CRLF +
    b'        \'subscription_type\': row[4] if row else \'trial\',' + CRLF +
    b'    }' + CRLF +
    CRLF +
    CRLF +
    b'def _build_upload_summary_message(access_type, count, report_id, parse_meta):' + CRLF +
    b'    """Return the human-readable summary string for an upload result."""' + CRLF +
    b'    if parse_meta and parse_meta.get(\'truncated_for_plan\') and access_type == \'trial\':' + CRLF +
    b'        skipped = int(parse_meta.get(\'skipped_due_to_plan_limit\', 0))' + CRLF +
    b'        return (' + CRLF +
    b'            f\'Success! We analyzed the first {FREE_PLAN_MAX_REVIEWS_PER_REPORT} valid reviews for the Free plan \'' + CRLF +
    b'            f\'and skipped {skipped} additional reviews. Upgrade to analyze all uploaded reviews.\'' + CRLF +
    b'        )' + CRLF +
    b'    if report_id is None:' + CRLF +
    b'        return \'Upload succeeded, but no snapshot was created because no analyzable reviews were found.\'' + CRLF +
    b'    return f\'Success! Imported {count} reviews and saved report snapshot #{report_id}. Next step: open your dashboard to download this report anytime.\'' + CRLF +
    CRLF +
    CRLF +
    b'def _log_upload_event(user_id, access_type, count, report_id, channel):' + CRLF +
    b'    """Emit a security event log for upload success."""' + CRLF +
    b'    _log_security_event(' + CRLF +
    b'        user_id,' + CRLF +
    b'        \'upload_success\',' + CRLF +
    b'        metadata={\'report_id\': report_id, \'count\': count, \'access_type\': access_type, \'channel\': channel},' + CRLF +
    b'    )' + CRLF +
    CRLF +
    CRLF
)

ANCHOR = b"@app.route('/upload', methods=['GET', 'POST'])" + CRLF
anchor_pos = src.find(ANCHOR)
if anchor_pos < 0:
    print("ANCHOR NOT FOUND"); sys.exit(1)

src = src[:anchor_pos] + NEW_HELPERS + src[anchor_pos:]
print("helpers inserted OK")

# ---------------------------------------------------------------------------
# 2. Replace the web upload() handler body
# ---------------------------------------------------------------------------

WEB_OLD = (
    b"@app.route('/upload', methods=['GET', 'POST'])" + CRLF +
    CRLF +
    b"@login_required" + CRLF +
    CRLF +
    b"@limiter.limit('15 per hour')" + CRLF +
    CRLF +
    b"def upload():" + CRLF +
    CRLF +
    b'    """CSV upload page for bulk review import with tiered limits."""' + CRLF +
    CRLF +
    b'    account_status = current_user.get_account_status()' + CRLF +
    CRLF +
    b'    can_upload = current_user.can_generate_report()' + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'    if request.method == \'POST\':' + CRLF +
    CRLF +
    b'        # TODO: Re-enable email verification gate when email confirmation flow exists.' + CRLF +
    CRLF +
    b'        access_type = get_report_access_type(current_user.id)' + CRLF +
    CRLF +
    b'        trial_usage_count, trial_limit = _get_trial_usage_count(current_user.id, current_user.trial_limit)' + CRLF +
    CRLF +
    b'        can_upload = (' + CRLF +
    CRLF +
    b'            current_user.has_active_subscription()' + CRLF +
    CRLF +
    b'            or current_user.has_unused_one_time_reports()' + CRLF +
    CRLF +
    b'            or (access_type == \'trial\' and trial_usage_count < trial_limit)' + CRLF +
    CRLF +
    b'        )' + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'        if not can_upload:' + CRLF +
    CRLF +
    b"            flash('You have no remaining report credits. Upgrade or purchase a one-time report to generate new snapshots.', 'warning')" + CRLF +
    CRLF +
    b"            return redirect(url_for('pricing'))" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b"        if 'file' not in request.files:" + CRLF +
    CRLF +
    b"            flash('No CSV file was detected in the upload request. Please choose a file and try again.', 'danger')" + CRLF +
    CRLF +
    b"            return redirect(url_for('upload'))" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'        file = request.files[\'file\']' + CRLF +
    b"        if file.filename == '':" + CRLF +
    b"            flash('No file selected. Choose a CSV file with review text and rating columns.', 'danger')" + CRLF +
    b"            return redirect(url_for('upload'))" + CRLF +
    CRLF +
    b"        if (file.mimetype or '').lower() not in ALLOWED_CSV_MIME_TYPES:" + CRLF +
    b"            flash('Invalid file type. Please upload a CSV file.', 'danger')" + CRLF +
    b"            return redirect(url_for('upload'))" + CRLF +
    CRLF +
    b"        if not file.filename.lower().endswith('.csv'):" + CRLF +
    b"            flash('Unsupported file type. Please upload a .csv file and try again.', 'danger')" + CRLF +
    b"            return redirect(url_for('upload'))" + CRLF +
    CRLF +
    CRLF +
    b"        if access_type == 'trial' and trial_usage_count >= trial_limit:" + CRLF +
    CRLF +
    b'            flash(' + CRLF +
    CRLF +
    b'                f\'Free plan includes {trial_limit} reports per month. Upgrade to continue generating reports.\',' + CRLF +
    CRLF +
    b"                'warning'," + CRLF +
    CRLF +
    b'            )' + CRLF +
    CRLF +
    b"            return redirect(url_for('pricing'))" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'        try:' + CRLF +
    CRLF +
    b'            valid_rows, csv_error, parse_meta = _parse_csv_upload_rows(file, access_type)' + CRLF +
    CRLF +
    b'            if csv_error:' + CRLF +
    CRLF +
    b'                flash(csv_error, \'danger\')' + CRLF +
    CRLF +
    b"                return redirect(url_for('upload'))" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'            report_hash = _build_report_hash(valid_rows)' + CRLF +
    CRLF +
    b'            duplicate_report_id = _find_duplicate_report_id(current_user.id, report_hash)' + CRLF +
    CRLF +
    b'            if duplicate_report_id:' + CRLF +
    CRLF +
    b'                flash(' + CRLF +
    CRLF +
    b"                    'This upload appears identical to an existing report. '" + CRLF +
    CRLF +
    b'                    "To keep your trends accurate, we don\'t allow uploading the same reviews twice for the same account.",' + CRLF +
    CRLF +
    b"                    'warning'," + CRLF +
    CRLF +
    b'                )' + CRLF +
    CRLF +
    b"                return redirect(url_for('upload'))" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'            # PR5 (F8/F10/F11): single connection, single BEGIN IMMEDIATE transaction.' + CRLF +
    b'            # reviews + report snapshot + credit update all commit together or not at all.' + CRLF +
    CRLF +
    b'            conn = db_connect()' + CRLF +
    CRLF +
    b'            c = conn.cursor()' + CRLF +
    CRLF +
    b'            snapshot_report_id = None  # guard: defined before tx so rollback paths don\'t raise UnboundLocalError' + CRLF +
    CRLF +
    b'            count = 0' + CRLF +
    CRLF +
    b'            try:' + CRLF +
    CRLF +
    b"                conn.execute('BEGIN')" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'                _insert_user_reviews_tx(c, current_user.id, valid_rows)' + CRLF +
    CRLF +
    b'                count = len(valid_rows)' + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'                # F8 test hook: set UPLOAD_FAIL_AFTER_REVIEWS=1 to prove rollback.' + CRLF +
    b'                _maybe_raise_upload_fail_hook()' + CRLF +
    CRLF +
    b'                snapshot_report_id, _pending_slack_alerts = _save_report_snapshot_tx(' + CRLF +
    b'                    c,' + CRLF +
    b'                    current_user.id,' + CRLF +
    b'                    subscription_type=access_type,' + CRLF +
    b'                    report_hash=report_hash,' + CRLF +
    b'                )' + CRLF +
    CRLF +
    b'                # Credit update AFTER snapshot exists \xe2\x80\x94 same transaction.' + CRLF +
    b'                _update_usage_credit_tx(c, current_user.id, access_type)' + CRLF +
    CRLF +
    b'                conn.commit()' + CRLF +
    CRLF +
    b'            except Exception:' + CRLF +
    b'                conn.rollback()' + CRLF +
    b'                raise' + CRLF +
    b'            finally:' + CRLF +
    b'                conn.close()' + CRLF +
    CRLF +
    b'            _fire_pending_slack_alerts(_pending_slack_alerts)' + CRLF +
    CRLF +
    b'            if not snapshot_report_id:' + CRLF +
    CRLF +
    b"                flash('Upload succeeded, but no snapshot was created because no analyzable reviews were found.', 'warning')" + CRLF +
    CRLF +
    b"                _log_security_event(current_user.id, 'upload_success', metadata={'report_id': None, 'count': count, 'access_type': access_type, 'channel': 'web'}," + CRLF +
    CRLF +
    b'                )' + CRLF +
    CRLF +
    b"                return redirect(url_for('dashboard'))" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b"            if access_type == 'trial' and parse_meta and parse_meta.get('truncated_for_plan'):" + CRLF +
    CRLF +
    b"                skipped = parse_meta.get('skipped_due_to_plan_limit', 0)" + CRLF +
    CRLF +
    b'                flash(' + CRLF +
    CRLF +
    b'                    f\'Success! We analyzed the first {FREE_PLAN_MAX_REVIEWS_PER_REPORT} valid reviews for the Free plan \'' + CRLF +
    CRLF +
    b'                    f\'and skipped {skipped} additional reviews. Upgrade to analyze all uploaded reviews.\',' + CRLF +
    CRLF +
    b"                    'warning'," + CRLF +
    CRLF +
    b'                )' + CRLF +
    CRLF +
    b'            else:' + CRLF +
    CRLF +
    b'                flash(' + CRLF +
    CRLF +
    b"                    f'Success! Imported {count} reviews and saved report snapshot #{snapshot_report_id}. '" + CRLF +
    CRLF +
    b"                    'Next step: open your dashboard to download this report anytime.'," + CRLF +
    CRLF +
    b"                    'success'," + CRLF +
    CRLF +
    b'                )' + CRLF +
    CRLF +
    b"            _log_security_event(current_user.id, 'upload_success', metadata={'report_id': snapshot_report_id, 'count': count, 'access_type': access_type, 'channel': 'web'}," + CRLF +
    CRLF +
    b'            )' + CRLF +
    CRLF +
    b"            return redirect(url_for('dashboard'))" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'        except Exception as exc:' + CRLF +
    CRLF +
    b"            _log_security_event(current_user.id, 'upload_failed', metadata={'error_class': type(exc).__name__, 'channel': 'web'}," + CRLF +
    CRLF +
    b'            )' + CRLF +
    CRLF +
    b"            flash('We could not process that CSV upload. Please verify the file format and try again.', 'danger')" + CRLF +
    CRLF +
    b"            return redirect(url_for('upload'))" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'    # Legacy GET /upload -> SPA handoff' + CRLF +
    b"    return redirect(_resolve_public_app_base_url() + '/upload', code=302)"
)

WEB_NEW = (
    b"@app.route('/upload', methods=['GET', 'POST'])" + CRLF +
    b'@login_required' + CRLF +
    b"@limiter.limit('15 per hour')" + CRLF +
    b'def upload():' + CRLF +
    b'    """CSV upload page for bulk review import with tiered limits."""' + CRLF +
    b'    # GET: hand off to the SPA.' + CRLF +
    b'    if request.method != \'POST\':' + CRLF +
    b"        return redirect(_resolve_public_app_base_url() + '/upload', code=302)" + CRLF +
    CRLF +
    b'    # TODO: Re-enable email verification gate when email confirmation flow exists.' + CRLF +
    b'    access_type = get_report_access_type(current_user.id)' + CRLF +
    b'    can_upload, trial_usage_count = _check_upload_credits(current_user.id, access_type)' + CRLF +
    b'    if not can_upload:' + CRLF +
    b"        flash('You have no remaining report credits. Upgrade or purchase a one-time report to generate new snapshots.', 'warning')" + CRLF +
    b"        return redirect(url_for('pricing'))" + CRLF +
    CRLF +
    b"    file = request.files.get('file')" + CRLF +
    b'    file_error = _validate_csv_file(file)' + CRLF +
    b'    if file_error:' + CRLF +
    b"        flash(file_error, 'danger')" + CRLF +
    b"        return redirect(url_for('upload'))" + CRLF +
    CRLF +
    b'    try:' + CRLF +
    b'        valid_rows, csv_error, parse_meta = _parse_csv_upload_rows(file, access_type)' + CRLF +
    b'        if csv_error:' + CRLF +
    b"            flash(csv_error, 'danger')" + CRLF +
    b"            return redirect(url_for('upload'))" + CRLF +
    CRLF +
    b'        report_hash = _build_report_hash(valid_rows)' + CRLF +
    b'        if _find_duplicate_report_id(current_user.id, report_hash):' + CRLF +
    b'            flash(' + CRLF +
    b"                'This upload appears identical to an existing report. '" + CRLF +
    b'                "To keep your trends accurate, we don\'t allow uploading the same reviews twice for the same account.",' + CRLF +
    b"                'warning'," + CRLF +
    b'            )' + CRLF +
    b"            return redirect(url_for('upload'))" + CRLF +
    CRLF +
    b'        # Single atomic transaction: reviews + snapshot + credit update.' + CRLF +
    b'        conn = db_connect()' + CRLF +
    b'        c = conn.cursor()' + CRLF +
    b'        try:' + CRLF +
    b"            conn.execute('BEGIN')" + CRLF +
    b'            _insert_user_reviews_tx(c, current_user.id, valid_rows)' + CRLF +
    b'            count = len(valid_rows)' + CRLF +
    b'            _maybe_raise_upload_fail_hook()' + CRLF +
    b'            snapshot_report_id, pending_alerts = _save_report_snapshot_tx(' + CRLF +
    b'                c, current_user.id, subscription_type=access_type, report_hash=report_hash,' + CRLF +
    b'            )' + CRLF +
    b'            _update_usage_credit_tx(c, current_user.id, access_type)' + CRLF +
    b'            conn.commit()' + CRLF +
    b'        except Exception:' + CRLF +
    b'            conn.rollback()' + CRLF +
    b'            raise' + CRLF +
    b'        finally:' + CRLF +
    b'            conn.close()' + CRLF +
    CRLF +
    b'        _fire_pending_slack_alerts(pending_alerts)' + CRLF +
    b'        msg = _build_upload_summary_message(access_type, count, snapshot_report_id, parse_meta)' + CRLF +
    b'        flash(msg, \'warning\' if snapshot_report_id is None or (parse_meta and parse_meta.get(\'truncated_for_plan\')) else \'success\')' + CRLF +
    b'        _log_upload_event(current_user.id, access_type, count, snapshot_report_id, \'web\')' + CRLF +
    b"        return redirect(url_for('dashboard'))" + CRLF +
    CRLF +
    b'    except Exception as exc:' + CRLF +
    b"        _log_security_event(current_user.id, 'upload_failed', metadata={'error_class': type(exc).__name__, 'channel': 'web'})" + CRLF +
    b"        flash('We could not process that CSV upload. Please verify the file format and try again.', 'danger')" + CRLF +
    b"        return redirect(url_for('upload'))"
)

if WEB_OLD not in src:
    print("WEB_OLD NOT FOUND")
    # debug: find a unique anchor in the old text and show what's around it
    anchor = b"    account_status = current_user.get_account_status()"
    idx = src.find(anchor)
    if idx > 0:
        print(f"  anchor found at byte {idx}, dumping 200 bytes:")
        print(repr(src[idx:idx+200]))
    sys.exit(1)

src = src.replace(WEB_OLD, WEB_NEW, 1)
print("web handler replaced OK")

# ---------------------------------------------------------------------------
# 3. Replace _ingest_rows_into_report
#    Remove: re-fetch of firm_ctx/firm_plan (already checked by caller),
#            pre-declarations, inline usage fetch, inline summary message,
#            duplicated log calls.
#    The function now takes firm_ctx as an optional parameter so existing
#    callers that already have it don't re-fetch; callers that don't pass it
#    fall back to _require_firm_context() for backward compat.
# ---------------------------------------------------------------------------

INGEST_OLD = (
    b'def _ingest_rows_into_report(valid_rows, access_type, parse_meta=None, channel=\'api\'):' + CRLF +
    b'    trial_usage_count, _ = _get_trial_usage_count(current_user.id, current_user.trial_limit)' + CRLF +
    b'    report_hash = _build_report_hash(valid_rows)' + CRLF +
    b'    duplicate_report_id = _find_duplicate_report_id(current_user.id, report_hash)' + CRLF +
    b'    if duplicate_report_id:' + CRLF +
    b'        return jsonify(' + CRLF +
    b'            {' + CRLF +
    b'                \'success\': False,' + CRLF +
    b'                \'error\': (' + CRLF +
    b'                    "This upload appears identical to an existing report. "' + CRLF +
    b'                    "To keep your trends accurate, we don\'t allow uploading the same reviews twice for the same account."' + CRLF +
    b'                ),' + CRLF +
    b'            }' + CRLF +
    b'        ), 409' + CRLF +
    CRLF +
    b'    firm_ctx, firm_err = _require_firm_context()' + CRLF +
    b'    if firm_err:' + CRLF +
    b'        return firm_err' + CRLF +
    b'    firm_plan = get_firm_plan(firm_ctx[\'firm_id\'])' + CRLF +
    b'    report_limit_error = _enforce_report_generation_limit(firm_ctx[\'firm_id\'], firm_plan)' + CRLF +
    b'    if report_limit_error:' + CRLF +
    b'        return report_limit_error' + CRLF +
    CRLF +
    b'    conn = db_connect()' + CRLF +
    b'    c = conn.cursor()' + CRLF +
    b'    snapshot_report_id = None' + CRLF +
    b'    count = 0' + CRLF +
    b'    try:' + CRLF +
    b"        conn.execute('BEGIN')" + CRLF +
    b'        _insert_user_reviews_tx(c, current_user.id, valid_rows)' + CRLF +
    b'        count = len(valid_rows)' + CRLF +
    CRLF +
    b'        _maybe_raise_upload_fail_hook()' + CRLF +
    CRLF +
    b'        snapshot_report_id, _pending_slack_alerts = _save_report_snapshot_tx(' + CRLF +
    b'            c,' + CRLF +
    b'            current_user.id,' + CRLF +
    b'            subscription_type=access_type,' + CRLF +
    b'            report_hash=report_hash,' + CRLF +
    b'        )' + CRLF +
    CRLF +
    b'        # Credit update AFTER snapshot exists \xe2\x80\x94 same transaction.' + CRLF +
    b'        _update_usage_credit_tx(c, current_user.id, access_type, trial_usage_count=trial_usage_count)' + CRLF +
    CRLF +
    b'        conn.commit()' + CRLF +
    b'    except Exception:' + CRLF +
    b'        conn.rollback()' + CRLF +
    b'        raise' + CRLF +
    b'    finally:' + CRLF +
    b'        conn.close()' + CRLF +
    CRLF +
    b'    _fire_pending_slack_alerts(_pending_slack_alerts)' + CRLF +
    CRLF +
    b'    if snapshot_report_id:' + CRLF +
    b'        try:' + CRLF +
    b"            scan_recent_reviews_for_signals(db_connect, firm_id=firm_ctx['firm_id'])" + CRLF +
    b'        except Exception:' + CRLF +
    b"            app.logger.exception('Failed signal monitor scan for firm %s after upload', firm_ctx['firm_id'])" + CRLF +
    CRLF +
    b'    conn = db_connect()' + CRLF +
    b'    c = conn.cursor()' + CRLF +
    b'    c.execute(' + CRLF +
    b'        \'\'\'' + CRLF +
    b'        SELECT trial_reviews_used, trial_limit, one_time_reports_purchased, one_time_reports_used, subscription_type' + CRLF +
    b'        FROM users' + CRLF +
    b'        WHERE id = ?' + CRLF +
    b'        \'\'\',' + CRLF +
    b'        (current_user.id,),' + CRLF +
    b'    )' + CRLF +
    b'    usage_row = c.fetchone()' + CRLF +
    b'    conn.close()' + CRLF +
    CRLF +
    b'    usage = {' + CRLF +
    b'        \'trial_reviews_used\': max(' + CRLF +
    b'            int(usage_row[0] or 0) if usage_row else 0,' + CRLF +
    b'            _get_trial_report_snapshot_count(current_user.id),' + CRLF +
    b'        ),' + CRLF +
    b"        'trial_limit': usage_row[1] if usage_row else FREE_PLAN_REPORT_LIMIT," + CRLF +
    b"        'one_time_reports_used': usage_row[3] if usage_row else 0," + CRLF +
    b"        'one_time_reports_remaining': max(0, (usage_row[2] if usage_row else 0) - (usage_row[3] if usage_row else 0))," + CRLF +
    b"        'subscription_type': usage_row[4] if usage_row else 'trial'," + CRLF +
    b'    }' + CRLF +
    CRLF +
    b'    if not snapshot_report_id:' + CRLF +
    b"        _log_security_event(current_user.id, 'upload_success', metadata={'report_id': None, 'count': count, 'access_type': access_type, 'channel': channel})" + CRLF +
    b'        return jsonify(' + CRLF +
    b'            {' + CRLF +
    b"                'success': True," + CRLF +
    b"                'summary': {" + CRLF +
    b"                    'imported_count': count," + CRLF +
    b"                    'report_id': None," + CRLF +
    b"                    'message': 'Upload succeeded, but no snapshot was created.'," + CRLF +
    b"                    'truncated_for_plan': bool(parse_meta and parse_meta.get('truncated_for_plan'))," + CRLF +
    b"                    'skipped_due_to_plan_limit': int(parse_meta.get('skipped_due_to_plan_limit', 0)) if parse_meta else 0," + CRLF +
    b'                },' + CRLF +
    b"                'usage': usage," + CRLF +
    b'            }' + CRLF +
    b'        ), 200' + CRLF +
    CRLF +
    b"    summary_message = f'Success! Imported {count} reviews and saved report snapshot #{snapshot_report_id}.'" + CRLF +
    b"    if access_type == 'trial' and parse_meta and parse_meta.get('truncated_for_plan'):" + CRLF +
    b"        skipped = int(parse_meta.get('skipped_due_to_plan_limit', 0))" + CRLF +
    b'        summary_message = (' + CRLF +
    b'            f\'Success! We analyzed the first {FREE_PLAN_MAX_REVIEWS_PER_REPORT} valid reviews for the Free plan \'' + CRLF +
    b"            f'and skipped {skipped} additional reviews. Upgrade to analyze all uploaded reviews.'" + CRLF +
    b'        )' + CRLF +
    CRLF +
    b"    _log_security_event(current_user.id, 'upload_success', metadata={'report_id': snapshot_report_id, 'count': count, 'access_type': access_type, 'channel': channel})" + CRLF +
    b'    return jsonify(' + CRLF +
    b'        {' + CRLF +
    b"            'success': True," + CRLF +
    b"            'summary': {" + CRLF +
    b"                'imported_count': count," + CRLF +
    b"                'report_id': snapshot_report_id," + CRLF +
    b"                'message': summary_message," + CRLF +
    b"                'truncated_for_plan': bool(parse_meta and parse_meta.get('truncated_for_plan'))," + CRLF +
    b"                'skipped_due_to_plan_limit': int(parse_meta.get('skipped_due_to_plan_limit', 0)) if parse_meta else 0," + CRLF +
    b'            },' + CRLF +
    b"            'usage': usage," + CRLF +
    b'        }' + CRLF +
    b'    ), 200'
)

INGEST_NEW = (
    b"def _ingest_rows_into_report(valid_rows, access_type, parse_meta=None, channel='api', firm_ctx=None):" + CRLF +
    b'    """Run the full ingest pipeline: dedup check -> transaction -> signal scan -> JSON response.' + CRLF +
    CRLF +
    b'    firm_ctx may be pre-supplied by the caller to avoid a redundant DB round-trip.' + CRLF +
    b'    """' + CRLF +
    b'    trial_usage_count, _ = _get_trial_usage_count(current_user.id, current_user.trial_limit)' + CRLF +
    b'    report_hash = _build_report_hash(valid_rows)' + CRLF +
    b'    if _find_duplicate_report_id(current_user.id, report_hash):' + CRLF +
    b'        return jsonify({' + CRLF +
    b"            'success': False," + CRLF +
    b"            'error': (" + CRLF +
    b'                "This upload appears identical to an existing report. "' + CRLF +
    b'                "To keep your trends accurate, we don\'t allow uploading the same reviews twice for the same account."' + CRLF +
    b'            ),' + CRLF +
    b'        }), 409' + CRLF +
    CRLF +
    b'    if firm_ctx is None:' + CRLF +
    b'        firm_ctx, firm_err = _require_firm_context()' + CRLF +
    b'        if firm_err:' + CRLF +
    b'            return firm_err' + CRLF +
    b'    firm_plan = get_firm_plan(firm_ctx[\'firm_id\'])' + CRLF +
    b'    report_limit_error = _enforce_report_generation_limit(firm_ctx[\'firm_id\'], firm_plan)' + CRLF +
    b'    if report_limit_error:' + CRLF +
    b'        return report_limit_error' + CRLF +
    CRLF +
    b'    # Atomic transaction: insert reviews, snapshot, credit update.' + CRLF +
    b'    conn = db_connect()' + CRLF +
    b'    c = conn.cursor()' + CRLF +
    b'    try:' + CRLF +
    b"        conn.execute('BEGIN')" + CRLF +
    b'        _insert_user_reviews_tx(c, current_user.id, valid_rows)' + CRLF +
    b'        count = len(valid_rows)' + CRLF +
    b'        _maybe_raise_upload_fail_hook()' + CRLF +
    b'        snapshot_report_id, pending_alerts = _save_report_snapshot_tx(' + CRLF +
    b'            c, current_user.id, subscription_type=access_type, report_hash=report_hash,' + CRLF +
    b'        )' + CRLF +
    b'        _update_usage_credit_tx(c, current_user.id, access_type, trial_usage_count=trial_usage_count)' + CRLF +
    b'        conn.commit()' + CRLF +
    b'    except Exception:' + CRLF +
    b'        conn.rollback()' + CRLF +
    b'        raise' + CRLF +
    b'    finally:' + CRLF +
    b'        conn.close()' + CRLF +
    CRLF +
    b'    _fire_pending_slack_alerts(pending_alerts)' + CRLF +
    CRLF +
    b'    if snapshot_report_id:' + CRLF +
    b'        try:' + CRLF +
    b"            scan_recent_reviews_for_signals(db_connect, firm_id=firm_ctx['firm_id'])" + CRLF +
    b'        except Exception:' + CRLF +
    b"            app.logger.exception('Failed signal monitor scan for firm %s after upload', firm_ctx['firm_id'])" + CRLF +
    CRLF +
    b'    usage = _fetch_user_usage(current_user.id)' + CRLF +
    b'    summary_message = _build_upload_summary_message(access_type, count, snapshot_report_id, parse_meta)' + CRLF +
    b'    _log_upload_event(current_user.id, access_type, count, snapshot_report_id, channel)' + CRLF +
    CRLF +
    b'    truncated = bool(parse_meta and parse_meta.get(\'truncated_for_plan\'))' + CRLF +
    b'    skipped = int(parse_meta.get(\'skipped_due_to_plan_limit\', 0)) if parse_meta else 0' + CRLF +
    b'    return jsonify({' + CRLF +
    b"        'success': True," + CRLF +
    b"        'summary': {" + CRLF +
    b"            'imported_count': count," + CRLF +
    b"            'report_id': snapshot_report_id," + CRLF +
    b"            'message': summary_message," + CRLF +
    b"            'truncated_for_plan': truncated," + CRLF +
    b"            'skipped_due_to_plan_limit': skipped," + CRLF +
    b'        },' + CRLF +
    b"        'usage': usage," + CRLF +
    b'    }), 200'
)

if INGEST_OLD not in src:
    print("INGEST_OLD NOT FOUND")
    # debug
    anchor = b"def _ingest_rows_into_report"
    idx = src.find(anchor)
    if idx > 0:
        print(f"  function found at byte {idx}")
        print(repr(src[idx:idx+300]))
    sys.exit(1)

src = src.replace(INGEST_OLD, INGEST_NEW, 1)
print("_ingest_rows_into_report replaced OK")

# ---------------------------------------------------------------------------
# 4. Update api_upload() to pass firm_ctx into _ingest_rows_into_report
# ---------------------------------------------------------------------------

API_OLD = (
    b"        return _ingest_rows_into_report(valid_rows, access_type, parse_meta=parse_meta, channel='api')"
)
API_NEW = (
    b"        return _ingest_rows_into_report(valid_rows, access_type, parse_meta=parse_meta, channel='api', firm_ctx=firm_ctx)"
)
if API_OLD not in src:
    print("API_OLD not found — checking for existing firm_ctx param")
else:
    src = src.replace(API_OLD, API_NEW, 1)
    print("api_upload firm_ctx passthrough OK")

# ---------------------------------------------------------------------------
# Write
# ---------------------------------------------------------------------------
with open(path, 'wb') as f:
    f.write(src)
print("file written OK")
