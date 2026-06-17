"use client";

import { useState } from "react";
import { createStudentAction } from "@/lib/actions/student";
import { Button } from "./ui";
import { Icon } from "./icons";

export function StudentForm({
  isAdmin,
  branches,
  classes,
}: {
  isAdmin: boolean;
  branches: { id: string; name: string }[];
  classes: { id: string; name: string; branchId: string | null }[];
}) {
  const [open, setOpen] = useState(false);
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);

  const visibleClasses = isAdmin
    ? classes.filter((c) => c.branchId === branchId)
    : classes;

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>
        <Icon.plus className="w-4 h-4" /> Daftar Murid
      </Button>

      {open && (
        <form
          action={async (fd) => {
            setError(null);
            const res = await createStudentAction(fd);
            if (res?.error) setError(res.error);
            else setOpen(false);
          }}
          className="mt-4 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <input name="name" required placeholder="Nama penuh murid" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <div className="grid grid-cols-2 gap-3">
              <input name="dob" type="date" title="Tarikh lahir" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
              <select name="gender" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
                <option value="">Jantina</option>
                <option value="L">Lelaki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <input name="parentName" required placeholder="Nama ibu/bapa" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <input name="parentPhone" required placeholder="No. telefon ibu bapa" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <input name="parentEmail" type="email" placeholder="Emel (pilihan)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          </div>

          {isAdmin && (
            <select name="branchId" value={branchId} onChange={(e) => setBranchId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          )}

          <div className="grid sm:grid-cols-3 gap-3">
            <select name="classId" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              <option value="">— Pilih kelas —</option>
              {visibleClasses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input name="monthlyFee" type="number" step="0.01" placeholder="Yuran bulanan (RM)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
            <input name="registrationFee" type="number" step="0.01" placeholder="Yuran daftar (RM)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          </div>
          <input name="enrollmentDate" type="date" title="Tarikh pendaftaran" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />

          {error && <div className="text-sm text-rose-600">{error}</div>}
          <div className="flex gap-2">
            <Button type="submit">Daftar Murid</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}
