import oracledb
from utils.db import execute_query, execute_many
from datetime import datetime


def sync_tablespace_usage():
    query = """
        SELECT df.tablespace_name,
               ROUND(SUM(df.bytes) / 1024 / 1024 / 1024, 2) AS total_gb,
               ROUND(SUM(df.bytes - fs.bytes) / 1024 / 1024 / 1024, 2) AS used_gb
        FROM dba_data_files df
        JOIN (
            SELECT tablespace_name, SUM(bytes) AS bytes
            FROM dba_free_space
            GROUP BY tablespace_name
        ) fs ON df.tablespace_name = fs.tablespace_name
        GROUP BY df.tablespace_name, fs.bytes
    """
    rows = execute_query(query)
    execute_query("DELETE FROM tablespace_usage_view")
    execute_many("INSERT INTO tablespace_usage_view (tablespace_name, total_space_gb, used_space_gb) VALUES (:1, :2, :3)", rows)

if __name__ == "__main__":
    sync_tablespace_usage()
