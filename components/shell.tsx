"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icons";
import { ROLE_LABEL, ADMIN_ROLES, MANAGER_ROLES } from "@/lib/constants";
import { logoutAction } from "@/lib/actions/auth";

type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof Icon;
  roles?: string[];
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/students", label: "Murid", icon: "student", roles: MANAGER_ROLES },
  { href: "/fees", label: "Yuran", icon: "money", roles: MANAGER_ROLES },
  { href: "/attendance", label: "Kehadiran", icon: "clock" },
  { href: "/leave", label: "Cuti", icon: "calendar" },
  { href: "/claims", label: "Tuntutan", icon: "receipt" },
  { href: "/overtime", label: "Lebih Masa", icon: "timer" },
  { href: "/payroll", label: "Gaji", icon: "wallet" },
  { href: "/tasks", label: "Tugas", icon: "task" },
  { href: "/prospects", label: "Prospek", icon: "target", roles: MANAGER_ROLES },
  { href: "/announcements", label: "Pengumuman", icon: "megaphone" },
  { href: "/staff", label: "Pekerja", icon: "users", roles: MANAGER_ROLES },
  { href: "/branches", label: "Cawangan", icon: "building", roles: ADMIN_ROLES },
];

export function Shell({
  user,
  children,
}: {
  user: { name: string; role: string; branchName: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = NAV.filter((n) => !n.roles || n.roles.includes(user.role));
  const initials = user.name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 fixed inset-y-0">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            M
          </div>
          <div>
            <div className="font-bold text-slate-800 leading-tight">Mixture</div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Pengurusan Tadika
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((n) => {
            const I = Icon[n.icon];
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <I className="w-5 h-5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <UserBox name={user.name} role={user.role} branch={user.branchName} initials={initials} />
      </aside>

      {/* Kandungan utama */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Topbar mobile */}
        <header className="lg:hidden h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              M
            </div>
            <span className="font-bold text-slate-800">Mixture</span>
          </div>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold"
          >
            {initials}
          </button>
        </header>

        {menuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-medium text-slate-800">{user.name}</div>
            <div className="text-xs text-slate-500 mb-3">
              {ROLE_LABEL[user.role]} {user.branchName ? `• ${user.branchName}` : ""}
            </div>
            <form action={logoutAction}>
              <button className="flex items-center gap-2 text-sm text-rose-600 font-medium">
                <Icon.logout className="w-4 h-4" /> Log Keluar
              </button>
            </form>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-20">
        <div className="flex overflow-x-auto no-scrollbar">
          {items.map((n) => {
            const I = Icon[n.icon];
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex-1 min-w-[64px] flex flex-col items-center gap-1 py-2 text-[10px] font-medium ${
                  active ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                <I className="w-5 h-5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function UserBox({
  name,
  role,
  branch,
  initials,
}: {
  name: string;
  role: string;
  branch: string | null;
  initials: string;
}) {
  return (
    <div className="border-t border-slate-100 p-3">
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-slate-800 truncate">{name}</div>
          <div className="text-[11px] text-slate-400 truncate">
            {ROLE_LABEL[role]}
            {branch ? ` • ${branch}` : ""}
          </div>
        </div>
      </div>
      <form action={logoutAction}>
        <button className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
          <Icon.logout className="w-4 h-4" /> Log Keluar
        </button>
      </form>
    </div>
  );
}
