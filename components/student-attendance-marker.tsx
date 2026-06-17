"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markStudentAttendanceAction } from "@/lib/actions/student-attendance";
import { Button } from "./ui";
import { Icon } from "./icons";
import { STUDENT_ATT_STATUS } from "@/lib/constants";

type Row = {
  id: string;
  name: string;
  className: string | null;
  parentName: string;
  parentPhone: string;
  status: string | null;
};

const STATUS_TONE: Record<string, string> = {
  PRESENT: "bg-emerald-500 text-white",
  LATE: "bg-amber-500 text-white",
  ABSENT: "bg-rose-500 text-white",
  SICK: "bg-purple-500 text-white",
  LEAVE: "bg-slate-500 text-white",
};

function waNotify(phone: string, parent: string, student: string, status: string) {
  let p = phone.replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "60" + p.slice(1);
  else if (!p.startsWith("60")) p = "60" + p;
  const teks =
    status === "PRESENT" || status === "LATE"
      ? `Salam ${parent}, kami ingin memaklumkan bahawa ${student} telah selamat sampai ke Tadika Mixture hari ini${status === "LATE" ? " (lewat sedikit)" : ""}. Terima kasih.`
      : `Salam ${parent}, kami perasan ${student} tidak hadir ke Tadika Mixture hari ini. Mohon maklumkan jika ada sebarang hal. Terima kasih.`;
  return `https://wa.me/${p}?text=${encodeURIComponent(teks)}`;
}

export function StudentAttendanceMarker({
  date,
  rows,
}: {
  date: string;
  rows: Row[];
}) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, string>>(
    Object.fromEntries(rows.map((r) => [r.id, r.status ?? "PRESENT"]))
  );
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  function setStatus(id: string, status: string) {
    setState((s) => ({ ...s, [id]: status }));
    setSaved(false);
  }

  function setAll(status: string) {
    setState(Object.fromEntries(rows.map((r) => [r.id, status])));
    setSaved(false);
  }

  async function save() {
    setBusy(true);
    const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const res = await markStudentAttendanceAction({
      date,
      records: rows.map((r) => ({
        studentId: r.id,
        status: state[r.id],
        arrivedAt: ["PRESENT", "LATE"].includes(state[r.id]) ? now : undefined,
      })),
    });
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  const summary = rows.reduce<Record<string, number>>((acc, r) => {
    const s = state[r.id];
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Tetapkan semua:</span>
        {Object.keys(STUDENT_ATT_STATUS).map((s) => (
          <button
            key={s}
            onClick={() => setAll(s)}
            className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {STUDENT_ATT_STATUS[s]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {rows.map((r) => {
          const st = state[r.id];
          return (
            <div key={r.id} className="p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-700 truncate">{r.name}</div>
                  <div className="text-[11px] text-slate-400">{r.className ?? "Tiada kelas"} • {r.parentName}</div>
                </div>
                <a
                  href={waNotify(r.parentPhone, r.parentName, r.name, st)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shrink-0"
                  title="Maklum ibu bapa"
                >
                  <Icon.whatsapp className="w-4 h-4" />
                </a>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.keys(STUDENT_ATT_STATUS).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(r.id, s)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      st === s ? STATUS_TONE[s] : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {STUDENT_ATT_STATUS[s]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 sticky bottom-16 lg:bottom-0 bg-white py-2">
        <Button onClick={save} disabled={busy}>
          {busy ? "Menyimpan..." : "Simpan Kehadiran"}
        </Button>
        {saved && <span className="text-sm text-emerald-600">✓ Disimpan</span>}
        <span className="text-xs text-slate-400">
          {Object.entries(summary).map(([s, n]) => `${STUDENT_ATT_STATUS[s]}: ${n}`).join(" • ")}
        </span>
      </div>
    </div>
  );
}
