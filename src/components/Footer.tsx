import { SITE_NAME } from "@/lib/site-config";

const currentYear = new Date().getFullYear();

const policies = [
  {
    title: "Terma & Syarat",
    content:
      "Dengan mengakses dan menggunakan laman web ini, anda bersetuju untuk mematuhi terma dan syarat penggunaan. RENFlow Plus adalah produk dalam fasa Early Access — ciri dan fungsi tertakluk kepada perubahan. Langganan founding price dikunci pada kadar semasa untuk akaun yang mendaftar dalam tempoh Early Access. Pembatalan boleh dibuat pada bila-bila masa sebelum kitaran bil seterusnya.",
  },
  {
    title: "Dasar Privasi",
    content:
      "Laman ini menggunakan Google AdWords Remarketing, Facebook Ads dan TikTok Ads Remarketing serta cookies untuk memberikan pengalaman yang lebih baik dan iklan yang relevan. Data peribadi yang dikumpul (nama, nombor telefon, e-mel) hanya digunakan untuk tujuan komunikasi berkaitan RENFlow Plus dan tidak akan dikongsi dengan pihak ketiga tanpa kebenaran anda.",
  },
  {
    title: "Penafian Pendapatan",
    content:
      "Keputusan yang dipaparkan bukan keputusan tipikal. Hasil setiap individu adalah berbeza bergantung kepada usaha, pengalaman dan keadaan pasaran masing-masing. RENFlow Plus adalah alat pengurusan kerja — ia tidak menjamin sebarang pendapatan atau hasil jualan tertentu.",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-3 sm:grid-cols-3">
          {policies.map((policy) => (
            <details
              key={policy.title}
              className="group rounded-xl border border-white/10 bg-ink-2/40 px-5 py-4 transition-colors open:bg-ink-2/60"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-sm font-semibold text-on-dark marker:content-none">
                <span className="flex items-center gap-2">
                  <span className="text-on-dark-muted">▸</span>
                  {policy.title}
                </span>
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-on-dark-muted">
                {policy.content}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-[11px] text-on-dark-muted/50 sm:flex-row">
          <p>
            © {currentYear} HAK CIPTA TERPELIHARA · By AZLAN ZAKARIA
          </p>
          <p>
            {SITE_NAME} · Early Access · Founding REN
          </p>
        </div>
      </div>
    </footer>
  );
}
