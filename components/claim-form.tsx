"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClaimAction } from "@/lib/actions/claim";
import { Button } from "./ui";
import { Icon } from "./icons";
import { CLAIM_TYPES, MILEAGE_RATE } from "@/lib/constants";

export function ClaimForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("MEDICAL");
  const [amount, setAmount] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [title, setTitle] = useState("");
  const [claimDate, setClaimDate] = useState(new Date().toISOString().slice(0, 10));
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const mileageAmount = type === "MILEAGE"
    ? (Number(distanceKm) || 0) * MILEAGE_RATE
    : 0;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 700 / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function submit() {
    setBusy(true);
    setMsg(null);
    const res = await createClaimAction({
      type,
      title,
      amount: Number(amount),
      distanceKm: Number(distanceKm),
      claimDate,
      receiptPhoto: photo || undefined,
    });
    setBusy(false);
    setMsg(res.message);
    if (res.ok) {
      setTitle(""); setAmount(""); setDistanceKm(""); setPhoto(null);
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <div>
      <Button onClick={() => setOpen((v) => !v)}>
        <Icon.plus className="w-4 h-4" /> Tuntutan Baru
      </Button>

      {open && (
        <div className="mt-4 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="grid sm:grid-cols-2 gap-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              {Object.entries(CLAIM_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <input type="date" value={claimDate} onChange={(e) => setClaimDate(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tajuk (cth: Klinik panel / Perjalanan ke HQ)" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />

          {type === "MILEAGE" ? (
            <div className="grid sm:grid-cols-2 gap-3 items-center">
              <input value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} type="number" placeholder="Jarak (km)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
              <div className="text-sm text-slate-600">
                = RM {mileageAmount.toFixed(2)} <span className="text-xs text-slate-400">(RM{MILEAGE_RATE}/km)</span>
              </div>
            </div>
          ) : (
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" placeholder="Jumlah (RM)" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          )}

          <div>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border border-slate-300 cursor-pointer hover:bg-slate-50">
              <Icon.camera className="w-4 h-4 text-indigo-600" />
              {photo ? "Tukar resit" : "Lampirkan resit"}
              <input type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
            </label>
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="resit" className="mt-2 w-24 h-24 object-cover rounded-lg" />
            )}
          </div>

          {msg && <div className="text-sm text-slate-600">{msg}</div>}
          <div className="flex gap-2">
            <Button onClick={submit} disabled={busy}>{busy ? "Menghantar..." : "Hantar Tuntutan"}</Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
          </div>
        </div>
      )}
    </div>
  );
}
