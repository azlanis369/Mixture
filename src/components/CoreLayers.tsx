import Reveal from "@/components/Reveal";

const layers = [
  {
    tag: "Layer 1 · Depan",
    title: "Public Profile Premium",
    body:
      "Apa client nampak: profile REN yang kemas, scan QR terus, kawasan servis dan listing tersusun. Kredibiliti tanpa kad nama lusuh.",
  },
  {
    tag: "Layer 2 · Belakang",
    title: "CRM Kerja Harian",
    body:
      "Apa anda guna setiap hari: lead inbox, next action, listing manager dan caption studio — semua dalam satu flow, bukan bertaburan antara app.",
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
          {layers.map((layer, index) => (
            <Reveal key={layer.title} delayMs={index * 120}>
              <div className="h-full rounded-2xl border border-white/10 bg-ink-2/60 p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-soft">
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
          ))}
        </div>
      </div>
    </section>
  );
}
