"use client";

import { useState } from "react";
import { applyLeaveAction } from "@/lib/actions/leave";
import { Button } from "./ui";
import { Icon } from "./icons";
import { LEAVE_TYPES } from "@/lib/constants";

export function LeaveForm() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("ANNUAL");

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>
        <Icon.plus className="w-4 h-4" /> Mohon Cuti
      </Button>

      {open && (
        <form
          action={async (fd) => {
            await applyLeaveAction(fd);
            setOpen(false);
          }}
          className="mt-4 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Jenis Cuti</label>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
              >
                {Object.entries(LEAVE_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            {type === "EARLY_LEAVE" && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Masa Keluar</label>
                <input name="startTime" type="time" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tarikh Mula</label>
              <input name="startDate" type="date" required className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tarikh Tamat</label>
              <input name="endDate" type="date" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Sebab / Catatan</label>
            <textarea name="reason" required rows={2} placeholder="Cth: Hal kecemasan keluarga" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Hantar Permohonan</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
