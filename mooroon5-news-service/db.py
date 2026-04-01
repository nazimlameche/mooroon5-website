import logging
import os
import sys
from datetime import datetime, timezone

import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger(__name__)


def _get_connection() -> psycopg2.extensions.connection:
    """Open a connection to Neon PostgreSQL using NEON_DATABASE_URL."""
    url = os.environ.get("NEON_DATABASE_URL")
    if not url:
        logger.error("NEON_DATABASE_URL environment variable is not set")
        sys.exit(1)
    try:
        return psycopg2.connect(url, cursor_factory=RealDictCursor)
    except psycopg2.OperationalError as e:
        logger.error("Cannot connect to database: %s", e)
        sys.exit(1)


def get_active_subscriptions() -> list[dict]:
    """Return all active subscriptions as a list of dicts with email and company_name."""
    conn = _get_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                "SELECT email, company_name FROM subscriptions WHERE is_active = TRUE"
            )
            return [dict(row) for row in cur.fetchall()]
    finally:
        conn.close()


def update_last_sent(email: str, company_name: str) -> None:
    """Update last_sent_at for the given subscription."""
    conn = _get_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                UPDATE subscriptions
                SET last_sent_at = %s
                WHERE email = %s AND company_name = %s
                """,
                (datetime.now(timezone.utc), email, company_name),
            )
    finally:
        conn.close()
