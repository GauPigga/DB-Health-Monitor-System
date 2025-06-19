import oracledb
from utils.db import execute_query, execute_many
from datetime import datetime


def sync_user_activity():
    query = """
        SELECT username,
               COUNT(*) FILTER (WHERE status='ACTIVE') AS active_sessions,
               SUM(cpu_time) AS total_cpu_time,
               COUNT(*) AS total_queries
        FROM v$session
        WHERE username IS NOT NULL
        GROUP BY username
    """
    rows = execute_query(query)
    execute_query("DELETE FROM user_activity_view")
    execute_many("INSERT INTO user_activity_view (username, active_sessions, total_cpu_time, total_queries) VALUES (:1, :2, :3, :4)", rows)

if __name__ == "__main__":
    sync_user_activity()
