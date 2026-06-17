import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCSV } from "@/lib/csv";
import {
  ADMIN_ROLES,
  MANAGER_ROLES,
  LEAVE_TYPES,
  STUDENT_ATT_STATUS,
  INVOICE_STATUS,
  PAYMENT_METHOD,
} from "@/lib/constants";
import { formatDateTimeMY } from "@/lib/date";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) {
    return NextResponse.json({ error: "Tiada kebenaran" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") || "";
  const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const branchScope = isAdmin ? {} : { branchId: user.branchId };

  let csv = "";
  let filename = "laporan.csv";

  if (type === "staff-attendance") {
    const rows = await prisma.attendance.findMany({
      where: { date: { startsWith: month }, ...branchScope },
      include: { user: true, branch: true },
      orderBy: [{ date: "asc" }],
    });
    csv = toCSV(
      ["Tarikh", "Pekerja", "Cawangan", "Masuk", "Keluar", "Status"],
      rows.map((r) => [
        r.date,
        r.user.name,
        r.branch?.code ?? "",
        r.clockInAt ? formatDateTimeMY(r.clockInAt) : "",
        r.clockOutAt ? formatDateTimeMY(r.clockOutAt) : "",
        r.status,
      ])
    );
    filename = `kehadiran-pekerja-${month}.csv`;
  } else if (type === "student-attendance") {
    const rows = await prisma.studentAttendance.findMany({
      where: { date: { startsWith: month }, ...branchScope },
      include: { student: { include: { branch: true, classRoom: true } } },
      orderBy: [{ date: "asc" }],
    });
    csv = toCSV(
      ["Tarikh", "Murid", "Kelas", "Cawangan", "Status", "Masa Sampai"],
      rows.map((r) => [
        r.date,
        r.student.name,
        r.student.classRoom?.name ?? "",
        r.student.branch?.code ?? "",
        STUDENT_ATT_STATUS[r.status] ?? r.status,
        r.arrivedAt ?? "",
      ])
    );
    filename = `kehadiran-murid-${month}.csv`;
  } else if (type === "fees") {
    const rows = await prisma.invoice.findMany({
      where: { month, ...branchScope },
      include: { student: { include: { branch: true } } },
      orderBy: [{ status: "asc" }],
    });
    csv = toCSV(
      ["Bulan", "Murid", "Cawangan", "Perihal", "Jumlah (RM)", "Dibayar (RM)", "Baki (RM)", "Status", "Kaedah"],
      rows.map((r) => [
        r.month,
        r.student.name,
        r.student.branch?.code ?? "",
        r.description,
        r.amount.toFixed(2),
        r.paidAmount.toFixed(2),
        (r.amount - r.paidAmount).toFixed(2),
        INVOICE_STATUS[r.status] ?? r.status,
        r.method ? PAYMENT_METHOD[r.method] : "",
      ])
    );
    filename = `yuran-${month}.csv`;
  } else if (type === "payroll" && isAdmin) {
    const rows = await prisma.payslip.findMany({
      where: { month },
      include: { user: { include: { branch: true } } },
      orderBy: [{ netPay: "desc" }],
    });
    csv = toCSV(
      ["Bulan", "Pekerja", "Cawangan", "Gaji Asas", "Elaun", "OT", "Kasar", "KWSP Pekerja", "PERKESO", "SIP", "PCB", "Bersih", "KWSP Majikan"],
      rows.map((r) => [
        r.month,
        r.user.name,
        r.user.branch?.code ?? "",
        r.basicSalary.toFixed(2),
        r.allowance.toFixed(2),
        r.overtimePay.toFixed(2),
        r.grossPay.toFixed(2),
        r.epfEmployee.toFixed(2),
        r.socsoEmployee.toFixed(2),
        r.eisEmployee.toFixed(2),
        r.pcb.toFixed(2),
        r.netPay.toFixed(2),
        r.epfEmployer.toFixed(2),
      ])
    );
    filename = `gaji-${month}.csv`;
  } else if (type === "leave") {
    const rows = await prisma.leaveRequest.findMany({
      where: { startDate: { startsWith: month }, user: branchScope },
      include: { user: { include: { branch: true } } },
      orderBy: [{ startDate: "asc" }],
    });
    csv = toCSV(
      ["Pekerja", "Cawangan", "Jenis", "Mula", "Tamat", "Status", "Sebab"],
      rows.map((r) => [
        r.user.name,
        r.user.branch?.code ?? "",
        LEAVE_TYPES[r.type] ?? r.type,
        r.startDate,
        r.endDate,
        r.status,
        r.reason,
      ])
    );
    filename = `cuti-${month}.csv`;
  } else {
    return NextResponse.json({ error: "Jenis laporan tidak sah" }, { status: 400 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
