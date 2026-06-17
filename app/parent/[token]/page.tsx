import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { todayMY, formatDateMY } from "@/lib/date";
import {
  STUDENT_ATT_STATUS,
  INVOICE_STATUS,
  GENDER_LABEL,
} from "@/lib/constants";

function rm(n: number) {
  return `RM ${n.toFixed(2)}`;
}

const ATT_TONE: Record<string, string> = {
  PRESENT: "bg-emerald-100 text-emerald-700",
  LATE: "bg-amber-100 text-amber-700",
  ABSENT: "bg-rose-100 text-rose-700",
  SICK: "bg-purple-100 text-purple-700",
  LEAVE: "bg-slate-100 text-slate-600",
};

export default async function ParentPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const student = await prisma.student.findUnique({
    where: { accessToken: token },
    include: { branch: true, classRoom: true },
  });
  if (!student) notFound();

  const month = todayMY().slice(0, 7);
  const [attendance, invoices, activities] = await Promise.all([
    prisma.studentAttendance.findMany({
      where: { studentId: student.id, date: { startsWith: month } },
      orderBy: { date: "desc" },
    }),
    prisma.invoice.findMany({
      where: { studentId: student.id },
      orderBy: { month: "desc" },
      take: 6,
    }),
    prisma.activity.findMany({
      where: student.classId
        ? { OR: [{ classId: student.classId }, { classId: null, branchId: student.branchId }] }
        : { branchId: student.branchId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const presentCount = attendance.filter((a) => ["PRESENT", "LATE"].includes(a.status)).length;
  const outstanding = invoices
    .filter((i) => i.status !== "PAID")
    .reduce((s, i) => s + (i.amount - i.paidAmount), 0);

  return (
    <div className="space-y-5">
      {/* Kad murid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
            {student.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">{student.name}</h1>
            <p className="text-sm text-slate-500">
              {student.classRoom?.name ?? "Belum ada kelas"}
              {student.gender ? ` • ${GENDER_LABEL[student.gender]}` : ""}
            </p>
            <p className="text-xs text-slate-400">{student.branch?.name}</p>
          </div>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Kehadiran Bulan Ini</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{presentCount}<span className="text-sm font-normal text-slate-400"> hari hadir</span></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Yuran Tertunggak</div>
          <div className={`text-2xl font-bold mt-1 ${outstanding > 0 ? "text-rose-600" : "text-emerald-600"}`}>{rm(outstanding)}</div>
        </div>
      </div>

      {/* Kehadiran terkini */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Kehadiran Terkini</h2>
        {attendance.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada rekod kehadiran bulan ini.</p>
        ) : (
          <div className="space-y-2">
            {attendance.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{formatDateMY(a.date)}{a.arrivedAt ? ` • ${a.arrivedAt}` : ""}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ATT_TONE[a.status]}`}>
                  {STUDENT_ATT_STATUS[a.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Yuran */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Penyata Yuran</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-slate-400">Tiada invois.</p>
        ) : (
          <div className="space-y-2">
            {invoices.map((i) => (
              <div key={i.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <div>
                  <div className="text-sm text-slate-700">{i.description}</div>
                  <div className="text-[11px] text-slate-400">{i.month}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">{rm(i.amount)}</div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${i.status === "PAID" ? "bg-emerald-100 text-emerald-700" : i.status === "PARTIAL" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                    {INVOICE_STATUS[i.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Aktiviti */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Aktiviti Terkini</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada aktiviti dikongsi.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {activities.map((a) => (
              <div key={a.id} className="rounded-xl overflow-hidden border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.photo} alt={a.title} className="w-full h-28 object-cover bg-slate-100" />
                <div className="p-2">
                  <div className="text-xs font-medium text-slate-700 truncate">{a.title}</div>
                  <div className="text-[10px] text-slate-400">{formatDateMY(a.date)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
