import React, { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import DataTable from "./DataTable";
import { FaExclamationTriangle } from "react-icons/fa";
import url from "../../url";

const alertColumns = [
  { header: "Time", accessor: "time" },
  { header: "Message", accessor: "message" },
];

export default function AlertsSection() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${url}/api/alerts`)
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch alerts:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading alerts...</div>;

  if (alerts.length === 0) return <div>No recent alerts to display.</div>;

  return (
    <section>
      <SectionHeader
        title={
          <span className="flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" />
            Recent Alerts
          </span>
        }
      />
      <DataTable columns={alertColumns} data={alerts} />
    </section>
  );
}
