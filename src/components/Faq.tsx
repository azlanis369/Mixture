import Reveal from "@/components/Reveal";
import WhatsAppCta from "@/components/WhatsAppCta";

const faqs = [
  {
    q: "RENFlow Plus ni baru ke?",
    a: "Ya — ini fasa Early Access. Enjinnya sudah terbukti menyusun kerja sebenar team property; RENFlow Plus ialah versi untuk REN individu. Anda masuk pada harga founding dan bantu bentuk arah produk sebelum pelancaran v1.0 penuh.",
  },
  {
    q: "Adakah ini auto-posting portal?",
    a: "Tidak. v1.0 tidak mendakwa ada auto-posting portal rasmi, WhatsApp Business API rasmi atau agency dashboard penuh. Ia dalam roadmap selepas Early Access.",
  },
  {
    q: "Akaun saya terus ada data?",
    a: "Tidak. Paparan demo menunjukkan contoh aliran. Akaun REN anda bermula kosong dan diisi dengan profile, listing, lead dan workflow anda sendiri.",
  },
  {
    q: "Kenapa sesetengah modul label \"Draft/Beta\"?",
    a: "Modul seperti Caption Studio dan Autobot masih dalam fasa penambahbaikan. Anda boleh guna sekarang, tapi anda semak dan hantar sendiri — bukan auto-posting penuh.",
  },
  {
    q: "Autobot buat apa?",
    a: "Autobot ialah Draft/Beta untuk bantu sediakan draf caption dan follow-up. Ia bukan sistem hantar mesej automatik rasmi.",
  },
  {
    q: "Apa yang tidak termasuk dalam v1.0?",
    a: "Auto-posting ke portal rasmi, WhatsApp Business API rasmi, dan agency dashboard penuh belum ada dalam v1.0. Ia dalam roadmap selepas Early Access.",
  },
  {
    q: "Macam mana dengan harga lepas v1.0?",
    a: "Harga founding RM88/bulan dikunci untuk REN yang sertai semasa Early Access. Harga akan naik selepas pelancaran v1.0 penuh.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="bg-ink px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <Reveal className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-on-dark sm:text-4xl">
            Soalan Lazim
          </h2>
        </Reveal>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Reveal key={faq.q} delayMs={index * 80}>
              <details className="group rounded-xl border border-white/10 bg-ink-2/60 p-5 open:bg-ink-2">
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-on-dark marker:content-none">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-10 text-center text-sm leading-relaxed text-on-dark-muted">
            Kalau sistem kerja anda masih bersepah, jangan tunggu v1.0 penuh.
          </p>
          <div className="mt-4 text-center">
            <WhatsAppCta
              source="faq_bottom"
              className="inline-block rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-on-dark shadow-lg shadow-emerald/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-soft hover:shadow-emerald/40"
            >
              Minta Akses Demo
            </WhatsAppCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
