import React from "react";
import url from "../../url";

import { FaDownload } from "react-icons/fa";
export default function SectionHeader({ title, onExport }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {onExport && (
        <button
          onClick={onExport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
        >
          <FaDownload />
          Export CSV
        </button>
      )}
    </div>
  );
}
