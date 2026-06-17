"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createActivityAction } from "@/lib/actions/activity";
import { Button } from "./ui";
import { Icon } from "./icons";

export function ActivityForm({
  classes,
}: {
  classes: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [classId, setClassId] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 800 / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/jpeg", 0.65));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function submit() {
    setBusy(true);
    setMsg(null);
    const res = await createActivityAction({ title, caption, photo: photo || "", classId });
    setBusy(false);
    setMsg(res.message);
    if (res.ok) {
      setTitle(""); setCaption(""); setPhoto(null); setClassId("");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>
        <Icon.plus className="w-4 h-4" /> Kongsi Aktiviti
      </Button>

      {open && (
        <div className="mt-4 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tajuk aktiviti (cth: Aktiviti Seni & Kraf)" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} placeholder="Keterangan (pilihan)" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
            <option value="">Semua kelas (cawangan)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border border-slate-300 cursor-pointer hover:bg-slate-50">
              <Icon.camera className="w-4 h-4 text-indigo-600" />
              {photo ? "Tukar gambar" : "Pilih gambar"}
              <input type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
            </label>
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="pratonton" className="mt-2 w-full max-w-xs rounded-xl" />
            )}
          </div>
          {msg && <div className="text-sm text-slate-600">{msg}</div>}
          <div className="flex gap-2">
            <Button onClick={submit} disabled={busy || !photo || !title}>{busy ? "Mengongsi..." : "Kongsi"}</Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </div>
      )}
    </div>
  );
}
