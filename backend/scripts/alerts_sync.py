import oracledb
from utils.db import execute_query, execute_many
from datetime import datetime


def sync_alerts():
    query = """
        SELECT originating_timestamp, message_text
        FROM v$diag_alert_ext
        WHERE originating_timestamp > SYSDATE - 1
        ORDER BY originating_timestamp DESC FETCH FIRST 20 ROWS ONLY
    """
    rows = execute_query(query)
    cleaned = [(r[0], r[1][:400]) for r in rows]
    execute_query("DELETE FROM db_alerts")
    execute_many("INSERT INTO db_alerts (alert_time, message) VALUES (:1, :2)", cleaned)

if __name__ == "__main__":
    sync_alerts()
