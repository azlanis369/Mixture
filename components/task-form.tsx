"use client";

import { useState } from "react";
import { createTaskAction } from "@/lib/actions/task";
import { Button } from "./ui";
import { Icon } from "./icons";
import { TASK_CATEGORY, TASK_PRIORITY } from "@/lib/constants";

export function TaskForm({
  staff,
}: {
  staff: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>
        <Icon.plus className="w-4 h-4" /> Tugas Baru
      </Button>

      {open && (
        <form
          action={async (fd) => {
            await createTaskAction(fd);
            setOpen(false);
          }}
          className="mt-4 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
        >
          <input
            name="title"
            required
            placeholder="Tajuk tugas (cth: Follow-up prospek WhatsApp)"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
          />
          <textarea
            name="description"
            rows={2}
            placeholder="Keterangan (pilihan)"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <select name="category" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              {Object.entries(TASK_CATEGORY).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select name="priority" defaultValue="MEDIUM" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              {Object.entries(TASK_PRIORITY).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <select name="assigneeId" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              <option value="">— Tugaskan kepada —</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input name="dueDate" type="date" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Cipta Tugas</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
