"""
Pass 3 patch — final.
Replaces the POST block in upload() and all of _ingest_rows_into_report.
"""
import sys

path = r'C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\backend\app.py'
with open(path, 'rb') as f:
    src = f.read()

CRLF = b'\r\n'

# -----------------------------------------------------------------------
# 1. Replace POST block inside upload()
#    Boundary: from "    if request.method == 'POST':\r\n"
#              to   (exclusive) "    # Legacy GET /upload -> SPA handoff\r\n"
# -----------------------------------------------------------------------

post_marker   = b"    if request.method == 'POST':" + CRLF
get_comment   = b'    # Legacy GET /upload -> SPA handoff' + CRLF
upload_def    = b'def upload():'
def_pos       = src.find(upload_def)
post_pos      = src.find(post_marker, def_pos)
get_end_pos   = src.find(get_comment, post_pos)

if post_pos < 0 or get_end_pos < 0:
    print(f"BOUNDARY NOT FOUND: post_pos={post_pos}, get_end_pos={get_end_pos}")
    sys.exit(1)

post_block_old = src[post_pos:get_end_pos]

post_block_new = (
    b"    if request.method != 'POST':" + CRLF +
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
    b"        flash_level = 'warning' if (snapshot_report_id is None or (parse_meta and parse_meta.get('truncated_for_plan'))) else 'success'" + CRLF +
    b'        flash(msg, flash_level)' + CRLF +
    b'        _log_upload_event(current_user.id, access_type, count, snapshot_report_id, \'web\')' + CRLF +
    b"        return redirect(url_for('dashboard'))" + CRLF +
    CRLF +
    b'    except Exception as exc:' + CRLF +
    b"        _log_security_event(current_user.id, 'upload_failed', metadata={'error_class': type(exc).__name__, 'channel': 'web'})" + CRLF +
    b"        flash('We could not process that CSV upload. Please verify the file format and try again.', 'danger')" + CRLF +
    b"        return redirect(url_for('upload'))" + CRLF +
    CRLF
)

src = src[:post_pos] + post_block_new + src[get_end_pos:]
print("upload() POST block replaced OK")

# -----------------------------------------------------------------------
# 2. Replace _ingest_rows_into_report
# -----------------------------------------------------------------------

INGEST_OLD = (
    b"def _ingest_rows_into_report(valid_rows, access_type, parse_meta=None, channel='api'):" + CRLF +
    b'    trial_usage_count, _ = _get_trial_usage_count(current_user.id, current_user.trial_limit)' + CRLF +
    b'    report_hash = _build_report_hash(valid_rows)' + CRLF +
    b'    duplicate_report_id = _find_duplicate_report_id(current_user.id, report_hash)' + CRLF +
    b'    if duplicate_report_id:' + CRLF +
    b'        return jsonify(' + CRLF +
    b'            {' + CRLF +
    b"                'success': False," + CRLF +
    b"                'error': (" + CRLF +
    b'                    "This upload appears identical to an existing report. "' + CRLF +
    b'                    "To keep your trends accurate, we don\'t allow uploading the same reviews twice for the same account."' + CRLF +
    b'                ),' + CRLF +
    b'            }' + CRLF +
    b'        ), 409' + CRLF +
    CRLF +
    b'    firm_ctx, firm_err = _require_firm_context()' + CRLF +
    b'    if firm_err:' + CRLF +
    b'        return firm_err' + CRLF +
    b"    firm_plan = get_firm_plan(firm_ctx['firm_id'])" + CRLF +
    b"    report_limit_error = _enforce_report_generation_limit(firm_ctx['firm_id'], firm_plan)" + CRLF +
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
    b"        '''" + CRLF +
    b'        SELECT trial_reviews_used, trial_limit, one_time_reports_purchased, one_time_reports_used, subscription_type' + CRLF +
    b'        FROM users' + CRLF +
    b'        WHERE id = ?' + CRLF +
    b"        '''," + CRLF +
    b'        (current_user.id,),' + CRLF +
    b'    )' + CRLF +
    b'    usage_row = c.fetchone()' + CRLF +
    b'    conn.close()' + CRLF +
    CRLF +
    b'    usage = {' + CRLF +
    b"        'trial_reviews_used': max(" + CRLF +
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
    b"    firm_plan = get_firm_plan(firm_ctx['firm_id'])" + CRLF +
    b"    report_limit_error = _enforce_report_generation_limit(firm_ctx['firm_id'], firm_plan)" + CRLF +
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
    b"    truncated = bool(parse_meta and parse_meta.get('truncated_for_plan'))" + CRLF +
    b"    skipped = int(parse_meta.get('skipped_due_to_plan_limit', 0)) if parse_meta else 0" + CRLF +
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
    idx = src.find(b"def _ingest_rows_into_report")
    if idx > 0:
        print(f"  function at byte {idx}")
        sys.stdout.buffer.write(b'FIRST 400: ' + src[idx:idx+400] + b'\n')
    sys.exit(1)

src = src.replace(INGEST_OLD, INGEST_NEW, 1)
print("_ingest_rows_into_report replaced OK")

# -----------------------------------------------------------------------
# 3. Pass firm_ctx from api_upload into _ingest_rows_into_report
# -----------------------------------------------------------------------
API_OLD = b"        return _ingest_rows_into_report(valid_rows, access_type, parse_meta=parse_meta, channel='api')"
API_NEW = b"        return _ingest_rows_into_report(valid_rows, access_type, parse_meta=parse_meta, channel='api', firm_ctx=firm_ctx)"
if API_OLD in src:
    src = src.replace(API_OLD, API_NEW, 1)
    print("api_upload firm_ctx passthrough OK")
else:
    print("api_upload passthrough already patched or not found — skipping")

# -----------------------------------------------------------------------
# Write
# -----------------------------------------------------------------------
with open(path, 'wb') as f:
    f.write(src)
print("file written OK")
