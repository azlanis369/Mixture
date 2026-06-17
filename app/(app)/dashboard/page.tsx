import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayMY, formatTimeMY } from "@/lib/date";
import {
  ADMIN_ROLES,
  MANAGER_ROLES,
  ROLE_LABEL,
  PROSPECT_STATUS,
  LEAVE_TYPES,
} from "@/lib/constants";
import { Card, StatCard, SectionTitle, Badge, EmptyState } from "@/components/ui";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const today = todayMY();
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const isManager = MANAGER_ROLES.includes(user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Selamat datang, {user.name.replace(/\(.*?\)/g, "").trim()} 👋
        </h1>
        <p className="text-sm text-slate-500">
          {ROLE_LABEL[user.role]}
          {user.branch ? ` • ${user.branch.name}` : ""} •{" "}
          {new Date().toLocaleDateString("ms-MY", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {isAdmin ? (
        <AdminDashboard today={today} />
      ) : isManager ? (
        <ManagerDashboard branchId={user.branchId!} today={today} />
      ) : (
        <StaffDashboard userId={user.id} today={today} />
      )}
    </div>
  );
}

/* ---------------- Admin (HQ) ---------------- */
async function AdminDashboard({ today }: { today: string }) {
  const [branches, staffCount, presentToday, onLeave, pendingLeaves, prospects, openTasks] =
    await Promise.all([
      prisma.branch.findMany({ orderBy: { isHQ: "desc" } }),
      prisma.user.count({ where: { active: true } }),
      prisma.attendance.count({ where: { date: today, clockInAt: { not: null } } }),
      prisma.leaveRequest.count({
        where: { status: "APPROVED", startDate: { lte: today }, endDate: { gte: today } },
      }),
      prisma.leaveRequest.count({ where: { status: "PENDING" } }),
      prisma.prospect.groupBy({ by: ["status"], _count: true }),
      prisma.task.count({ where: { status: { not: "DONE" } } }),
    ]);

  const prospectMap: Record<string, number> = {};
  prospects.forEach((p) => (prospectMap[p.status] = p._count));
  const enrolled = prospectMap["ENROLLED"] || 0;
  const totalProspects = prospects.reduce((s, p) => s + p._count, 0);

  // Statistik murid & yuran bulan ini
  const month = today.slice(0, 7);
  const [studentCount, invoiceAgg] = await Promise.all([
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.invoice.aggregate({
      where: { month },
      _sum: { amount: true, paidAmount: true },
    }),
  ]);
  const billed = invoiceAgg._sum.amount ?? 0;
  const collected = invoiceAgg._sum.paidAmount ?? 0;
  const outstanding = billed - collected;

  // Kehadiran per cawangan
  const perBranch = await Promise.all(
    branches.map(async (b) => {
      const total = await prisma.user.count({ where: { branchId: b.id, active: true } });
      const present = await prisma.attendance.count({
        where: { branchId: b.id, date: today, clockInAt: { not: null } },
      });
      const open = await prisma.task.count({
        where: { branchId: b.id, status: { not: "DONE" } },
      });
      const leads = await prisma.prospect.count({
        where: { branchId: b.id, status: { notIn: ["ENROLLED", "LOST"] } },
      });
      return { b, total, present, open, leads };
    })
  );

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Cawangan" value={branches.length} hint="1 HQ + cawangan" tone="indigo" href="/branches" />
        <StatCard label="Jumlah Pekerja" value={staffCount} tone="blue" href="/staff" />
        <StatCard label="Hadir Hari Ini" value={presentToday} hint={`${onLeave} bercuti`} tone="green" href="/attendance" />
        <StatCard label="Cuti Menunggu" value={pendingLeaves} hint="perlu kelulusan" tone="amber" href="/leave" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Murid Aktif" value={studentCount} tone="indigo" href="/students" />
        <StatCard label="Yuran Dikutip" value={`RM ${collected.toFixed(0)}`} hint={`bulan ${month}`} tone="green" href="/fees" />
        <StatCard label="Yuran Tertunggak" value={`RM ${outstanding.toFixed(0)}`} hint="belum dijelaskan" tone="red" href="/fees" />
        <StatCard label="Tugas Aktif" value={openTasks} tone="amber" href="/tasks" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Jumlah Prospek" value={totalProspects} tone="purple" href="/prospects" />
        <StatCard label="Berdaftar" value={enrolled} hint="prospek berjaya" tone="green" href="/prospects" />
        <StatCard label="Dalam Proses" value={(prospectMap["CONTACTED"] || 0) + (prospectMap["VISIT"] || 0) + (prospectMap["NEW"] || 0)} tone="amber" href="/prospects" />
        <StatCard label="Cuti Menunggu" value={pendingLeaves} hint="perlu kelulusan" tone="blue" href="/leave" />
      </div>

      <Card className="p-4">
        <SectionTitle
          title="Pemantauan Cawangan"
          subtitle="Kehadiran, tugas & prospek setiap cawangan hari ini"
        />
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="py-2 font-medium">Cawangan</th>
                <th className="py-2 font-medium text-center">Hadir</th>
                <th className="py-2 font-medium text-center">Tugas Aktif</th>
                <th className="py-2 font-medium text-center">Prospek</th>
              </tr>
            </thead>
            <tbody>
              {perBranch.map(({ b, total, present, open, leads }) => (
                <tr key={b.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5">
                    <div className="font-medium text-slate-700">{b.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {b.isHQ ? "Ibu Pejabat" : b.code}
                    </div>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={present >= total && total > 0 ? "text-emerald-600 font-medium" : "text-slate-700"}>
                      {present}/{total}
                    </span>
                  </td>
                  <td className="py-2.5 text-center text-slate-700">{open}</td>
                  <td className="py-2.5 text-center text-slate-700">{leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ProspectFunnel map={prospectMap} />
    </>
  );
}

function ProspectFunnel({ map }: { map: Record<string, number> }) {
  const order = ["NEW", "CONTACTED", "VISIT", "ENROLLED", "LOST"];
  const tones: Record<string, string> = {
    NEW: "bg-slate-400",
    CONTACTED: "bg-sky-400",
    VISIT: "bg-amber-400",
    ENROLLED: "bg-emerald-500",
    LOST: "bg-rose-400",
  };
  const max = Math.max(1, ...order.map((s) => map[s] || 0));
  return (
    <Card className="p-4">
      <SectionTitle title="Corong Prospek Ibu Bapa" subtitle="Status keseluruhan lead" />
      <div className="space-y-3">
        {order.map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className="w-24 text-sm text-slate-600">{PROSPECT_STATUS[s]}</div>
            <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
              <div
                className={`h-full ${tones[s]} rounded-full transition-all`}
                style={{ width: `${((map[s] || 0) / max) * 100}%` }}
              />
            </div>
            <div className="w-8 text-right text-sm font-medium text-slate-700">
              {map[s] || 0}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------------- Manager (Ketua Cawangan) ---------------- */
async function ManagerDashboard({ branchId, today }: { branchId: string; today: string }) {
  const month = today.slice(0, 7);
  const [staff, present, pendingLeaves, prospects, tasks, students, invoiceAgg] = await Promise.all([
    prisma.user.count({ where: { branchId, active: true } }),
    prisma.attendance.count({ where: { branchId, date: today, clockInAt: { not: null } } }),
    prisma.leaveRequest.findMany({
      where: { status: "PENDING", user: { branchId } },
      include: { user: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.prospect.count({ where: { branchId, status: { notIn: ["ENROLLED", "LOST"] } } }),
    prisma.task.findMany({
      where: { branchId, status: { not: "DONE" } },
      take: 5,
      orderBy: { dueDate: "asc" },
    }),
    prisma.student.count({ where: { branchId, status: "ACTIVE" } }),
    prisma.invoice.aggregate({ where: { branchId, month }, _sum: { amount: true, paidAmount: true } }),
  ]);
  const outstanding = (invoiceAgg._sum.amount ?? 0) - (invoiceAgg._sum.paidAmount ?? 0);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Murid Aktif" value={students} tone="indigo" href="/students" />
        <StatCard label="Yuran Tertunggak" value={`RM ${outstanding.toFixed(0)}`} hint="bulan ini" tone="red" href="/fees" />
        <StatCard label="Hadir Hari Ini" value={`${present}/${staff}`} tone="green" href="/attendance" />
        <StatCard label="Prospek Aktif" value={prospects} tone="purple" href="/prospects" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <SectionTitle title="Cuti Perlu Diluluskan" action={<Link href="/leave" className="text-sm text-indigo-600">Lihat semua</Link>} />
          {pendingLeaves.length === 0 ? (
            <EmptyState text="Tiada permohonan cuti tertunda." />
          ) : (
            <div className="space-y-2">
              {pendingLeaves.map((l) => (
                <div key={l.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{l.user.name}</div>
                    <div className="text-xs text-slate-400">{LEAVE_TYPES[l.type]} • {l.startDate}</div>
                  </div>
                  <Badge tone="amber">Menunggu</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <SectionTitle title="Tugas Akan Datang" action={<Link href="/tasks" className="text-sm text-indigo-600">Lihat semua</Link>} />
          {tasks.length === 0 ? (
            <EmptyState text="Tiada tugas aktif." />
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">{t.title}</div>
                    <div className="text-xs text-slate-400">Tarikh akhir: {t.dueDate || "-"}</div>
                  </div>
                  <Badge tone={t.priority === "HIGH" ? "red" : "slate"}>
                    {t.priority === "HIGH" ? "Penting" : "Biasa"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

/* ---------------- Staff (Pekerja) ---------------- */
async function StaffDashboard({ userId, today }: { userId: string; today: string }) {
  const [attendance, myLeaves, myTasks, announcements] = await Promise.all([
    prisma.attendance.findUnique({ where: { userId_date: { userId, date: today } } }),
    prisma.leaveRequest.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.task.findMany({ where: { assigneeId: userId, status: { not: "DONE" } }, take: 5, orderBy: { dueDate: "asc" } }),
    prisma.announcement.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], take: 3 }),
  ]);

  const clockedIn = !!attendance?.clockInAt;
  const clockedOut = !!attendance?.clockOutAt;

  return (
    <>
      <Card className="p-5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-indigo-100 text-sm">Status Kehadiran Hari Ini</div>
            <div className="text-2xl font-bold mt-1">
              {clockedOut ? "Sudah Pulang" : clockedIn ? "Sedang Bertugas" : "Belum Daftar Masuk"}
            </div>
            <div className="text-indigo-100 text-sm mt-1">
              {clockedIn && `Masuk: ${formatTimeMY(attendance!.clockInAt)}`}
              {clockedOut && ` • Keluar: ${formatTimeMY(attendance!.clockOutAt)}`}
            </div>
          </div>
          <Link
            href="/attendance"
            className="bg-white text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50"
          >
            {clockedIn ? "Punch" : "Daftar Masuk"}
          </Link>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <SectionTitle title="Tugas Saya" action={<Link href="/tasks" className="text-sm text-indigo-600">Lihat semua</Link>} />
          {myTasks.length === 0 ? (
            <EmptyState text="Tiada tugas aktif. Syabas!" />
          ) : (
            <div className="space-y-2">
              {myTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="text-sm font-medium text-slate-700">{t.title}</div>
                  <Badge tone={t.status === "IN_PROGRESS" ? "blue" : "slate"}>
                    {t.status === "IN_PROGRESS" ? "Sedang" : "Belum"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <SectionTitle title="Cuti Terkini" action={<Link href="/leave" className="text-sm text-indigo-600">Mohon cuti</Link>} />
          {myLeaves.length === 0 ? (
            <EmptyState text="Belum ada permohonan cuti." />
          ) : (
            <div className="space-y-2">
              {myLeaves.map((l) => (
                <div key={l.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{LEAVE_TYPES[l.type]}</div>
                    <div className="text-xs text-slate-400">{l.startDate}</div>
                  </div>
                  <Badge tone={l.status === "APPROVED" ? "green" : l.status === "REJECTED" ? "red" : "amber"}>
                    {l.status === "APPROVED" ? "Lulus" : l.status === "REJECTED" ? "Tolak" : "Menunggu"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <SectionTitle title="Pengumuman Terkini" action={<Link href="/announcements" className="text-sm text-indigo-600">Lihat semua</Link>} />
        {announcements.length === 0 ? (
          <EmptyState text="Tiada pengumuman." />
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="border-l-2 border-indigo-300 pl-3">
                <div className="text-sm font-medium text-slate-700">{a.title}</div>
                <div className="text-xs text-slate-500 line-clamp-2">{a.body}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
