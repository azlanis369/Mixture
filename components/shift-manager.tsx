"use client";

import { useState } from "react";
import { createShiftAction } from "@/lib/actions/staff";
import { Card, SectionTitle, Badge, Button } from "./ui";
import { Icon } from "./icons";

export function ShiftManager({
  shifts,
}: {
  shifts: { id: string; name: string; startTime: string; endTime: string; breakMinutes: number }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-4">
      <SectionTitle
        title="Syif Kerja"
        subtitle="Tetapkan waktu masuk/keluar & rehat"
        action={
          <Button variant="secondary" onClick={() => setOpen((v) => !v)} className="!py-1.5 !px-3 !text-xs">
            <Icon.plus className="w-4 h-4" /> Syif Baru
          </Button>
        }
      />

      {open && (
        <form
          action={async (fd) => {
            await createShiftAction(fd);
            setOpen(false);
          }}
          className="mb-4 grid sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
        >
          <input name="name" required placeholder="Nama syif" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          <input name="startTime" type="time" required className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          <input name="endTime" type="time" required className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          <div className="flex gap-2">
            <input name="breakMinutes" type="number" defaultValue={60} className="w-20 px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <Button type="submit" className="!py-2 !px-3">Simpan</Button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {shifts.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada syif.</p>
        ) : (
          shifts.map((s) => (
            <div key={s.id} className="px-3 py-2 rounded-xl border border-slate-200 text-sm">
              <span className="font-medium text-slate-700">{s.name}</span>
              <span className="text-slate-400"> • {s.startTime}–{s.endTime}</span>
              <Badge tone="slate">{s.breakMinutes}m rehat</Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
