import oracledb
from utils.db import execute_query, execute_many
from datetime import datetime


def sync_instance_status():
    query = "SELECT status, startup_time FROM v$instance"
    row = execute_query(query)[0]
    execute_query("DELETE FROM v_instance")
    execute_query("INSERT INTO v_instance (status, startup_time) VALUES (:1, :2)", [row])

if __name__ == "__main__":
    sync_instance_status()
