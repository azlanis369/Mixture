import EarlyAccessBadge from "@/components/EarlyAccessBadge";
import FoundingSlots from "@/components/FoundingSlots";
import PhoneMockup from "@/components/PhoneMockup";
import Reveal from "@/components/Reveal";
import WhatsAppCta from "@/components/WhatsAppCta";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-ink px-5 pb-20 pt-16 sm:px-8 sm:pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-gold/10 blur-[120px]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
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
          <a
            href="#app-hub"
            className="group mt-6 inline-flex max-w-xl items-start gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-left transition-colors hover:border-gold/50 hover:bg-gold/10"
          >
            <span className="mt-0.5 shrink-0 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
              Baru
            </span>
            <span className="text-sm text-on-dark sm:text-base">
              <span className="font-semibold text-gold">Poster Studio</span>{" "}
              — 1-klik jana poster listing branded, 3 template (Hero, Personal
              REN, Galeri). Terus muat turun PNG.{" "}
              <span className="whitespace-nowrap text-on-dark-muted underline-offset-2 group-hover:underline">
                Lihat →
              </span>
            </span>
          </a>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WhatsAppCta
              source="hero"
              className="rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-on-dark shadow-lg shadow-emerald/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-soft hover:shadow-emerald/40 sm:text-base"
            >
              Minta Akses Demo
            </WhatsAppCta>
            <a
              href="#workflow"
              className="text-sm font-medium text-on-dark-muted underline-offset-4 transition-colors hover:text-on-dark hover:underline sm:text-base"
            >
              Lihat Cara Ia Berfungsi
            </a>
          </div>
          <div className="mt-6">
            <FoundingSlots variant="compact" />
          </div>
        </Reveal>
        <Reveal delayMs={150} className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </Reveal>
      </div>
    </section>
  );
}
