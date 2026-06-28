import EarlyAccessBadge from "@/components/EarlyAccessBadge";
import PhoneMockup from "@/components/PhoneMockup";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/site-config";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-ink px-5 pb-20 pt-16 sm:px-8 sm:pt-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <EarlyAccessBadge className="mb-6" />
          <h1 className="font-display text-4xl font-bold leading-tight text-on-dark sm:text-5xl lg:text-6xl">
            Anda REN yang bagus.
            <br />
            <span className="text-emerald-soft">Sistem anda yang bersepah.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-on-dark-muted sm:text-lg">
            RENFlow Plus susun profile, listing, lead dan follow-up dalam satu
            flow — supaya kerja anda nampak setajam hasil anda.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-on-dark transition-colors hover:bg-emerald-soft sm:text-base"
            >
              Minta Akses Demo
            </a>
            <a
              href="#workflow"
              className="text-sm font-medium text-on-dark-muted underline-offset-4 transition-colors hover:text-on-dark hover:underline sm:text-base"
            >
              Lihat Cara Ia Berfungsi
            </a>
          </div>
        </Reveal>
        <Reveal delayMs={150} className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </Reveal>
      </div>
    </section>
  );
}
