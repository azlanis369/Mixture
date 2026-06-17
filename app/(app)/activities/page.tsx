import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateMY } from "@/lib/date";
import { ADMIN_ROLES } from "@/lib/constants";
import { Card, SectionTitle, EmptyState, Button } from "@/components/ui";
import { ActivityForm } from "@/components/activity-form";
import { deleteActivityAction } from "@/lib/actions/activity";

export default async function ActivitiesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const scope = isAdmin ? {} : { branchId: user.branchId };

  const [activities, classes] = await Promise.all([
    prisma.activity.findMany({
      where: scope,
      include: { classRoom: true, branch: true },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
    prisma.classRoom.findMany({ where: scope, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Galeri Aktiviti Murid</h1>
        <p className="text-sm text-slate-500">
          Kongsi aktiviti harian — ibu bapa dapat melihat perkembangan anak melalui portal mereka.
        </p>
      </div>

      <Card className="p-5">
        <ActivityForm classes={classes} />
      </Card>

      <SectionTitle title="Aktiviti Terkini" subtitle={isAdmin ? "Semua cawangan" : "Cawangan anda"} />
      {activities.length === 0 ? (
        <Card className="p-4"><EmptyState text="Belum ada aktiviti dikongsi." /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((a) => (
            <Card key={a.id} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.photo} alt={a.title} className="w-full h-44 object-cover bg-slate-100" />
              <div className="p-4">
                <div className="text-sm font-semibold text-slate-800">{a.title}</div>
                {a.caption && <p className="text-xs text-slate-500 mt-1">{a.caption}</p>}
                <div className="flex items-center justify-between mt-2">
                  <div className="text-[11px] text-slate-400">
                    {a.classRoom?.name ?? "Umum"}
                    {isAdmin ? ` • ${a.branch?.code}` : ""} • {formatDateMY(a.date)}
                  </div>
                  {(a.authorId === user.id || isAdmin) && (
                    <form action={deleteActivityAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <Button type="submit" variant="ghost" className="!py-1 !px-2 !text-xs !text-rose-600">
                        Padam
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
