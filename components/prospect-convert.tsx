"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { convertProspectAction } from "@/lib/actions/student";
import { Button } from "./ui";

export function ProspectConvert({ prospectId }: { prospectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fee, setFee] = useState("300");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const fd = new FormData();
    fd.set("prospectId", prospectId);
    fd.set("monthlyFee", fee);
    await convertProspectAction(fd);
    setBusy(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button variant="secondary" className="!py-1.5 !px-2.5 !text-xs" onClick={() => setOpen(true)}>
        Tukar ke Murid
      </Button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <input
        type="number"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
        placeholder="Yuran/bln"
        className="w-24 px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
      />
      <Button className="!py-1.5 !px-2.5 !text-xs" onClick={submit} disabled={busy}>
        {busy ? "..." : "Sahkan"}
      </Button>
      <Button variant="ghost" className="!py-1.5 !px-2 !text-xs" onClick={() => setOpen(false)}>✕</Button>
    </div>
  );
}
