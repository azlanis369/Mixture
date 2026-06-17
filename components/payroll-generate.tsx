"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generatePayslipsAction } from "@/lib/actions/payroll";
import { Button } from "./ui";

export function PayrollGenerate({ defaultMonth }: { defaultMonth: string }) {
  const router = useRouter();
  const [month, setMonth] = useState(defaultMonth);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setMsg(null);
    const fd = new FormData();
    fd.set("month", month);
    const res = await generatePayslipsAction(fd);
    setBusy(false);
    setMsg(res?.message ?? null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Bulan Gaji</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
        />
      </div>
      <Button onClick={run} disabled={busy}>
        {busy ? "Menjana..." : "Jana Slip Gaji"}
      </Button>
      {msg && <span className="text-sm text-emerald-600">{msg}</span>}
    </div>
  );
}
