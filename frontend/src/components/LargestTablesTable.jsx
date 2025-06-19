import React, { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import DataTable from "./DataTable";
import { exportToCSV } from "../utils/exportCsv";

export default function LargestTablesTable() {
  const [largestTables, setLargestTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/largest-tables")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch largest tables");
        return res.json();
      })
      .then((data) => {
        setLargestTables(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading largest tables...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const largestTableColumns = [
    { header: "Table Name", accessor: "table_name" },
    { header: "Size (MB)", accessor: "size_mb" },
  ];

  return (
    <section>
      <SectionHeader
        title="📊 Top 5 Largest Tables"
        onExport={() => exportToCSV("largest_tables.csv", largestTables)}
      />
      <DataTable columns={largestTableColumns} data={largestTables} />
    </section>
  );
}
