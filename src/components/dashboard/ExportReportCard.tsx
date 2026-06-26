"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { format, subMonths } from "date-fns";

export default function ExportReportCard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    // Default to current month
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleExport = () => {
    const [year, month] = selectedDate.split("-");
    const url = `/print/monthly-report?month=${month}&year=${year}`;
    window.open(url, "_blank");
  };

  // Generate last 12 months for dropdown
  const monthOptions = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = subMonths(now, i);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = format(d, "MMMM yyyy");
    monthOptions.push({ value, label });
  }

  return (
    <div className="bg-white shadow-sm border border-emerald-100 rounded-xl p-6">
      <h3 className="text-lg font-medium text-emerald-900 mb-4">Export Reports</h3>
      <p className="text-sm text-slate-500 mb-4">
        Generate a printable PDF report of member statuses and collections for a specific month.
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="month-select" className="block text-sm font-medium text-slate-700 mb-1">
            Select Month
          </label>
          <select
            id="month-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-emerald-600 sm:text-sm sm:leading-6"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleExport}
          className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-100 ring-1 ring-inset ring-emerald-600/20 transition-colors"
        >
          <FileDown className="h-4 w-4" />
          Generate PDF Report
        </button>
      </div>
    </div>
  );
}
