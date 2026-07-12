import Reveal from "@/components/Reveal";

export default function OriginStory() {
  return (
    <section id="origin" className="relative overflow-hidden bg-ink px-5 py-20 sm:px-8 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-emerald/8 blur-[120px]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-emerald-soft">
            Dibina oleh REN, untuk REN.
          </p>
          <p className="mt-6 text-xl leading-relaxed text-on-dark sm:text-2xl">
            Saya bina sistem ini untuk team saya sendiri dulu — sebab kami
            penat dengan listing bersepah, lead hilang dalam WhatsApp, dan
            follow-up yang terlepas. Bila ia berjaya susun kerja kami, saya
            sedar setiap REN individu pun perlukan senjata yang sama. Itulah
            RENFlow Plus.
          </p>
          <p className="mt-6 text-sm text-on-dark-muted">
            Azlan Zakaria · Pembina RENFlow Plus (dari pengalaman membina
            sistem hartanah internal sebelum ini)
          </p>
        </Reveal>
      </div>
    </section>
  );
}
