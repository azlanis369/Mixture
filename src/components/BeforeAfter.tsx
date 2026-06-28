import Reveal from "@/components/Reveal";

type Scene = {
  label: string;
  before: string;
  after: string;
};

const scenes: Scene[] = [
  {
    label: "Adegan 1 — Pukul 11 malam",
    before:
      'Skrin WhatsApp menyala dalam gelap. 217 mesej belum baca. "Yang tanya unit Pandan Indah tadi… siapa tah." Scroll. Hilang. Tidur tak lena.',
    after:
      "Satu skrin lead. Nama, sumber, listing, next action — terang. Tutup phone. Tidur.",
  },
  {
    label: "Adegan 2 — Depan owner",
    before:
      "Hulur kad nama lusuh. Buka gallery cari gambar listing — terselit foto anak, resit, screenshot. Owner senyum sopan, hilang yakin.",
    after:
      "Owner scan QR. Public profile premium terbuka — REN 36963, kawasan servis, listing tersusun. Owner tak cakap apa-apa, tapi dia dah percaya.",
  },
  {
    label: "Adegan 3 — Sebelum post",
    before:
      "Tulis caption. Copy ke FB. Edit. Copy ke Telegram. Edit lagi. Salah harga di satu platform. Sedar lepas 40 like.",
    after:
      "Caption Studio jana — WA, Telegram, FB, CTA siap. Satu sumber. Konsisten. Hantar.",
  },
];

const chipPairs = [
  ["Listing bersepah", "Listing tersusun"],
  ["Gambar bercampur", "Media ikut listing"],
  ["Caption ulang-ulang", "Caption siap dijana"],
  ["Lead hilang dalam WhatsApp", "Lead direkod"],
  ["Follow-up tidak jelas", "Next action jelas"],
  ["Profile nampak biasa", "Public profile premium"],
];

function SceneRow({ scene, index }: { scene: Scene; index: number }) {
  return (
    <Reveal delayMs={index * 100}>
      <p className="mb-4 text-center font-display text-sm font-semibold uppercase tracking-wide text-on-dark-muted">
        {scene.label}
      </p>
      <div className="grid overflow-hidden rounded-2xl border border-white/10 md:grid-cols-2">
        <div className="bg-ink-2 p-6 sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-dark-muted/70">
            Before
          </p>
          <p className="text-sm leading-relaxed text-on-dark-muted sm:text-base">
            {scene.before}
          </p>
        </div>
        <div className="bg-surface p-6 sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald">
            After
          </p>
          <p className="text-sm leading-relaxed text-on-light sm:text-base">
            {scene.after}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function BeforeAfter() {
  return (
    <section className="bg-ink px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-4xl space-y-10">
        {scenes.map((scene, index) => (
          <SceneRow key={scene.label} scene={scene} index={index} />
        ))}

        <Reveal>
          <p className="pt-6 text-center font-display text-2xl font-bold text-on-dark sm:text-3xl">
            Effort anda sama. Tapi hasilnya nampak first-class.
          </p>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {chipPairs.map(([before, after]) => (
              <span
                key={before}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-on-dark-muted sm:text-sm"
              >
                <span className="line-through opacity-70">{before}</span>
                <span aria-hidden className="text-emerald-soft">
                  →
                </span>
                <span className="font-medium text-on-dark">{after}</span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
