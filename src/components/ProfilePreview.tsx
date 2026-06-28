import { IconProfile, IconQr } from "@/components/icons";
import Reveal from "@/components/Reveal";

const listings = [
  { title: "Residensi Pandan Indah", type: "Condo", status: "Active" },
  { title: "Taman Setapak Jaya", type: "Terrace", status: "Active" },
  { title: "The Oaks, Ampang", type: "Semi-D", status: "Under Offer" },
];

const leadWorkspace = [
  { field: "Name", value: "Siti binti Ahmad" },
  { field: "Source", value: "QR Scan · Profile" },
  { field: "Next Action", value: "Hantar info unit A-12-03" },
];

export default function ProfilePreview() {
  return (
    <section id="preview" className="section-elevated bg-ink-2 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-on-dark sm:text-4xl">
            Apa prospect nampak. Apa anda guna.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-on-dark-muted sm:text-base">
            Public profile premium di depan. Workspace ringan di belakang.
            Dua layer, satu flow.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-2/60">
              <div className="border-b border-white/10 bg-emerald/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald/20">
                    <IconProfile className="h-7 w-7 text-emerald-soft" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-on-dark">
                      Azlan Zakaria
                    </p>
                    <p className="text-xs text-on-dark-muted">
                      REN 36963 · KL / Selangor
                    </p>
                  </div>
                  <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <IconQr className="h-5 w-5 text-on-dark-muted" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-on-dark-muted">
                  Listing Tersusun
                </p>
                <div className="mt-3 space-y-2">
                  {listings.map((listing) => (
                    <div
                      key={listing.title}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-2.5"
                    >
                      <div>
                        <p className="text-xs font-medium text-on-dark">
                          {listing.title}
                        </p>
                        <p className="text-[11px] text-on-dark-muted">
                          {listing.type}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          listing.status === "Active"
                            ? "bg-emerald/20 text-emerald-soft"
                            : "bg-gold/20 text-gold"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-emerald/10 px-4 py-3 text-center">
                  <p className="text-xs font-semibold text-emerald-soft">
                    WhatsApp · Hubungi REN
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-2/60">
              <div className="border-b border-white/10 bg-black/20 px-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-on-dark-muted">
                  Lead Workspace
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {leadWorkspace.map((row) => (
                    <div key={row.field}>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-on-dark-muted/60">
                        {row.field}
                      </p>
                      <p className="mt-0.5 text-sm text-on-dark">{row.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-white/5 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-dark-muted">
                    Pipeline
                  </p>
                  <div className="mt-3 flex gap-1.5">
                    {["Enquiry", "Viewing", "Booking", "Loan", "Closed"].map(
                      (stage, i) => (
                        <div key={stage} className="flex-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              i < 2 ? "bg-emerald" : "bg-white/10"
                            }`}
                          />
                          <p className="mt-1.5 text-center text-[9px] text-on-dark-muted">
                            {stage}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/5 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-dark-muted">
                    Quick Stats
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[
                      { label: "Profile Views", val: "342" },
                      { label: "Listing Clicks", val: "89" },
                      { label: "WA Clicks", val: "24" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg bg-white/5 px-3 py-2 text-center"
                      >
                        <p className="font-display text-lg font-bold text-emerald-soft">
                          {stat.val}
                        </p>
                        <p className="text-[9px] text-on-dark-muted">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
