import Reveal from "@/components/Reveal";
import { ENGINE_SOURCE_NAME } from "@/lib/site-config";

const funnel = ["Views", "Shares", "Leads", "Booked", "Closed"];

export default function Proof() {
  return (
    <section id="proof" className="bg-ink px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-on-dark sm:text-4xl">
            Enjin sebenar di belakang RENFlow Plus.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-on-dark-muted sm:text-base">
            Sistem yang sama menjana SWOT Intelligence automatik daripada data
            kerja sebenar REN — listing, share, lead dan deal. Bukan ramalan
            pasaran luaran. Data anda sendiri, jadi keputusan anda sendiri.
          </p>
        </Reveal>

        <Reveal>
          {/* Browser-mockup frame for the real {ENGINE_SOURCE_NAME} SWOT + funnel view.
              TODO(azlan): swap this structural diagram for a real screenshot
              (e.g. public/proof-superren-funnel.png) once you can share one. */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-2 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-2 text-xs text-on-dark-muted">
                {ENGINE_SOURCE_NAME}/dashboard
              </span>
            </div>
            <div className="p-6 sm:p-10">
              <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-on-dark-muted">
                Funnel sebenar
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
                {funnel.map((stage, index) => (
                  <div key={stage} className="flex-1">
                    <div
                      className="rounded-lg bg-emerald/80"
                      style={{
                        height: "2.25rem",
                        width: `${100 - index * 14}%`,
                      }}
                    />
                    <p className="mt-2 text-xs text-on-dark-muted sm:text-sm">
                      {stage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 text-center text-xs text-on-dark-muted">
          Paparan menggunakan data sistem sebenar dari deployment Super Ren
          Group. Akaun anda bermula kosong.
        </p>
      </div>
    </section>
  );
}
