import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayMY, formatDateMY } from "@/lib/date";
import { ADMIN_ROLES, STUDENT_ATT_STATUS } from "@/lib/constants";
import { Card, SectionTitle, EmptyState, StatCard } from "@/components/ui";
import { StudentAttendanceMarker } from "@/components/student-attendance-marker";

export default async function StudentAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; classId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const sp = await searchParams;
  const date = sp.date || todayMY();
  const classId = sp.classId || "";

  const scope = isAdmin ? {} : { branchId: user.branchId };
  const [classes, students] = await Promise.all([
    prisma.classRoom.findMany({ where: scope, orderBy: { name: "asc" } }),
    prisma.student.findMany({
      where: { status: "ACTIVE", ...scope, ...(classId ? { classId } : {}) },
      include: { classRoom: true, attendances: { where: { date } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const rows = students.map((s) => ({
    id: s.id,
    name: s.name,
    className: s.classRoom?.name ?? null,
    parentName: s.parentName,
    parentPhone: s.parentPhone,
    status: s.attendances[0]?.status ?? null,
  }));

  const marked = rows.filter((r) => r.status).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Kehadiran Murid</h1>
        <p className="text-sm text-slate-500">
          Tanda kehadiran harian & maklumkan ibu bapa anak selamat sampai.
        </p>
      </div>

      <Card className="p-4">
        <form className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tarikh</label>
            <input type="date" name="date" defaultValue={date} className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Kelas</label>
            <select name="classId" defaultValue={classId} className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
              <option value="">Semua kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
            Papar
          </button>
        </form>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Jumlah Murid" value={rows.length} tone="indigo" />
        <StatCard label="Sudah Ditanda" value={marked} tone="green" />
        <StatCard label="Tarikh" value={formatDateMY(date)} tone="blue" />
      </div>

      <Card className="p-4">
        <SectionTitle title="Senarai Kehadiran" subtitle={isAdmin ? "Semua cawangan" : "Cawangan anda"} />
        {rows.length === 0 ? (
          <EmptyState text="Tiada murid aktif untuk ditanda. Daftar murid dahulu." />
        ) : (
          <StudentAttendanceMarker date={date} rows={rows} />
        )}
      </Card>
    </div>
  );
}
