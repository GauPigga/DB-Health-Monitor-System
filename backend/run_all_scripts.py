import oracledb
import os
from config import ORACLE_CONFIG

def get_connection():
    dsn = oracledb.makedsn(
        ORACLE_CONFIG["host"], ORACLE_CONFIG["port"], service_name=ORACLE_CONFIG["service_name"]
    )
    connection = oracledb.connect(
        user=ORACLE_CONFIG["user"],
        password=ORACLE_CONFIG["password"],
        dsn=dsn,
        encoding="UTF-8"
    )
    return connection

def run_sql_file(filepath):
    conn = get_connection()
    cursor = conn.cursor()
    with open(filepath, 'r') as f:
        sql_commands = f.read()
    for cmd in sql_commands.split(';'):
        if cmd.strip():
            cursor.execute(cmd)
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    scripts_path = './backend/scripts' 
    for filename in os.listdir(scripts_path):
        if filename.endswith('.sql'):
            print(f"Running {filename}")
            run_sql_file(os.path.join(scripts_path, filename))
    print("All scripts executed.")
