import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateMY } from "@/lib/date";
import { ADMIN_ROLES, MANAGER_ROLES, OT_STATUS } from "@/lib/constants";
import { overtimeRateHourly } from "@/lib/payroll";
import { Card, SectionTitle, Badge, EmptyState, Button } from "@/components/ui";
import { OvertimeForm } from "@/components/overtime-form";
import { reviewOvertimeAction } from "@/lib/actions/overtime";

function statusTone(s: string) {
  return s === "APPROVED" ? "green" : s === "REJECTED" ? "red" : "amber";
}

export default async function OvertimePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const isManager = MANAGER_ROLES.includes(user.role);
  const isAdmin = ADMIN_ROLES.includes(user.role);

  const mine = await prisma.overtime.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const pending = isManager
    ? await prisma.overtime.findMany({
        where: {
          status: "PENDING",
          user: isAdmin ? {} : { branchId: user.branchId },
          NOT: { userId: user.id },
        },
        include: { user: { include: { branch: true } } },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const myHourly = overtimeRateHourly(user.basicSalary);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Lebih Masa (Overtime)</h1>
        <p className="text-sm text-slate-500">
          Mohon & pantau kerja lebih masa. Bayaran dikira automatik dalam slip gaji.
        </p>
      </div>

      <Card className="p-5">
        <OvertimeForm />
        {user.basicSalary > 0 && (
          <p className="text-xs text-slate-400 mt-3">
            Anggaran kadar sejam anda: RM {myHourly.toFixed(2)} (gaji asas ÷ 26 ÷ 8).
          </p>
        )}
      </Card>

      {isManager && (
        <Card className="p-4">
          <SectionTitle title="Permohonan Perlu Kelulusan" subtitle={isAdmin ? "Semua cawangan" : "Cawangan anda"} />
          {pending.length === 0 ? (
            <EmptyState text="Tiada permohonan tertunda." />
          ) : (
            <div className="space-y-3">
              {pending.map((o) => (
                <div key={o.id} className="p-3 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{o.user.name}</div>
                      <div className="text-xs text-slate-400">
                        {o.user.branch?.code} • {formatDateMY(o.date)} • {o.hours} jam × {o.rate}
                      </div>
                      <div className="text-sm text-slate-500 mt-1 italic">“{o.reason}”</div>
                    </div>
                    <Badge tone="amber">{o.hours * o.rate} unit-jam</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {["APPROVED", "REJECTED"].map((d) => (
                      <form key={d} action={reviewOvertimeAction}>
                        <input type="hidden" name="id" value={o.id} />
                        <input type="hidden" name="decision" value={d} />
                        <Button type="submit" variant={d === "APPROVED" ? "primary" : "danger"} className="!py-1.5 !px-3">
                          {d === "APPROVED" ? "Luluskan" : "Tolak"}
                        </Button>
                      </form>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card className="p-4">
        <SectionTitle title="Lebih Masa Saya" />
        {mine.length === 0 ? (
          <EmptyState text="Belum ada permohonan lebih masa." />
        ) : (
          <div className="space-y-2">
            {mine.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-slate-700">{formatDateMY(o.date)}</div>
                  <div className="text-xs text-slate-400">{o.hours} jam × {o.rate} • {o.reason}</div>
                </div>
                <Badge tone={statusTone(o.status)}>{OT_STATUS[o.status]}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
