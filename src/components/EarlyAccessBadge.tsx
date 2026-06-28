export default function EarlyAccessBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      Early Access · Beta · Harga Founding REN
    </span>
  );
}
