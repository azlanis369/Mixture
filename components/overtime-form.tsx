"use client";

import { useState } from "react";
import { createOvertimeAction } from "@/lib/actions/overtime";
import { Button } from "./ui";
import { Icon } from "./icons";

export function OvertimeForm() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>
        <Icon.plus className="w-4 h-4" /> Mohon Lebih Masa
      </Button>

      {open && (
        <form
          action={async (fd) => {
            await createOvertimeAction(fd);
            setOpen(false);
          }}
          className="mt-4 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
        >
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tarikh</label>
              <input name="date" type="date" required className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Jumlah Jam</label>
              <input name="hours" type="number" step="0.5" min="0.5" required placeholder="cth: 2" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Kadar</label>
              <select name="rate" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
                <option value="1.5">1.5× (hari biasa)</option>
                <option value="2">2.0× (hujung minggu)</option>
                <option value="3">3.0× (cuti umum)</option>
              </select>
            </div>
          </div>
          <textarea name="reason" required rows={2} placeholder="Sebab kerja lebih masa" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          <div className="flex gap-2">
            <Button type="submit">Hantar Permohonan</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
