import {
  IconBell,
  IconBot,
  IconCaption,
  IconChart,
  IconChat,
  IconDeal,
  IconFollowUp,
  IconInbox,
  IconListing,
  IconMedia,
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
};

// G1: modul "Live" wujud dalam beta sekarang.
// G4: modul yang bergantung pada API luaran (WhatsApp Business, Meta Ads,
//     Google Meet, Zoom) dilabel jujur sebagai Draft/Beta atau Roadmap —
//     tiada dakwaan integrasi rasmi penuh dalam v1.0.
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
    status: "Draft/Beta",
    body: "Balas dan chat lead terus dari dalam CRM — perbualan tersimpan pada profile lead, bukan berselerak dalam telefon.",
    icon: IconChat,
  },
  {
    name: "Automated Follow-ups",
    status: "Draft/Beta",
    body: "Reminder automatik dan sequence selepas enquiry, meeting atau demo — konsisten tanpa perlu ingat manual.",
    icon: IconBell,
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
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[module.status]}`}
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
