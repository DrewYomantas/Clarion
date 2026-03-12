import sys

path = r'C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\backend\app.py'
with open(path, 'rb') as f:
    src = f.read()

CRLF = b'\r\n'
USFX = b'\xef\xbf\xbd'  # replacement char used in file instead of em-dash

# ---------------------------------------------------------------------------
# WEB CALLER replacement
# ---------------------------------------------------------------------------
web_old = (
    b'                # F8 test hook: set UPLOAD_FAIL_AFTER_REVIEWS=1 to prove rollback.' + CRLF +
    CRLF +
    b'                # PR5b: only active in dev/test ' + USFX + b' ignored in production.' + CRLF +
    CRLF +
    b'                if (' + CRLF +
    CRLF +
    b"                    os.environ.get('UPLOAD_FAIL_AFTER_REVIEWS') == '1'" + CRLF +
    CRLF +
    b"                    and (app.config.get('DEBUG') or app.config.get('TESTING'))" + CRLF +
    CRLF +
    b'                ):' + CRLF +
    CRLF +
    b"                    raise RuntimeError('PR5 test: forced failure after review inserts')" + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'                snapshot_report_id, _pending_slack_alerts = _save_report_snapshot_tx(' + CRLF +
    CRLF +
    b'                    c,' + CRLF +
    CRLF +
    b'                    current_user.id,' + CRLF +
    CRLF +
    b'                    subscription_type=access_type,' + CRLF +
    CRLF +
    b'                    report_hash=report_hash,' + CRLF +
    CRLF +
    b'                )' + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'                # Credit update AFTER snapshot exists ' + USFX + b' same transaction.' + CRLF +
    CRLF +
    b"                if access_type == 'onetime':" + CRLF +
    CRLF +
    b'                    c.execute(' + CRLF +
    CRLF +
    b"                        '''" + CRLF +
    CRLF +
    b'                        UPDATE users' + CRLF +
    CRLF +
    b'                        SET one_time_reports_used = one_time_reports_used + 1' + CRLF +
    CRLF +
    b'                        WHERE id = ?' + CRLF +
    CRLF +
    b"                        '''," + CRLF +
    CRLF +
    b'                        (current_user.id,),' + CRLF +
    CRLF +
    b'                    )' + CRLF +
    CRLF +
    b"                elif access_type == 'trial':" + CRLF +
    b'                    # Atomic increment avoids a TOCTOU race where two concurrent' + CRLF +
    b'                    # uploads both read the same count and the second write wins.' + CRLF +
    b'                    c.execute(' + CRLF +
    b"                        'UPDATE users SET trial_reviews_used = trial_reviews_used + 1 WHERE id = ?'," + CRLF +
    b'                        (current_user.id,),' + CRLF +
    b'                    )' + CRLF +
    CRLF +
    CRLF +
    CRLF +
    b'                conn.commit()' + CRLF +
    CRLF +
    b'            except Exception:' + CRLF +
    CRLF +
    b'                conn.rollback()' + CRLF +
    CRLF +
    b'                raise' + CRLF +
    CRLF +
    b'            finally:' + CRLF +
    CRLF +
    b'                conn.close()' + CRLF +
    CRLF +
    b'            # Fire Slack alerts after the transaction commits so the network' + CRLF +
    b'            # call does not hold the DB write lock.' + CRLF +
    b'            for _alert_msg in (_pending_slack_alerts or []):' + CRLF +
    b'                try:' + CRLF +
    b'                    send_slack_alert(_alert_msg)' + CRLF +
    b'                except Exception:' + CRLF +
    b"                    app.logger.exception('Failed to send post-commit Slack governance alert')"
)

web_new = (
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
    b'            _fire_pending_slack_alerts(_pending_slack_alerts)'
)

if web_old not in src:
    print('WEB OLD NOT FOUND')
    sys.exit(1)

src = src.replace(web_old, web_new, 1)
print('web caller patched OK')

# ---------------------------------------------------------------------------
# API CALLER replacement
# ---------------------------------------------------------------------------
api_old = (
    b'        if (' + CRLF +
    b"            os.environ.get('UPLOAD_FAIL_AFTER_REVIEWS') == '1'" + CRLF +
    b"            and (app.config.get('DEBUG') or app.config.get('TESTING'))" + CRLF +
    b'        ):' + CRLF +
    b"            raise RuntimeError('PR5 test: forced failure after review inserts')" + CRLF +
    CRLF +
    b'        snapshot_report_id, _pending_slack_alerts = _save_report_snapshot_tx(' + CRLF +
    b'            c,' + CRLF +
    b'            current_user.id,' + CRLF +
    b'            subscription_type=access_type,' + CRLF +
    b'            report_hash=report_hash,' + CRLF +
    b'        )' + CRLF +
    CRLF +
    b"        if access_type == 'onetime':" + CRLF +
    b'            c.execute(' + CRLF +
    b"                '''" + CRLF +
    b'                UPDATE users' + CRLF +
    b'                SET one_time_reports_used = one_time_reports_used + 1' + CRLF +
    b'                WHERE id = ?' + CRLF +
    b"                '''," + CRLF +
    b'                (current_user.id,),' + CRLF +
    b'            )' + CRLF +
    b"        elif access_type == 'trial':" + CRLF +
    b'            updated_free_usage = max(' + CRLF +
    b'                trial_usage_count + 1,' + CRLF +
    b'                _get_trial_report_snapshot_count(current_user.id),' + CRLF +
    b'            )' + CRLF +
    b'            c.execute(' + CRLF +
    b"                '''" + CRLF +
    b'                UPDATE users' + CRLF +
    b'                SET trial_reviews_used = ?' + CRLF +
    b'                WHERE id = ?' + CRLF +
    b"                '''," + CRLF +
    b'                (updated_free_usage, current_user.id),' + CRLF +
    b'            )' + CRLF +
    CRLF +
    b'        conn.commit()' + CRLF +
    b'    except Exception:' + CRLF +
    b'        conn.rollback()' + CRLF +
    b'        raise' + CRLF +
    b'    finally:' + CRLF +
    b'        conn.close()' + CRLF +
    CRLF +
    b'    # Fire Slack alerts after the transaction commits so the network' + CRLF +
    b'    # call does not hold the DB write lock.' + CRLF +
    b'    for _alert_msg in (_pending_slack_alerts or []):' + CRLF +
    b'        try:' + CRLF +
    b'            send_slack_alert(_alert_msg)' + CRLF +
    b'        except Exception:' + CRLF +
    b"            app.logger.exception('Failed to send post-commit Slack governance alert')"
)

api_new = (
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
    b'    _fire_pending_slack_alerts(_pending_slack_alerts)'
)

if api_old not in src:
    print('API OLD NOT FOUND')
    sys.exit(1)

src = src.replace(api_old, api_new, 1)
print('api caller patched OK')

with open(path, 'wb') as f:
    f.write(src)
print('file written')
