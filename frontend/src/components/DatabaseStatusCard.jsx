import React, { useEffect, useState } from "react";

export default function DatabaseStatusCard() {
  const [status, setStatus] = useState(null);
  const [uptime, setUptime] = useState(null);
  const [version, setVersion] = useState("Oracle 21c"); // you can also fetch version if API supports
  const [host, setHost] = useState("Unknown");
  const [port, setPort] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/db-status")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch DB status");
        return res.json();
      })
      .then((data) => {
        console.log(data)
        setStatus(data.status || "UNKNOWN");
        setUptime(data.uptime || "Unknown");
        setHost(data.host)
        // Optionally set version, host, port if available from API
        // For now, you can keep static or extend API accordingly
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <section className="bg-gray-800 p-4 rounded-lg shadow text-red-400">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          🛠️ Database Status
        </h2>
        <p>Error: {error}</p>
      </section>
    );
  }

  if (status === null || uptime === null) {
    return (
      <section className="bg-gray-800 p-4 rounded-lg shadow text-gray-100">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          🛠️ Database Status
        </h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="bg-gray-800 p-4 rounded-lg shadow text-gray-100">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        🛠️ Database Status
      </h2>
      <div className="text-lg space-y-2">
        <p>
          🔌 Status:{" "}
          <span
            className={`font-bold ${
              status === "OPEN" ? "text-green-400" : "text-red-500"
            }`}
          >
            {status === "OPEN" ? "🟢 UP" : "🔴 DOWN"}
          </span>
        </p>
        <p>
          ⏱️ Uptime: <span className="text-blue-300">{uptime}</span>
        </p>
        <p>
          🗂️ DB Version:{" "}
          <span className="font-semibold text-yellow-300">{version}</span>
        </p>
        <p>
          🌐 Host: <span className="font-mono text-blue-400">{host}</span>
        </p>
        <p>
          🔌 Port:{" "}
          <span className="font-mono text-blue-400">{port ?? "1521"}</span>
        </p>
      </div>
    </section>
  );
}
