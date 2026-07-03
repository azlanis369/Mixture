import { SITE_NAME } from "@/lib/site-config";
import WhatsAppCta from "@/components/WhatsAppCta";

const currentYear = new Date().getFullYear();

type Section = {
  heading?: string;
  body: string;
};

type Policy = {
  title: string;
  sections: Section[];
};

const policies: Policy[] = [
  {
    title: "Terma & Syarat",
    sections: [
      {
        body:
          "Dengan mengakses dan menggunakan RENFlow Plus, anda bersetuju untuk mematuhi terma dan syarat penggunaan di bawah.",
      },
      {
        heading: "1. Fasa Early Access",
        body:
          "RENFlow Plus adalah produk dalam fasa Early Access. Ciri dan fungsi tertakluk kepada perubahan, penambahbaikan atau penyingkiran tanpa notis sebelum pelancaran v1.0 penuh.",
      },
      {
        heading: "2. Langganan Founding REN",
        body:
          "Harga founding RM69/bulan dikunci selamanya untuk 100 akaun individual pertama yang mendaftar dalam tempoh Early Access. Selepas 100 slot dipenuhi, harga standard RM149/bulan diguna pakai untuk pendaftaran seterusnya.",
      },
      {
        heading: "3. Penggunaan yang Dibenarkan",
        body:
          "Satu akaun untuk satu REN individu. Perkongsian akaun antara beberapa REN tidak dibenarkan. Data listing, lead dan client mestilah milik REN yang berdaftar sendiri.",
      },
      {
        heading: "4. Modul Draft/Beta",
        body:
          "Modul yang berlabel Draft/Beta (contoh: Autobot, Caption Studio) disediakan “as-is” untuk membantu penyediaan draf. Anda bertanggungjawab menyemak dan menghantar mesej/caption sendiri.",
      },
      {
        heading: "5. Pembatalan",
        body:
          "Rujuk Dasar Pembatalan di sebelah untuk butiran lengkap.",
      },
    ],
  },
  {
    title: "Dasar Pembatalan",
    sections: [
      {
        heading: "Pembatalan bila-bila masa",
        body:
          "Anda boleh batalkan langganan bila-bila masa. Tiada penalti, tiada kontrak minimum, tiada soalan yang menyulitkan.",
      },
      {
        heading: "Bila pembatalan berkuat kuasa",
        body:
          "Pembatalan berkuat kuasa pada penghujung kitaran bil semasa. Anda kekal ada akses penuh sehingga tarikh tersebut — tiada pemotongan akses secara serta-merta.",
      },
      {
        heading: "Auto-renewal",
        body:
          "Langganan diperbaharui secara automatik setiap kitaran (bulanan atau tahunan) kecuali anda batalkan sebelum kitaran seterusnya bermula. Anda akan terima peringatan sebelum caj dibuat.",
      },
      {
        heading: "Bayaran balik",
        body:
          "Tiada bayaran balik separa untuk baki bulan atau baki tahun yang belum digunakan. Ini pendekatan lazim SaaS — anda bayar untuk tempoh akses, bukan mesin masa.",
      },
      {
        heading: "Cara batal",
        body:
          "Hantar mesej WhatsApp ke nombor rasmi RENFlow Plus (butang di bawah). Pembatalan diproses dalam masa 1-2 hari bekerja.",
      },
      {
        heading: "Data selepas pembatalan",
        body:
          "Akaun anda kekal aktif untuk tempoh grace 30 hari selepas pembatalan supaya anda boleh export listing, lead dan data lain. Selepas itu, data dipadam mengikut Dasar Privasi.",
      },
    ],
  },
  {
    title: "Dasar Privasi",
    sections: [
      {
        heading: "Data yang dikumpul",
        body:
          "Kami kumpul: (a) data yang anda berikan secara langsung — nama, nombor telefon, e-mel, nombor REN, listing, lead; (b) data teknikal — alamat IP, jenis pelayar, tarikh & masa lawatan; (c) data interaksi — halaman yang dilawati, butang yang diklik.",
      },
      {
        heading: "Tujuan pengumpulan",
        body:
          "Data digunakan untuk: menyampaikan perkhidmatan RENFlow Plus, komunikasi berkaitan produk (invois, kemas kini, sokongan), penambahbaikan produk, dan iklan yang relevan.",
      },
      {
        heading: "Cookies & tracking pixels",
        body:
          "Laman ini menggunakan cookies dan pixel dari Meta (Facebook), TikTok dan Google Analytics 4 untuk mengukur prestasi kempen dan pengalaman pengguna. Anda boleh matikan cookies melalui tetapan pelayar.",
      },
      {
        heading: "Perkongsian dengan pihak ketiga",
        body:
          "Kami tidak jual data anda. Perkongsian hanya berlaku dengan: (a) penyedia teknikal (contoh: Vercel untuk hosting, gateway bayaran) dalam skop menyampaikan perkhidmatan; (b) pihak berkuasa jika diperlukan oleh undang-undang Malaysia.",
      },
      {
        heading: "Simpanan & keselamatan",
        body:
          "Data disimpan dalam infrastruktur berpiawaian industri dengan enkripsi transit (HTTPS/TLS). Akses dalaman dihadkan kepada pentadbir yang diberi kuasa.",
      },
      {
        heading: "Hak anda di bawah PDPA 2010",
        body:
          "Anda berhak: mengakses data peribadi anda, membetulkan data yang tidak tepat, meminta pemadaman, atau menarik balik persetujuan. Hubungi kami via WhatsApp untuk sebarang permintaan.",
      },
      {
        heading: "Kemas kini dasar",
        body:
          "Dasar ini boleh dikemas kini dari semasa ke semasa. Perubahan besar akan dimaklumkan melalui WhatsApp atau notifikasi dalam produk.",
      },
    ],
  },
  {
    title: "Penafian Pendapatan",
    sections: [
      {
        body:
          "Keputusan yang dipaparkan bukan keputusan tipikal. Hasil setiap individu adalah berbeza bergantung kepada usaha, pengalaman, kemahiran pemasaran, dan keadaan pasaran masing-masing.",
      },
      {
        heading: "Bukan jaminan pendapatan",
        body:
          "RENFlow Plus adalah alat pengurusan kerja (workflow tool). Ia tidak menjamin sebarang jumlah pendapatan, jualan atau lead untuk pengguna. Kejayaan bergantung sepenuhnya pada usaha REN individu.",
      },
      {
        heading: "Data proof",
        body:
          "Angka funnel dan statistik yang dipaparkan dalam laman ini adalah dari deployment sebenar superREN.group CRM Pro sebagai contoh struktur. Akaun REN individu bermula kosong dan diisi dengan data anda sendiri.",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-3 sm:grid-cols-2">
          {policies.map((policy) => (
            <details
              key={policy.title}
              className="group rounded-xl border border-white/10 bg-ink-2/40 px-5 py-4 transition-colors open:bg-ink-2/60"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-sm font-semibold text-on-dark marker:content-none">
                <span className="flex items-center gap-2">
                  <span className="text-on-dark-muted transition-transform group-open:rotate-90">
                    ▸
                  </span>
                  {policy.title}
                </span>
              </summary>
              <div className="mt-4 space-y-3">
                {policy.sections.map((section, i) => (
                  <div key={i}>
                    {section.heading && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-soft/80">
                        {section.heading}
                      </p>
                    )}
                    <p
                      className={`text-xs leading-relaxed text-on-dark-muted ${
                        section.heading ? "mt-1" : ""
                      }`}
                    >
                      {section.body}
                    </p>
                  </div>
                ))}
                {policy.title === "Dasar Pembatalan" && (
                  <WhatsAppCta
                    source="footer_cancellation"
                    message="Hi, saya nak batalkan langganan RENFlow Plus saya."
                    className="mt-3 inline-block rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-on-dark-muted transition-colors hover:border-emerald/40 hover:text-emerald-soft"
                  >
                    Batal via WhatsApp
                  </WhatsAppCta>
                )}
                {policy.title === "Dasar Privasi" && (
                  <WhatsAppCta
                    source="footer_privacy"
                    message="Hi, saya ada pertanyaan berkaitan Dasar Privasi RENFlow Plus."
                    className="mt-3 inline-block rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-on-dark-muted transition-colors hover:border-emerald/40 hover:text-emerald-soft"
                  >
                    Hubungi berkaitan Privasi
                  </WhatsAppCta>
                )}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 text-[11px] text-on-dark-muted/50 sm:flex-row">
          <p>© {currentYear} HAK CIPTA TERPELIHARA · By AZLAN ZAKARIA</p>
          <p>
            {SITE_NAME} · Early Access · Founding REN
          </p>
        </div>
      </div>
    </footer>
  );
}
