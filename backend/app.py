from flask import Flask, jsonify
from flask_cors import CORS
from utils.db import fetch_all_dict, fetch_one_dict

app = Flask(__name__)
CORS(app)

@app.route("/api/db-status")
def db_status():
    try:
        query = """
            SELECT 
                status, 
                host_name, 
                TO_CHAR(startup_time, 'YYYY-MM-DD HH24:MI:SS') AS uptime
            FROM v$instance
        """
        data = fetch_one_dict(query)
        return jsonify({
            "status": data.get("status", "UNKNOWN"),
            "host": data.get("host_name", "UNKNOWN"),
            "uptime": data.get("uptime")
        })
    except Exception as e:
        return jsonify({"error": "Failed to fetch DB status", "details": str(e)}), 500


@app.route("/api/sessions")
def sessions():
    try:
        active_q = "SELECT COUNT(*) as count FROM v$session WHERE status = 'ACTIVE'"
        idle_q = "SELECT COUNT(*) as count FROM v$session WHERE status = 'INACTIVE'"
        blocking_q = "SELECT COUNT(DISTINCT blocking_session) as count FROM v$session WHERE blocking_session IS NOT NULL"

        active = fetch_one_dict(active_q)["count"]
        idle = fetch_one_dict(idle_q)["count"]
        blocking = fetch_one_dict(blocking_q)["count"]

        return jsonify({
            "active_sessions": active,
            "idle_sessions": idle,
            "blocking_sessions": blocking
        })
    except Exception as e:
        return jsonify({"error": "Failed to fetch session stats", "details": str(e)}), 500

@app.route("/api/cpu-memory")
def cpu_memory():
    try:
        cpu_q = """
            SELECT value FROM v$sysmetric WHERE metric_name = 'CPU Usage Per Sec' AND rownum = 1
        """
        mem_q = """
            SELECT
              ROUND((SELECT value FROM v$sysmetric WHERE metric_name = 'Memory Used (MB)') / 1024, 2) AS mem_used_gb,
              ROUND((SELECT value FROM v$sysmetric WHERE metric_name = 'Memory Size (MB)') / 1024, 2) AS mem_total_gb
            FROM dual
        """
        cpu_usage = fetch_one_dict(cpu_q)
        mem = fetch_one_dict(mem_q)
        return jsonify({
            "cpu_usage_percent": round(cpu_usage["value"], 2) if cpu_usage else None,
            "memory_used_gb": mem["mem_used_gb"] if mem else None,
            "memory_total_gb": mem["mem_total_gb"] if mem else None
        })
    except Exception as e:
        return jsonify({"error": "Failed to fetch CPU/Memory usage", "details": str(e)}), 500

@app.route("/api/alerts")
def alerts():
    try:
        query = """
            SELECT TO_CHAR(alert_time, 'YYYY-MM-DD HH24:MI') as alert_time, message
            FROM db_alerts
            ORDER BY alert_time DESC FETCH FIRST 10 ROWS ONLY
        """
        alerts = fetch_all_dict(query)
        result = [{"time": a["alert_time"], "message": a["message"]} for a in alerts]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "Failed to fetch alerts", "details": str(e)}), 500

@app.route("/api/sql-performance")
def sql_performance():
    try:
        query = """
            SELECT sql_text, executions, avg_exec_time_ms, total_cpu_time,
                TO_CHAR(last_execution, 'YYYY-MM-DD HH24:MI:SS') AS last_execution
            FROM sql_performance_view
            FETCH FIRST 20 ROWS ONLY
        """
        data = fetch_all_dict(query)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Failed to fetch SQL performance", "details": str(e)}), 500

@app.route("/api/tablespaces")
def tablespaces():
    try:
        query = """
            SELECT tablespace_name, total_space_gb, used_space_gb
            FROM tablespace_usage_view
        """
        raw = fetch_all_dict(query)
        for item in raw:
            total = item["total_space_gb"] or 1
            used = item["used_space_gb"] or 0
            item["usage_percent"] = round((used / total) * 100, 2)
        return jsonify(raw)
    except Exception as e:
        return jsonify({"error": "Failed to fetch tablespaces", "details": str(e)}), 500

@app.route("/api/largest-tables")
def largest_tables():
    try:
        query = """
            SELECT table_name, size_mb
            FROM largest_tables_view
            FETCH FIRST 5 ROWS ONLY
        """
        data = fetch_all_dict(query)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Failed to fetch largest tables", "details": str(e)}), 500

@app.route("/api/user-activity")
def user_activity():
    try:
        query = """
            SELECT username, active_sessions, total_cpu_time, total_queries
            FROM user_activity_view
        """
        data = fetch_all_dict(query)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Failed to fetch user activity", "details": str(e)}), 500
    

@app.route("/api/sql-performance-trends")
def sql_performance_trends():
    try:
        query = """
            SELECT 
                TO_CHAR(sample_time, 'HH24:MI') AS time,
                ROUND(AVG(avg_exec_time_ms), 2) AS avg_exec_time_ms,
                COUNT(CASE WHEN avg_exec_time_ms > 1000 THEN 1 END) AS slow_queries
            FROM sql_performance_samples
            GROUP BY TO_CHAR(sample_time, 'HH24:MI')
            ORDER BY time
        """
        data = fetch_all_dict(query)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Failed to fetch performance trends", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

