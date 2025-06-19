import React from 'react';

export default function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map(col => (
              <th
                key={col.accessor}
                className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-3 text-center text-gray-500">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-800 transition">
                {columns.map(col => (
                  <td
                    key={col.accessor}
                    className="px-4 py-2 text-sm text-gray-200 whitespace-nowrap"
                    title={row[col.accessor]}
                  >
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}