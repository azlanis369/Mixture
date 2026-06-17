"use client";

import { useState } from "react";
import { createAnnouncementAction } from "@/lib/actions/announcement";
import { Button } from "./ui";
import { Icon } from "./icons";
import { CHANNEL_LABEL, ANNOUNCE_CATEGORY } from "@/lib/constants";

export function AnnouncementForm({ canBroadcast }: { canBroadcast: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>
        <Icon.plus className="w-4 h-4" /> Pengumuman Baru
      </Button>

      {open && (
        <form
          action={async (fd) => {
            await createAnnouncementAction(fd);
            setOpen(false);
          }}
          className="mt-4 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
        >
          <input name="title" required placeholder="Tajuk pengumuman" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          <textarea name="body" required rows={3} placeholder="Isi kandungan..." className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          <div className="grid sm:grid-cols-3 gap-3">
            <select name="channel" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              {Object.entries(CHANNEL_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select name="category" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              {Object.entries(ANNOUNCE_CATEGORY).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            {canBroadcast && (
              <select name="scope" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
                <option value="ALL">Semua cawangan</option>
                <option value="BRANCH">Cawangan saya</option>
              </select>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="pinned" className="rounded" /> Pin di atas
          </label>
          <div className="flex gap-2">
            <Button type="submit">Terbitkan</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
