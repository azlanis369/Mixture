"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateInvoicesAction, recordPaymentAction } from "@/lib/actions/fee";
import { Button } from "./ui";
import { PAYMENT_METHOD } from "@/lib/constants";

export function FeeGenerate({ defaultMonth }: { defaultMonth: string }) {
  const router = useRouter();
  const [month, setMonth] = useState(defaultMonth);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setMsg(null);
    const fd = new FormData();
    fd.set("month", month);
    const res = await generateInvoicesAction(fd);
    setBusy(false);
    setMsg(res?.message ?? null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Bulan Invois</label>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
      </div>
      <Button onClick={run} disabled={busy}>{busy ? "Menjana..." : "Jana Invois Bulanan"}</Button>
      {msg && <span className="text-sm text-emerald-600">{msg}</span>}
    </div>
  );
}

export function PaymentButton({
  invoiceId,
  outstanding,
}: {
  invoiceId: string;
  outstanding: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(outstanding.toFixed(2));
  const [method, setMethod] = useState("CASH");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const fd = new FormData();
    fd.set("id", invoiceId);
    fd.set("amount", amount);
    fd.set("method", method);
    await recordPaymentAction(fd);
    setBusy(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button variant="primary" className="!py-1.5 !px-3 !text-xs" onClick={() => setOpen(true)}>
        Rekod Bayaran
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 p-2 rounded-lg bg-slate-50">
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-24 px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
      />
      <select value={method} onChange={(e) => setMethod(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white">
        {Object.entries(PAYMENT_METHOD).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
      <Button className="!py-1.5 !px-3 !text-xs" onClick={submit} disabled={busy}>
        {busy ? "..." : "Simpan"}
      </Button>
      <Button variant="ghost" className="!py-1.5 !px-2 !text-xs" onClick={() => setOpen(false)}>Batal</Button>
    </div>
  );
}
