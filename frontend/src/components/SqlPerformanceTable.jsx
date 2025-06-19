import React, { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import DataTable from "./DataTable";
import { exportToCSV } from "../utils/exportCsv";

const sqlPerformanceColumns = [
  { header: "SQL Text", accessor: "sql_text" },
  { header: "Executions", accessor: "executions" },
  { header: "Avg Exec Time (ms)", accessor: "avg_exec_time_ms" },
  { header: "Total CPU Time", accessor: "total_cpu_time" },
  { header: "Last Execution", accessor: "last_execution" },
];

export default function SqlPerformanceTable() {
  const [sqlData, setSqlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/sql-performance")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch SQL performance data");
        return res.json();
      })
      .then((data) => {
        setSqlData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading SQL performance data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <section>
      <SectionHeader
        title="🧾 SQL Query Performance"
        onExport={() => exportToCSV("sql_performance.csv", sqlData)}
      />
      <DataTable columns={sqlPerformanceColumns} data={sqlData} />
    </section>
  );
}
