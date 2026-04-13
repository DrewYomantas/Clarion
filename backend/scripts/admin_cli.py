#!/usr/bin/env python3

"""Admin maintenance CLI for safe account operations."""



from __future__ import annotations



import argparse
from datetime import datetime, timezone

from config import Config
from db_compat import DatabaseConnector





def db_connect():
    return DatabaseConnector(Config.DATABASE_URL).connect()





def grant_credits(email: str, count: int):

    conn = db_connect(); cur = conn.cursor()

    cur.execute(

        """

        UPDATE users

        SET one_time_reports_purchased = COALESCE(one_time_reports_purchased, 0) + ?

        WHERE email = ?

        """,

        (count, email),

    )

    conn.commit(); changed = cur.rowcount; conn.close()

    print(f"updated_rows={changed}")





def set_subscription(email: str, sub_type: str, status: str):

    conn = db_connect(); cur = conn.cursor()

    cur.execute(

        "UPDATE users SET subscription_type = ?, subscription_status = ? WHERE email = ?",

        (sub_type, status, email),

    )

    conn.commit(); changed = cur.rowcount; conn.close()

    print(f"updated_rows={changed}")





def verify_email(email: str):

    conn = db_connect(); cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = ?", (email,))

    row = cur.fetchone()

    if not row:

        conn.close()

        print("user_not_found")

        return

    user_id = row[0]

    cur.execute(

        "INSERT OR REPLACE INTO user_email_verification (user_id, verified_at) VALUES (?, ?)",

        (user_id, datetime.now(timezone.utc).isoformat()),

    )

    conn.commit(); conn.close()

    print("verified")





def rename_email(old_email: str, new_email: str):
    conn = db_connect(); cur = conn.cursor()
    cur.execute("SELECT id, username FROM users WHERE email = ?", (old_email,))
    row = cur.fetchone()
    if not row:
        conn.close()
        print("user_not_found")
        return
    user_id, username = row
    cur.execute("SELECT id FROM users WHERE email = ?", (new_email,))
    if cur.fetchone():
        conn.close()
        print("new_email_already_exists")
        return
    new_username = new_email if username == old_email else username
    cur.execute(
        "UPDATE users SET email = ?, username = ?, email_verified = 1, is_verified = 1 WHERE id = ?",
        (new_email, new_username, user_id),
    )
    cur.execute(
        "INSERT OR REPLACE INTO user_email_verification (user_id, verified_at) VALUES (?, ?)",
        (user_id, datetime.now(timezone.utc).isoformat()),
    )
    conn.commit(); changed = cur.rowcount; conn.close()
    print(f"renamed user_id={user_id} updated_rows={changed}")


def main():

    parser = argparse.ArgumentParser(description='Clarion admin utility')

    sub = parser.add_subparsers(dest='cmd', required=True)



    p1 = sub.add_parser('grant-credits')

    p1.add_argument('--email', required=True)

    p1.add_argument('--count', type=int, required=True)



    p2 = sub.add_parser('set-subscription')

    p2.add_argument('--email', required=True)

    p2.add_argument('--type', required=True, choices=['trial', 'one-time', 'monthly', 'annual'])

    p2.add_argument('--status', required=True, choices=['trial', 'active', 'inactive', 'canceled', 'past_due'])



    p3 = sub.add_parser('verify-email')

    p3.add_argument('--email', required=True)

    p4 = sub.add_parser('rename-email')
    p4.add_argument('--old-email', required=True)
    p4.add_argument('--new-email', required=True)



    args = parser.parse_args()



    if args.cmd == 'grant-credits':

        grant_credits(args.email, args.count)

    elif args.cmd == 'set-subscription':

        set_subscription(args.email, args.type, args.status)

    elif args.cmd == 'verify-email':

        verify_email(args.email)
    elif args.cmd == 'rename-email':
        rename_email(args.old_email, args.new_email)





if __name__ == '__main__':

    main()



