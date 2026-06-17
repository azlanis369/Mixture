import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateMY } from "@/lib/date";
import { ADMIN_ROLES, MANAGER_ROLES, LEAVE_TYPES, LEAVE_STATUS } from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState, Button } from "@/components/ui";
import { LeaveForm } from "@/components/leave-form";
import { reviewLeaveAction } from "@/lib/actions/leave";

function statusTone(s: string) {
  return s === "APPROVED" ? "green" : s === "REJECTED" ? "red" : "amber";
}

export default async function LeavePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const isManager = MANAGER_ROLES.includes(user.role);
  const isAdmin = ADMIN_ROLES.includes(user.role);

  const myLeaves = await prisma.leaveRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { approver: true },
  });

  const pending = isManager
    ? await prisma.leaveRequest.findMany({
        where: {
          status: "PENDING",
          user: isAdmin ? {} : { branchId: user.branchId },
          NOT: { userId: user.id },
        },
        include: { user: { include: { branch: true } } },
        orderBy: { createdAt: "asc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pengurusan Cuti</h1>
          <p className="text-sm text-slate-500">
            Mohon cuti awal, kecemasan & lain-lain.
          </p>
        </div>
      </div>

      <Card className="p-5">
        <LeaveForm />
      </Card>

      {isManager && (
        <Card className="p-4">
          <SectionTitle
            title="Permohonan Perlu Kelulusan"
            subtitle={isAdmin ? "Semua cawangan" : "Cawangan anda"}
          />
          {pending.length === 0 ? (
            <EmptyState text="Tiada permohonan tertunda." />
          ) : (
            <div className="space-y-3">
              {pending.map((l) => (
                <div key={l.id} className="p-3 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{l.user.name}</div>
                      <div className="text-xs text-slate-400">
                        {l.user.branch?.name} • {l.user.position}
                      </div>
                    </div>
                    <Badge tone="blue">{LEAVE_TYPES[l.type]}</Badge>
                  </div>
                  <div className="text-sm text-slate-600">
                    {formatDateMY(l.startDate)}
                    {l.endDate !== l.startDate && ` – ${formatDateMY(l.endDate)}`}
                    {l.startTime && ` • Keluar ${l.startTime}`}
                  </div>
                  <div className="text-sm text-slate-500 mt-1 italic">“{l.reason}”</div>
                  <div className="flex gap-2 mt-3">
                    <form action={reviewLeaveAction}>
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="decision" value="APPROVED" />
                      <Button type="submit" className="!py-1.5 !px-3">Luluskan</Button>
                    </form>
                    <form action={reviewLeaveAction}>
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="decision" value="REJECTED" />
                      <Button type="submit" variant="danger" className="!py-1.5 !px-3">Tolak</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card className="p-4">
        <SectionTitle title="Permohonan Saya" />
        {myLeaves.length === 0 ? (
          <EmptyState text="Belum ada permohonan cuti." />
        ) : (
          <div className="space-y-2">
            {myLeaves.map((l) => (
              <div key={l.id} className="flex items-start justify-between gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-700">
                    {LEAVE_TYPES[l.type]}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDateMY(l.startDate)}
                    {l.endDate !== l.startDate && ` – ${formatDateMY(l.endDate)}`}
                    {l.startTime && ` • ${l.startTime}`}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 italic truncate">“{l.reason}”</div>
                </div>
                <Badge tone={statusTone(l.status)}>{LEAVE_STATUS[l.status]}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
