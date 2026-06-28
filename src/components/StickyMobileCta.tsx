import WhatsAppCta from "@/components/WhatsAppCta";

export default function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 p-3 backdrop-blur-md md:hidden">
      <WhatsAppCta
        source="sticky_mobile"
        className="flex items-center justify-center gap-2 rounded-full bg-emerald px-4 py-3 text-sm font-semibold text-on-dark shadow-lg shadow-emerald/30"
      >
        WhatsApp · Minta Demo
      </WhatsAppCta>
    </div>
  );
}
