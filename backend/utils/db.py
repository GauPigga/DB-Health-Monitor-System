import oracledb
from config import ORACLE_CONFIG

def get_connection():
    try:
        dsn = oracledb.makedsn(
            ORACLE_CONFIG["host"],
            ORACLE_CONFIG["port"],
            service_name=ORACLE_CONFIG["service_name"],
        )
        connection = oracledb.connect(
            user=ORACLE_CONFIG["user"],
            password=ORACLE_CONFIG["password"],
            dsn=dsn,
        )
        return connection
    except Exception as e:
        print(f"[DB ERROR] Failed to connect: {e}")
        raise

def fetch_all_dict(query, params=None):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                columns = [col[0].lower() for col in cursor.description]
                rows = cursor.fetchall()
                return [{columns[i]: row[i] for i in range(len(columns))} for row in rows]
    except Exception as e:
        print(f"[QUERY ERROR] fetch_all_dict failed: {e}")
        return []

def fetch_one_dict(query, params=None):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                columns = [col[0].lower() for col in cursor.description]
                row = cursor.fetchone()
                print("[DEBUG] Columns:", columns)
                print("[DEBUG] Row:", row)
                return {columns[i]: row[i] for i in range(len(columns))} if row else None
    except Exception as e:
        print(f"[QUERY ERROR] fetch_one_dict failed: {e}")
        return None
