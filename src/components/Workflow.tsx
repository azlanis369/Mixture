import {
  IconCaption,
  IconChart,
  IconFollowUp,
  IconInbox,
  IconListing,
  IconProfile,
} from "@/components/icons";
import Reveal from "@/components/Reveal";

const steps = [
  {
    n: "01",
    title: "Setup Profile",
    body: "Bina public profile premium & QR code dalam minit.",
    icon: IconProfile,
  },
  {
    n: "02",
    title: "Tambah Listing",
    body: "Masukkan listing sekali, media auto-organize ikut unit.",
    icon: IconListing,
  },
  {
    n: "03",
    title: "Terima Lead",
    body: "Lead direkod automatik bila prospek scan profile atau hubungi terus.",
    icon: IconInbox,
  },
  {
    n: "04",
    title: "Follow-up",
    body: "Next action jelas untuk setiap lead, tak hilang dalam WhatsApp.",
    icon: IconFollowUp,
  },
  {
    n: "05",
    title: "Caption Studio",
    body: "Jana caption untuk WA, Telegram & FB dari satu sumber. (Draft/Beta)",
    icon: IconCaption,
  },
  {
    n: "06",
    title: "Lihat Proof",
    body: "Pantau funnel Views → Shares → Leads → Booked → Closed.",
    icon: IconChart,
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="bg-ink px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-on-dark sm:text-4xl">
            Macam mana ia berfungsi
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.n} delayMs={(index % 3) * 100}>
                <div className="group h-full rounded-2xl border border-white/10 bg-gradient-to-b from-ink-2/80 to-ink-2/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-xl hover:shadow-emerald/10">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl font-bold text-emerald-soft">
                      {step.n}
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/15 text-emerald-soft transition-colors group-hover:bg-emerald/25">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-on-dark">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
                    {step.body}
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
