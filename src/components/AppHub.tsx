import Reveal from "@/components/Reveal";

type Module = {
  name: string;
  status: "Live" | "Draft/Beta";
  body: string;
};

// G1: every module shown here must exist in the beta build.
// G4: Autobot & Caption Studio stay labelled Draft/Beta — no auto-posting / official WA API claims.
const modules: Module[] = [
  {
    name: "Public Profile",
    status: "Live",
    body: "Profile premium boleh dikongsi via QR atau link.",
  },
  {
    name: "Listing Manager",
    status: "Live",
    body: "Susun listing dan media ikut unit, bukan bertaburan dalam gallery.",
  },
  {
    name: "Lead Inbox",
    status: "Live",
    body: "Semua lead direkod dalam satu skrin — nama, sumber, listing.",
  },
  {
    name: "Follow-up Tracker",
    status: "Live",
    body: "Next action jelas untuk setiap lead, tak hilang dalam chat.",
  },
  {
    name: "Caption Studio",
    status: "Draft/Beta",
    body: "Jana caption WA/Telegram/FB dari satu sumber. Anda semak & hantar sendiri.",
  },
  {
    name: "Autobot",
    status: "Draft/Beta",
    body: "Bantu draf respons automatik. Tiada auto-posting portal atau WA Business API rasmi dalam v1.0.",
  },
  {
    name: "SWOT Intelligence",
    status: "Live",
    body: "Lihat funnel Views → Shares → Leads → Booked → Closed dari data sebenar anda.",
  },
];

export default function AppHub() {
  return (
    <section id="app-hub" className="bg-ink px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-on-dark sm:text-4xl">
            App Hub
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-on-dark-muted sm:text-base">
            Setiap modul di bawah wujud dalam beta sekarang. Modul yang belum
            penuh kami label jujur sebagai Draft/Beta.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <Reveal key={module.name} delayMs={(index % 3) * 100}>
              <div className="h-full rounded-2xl border border-white/10 bg-ink-2/60 p-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-on-dark">
                    {module.name}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                      module.status === "Live"
                        ? "bg-emerald/20 text-emerald-soft"
                        : "bg-gold/20 text-gold"
                    }`}
                  >
                    {module.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
                  {module.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
