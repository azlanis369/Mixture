import EarlyAccessBadge from "@/components/EarlyAccessBadge";
import Reveal from "@/components/Reveal";
import WhatsAppCta from "@/components/WhatsAppCta";

export default function FinalCta() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-gradient-to-b from-ink to-ink-2 px-5 py-20 text-center sm:px-8 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-emerald/15 blur-[120px]"
      />
      <div className="relative mx-auto max-w-2xl">
        <Reveal>
          <EarlyAccessBadge className="mb-6" />
          <h2 className="font-display text-3xl font-bold text-on-dark sm:text-4xl">
            Effort anda sama. Kerja anda patut nampak setajam itu.
          </h2>
          <p className="mt-4 text-sm text-on-dark-muted sm:text-base">
            Sertai Early Access RENFlow Plus dan kunci harga founding
            RM69/bulan selamanya — hanya untuk 100 REN pertama.
          </p>
          <WhatsAppCta
            source="final_cta"
            className="mt-8 inline-block rounded-full bg-emerald px-8 py-3.5 text-sm font-semibold text-on-dark shadow-lg shadow-emerald/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-soft hover:shadow-emerald/40 sm:text-base"
          >
            Minta Akses Demo
          </WhatsAppCta>
        </Reveal>
      </div>
    </section>
  );
}
