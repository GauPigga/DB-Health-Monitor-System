-- Drop and recreate tables to ensure clean state
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE db_alerts';
  EXECUTE IMMEDIATE 'DROP TABLE sql_performance_view';
  EXECUTE IMMEDIATE 'DROP TABLE tablespace_usage_view';
  EXECUTE IMMEDIATE 'DROP TABLE largest_tables_view';
  EXECUTE IMMEDIATE 'DROP TABLE user_activity_view';
  EXECUTE IMMEDIATE 'DROP TABLE sql_performance_samples';
EXCEPTION
  WHEN OTHERS THEN NULL;
END;
/

-- 1. Alerts Table
CREATE TABLE db_alerts (
  alert_time TIMESTAMP,
  message VARCHAR2(4000)
);

INSERT INTO db_alerts (alert_time, message) VALUES (SYSDATE - INTERVAL '1' HOUR, 'ORA-01555: snapshot too old');
INSERT INTO db_alerts (alert_time, message) VALUES (SYSDATE - INTERVAL '2' HOUR, 'ORA-12541: TNS:no listener');


-- 2. SQL Performance View
CREATE TABLE sql_performance_view (
  sql_text VARCHAR2(1000),
  executions NUMBER,
  avg_exec_time_ms NUMBER,
  total_cpu_time NUMBER,
  last_execution TIMESTAMP
);

INSERT INTO sql_performance_view VALUES ('SELECT * FROM users', 150, 25.3, 1200, SYSDATE - INTERVAL '1' HOUR);
INSERT INTO sql_performance_view VALUES ('UPDATE orders SET status = ''done''', 23, 105.7, 2100, SYSDATE - INTERVAL '2' HOUR);


-- 3. Tablespace Usage View
CREATE TABLE tablespace_usage_view (
  tablespace_name VARCHAR2(30),
  total_space_gb NUMBER,
  used_space_gb NUMBER
);

INSERT INTO tablespace_usage_view VALUES ('USERS', 10, 6.5);
INSERT INTO tablespace_usage_view VALUES ('SYSTEM', 20, 12.3);


-- 4. Largest Tables View
CREATE TABLE largest_tables_view (
  table_name VARCHAR2(100),
  size_mb NUMBER
);

INSERT INTO largest_tables_view VALUES ('ORDERS', 4520);
INSERT INTO largest_tables_view VALUES ('USERS', 3200);
INSERT INTO largest_tables_view VALUES ('LOGS', 2780);


-- 5. User Activity View
CREATE TABLE user_activity_view (
  username VARCHAR2(30),
  active_sessions NUMBER,
  total_cpu_time NUMBER,
  total_queries NUMBER
);

INSERT INTO user_activity_view VALUES ('HR', 4, 890, 120);
INSERT INTO user_activity_view VALUES ('SYS', 1, 120, 45);


-- 6. SQL Performance Samples
CREATE TABLE sql_performance_samples (
  sample_time TIMESTAMP,
  avg_exec_time_ms NUMBER
);

INSERT INTO sql_performance_samples VALUES (TO_TIMESTAMP('2025-06-19 09:00', 'YYYY-MM-DD HH24:MI'), 45.5);
INSERT INTO sql_performance_samples VALUES (TO_TIMESTAMP('2025-06-19 09:15', 'YYYY-MM-DD HH24:MI'), 150.2);
INSERT INTO sql_performance_samples VALUES (TO_TIMESTAMP('2025-06-19 09:30', 'YYYY-MM-DD HH24:MI'), 80.1);

COMMIT;
