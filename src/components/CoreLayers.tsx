import { IconLayers, IconProfile } from "@/components/icons";
import Reveal from "@/components/Reveal";

const layers = [
  {
    tag: "Layer 1 · Depan",
    title: "Public Profile Premium",
    body:
      "Apa client nampak: profile REN yang kemas, scan QR terus, kawasan servis dan listing tersusun. Kredibiliti tanpa kad nama lusuh.",
    icon: IconProfile,
  },
  {
    tag: "Layer 2 · Belakang",
    title: "CRM Kerja Harian",
    body:
      "Apa anda guna setiap hari: lead inbox, next action, listing manager dan caption studio — semua dalam satu flow, bukan bertaburan antara app.",
    icon: IconLayers,
  },
];

export default function CoreLayers() {
  return (
    <section id="layers" className="bg-ink px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-on-dark sm:text-4xl">
            Dua layer, satu flow
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <Reveal key={layer.title} delayMs={index * 120}>
                <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-b from-ink-2/80 to-ink-2/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-xl hover:shadow-emerald/10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald/15 text-emerald-soft">
                    <Icon />
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-soft">
                    {layer.tag}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-bold text-on-dark">
                    {layer.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-on-dark-muted sm:text-base">
                    {layer.body}
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
