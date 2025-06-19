import oracledb
from utils.db import execute_query, execute_many
from datetime import datetime


def sync_sessions():
    query = "SELECT sid, status, blocking_session FROM v$session WHERE username IS NOT NULL"
    rows = execute_query(query)
    execute_query("DELETE FROM v_session")
    execute_many("INSERT INTO v_session (session_id, status, blocking_session) VALUES (:1, :2, :3)", rows)

if __name__ == "__main__":
    sync_sessions()
