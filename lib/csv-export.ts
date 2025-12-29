/**
 * CSV Export Utilities
 * Handles CSV generation and download with proper escaping
 */

export interface CSVColumn {
  key: string;
  label: string;
}

/**
 * Escape CSV field value to handle special characters
 */
function escapeCSVField(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If the value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Generate CSV content from data array and column configuration
 * @param data - Array of data objects
 * @param columns - Column configuration with key and label
 * @returns CSV string with headers and data
 */
export function generateCSV(data: Record<string, any>[], columns: CSVColumn[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Generate header row
  const headers = columns.map(col => escapeCSVField(col.label)).join(',');

  // Generate data rows
  const rows = data.map(row => {
    return columns
      .map(col => {
        const value = row[col.key];
        return escapeCSVField(value);
      })
      .join(',');
  });

  // Combine headers and rows
  return [headers, ...rows].join('\n');
}

/**
 * Trigger browser download of CSV content
 * @param csvContent - CSV string content
 * @param filename - Desired filename (without .csv extension)
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Create blob with UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create temporary download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  // Add .csv extension if not present
  const finalFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up object URL
  URL.revokeObjectURL(url);
}

/**
 * Generate and download CSV in one step
 * @param data - Array of data objects
 * @param columns - Column configuration
 * @param filename - Desired filename
 */
export function exportToCSV(data: Record<string, any>[], columns: CSVColumn[], filename: string): void {
  const csvContent = generateCSV(data, columns);
  if (csvContent) {
    downloadCSV(csvContent, filename);
  }
}
