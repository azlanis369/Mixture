"use client";

import { useState } from "react";
import { Icon } from "./icons";

export function ParentLink({
  token,
  parentName,
  parentPhone,
  studentName,
}: {
  token: string;
  parentName: string;
  parentPhone: string;
  studentName: string;
}) {
  const [copied, setCopied] = useState(false);

  function url() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/parent/${token}`;
  }

  function copy() {
    navigator.clipboard?.writeText(url());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function wa() {
    let p = parentPhone.replace(/[^0-9]/g, "");
    if (p.startsWith("0")) p = "60" + p.slice(1);
    else if (!p.startsWith("60")) p = "60" + p;
    const msg = encodeURIComponent(
      `Salam ${parentName}, ini pautan peribadi untuk semak kehadiran, yuran & aktiviti ${studentName} di Tadika Mixture:\n${url()}`
    );
    window.open(`https://wa.me/${p}?text=${msg}`, "_blank");
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        onClick={copy}
        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
        title="Salin pautan portal"
      >
        {copied ? "Disalin ✓" : "Salin Pautan"}
      </button>
      <button
        onClick={wa}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
        title="Hantar pautan ke ibu bapa"
      >
        <Icon.whatsapp className="w-4 h-4" />
      </button>
    </div>
  );
}
