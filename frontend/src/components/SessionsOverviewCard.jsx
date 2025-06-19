import React, { useEffect, useState } from "react";

export default function SessionsOverviewCard() {
  const [sessions, setSessions] = useState({
    activeSessions: 0,
    idleSessions: 0,
    blockingSessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/sessions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sessions data");
        return res.json();
      })
      .then((data) => {
        setSessions({
          activeSessions: data.active_sessions,
          idleSessions: data.idle_sessions,
          blockingSessions: data.blocking_sessions,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading sessions data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const { activeSessions, idleSessions, blockingSessions } = sessions;

  return (
    <section className="bg-gray-800 p-4 rounded-lg shadow text-gray-100">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        🧑‍💻 Sessions Overview
      </h2>
      <div className="space-y-2 text-lg">
        <p>
          ✅ <span className="font-medium text-green-300">Active:</span>{" "}
          {activeSessions}
        </p>
        <p>
          💤 <span className="font-medium text-yellow-300">Idle:</span>{" "}
          {idleSessions}
        </p>
        <p>
          🚨{" "}
          <span
            className={`font-medium ${
              blockingSessions > 0 ? "text-red-400" : "text-green-300"
            }`}
          >
            Blocking:
          </span>{" "}
          {blockingSessions}
        </p>
      </div>
    </section>
  );
}
