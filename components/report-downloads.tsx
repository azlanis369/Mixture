"use client";

import { useState } from "react";
import { Icon } from "./icons";

export function ReportDownloads({
  defaultMonth,
  isAdmin,
}: {
  defaultMonth: string;
  isAdmin: boolean;
}) {
  const [month, setMonth] = useState(defaultMonth);

  const reports = [
    { type: "fees", label: "Kutipan Yuran", desc: "Invois & bayaran bulanan", tone: "emerald" },
    { type: "student-attendance", label: "Kehadiran Murid", desc: "Rekod harian murid", tone: "indigo" },
    { type: "staff-attendance", label: "Kehadiran Pekerja", desc: "Punch card pekerja", tone: "sky" },
    { type: "leave", label: "Cuti", desc: "Permohonan cuti", tone: "amber" },
    ...(isAdmin
      ? [{ type: "payroll", label: "Kos Gaji (Payroll)", desc: "Gaji & potongan berkanun", tone: "purple" }]
      : []),
  ];

  const toneBg: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    indigo: "bg-indigo-50 text-indigo-700",
    sky: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Pilih Bulan</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {reports.map((r) => (
          <a
            key={r.type}
            href={`/api/reports?type=${r.type}&month=${month}`}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all bg-white"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneBg[r.tone]}`}>
                <Icon.download className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">{r.label}</div>
                <div className="text-xs text-slate-400">{r.desc}</div>
              </div>
            </div>
            <span className="text-xs font-medium text-indigo-600">CSV</span>
          </a>
        ))}
      </div>
    </div>
  );
}
