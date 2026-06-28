const leads = [
  { name: "Aiman · Pandan Indah", tag: "Hot", action: "Follow-up petang ini" },
  { name: "Siti · Setapak", tag: "Baru", action: "Hantar maklumat unit" },
  { name: "Faiz · Ampang", tag: "Deal", action: "Sahkan tempahan" },
];

export default function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden
        className="absolute -inset-10 rounded-full bg-emerald/25 blur-3xl"
      />
      <div className="relative w-[260px] rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl sm:w-[300px]">
        <div className="rounded-[1.5rem] bg-ink-2/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-sm font-semibold text-on-dark">
              Lead Inbox
            </p>
            <span className="rounded-full bg-emerald/20 px-2 py-0.5 text-[10px] font-medium text-emerald-soft">
              Live
            </span>
          </div>
          <div className="space-y-2.5">
            {leads.map((lead) => (
              <div
                key={lead.name}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-on-dark">{lead.name}</p>
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-medium text-gold">
                    {lead.tag}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-on-dark-muted">{lead.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
