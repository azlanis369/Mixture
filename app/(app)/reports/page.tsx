import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayMY } from "@/lib/date";
import { ADMIN_ROLES, MANAGER_ROLES } from "@/lib/constants";
import { Card, SectionTitle, StatCard } from "@/components/ui";
import { ReportDownloads } from "@/components/report-downloads";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!MANAGER_ROLES.includes(user.role)) redirect("/dashboard");
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const month = todayMY().slice(0, 7);
  const branchScope = isAdmin ? {} : { branchId: user.branchId };

  const [feeAgg, studentAttCount, staffAttCount, payslipAgg] = await Promise.all([
    prisma.invoice.aggregate({ where: { month, ...branchScope }, _sum: { amount: true, paidAmount: true } }),
    prisma.studentAttendance.count({ where: { date: { startsWith: month }, ...branchScope } }),
    prisma.attendance.count({ where: { date: { startsWith: month }, ...branchScope } }),
    isAdmin
      ? prisma.payslip.aggregate({ where: { month }, _sum: { netPay: true } })
      : Promise.resolve({ _sum: { netPay: 0 } }),
  ]);

  const collected = feeAgg._sum.paidAmount ?? 0;
  const outstanding = (feeAgg._sum.amount ?? 0) - collected;
  const payrollTotal = payslipAgg._sum.netPay ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Laporan & Eksport</h1>
        <p className="text-sm text-slate-500">
          Muat turun data dalam format CSV untuk perakaunan & rekod.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Yuran Dikutip" value={`RM ${collected.toFixed(0)}`} hint={`bulan ${month}`} tone="green" />
        <StatCard label="Yuran Tertunggak" value={`RM ${outstanding.toFixed(0)}`} tone="red" />
        <StatCard label="Rekod Kehadiran Murid" value={studentAttCount} tone="indigo" />
        {isAdmin ? (
          <StatCard label="Kos Gaji Bersih" value={`RM ${payrollTotal.toFixed(0)}`} tone="purple" />
        ) : (
          <StatCard label="Rekod Punch Pekerja" value={staffAttCount} tone="blue" />
        )}
      </div>

      <Card className="p-5">
        <SectionTitle title="Muat Turun Laporan" subtitle="Pilih bulan, klik untuk muat turun CSV" />
        <ReportDownloads defaultMonth={month} isAdmin={isAdmin} />
      </Card>

      <p className="text-xs text-slate-400">
        Fail CSV menyokong aksara UTF-8 (boleh dibuka terus dalam Excel / Google Sheets).
        {isAdmin ? " Admin HQ melihat semua cawangan." : " Anda melihat data cawangan anda sahaja."}
      </p>
    </div>
  );
}
