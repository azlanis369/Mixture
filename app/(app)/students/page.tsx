import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateMY } from "@/lib/date";
import { ADMIN_ROLES, MANAGER_ROLES, STUDENT_STATUS, GENDER_LABEL } from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState, Button, StatCard } from "@/components/ui";
import { StudentForm } from "@/components/student-form";
import { updateStudentStatusAction } from "@/lib/actions/student";

function statusTone(s: string) {
  return s === "ACTIVE" ? "green" : s === "GRADUATED" ? "blue" : "slate";
}

function initials(name: string) {
  return name.replace(/bin\/binti.*/i, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default async function StudentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!MANAGER_ROLES.includes(user.role)) redirect("/dashboard");
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const scope = isAdmin ? {} : { branchId: user.branchId };

  const [students, branches, classes] = await Promise.all([
    prisma.student.findMany({
      where: scope,
      include: { branch: true, classRoom: true },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    }),
    prisma.branch.findMany({ where: { isHQ: false }, orderBy: { name: "asc" } }),
    prisma.classRoom.findMany({ where: scope, orderBy: { name: "asc" } }),
  ]);

  const active = students.filter((s) => s.status === "ACTIVE");
  const monthlyRevenue = active.reduce((sum, s) => sum + s.monthlyFee, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Pengurusan Murid</h1>
        <p className="text-sm text-slate-500">
          Pendaftaran murid, kelas & maklumat ibu bapa.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Murid Aktif" value={active.length} tone="green" />
        <StatCard label="Jumlah Kelas" value={classes.length} tone="indigo" />
        <StatCard label="Potensi Yuran/Bulan" value={`RM ${monthlyRevenue.toFixed(0)}`} tone="purple" />
      </div>

      <Card className="p-5">
        <StudentForm isAdmin={isAdmin} branches={branches} classes={classes} />
      </Card>

      <Card className="p-4">
        <SectionTitle title="Senarai Murid" subtitle={`${students.length} murid`} />
        {students.length === 0 ? (
          <EmptyState text="Belum ada murid berdaftar." />
        ) : (
          <div className="space-y-2">
            {students.map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {initials(s.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-700 truncate">{s.name}</div>
                  <div className="text-xs text-slate-400">
                    {s.classRoom?.name ?? "Tiada kelas"}
                    {s.gender ? ` • ${GENDER_LABEL[s.gender]}` : ""}
                    {isAdmin ? ` • ${s.branch?.code}` : ""} • Daftar {formatDateMY(s.enrollmentDate)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Ibu bapa: {s.parentName} ({s.parentPhone})
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-slate-700">RM {s.monthlyFee.toFixed(0)}<span className="text-[11px] font-normal text-slate-400">/bln</span></div>
                  <Badge tone={statusTone(s.status)}>{STUDENT_STATUS[s.status]}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
