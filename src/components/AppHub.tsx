import {
  IconBell,
  IconBot,
  IconCaption,
  IconChart,
  IconChat,
  IconCommission,
  IconDeal,
  IconFollowUp,
  IconInbox,
  IconListing,
  IconMedia,
  IconPoster,
  IconProfile,
  IconQr,
  IconTarget,
  IconVideo,
} from "@/components/icons";
import Reveal from "@/components/Reveal";
import type { ComponentType } from "react";

type Status = "Live" | "Draft/Beta" | "Roadmap";

type Module = {
  name: string;
  status: Status;
  body: string;
  icon: ComponentType<{ className?: string }>;
  // "Baru" pill for freshly-shipped modules — surfaces so agents can spot
  // what's new at a glance. Hand-set, not auto — we want to control emphasis.
  isNew?: boolean;
};

// G1: modul "Live" bukan spekulasi — pattern-nya terbukti dari sistem
//     hartanah internal yang dibina sebelum ini, kini dibuka untuk REN
//     individu melalui RENFlow Plus.
// G4: hanya modul yang bergantung pada KELULUSAN API pihak ketiga (Meta Ads,
//     Google Meet, Zoom) kekal Roadmap — kapasiti wujud, tapi integrasi rasmi
//     luar kawalan kami. Itu satu-satunya garisan over-claim.
//
// NOTA: 10 modul pertama ialah modul asal — kekalkan verbatim, jangan tukar
// ganti. Modul baharu ditambah selepas itu sahaja.
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
  // — Modul baharu (CRM capabilities) —
  {
    name: "WhatsApp Integration",
    status: "Live",
    body: "Balas dan chat lead terus dari dalam CRM — perbualan tersimpan pada profile lead, bukan berselerak dalam telefon.",
    icon: IconChat,
  },
  {
    name: "Automated Follow-ups",
    status: "Live",
    body: "Reminder automatik dan sequence selepas enquiry, meeting atau demo — konsisten tanpa perlu ingat manual.",
    icon: IconBell,
  },
  {
    name: "Commission Tracker",
    status: "Live",
    body: "Pantau komisen setiap deal — booking, closed dan bayaran — terus tersambung dengan Deal Pipeline. Tahu berapa yang belum masuk.",
    icon: IconCommission,
  },
  {
    name: "Poster Studio",
    status: "Live",
    body: "1-klik jana poster listing branded — 3 template (Hero, Personal REN, Galeri Multi-Foto). Muat turun PNG terus untuk WhatsApp, IG dan FB.",
    icon: IconPoster,
    isNew: true,
  },
  {
    name: "Meta Lead Integration",
    status: "Roadmap",
    body: "Tarik lead dari Meta Ads (Facebook/Instagram) terus masuk CRM secara automatik. Tertakluk kepada kelulusan API Meta.",
    icon: IconTarget,
  },
  {
    name: "Meet & Zoom",
    status: "Roadmap",
    body: "Jadual meeting online terus dari CRM, sambung dengan profile lead, dan simpan sejarah meeting. Integrasi Google Meet & Zoom.",
    icon: IconVideo,
  },
];

const statusStyles: Record<Status, string> = {
  Live: "bg-emerald/20 text-emerald-soft",
  "Draft/Beta": "bg-gold/20 text-gold",
  Roadmap: "bg-white/10 text-on-dark-muted",
};

export default function AppHub() {
  return (
    <section id="app-hub" className="section-elevated bg-ink-2 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-on-dark sm:text-4xl">
            App Hub
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-on-dark-muted sm:text-base">
            Kami label jujur setiap modul.{" "}
            <span className="text-emerald-soft">Live</span> sudah wujud dalam
            beta,{" "}
            <span className="text-gold">Draft/Beta</span> sedang diperhalusi,
            dan <span className="text-on-dark">Roadmap</span> menyusul selepas
            Early Access.
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
                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                      {module.isNew ? (
                        <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink">
                          Baru
                        </span>
                      ) : null}
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[module.status]}`}
                      >
                        {module.status}
                      </span>
                    </div>
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
