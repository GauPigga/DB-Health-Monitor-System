import React, { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  interaction: { mode: "index", intersect: false },
  stacked: false,
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: { display: true, text: "Avg Exec Time (ms)" },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: { drawOnChartArea: false },
      title: { display: true, text: "Slow Queries (count)" },
    },
  },
};

export default function QueryPerformanceChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/sql-performance-trends")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch query performance data");
        return res.json();
      })
      .then((data) => {
        // Assuming data is an array of objects like:
        // { time: "00:00", avg_exec_time_ms: 120, slow_queries: 5 }

        const labels = data.map((d) => d.time);
        const avgExecTimes = data.map((d) => d.avg_exec_time_ms);
        const slowQueries = data.map((d) => d.slow_queries);

        setChartData({
          labels,
          datasets: [
            {
              label: "Avg Exec Time (ms)",
              data: avgExecTimes,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              yAxisID: "y",
              tension: 0.3,
            },
            {
              label: "Slow Queries (count)",
              data: slowQueries,
              borderColor: "rgb(220, 38, 38)",
              backgroundColor: "rgba(220, 38, 38, 0.5)",
              yAxisID: "y1",
              tension: 0.3,
            },
          ],
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!chartData) return null;

  return (
    <section>
      <SectionHeader title="📈 Query Performance Trends" />
      <Line options={chartOptions} data={chartData} />
    </section>
  );
}
