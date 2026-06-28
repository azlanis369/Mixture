import Reveal from "@/components/Reveal";

const steps = [
  {
    n: "01",
    title: "Setup Profile",
    body: "Bina public profile premium & QR code dalam minit.",
  },
  {
    n: "02",
    title: "Tambah Listing",
    body: "Masukkan listing sekali, media auto-organize ikut unit.",
  },
  {
    n: "03",
    title: "Terima Lead",
    body: "Lead direkod automatik bila prospek scan profile atau hubungi terus.",
  },
  {
    n: "04",
    title: "Follow-up",
    body: "Next action jelas untuk setiap lead, tak hilang dalam WhatsApp.",
  },
  {
    n: "05",
    title: "Caption Studio",
    body: "Jana caption untuk WA, Telegram & FB dari satu sumber. (Draft/Beta)",
  },
  {
    n: "06",
    title: "Lihat Proof",
    body: "Pantau funnel Views → Shares → Leads → Booked → Closed.",
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
          {steps.map((step, index) => (
            <Reveal key={step.n} delayMs={(index % 3) * 100}>
              <div className="h-full rounded-2xl border border-white/10 bg-ink-2/60 p-6">
                <p className="font-display text-2xl font-bold text-emerald-soft">
                  {step.n}
                </p>
                <h3 className="mt-2 font-display text-base font-semibold text-on-dark">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
