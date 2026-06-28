import Link from "next/link";
import WhatsAppCta from "@/components/WhatsAppCta";

const links = [
  { href: "#preview", label: "Preview" },
  { href: "#app-hub", label: "Modules" },
  { href: "#pricing", label: "Price" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="#hero" className="font-display text-lg font-bold tracking-tight text-on-dark">
          RENFlow<span className="text-emerald-soft">+</span>
        </Link>
        <ul className="hidden items-center gap-6 text-sm text-on-dark-muted md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-on-dark">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <WhatsAppCta
          source="nav"
          className="rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-on-dark transition-colors hover:bg-emerald-soft"
        >
          Minta Demo
        </WhatsAppCta>
      </nav>
    </header>
  );
}
