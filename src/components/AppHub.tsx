import {
  IconBot,
  IconCaption,
  IconChart,
  IconDeal,
  IconFollowUp,
  IconInbox,
  IconListing,
  IconMedia,
  IconProfile,
  IconQr,
} from "@/components/icons";
import Reveal from "@/components/Reveal";
import type { ComponentType } from "react";

type Module = {
  name: string;
  status: "Live" | "Draft/Beta";
  body: string;
  icon: ComponentType<{ className?: string }>;
};

// G1: every module shown here must exist in the beta build.
// G4: Autobot & Caption Studio stay labelled Draft/Beta — no auto-posting / official WA API claims.
const modules: Module[] = [
  {
    name: "Public Profile",
    status: "Live",
    body: "Profile premium boleh dikongsi via QR atau link.",
    icon: IconProfile,
  },
  {
    name: "Listing Manager",
    status: "Live",
    body: "Susun listing dan media ikut unit, bukan bertaburan dalam gallery.",
    icon: IconListing,
  },
  {
    name: "Media Board",
    status: "Live",
    body: "Gambar tersusun ikut listing, bukan bercampur dengan foto peribadi dalam gallery.",
    icon: IconMedia,
  },
  {
    name: "Lead Capture",
    status: "Live",
    body: "WhatsApp enquiry dan form lead direkod automatik dengan sumber tracking.",
    icon: IconInbox,
  },
  {
    name: "Mini CRM",
    status: "Live",
    body: "Status, nota dan next action untuk setiap lead — tak perlu spreadsheet lain.",
    icon: IconFollowUp,
  },
  {
    name: "Deal Pipeline",
    status: "Live",
    body: "Track booking, loan, tenancy/SPA hingga closed dalam satu paparan.",
    icon: IconDeal,
  },
  {
    name: "Caption Studio",
    status: "Draft/Beta",
    body: "Jana caption WA/Telegram/FB dari satu sumber. Anda semak & hantar sendiri.",
    icon: IconCaption,
  },
  {
    name: "QR Card",
    status: "Live",
    body: "Kad nama digital untuk meeting & sharing — scan terus ke public profile.",
    icon: IconQr,
  },
  {
    name: "Basic Analytics",
    status: "Live",
    body: "Profile views, listing clicks, WhatsApp clicks — tahu apa yang berkesan.",
    icon: IconChart,
  },
  {
    name: "Autobot",
    status: "Draft/Beta",
    body: "Bantu draf respons automatik. Tiada auto-posting portal atau WA Business API rasmi dalam v1.0.",
    icon: IconBot,
  },
];

export default function AppHub() {
  return (
    <section id="app-hub" className="section-elevated bg-ink-2 px-5 py-20 sm:px-8 sm:py-28">
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
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Reveal key={module.name} delayMs={(index % 3) * 100}>
                <div className="group h-full rounded-2xl border border-white/10 bg-gradient-to-b from-ink-2/80 to-ink-2/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-xl hover:shadow-emerald/10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/15 text-emerald-soft transition-colors group-hover:bg-emerald/25">
                      <Icon />
                    </span>
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
                  <h3 className="mt-4 font-display text-base font-semibold text-on-dark">
                    {module.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
                    {module.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
