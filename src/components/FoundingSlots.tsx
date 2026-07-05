import type { CSSProperties } from "react";

const FOUNDING_CAP = 100;

function getFilledSlots(): number {
  const raw = process.env.NEXT_PUBLIC_FOUNDING_SLOTS_FILLED;
  if (!raw) return 0;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 0) return 0;
  if (n > FOUNDING_CAP) return FOUNDING_CAP;
  return n;
}

type Props = {
  variant?: "compact" | "full";
  className?: string;
};

export default function FoundingSlots({
  variant = "full",
  className = "",
}: Props) {
  const filled = getFilledSlots();
  const remaining = FOUNDING_CAP - filled;
  const percent = (filled / FOUNDING_CAP) * 100;
  const isFull = filled >= FOUNDING_CAP;
  const isUrgent = remaining <= 20 && !isFull;

  if (variant === "compact") {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold ${className}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full bg-gold ${
            !isFull ? "animate-pulse" : ""
          }`}
        />
        {isFull ? "Founding slot penuh" : `${filled}/${FOUNDING_CAP} founding REN`}
      </span>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-2 font-semibold uppercase tracking-wide text-gold">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-gold ${
              !isFull ? "animate-pulse" : ""
            }`}
          />
          {isFull ? "Founding slot penuh" : "Founding slot"}
        </span>
        <span className="font-display text-sm font-semibold text-on-dark">
          {filled}
          <span className="text-on-dark-muted">/{FOUNDING_CAP}</span>
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isFull
              ? "bg-gradient-to-r from-gold to-gold/70"
              : "bg-gradient-to-r from-emerald to-emerald-soft"
          }`}
          style={{ width: `${percent}%` } as CSSProperties}
        />
      </div>

      <p
        className={`mt-2 text-xs ${
          isUrgent ? "text-gold" : "text-on-dark-muted"
        }`}
      >
        {isFull
          ? "Semua 100 founding slot telah diambil. Sila daftar pada harga standard."
          : isUrgent
          ? `Hanya ${remaining} slot lagi pada harga founding.`
          : `${remaining} slot lagi pada harga founding RM69/bulan.`}
      </p>
    </div>
  );
}
