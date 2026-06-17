"use client";

import { useState } from "react";
import { createStaffAction } from "@/lib/actions/staff";
import { Button } from "./ui";
import { Icon } from "./icons";
import { ROLE_LABEL } from "@/lib/constants";

export function StaffForm({
  isAdmin,
  branches,
}: {
  isAdmin: boolean;
  branches: { id: string; name: string; code: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>
        <Icon.plus className="w-4 h-4" /> Tambah Pekerja
      </Button>

      {open && (
        <form
          action={async (fd) => {
            setError(null);
            const res = await createStaffAction(fd);
            if (res?.error) setError(res.error);
            else setOpen(false);
          }}
          className="mt-4 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="name" required placeholder="Nama penuh" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <input name="email" type="email" required placeholder="Emel" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="phone" placeholder="No. telefon" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <input name="position" placeholder="Jawatan (cth: Guru Tadika)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="password" type="text" required placeholder="Kata laluan sementara" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            {isAdmin ? (
              <select name="role" defaultValue="STAFF" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
                {["STAFF", "HEAD_OF_BRANCH", "ADMIN"].map((r) => (
                  <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                ))}
              </select>
            ) : (
              <input value="Pekerja" disabled className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-slate-100 text-slate-400" />
            )}
          </div>
          {isAdmin && (
            <select name="branchId" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          )}
          {error && <div className="text-sm text-rose-600">{error}</div>}
          <div className="flex gap-2">
            <Button type="submit">Simpan</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
