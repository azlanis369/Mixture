import FoundingSlots from "@/components/FoundingSlots";
import PayNowButton from "@/components/PayNowButton";
import Reveal from "@/components/Reveal";
import WhatsAppCta from "@/components/WhatsAppCta";

const exclusions = [
  "Auto-posting portal rasmi",
  "WhatsApp Business API rasmi",
  "Agency dashboard penuh",
];

export default function Pricing() {
  const hasPayment = !!process.env.NEXT_PUBLIC_BILLPLZ_PAYMENT_URL;

  return (
    <section id="pricing" className="relative overflow-hidden bg-ink px-5 py-20 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <FoundingSlots variant="compact" />
          <h2 className="mt-4 font-display text-3xl font-bold text-on-dark sm:text-4xl">
            Harga founding REN
          </h2>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="mt-10 rounded-2xl border border-gold/30 bg-gradient-to-b from-ink-2/90 to-ink-2/50 p-8 shadow-2xl shadow-gold/5 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              Founding Price · Locked Forever
            </p>
            <div className="mt-4 flex items-baseline justify-center gap-2">
              <span className="font-display text-2xl font-medium text-on-dark-muted/60 line-through">
                RM149
              </span>
              <span className="font-display text-4xl font-bold text-on-dark sm:text-5xl">
                RM69
              </span>
              <span className="text-lg text-on-dark-muted">/bulan</span>
            </div>
            <p className="mt-1 text-sm text-on-dark-muted">
              Untuk 100 REN pertama · Kekal selamanya
            </p>
            <p className="mt-4 text-sm font-semibold text-gold">
              Selepas 100 slot habis, harga standard RM149/bulan.
            </p>
            <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4 text-left">
              <FoundingSlots />
            </div>
            <div className="mt-6 flex flex-col items-center gap-3">
              <PayNowButton
                source="pricing_paynow"
                className="inline-flex items-center gap-2 rounded-full bg-emerald px-8 py-3.5 text-sm font-semibold text-on-dark shadow-lg shadow-emerald/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-soft hover:shadow-emerald/40 sm:text-base"
              >
                <span>Bayar Sekarang · RM69</span>
                <span aria-hidden>→</span>
              </PayNowButton>
              {hasPayment ? (
                <WhatsAppCta
                  source="pricing_secondary"
                  className="text-xs font-medium text-on-dark-muted underline-offset-4 transition-colors hover:text-on-dark hover:underline sm:text-sm"
                >
                  atau tanya via WhatsApp dulu
                </WhatsAppCta>
              ) : (
                <WhatsAppCta
                  source="pricing"
                  checkoutIntent
                  className="rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-on-dark shadow-lg shadow-emerald/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-soft hover:shadow-emerald/40"
                >
                  Minta Akses Demo
                </WhatsAppCta>
              )}
            </div>
            <div className="mt-8 border-t border-white/10 pt-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-dark-muted">
                Tidak termasuk v1.0
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-on-dark-muted">
                {exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden className="mt-0.5 text-on-dark-muted/60">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
