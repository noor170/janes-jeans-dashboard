type CsvValue = string | number | boolean | null | undefined;

interface ExportOptions {
  filename: string;
  headers: string[];
  data: CsvValue[][];
}

export function exportToCsv({ filename, headers, data }: ExportOptions): void {
  // Escape CSV values properly
  const escapeValue = (value: CsvValue): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    // If value contains comma, newline, or quote, wrap in quotes and escape existing quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Build CSV content
  const csvRows = [
    headers.map(escapeValue).join(','),
    ...data.map(row => row.map(escapeValue).join(','))
  ];
  const csvContent = csvRows.join('\n');

  // Add BOM for Excel UTF-8 compatibility
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper to format date for CSV
export function formatDateForCsv(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
