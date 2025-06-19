import oracledb
from utils.db import execute_query, execute_many
from datetime import datetime


def sync_largest_tables():
    query = """
        SELECT segment_name,
               ROUND(SUM(bytes)/1024/1024, 2) AS size_mb
        FROM dba_segments
        WHERE segment_type='TABLE'
        GROUP BY segment_name
        ORDER BY size_mb DESC FETCH FIRST 10 ROWS ONLY
    """
    rows = execute_query(query)
    execute_query("DELETE FROM largest_tables_view")
    execute_many("INSERT INTO largest_tables_view (table_name, size_mb) VALUES (:1, :2)", rows)

if __name__ == "__main__":
    sync_largest_tables()
