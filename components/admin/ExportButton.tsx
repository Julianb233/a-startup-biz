'use client';

import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { exportToCSV, CSVColumn } from '@/lib/csv-export';

interface ExportButtonProps {
  data: Record<string, any>[];
  columns: CSVColumn[];
  filename: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable CSV export button component
 * Generates and downloads CSV with loading state
 */
export function ExportButton({
  data,
  columns,
  filename,
  label = 'Export CSV',
  className = '',
  disabled = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Add small delay for better UX on large datasets
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate timestamp for filename
      const timestamp = new Date().toISOString().split('T')[0];
      const finalFilename = `${filename}_${timestamp}`;

      // Export CSV
      exportToCSV(data, columns, finalFilename);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const isDisabled = disabled || isExporting || !data || data.length === 0;

  return (
    <button
      onClick={handleExport}
      disabled={isDisabled}
      className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={data.length === 0 ? 'No data to export' : 'Export data as CSV'}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      <span>{isExporting ? 'Exporting...' : label}</span>
    </button>
  );
}
