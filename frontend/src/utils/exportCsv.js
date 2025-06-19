export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) {
    console.warn("No data to export.");
    return;
  }

  const separator = ",";
  const keys = Object.keys(rows[0]);

  const csvRows = [
    keys.join(separator), // Header row
    ...rows.map((row) =>
      keys
        .map((key) => {
          let cell = row[key] == null ? "" : row[key].toString();
          cell = cell.replace(/"/g, '""'); // Escape quotes
          return cell.search(/("|,|\n)/g) >= 0 ? `"${cell}"` : cell;
        })
        .join(separator)
    ),
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // Create a download link and trigger it
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up
}
