import React from "react";

import Header from "./components/Header";
import DatabaseStatusCard from "./components/DatabaseStatusCard";
import SessionsOverviewCard from "./components/SessionsOverviewCard";
import CpuMemoryUsageCard from "./components/CpuMemoryUsageCard";
import AlertsSection from "./components/AlertsSection";
import QueryPerformanceChart from "./components/QueryPerformanceChart";
import SqlPerformanceTable from "./components/SqlPerformancetable";
import TablespaceUsageTable from "./components/TablespaceUsageTable";
import LargestTablesTable from "./components/LargestTablesTable";
import UserActivityTable from "./components/UserActivityTable";

export default function App() {
  return (
    <div className="bg-gray-900 min-h-screen p-6 font-sans text-gray-100">
      <Header />

      <main className="grid grid-cols-1 md:grid-cols-3 p-6 gap-6">
        <DatabaseStatusCard />
        <SessionsOverviewCard />
        <CpuMemoryUsageCard />
      </main>

      <div className="bg-gray-900 p-6  space-y-12">
        <AlertsSection />
        <QueryPerformanceChart />
        <SqlPerformanceTable />
        <TablespaceUsageTable />
        <LargestTablesTable />
        <UserActivityTable />
      </div>
    </div>
  );
}
