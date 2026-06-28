import EarlyAccessBadge from "@/components/EarlyAccessBadge";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/site-config";

export default function FinalCta() {
  return (
    <section
      id="cta"
      className="bg-gradient-to-b from-ink to-ink-2 px-5 py-20 text-center sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <EarlyAccessBadge className="mb-6" />
          <h2 className="font-display text-3xl font-bold text-on-dark sm:text-4xl">
            Effort anda sama. Kerja anda patut nampak setajam itu.
          </h2>
          <p className="mt-4 text-sm text-on-dark-muted sm:text-base">
            Sertai Early Access RENFlow Plus dan kunci harga founding sebelum
            pelancaran v1.0 penuh.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-emerald px-8 py-3.5 text-sm font-semibold text-on-dark transition-colors hover:bg-emerald-soft sm:text-base"
          >
            Minta Akses Demo
          </a>
        </Reveal>
      </div>
    </section>
  );
}
