import oracledb
from utils.db import execute_query, execute_many
from datetime import datetime


def sync_cpu_memory():
    query = """
        SELECT metric_name, value
        FROM v$sysmetric
        WHERE metric_name IN ('CPU Usage Per Sec', 'Memory Used (MB)', 'Memory Size (MB)')
    """
    rows = execute_query(query)
    execute_query("DELETE FROM v_sysmetric")
    execute_many("INSERT INTO v_sysmetric (metric_name, value) VALUES (:1, :2)", rows)

if __name__ == "__main__":
    sync_cpu_memory()
