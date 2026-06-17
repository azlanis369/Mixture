import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayMY, formatTimeMY, formatDateMY } from "@/lib/date";
import { ADMIN_ROLES, MANAGER_ROLES } from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState } from "@/components/ui";
import { PunchCard } from "@/components/punch-card";

export default async function AttendancePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const today = todayMY();
  const isManager = MANAGER_ROLES.includes(user.role);
  const isAdmin = ADMIN_ROLES.includes(user.role);

  const myToday = await prisma.attendance.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  const myHistory = await prisma.attendance.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 7,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Kehadiran</h1>
        <p className="text-sm text-slate-500">
          Sistem punch card dengan pengesahan lokasi & gambar.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionTitle title="Punch Card Saya" subtitle={formatDateMY(new Date())} />
          <PunchCard
            clockedIn={!!myToday?.clockInAt}
            clockedOut={!!myToday?.clockOutAt}
          />
        </Card>

        <Card className="p-5">
          <SectionTitle title="Sejarah Kehadiran Saya" subtitle="7 hari terakhir" />
          {myHistory.length === 0 ? (
            <EmptyState text="Belum ada rekod kehadiran." />
          ) : (
            <div className="space-y-2">
              {myHistory.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="text-sm font-medium text-slate-700">
                    {formatDateMY(a.date)}
                  </div>
                  <div className="text-sm text-slate-500 tabular-nums">
                    {formatTimeMY(a.clockInAt)} → {formatTimeMY(a.clockOutAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {isManager && <TeamAttendance branchId={isAdmin ? null : user.branchId} today={today} />}
    </div>
  );
}

async function TeamAttendance({
  branchId,
  today,
}: {
  branchId: string | null;
  today: string;
}) {
  const staff = await prisma.user.findMany({
    where: { active: true, ...(branchId ? { branchId } : {}) },
    include: {
      branch: true,
      attendances: { where: { date: today } },
    },
    orderBy: [{ branchId: "asc" }, { name: "asc" }],
  });

  const present = staff.filter((s) => s.attendances[0]?.clockInAt).length;

  return (
    <Card className="p-4">
      <SectionTitle
        title="Pemantauan Kehadiran Pasukan"
        subtitle={`Hari ini • ${present}/${staff.length} sudah daftar masuk`}
      />
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 font-medium">Pekerja</th>
              {!branchId && <th className="py-2 font-medium">Cawangan</th>}
              <th className="py-2 font-medium">Masuk</th>
              <th className="py-2 font-medium">Keluar</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Bukti</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => {
              const att = s.attendances[0];
              const status = att?.clockOutAt
                ? { label: "Pulang", tone: "slate" as const }
                : att?.clockInAt
                ? { label: "Bertugas", tone: "green" as const }
                : { label: "Belum Masuk", tone: "red" as const };
              return (
                <tr key={s.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5">
                    <div className="font-medium text-slate-700">{s.name}</div>
                    <div className="text-[11px] text-slate-400">{s.position}</div>
                  </td>
                  {!branchId && (
                    <td className="py-2.5 text-slate-500">{s.branch?.code}</td>
                  )}
                  <td className="py-2.5 tabular-nums text-slate-600">{formatTimeMY(att?.clockInAt)}</td>
                  <td className="py-2.5 tabular-nums text-slate-600">{formatTimeMY(att?.clockOutAt)}</td>
                  <td className="py-2.5"><Badge tone={status.tone}>{status.label}</Badge></td>
                  <td className="py-2.5">
                    {att?.clockInPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={att.clockInPhoto} alt="bukti" className="w-9 h-9 rounded-lg object-cover" />
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
