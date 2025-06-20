import React, { useEffect, useState } from "react";
import url from "../../url";
export default function CpuMemoryUsageCard() {
  const [cpuUsagePercent, setCpuUsagePercent] = useState(null);
  const [memoryUsedGB, setMemoryUsedGB] = useState(null);
  const [memoryTotalGB, setMemoryTotalGB] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${url}/api/cpu-memory`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch CPU & Memory data");
        return res.json();
      })
      .then((data) => {
        setCpuUsagePercent(data.cpu_usage_percent ?? 0);
        setMemoryUsedGB(data.memory_used_gb ?? 0);
        setMemoryTotalGB(data.memory_total_gb ?? 1); // Avoid divide by zero
      })
      .catch((err) => setError(err.message));
  }, []);

  const cpuBarColor =
    cpuUsagePercent > 80
      ? "bg-red-500"
      : cpuUsagePercent > 60
      ? "bg-yellow-400"
      : "bg-green-400";

  const cpuTextColor =
    cpuUsagePercent > 80
      ? "text-red-400"
      : cpuUsagePercent > 60
      ? "text-yellow-400"
      : "text-green-300";

  const memoryUsagePercent =
    memoryUsedGB && memoryTotalGB ? (memoryUsedGB / memoryTotalGB) * 100 : 0;

  if (error) {
    return (
      <section className="bg-gray-800 p-4 rounded-lg shadow text-red-400">
        <h2 className="font-semibold mb-4">🖥️ CPU & Memory Usage</h2>
        <p>Error: {error}</p>
      </section>
    );
  }

  if (
    cpuUsagePercent === null ||
    memoryUsedGB === null ||
    memoryTotalGB === null
  ) {
    return (
      <section className="bg-gray-800 p-4 rounded-lg shadow text-gray-100">
        <h2 className="font-semibold mb-4">🖥️ CPU & Memory Usage</h2>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="bg-gray-800 p-4 rounded-lg shadow text-gray-100">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        🖥️ CPU & Memory Usage
      </h2>

      <div className="mb-4">
        <p>
          ⚙️ CPU Usage:{" "}
          <span className={`font-bold ${cpuTextColor}`}>
            {cpuUsagePercent.toFixed(2)}%
          </span>
        </p>
        <div className="w-full bg-gray-700 rounded h-4 mt-1">
          <div
            className={`${cpuBarColor} h-4 rounded`}
            style={{ width: `${cpuUsagePercent}%` }}
          ></div>
        </div>
      </div>

      <div>
        <p>
          🧠 Memory Used:{" "}
          <span className="font-bold text-blue-300">
            {memoryUsedGB.toFixed(2)} GB / {memoryTotalGB.toFixed(2)} GB
          </span>
        </p>
        <div className="w-full bg-gray-700 rounded h-4 mt-1">
          <div
            className="bg-blue-500 h-4 rounded"
            style={{
              width: `${memoryUsagePercent}%`,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}
