import React, { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import DataTable from "./DataTable";
import { exportToCSV } from "../utils/exportCsv";
import url from "../../url";

const tablespaceColumns = [
  { header: "Name", accessor: "name" },
  { header: "Used (GB)", accessor: "used" },
  { header: "Total (GB)", accessor: "total" },
  { header: "Usage %", accessor: "usage" },
  { header: "Usage Bar", accessor: "bar" },
];

const getUsagePercent = (used, total) => Math.round((used / total) * 100);

export default function TablespaceUsageTable() {
  const [tablespaceData, setTablespaceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${url}/api/tablespaces`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tablespace data");
        return res.json();
      })
      .then((data) => {
        const mapped = data.map(
          ({
            tablespace_name,
            used_space_gb,
            total_space_gb,
            usage_percent,
          }) => {
            const usage =
              usage_percent || getUsagePercent(used_space_gb, total_space_gb);

            let barColor = "bg-green-400";
            if (usage > 80) barColor = "bg-red-500";
            else if (usage > 50) barColor = "bg-yellow-400";

            const bar = (
              <div className="w-full bg-gray-600 rounded h-3">
                <div
                  className={`${barColor} h-3 rounded`}
                  style={{ width: `${usage}%` }}
                />
              </div>
            );

            return {
              name: tablespace_name,
              used: used_space_gb,
              total: total_space_gb,
              usage: `${usage}%`,
              bar,
            };
          }
        );
        setTablespaceData(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading tablespace data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <section>
      <SectionHeader
        title="💾 Tablespace Usage"
        onExport={() => exportToCSV("tablespace_usage.csv", tablespaceData)}
      />
      <DataTable columns={tablespaceColumns} data={tablespaceData} />
    </section>
  );
}
