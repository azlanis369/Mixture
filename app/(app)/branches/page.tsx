import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_ROLES } from "@/lib/constants";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";

export default async function BranchesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!ADMIN_ROLES.includes(user.role)) redirect("/dashboard");

  const branches = await prisma.branch.findMany({
    orderBy: { isHQ: "desc" },
    include: {
      _count: { select: { users: true, prospects: true } },
      users: { where: { role: "HEAD_OF_BRANCH" }, take: 1 },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Cawangan</h1>
        <p className="text-sm text-slate-500">
          {branches.length} lokasi di sekitar Kuala Lumpur & Selangor.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((b) => (
          <Card key={b.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icon.building className="w-5 h-5" />
              </div>
              {b.isHQ ? <Badge tone="indigo">HQ</Badge> : <Badge tone="slate">{b.code}</Badge>}
            </div>
            <h3 className="font-semibold text-slate-800">{b.name}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
              <Icon.pin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              {b.address}
            </p>
            {b.users[0] && (
              <p className="text-xs text-slate-500 mt-2">
                Ketua: <span className="font-medium text-slate-700">{b.users[0].name}</span>
              </p>
            )}
            <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100 text-sm">
              <div>
                <div className="font-bold text-slate-800">{b._count.users}</div>
                <div className="text-[11px] text-slate-400">Pekerja</div>
              </div>
              <div>
                <div className="font-bold text-slate-800">{b._count.prospects}</div>
                <div className="text-[11px] text-slate-400">Prospek</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
