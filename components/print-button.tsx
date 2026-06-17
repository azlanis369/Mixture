"use client";

export function PrintButton({ label = "Cetak / Simpan PDF" }: { label?: string }) {
  return (
    <div className="print:hidden flex gap-2">
      <button
        onClick={() => window.print()}
        className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {label}
      </button>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
      >
        Kembali
      </button>
    </div>
  );
}
