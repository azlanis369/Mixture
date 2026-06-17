"use client";

import { useState } from "react";
import { createProspectAction } from "@/lib/actions/prospect";
import { Button } from "./ui";
import { Icon } from "./icons";
import { PROSPECT_SOURCE } from "@/lib/constants";

export function ProspectForm() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>
        <Icon.plus className="w-4 h-4" /> Prospek Baru
      </Button>

      {open && (
        <form
          action={async (fd) => {
            await createProspectAction(fd);
            setOpen(false);
          }}
          className="mt-4 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="parentName" required placeholder="Nama ibu/bapa" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <input name="phone" required placeholder="No. telefon (cth: 0123456789)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <input name="childName" placeholder="Nama anak" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <input name="childAge" placeholder="Umur anak" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <select name="source" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              {Object.entries(PROSPECT_SOURCE).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <textarea name="notes" rows={2} placeholder="Catatan (cth: berminat program prasekolah 2026)" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          <div className="flex gap-2">
            <Button type="submit">Simpan Prospek</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
