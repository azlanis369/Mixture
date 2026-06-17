"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_ROLES } from "@/lib/constants";
import { calcPayroll, overtimeRateHourly } from "@/lib/payroll";

// Jana / kemas kini slip gaji untuk semua pekerja aktif bagi bulan tertentu (YYYY-MM)
export async function generatePayslipsAction(formData: FormData) {
  const actor = await getCurrentUser();
  if (!actor || !ADMIN_ROLES.includes(actor.role)) return { ok: false, message: "Tiada kebenaran." };

  const month = String(formData.get("month") || "");
  if (!/^\d{4}-\d{2}$/.test(month)) return { ok: false, message: "Bulan tidak sah." };

  const users = await prisma.user.findMany({
    where: { active: true, basicSalary: { gt: 0 } },
  });

  let count = 0;
  for (const u of users) {
    // Lebih masa diluluskan dalam bulan ini
    const ots = await prisma.overtime.findMany({
      where: { userId: u.id, status: "APPROVED", date: { startsWith: month } },
    });
    const hourly = overtimeRateHourly(u.basicSalary);
    const overtimePay =
      Math.round(ots.reduce((s, o) => s + o.hours * o.rate * hourly, 0) * 100) / 100;

    // Tuntutan diluluskan dalam bulan ini
    const claims = await prisma.claim.findMany({
      where: { userId: u.id, status: { in: ["APPROVED", "PAID"] }, claimDate: { startsWith: month } },
    });
    const claimsTotal = Math.round(claims.reduce((s, c) => s + c.amount, 0) * 100) / 100;

    const p = calcPayroll({
      basicSalary: u.basicSalary,
      allowance: u.allowance,
      overtimePay,
      claimsTotal,
    });

    await prisma.payslip.upsert({
      where: { userId_month: { userId: u.id, month } },
      create: {
        userId: u.id,
        month,
        basicSalary: p.basicSalary,
        allowance: p.allowance,
        overtimePay: p.overtimePay,
        claimsTotal: p.claimsTotal,
        grossPay: p.grossPay,
        epfEmployee: p.epfEmployee,
        epfEmployer: p.epfEmployer,
        socsoEmployee: p.socsoEmployee,
        socsoEmployer: p.socsoEmployer,
        eisEmployee: p.eisEmployee,
        eisEmployer: p.eisEmployer,
        pcb: p.pcb,
        netPay: p.netPay,
        generatedById: actor.id,
      },
      update: {
        // Hanya kemas kini jika masih draf
        basicSalary: p.basicSalary,
        allowance: p.allowance,
        overtimePay: p.overtimePay,
        claimsTotal: p.claimsTotal,
        grossPay: p.grossPay,
        epfEmployee: p.epfEmployee,
        epfEmployer: p.epfEmployer,
        socsoEmployee: p.socsoEmployee,
        socsoEmployer: p.socsoEmployer,
        eisEmployee: p.eisEmployee,
        eisEmployer: p.eisEmployer,
        pcb: p.pcb,
        netPay: p.netPay,
      },
    });
    count++;
  }

  revalidatePath("/payroll");
  return { ok: true, message: `${count} slip gaji dijana untuk ${month}.` };
}

export async function finalizePayslipAction(formData: FormData) {
  const actor = await getCurrentUser();
  if (!actor || !ADMIN_ROLES.includes(actor.role)) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.payslip.update({ where: { id }, data: { status: "FINALIZED" } });
  revalidatePath("/payroll");
}
