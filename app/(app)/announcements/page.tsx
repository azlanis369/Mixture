import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTimeMY } from "@/lib/date";
import { MANAGER_ROLES, CHANNEL_LABEL, ANNOUNCE_CATEGORY } from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState } from "@/components/ui";
import { AnnouncementForm } from "@/components/announcement-form";
import { ADMIN_ROLES } from "@/lib/constants";
import { Icon } from "@/components/icons";

function channelTone(c: string) {
  return c === "TELEGRAM" ? "blue" : c === "WHATSAPP" ? "green" : "slate";
}

export default async function AnnouncementsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const isManager = MANAGER_ROLES.includes(user.role);
  const isAdmin = ADMIN_ROLES.includes(user.role);

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [{ branchId: null }, { branchId: user.branchId }],
    },
    include: { author: true, branch: true },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Pengumuman & Notis</h1>
        <p className="text-sm text-slate-500">
          Program, mesyuarat & latihan dihebahkan melalui Telegram (utama) dan WhatsApp (umum).
        </p>
      </div>

      {isManager && (
        <Card className="p-5">
          <AnnouncementForm canBroadcast={isAdmin} />
        </Card>
      )}

      {announcements.length === 0 ? (
        <Card className="p-4">
          <EmptyState text="Tiada pengumuman buat masa ini." />
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const shareWa = `https://wa.me/?text=${encodeURIComponent(`*${a.title}*\n\n${a.body}`)}`;
            const shareTg = `https://t.me/share/url?url=${encodeURIComponent("https://mixture.my")}&text=${encodeURIComponent(`${a.title}\n\n${a.body}`)}`;
            return (
              <Card key={a.id} className={`p-4 ${a.pinned ? "ring-1 ring-indigo-200" : ""}`}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    {a.pinned && <Icon.pin className="w-4 h-4 text-indigo-500" />}
                    <h3 className="font-semibold text-slate-800">{a.title}</h3>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Badge tone={channelTone(a.channel)}>{CHANNEL_LABEL[a.channel]}</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-line">{a.body}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                  <div className="text-[11px] text-slate-400">
                    {ANNOUNCE_CATEGORY[a.category]} • {a.author?.name?.replace(/\(.*?\)/g, "").trim() ?? "Sistem"}
                    {a.branch ? ` • ${a.branch.code}` : " • Semua"} • {formatDateTimeMY(a.createdAt)}
                  </div>
                  <div className="flex gap-1.5">
                    <a href={shareTg} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 text-sky-600 hover:bg-sky-100">
                      <Icon.telegram className="w-3.5 h-3.5" /> Telegram
                    </a>
                    <a href={shareWa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                      <Icon.whatsapp className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
