import React, { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import DataTable from "./DataTable";
import { exportToCSV } from "../utils/exportCsv";
import url from "../../url";

// ✅ Define the columns
const userActivityColumns = [
  { header: "Username", accessor: "username" },
  { header: "Active Sessions", accessor: "active_sessions" },
  { header: "Total CPU Time", accessor: "total_cpu_time" },
  { header: "Total Queries", accessor: "total_queries" },
];

export default function UserActivityTable() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${url}/api/user-activity`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user activity");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading user activity...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <section>
      <SectionHeader
        title="👤 User Activity Summary"
        onExport={() => exportToCSV("user_activity.csv", userData)}
      />
      <DataTable columns={userActivityColumns} data={userData} />
    </section>
  );
}
