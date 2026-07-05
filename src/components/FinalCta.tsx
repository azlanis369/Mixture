import EarlyAccessBadge from "@/components/EarlyAccessBadge";
import PayNowButton from "@/components/PayNowButton";
import Reveal from "@/components/Reveal";
import WhatsAppCta from "@/components/WhatsAppCta";

export default function FinalCta() {
  const hasPayment = !!process.env.NEXT_PUBLIC_BILLPLZ_PAYMENT_URL;

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
          <div className="mt-8 flex flex-col items-center gap-3">
            <PayNowButton
              source="final_cta_paynow"
              className="inline-flex items-center gap-2 rounded-full bg-emerald px-8 py-3.5 text-sm font-semibold text-on-dark shadow-lg shadow-emerald/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-soft hover:shadow-emerald/40 sm:text-base"
            >
              <span>Bayar Sekarang · RM69</span>
              <span aria-hidden>→</span>
            </PayNowButton>
            {hasPayment ? (
              <WhatsAppCta
                source="final_cta_secondary"
                className="text-xs font-medium text-on-dark-muted underline-offset-4 transition-colors hover:text-on-dark hover:underline sm:text-sm"
              >
                atau tanya via WhatsApp dulu
              </WhatsAppCta>
            ) : (
              <WhatsAppCta
                source="final_cta"
                className="inline-block rounded-full bg-emerald px-8 py-3.5 text-sm font-semibold text-on-dark shadow-lg shadow-emerald/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-soft hover:shadow-emerald/40 sm:text-base"
              >
                Minta Akses Demo
              </WhatsAppCta>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
