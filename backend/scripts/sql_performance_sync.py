import oracledb
from utils.db import execute_query, execute_many
from datetime import datetime


def sync_sql_performance():
    query = """
        SELECT sql_text, executions, elapsed_time / executions AS avg_exec_time_ms,
               cpu_time, last_active_time
        FROM v$sql
        WHERE executions > 0 AND last_active_time IS NOT NULL
        ORDER BY last_active_time DESC FETCH FIRST 20 ROWS ONLY
    """
    rows = execute_query(query)
    cleaned = []
    for r in rows:
        cleaned.append((
            r[0][:1000], r[1], round(r[2]/1000, 2), r[3], r[4]
        ))

    execute_query("DELETE FROM sql_performance_view")
    execute_many("INSERT INTO sql_performance_view (sql_text, executions, avg_exec_time_ms, total_cpu_time, last_execution) VALUES (:1, :2, :3, :4, :5)", cleaned)

if __name__ == "__main__":
    sync_sql_performance()
