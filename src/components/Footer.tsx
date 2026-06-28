import { SITE_NAME } from "@/lib/site-config";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 text-xs text-on-dark-muted sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-sm font-semibold text-on-dark">
              {SITE_NAME}
            </p>
            <p className="mt-2 leading-relaxed">
              Sistem susun kerja untuk REN individu — profile, listing, lead,
              follow-up dan pipeline dalam satu flow.
            </p>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-wide text-on-dark">
              Polisi
            </p>
            <ul className="mt-2 space-y-1.5">
              <li>
                <a href="#terms" className="transition-colors hover:text-on-dark">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#privacy" className="transition-colors hover:text-on-dark">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-wide text-on-dark">
              Remarketing
            </p>
            <p className="mt-2 leading-relaxed">
              Laman ini menggunakan Google AdWords Remarketing, Facebook Ads dan
              TikTok Ads Remarketing serta cookies untuk memberikan pengalaman
              yang lebih baik dan iklan yang relevan.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6">
          <p className="text-[11px] leading-relaxed text-on-dark-muted/70">
            <span className="font-semibold text-on-dark-muted">
              Income Disclaimer:
            </span>{" "}
            Keputusan yang dipaparkan bukan keputusan tipikal. Hasil setiap
            individu adalah berbeza bergantung kepada usaha, pengalaman dan
            keadaan pasaran masing-masing.
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-on-dark-muted/50">
          © {currentYear} By AZLAN ZAKARIA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
