import React, { useState, useEffect } from "react";
import { FaDatabase } from "react-icons/fa";
import url from "../../url";
export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex justify-between items-center mb-8 text-gray-100">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <FaDatabase /> Database Health Monitor Dashboard
      </h1>
      <div className="text-right text-sm md:text-base leading-tight space-y-1 ml-4">
        <div>
          📅{" "}
          <span className="font-semibold text-blue-300">
            {currentTime.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div>
          ⏰{" "}
          <span className="font-semibold text-yellow-300">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
