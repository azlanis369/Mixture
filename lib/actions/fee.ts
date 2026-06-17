"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MANAGER_ROLES, ADMIN_ROLES } from "@/lib/constants";

// Jana invois yuran bulanan untuk semua murid aktif (ikut skop pengguna)
export async function generateInvoicesAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return { ok: false, message: "Tiada kebenaran." };
  const month = String(formData.get("month") || "");
  if (!/^\d{4}-\d{2}$/.test(month)) return { ok: false, message: "Bulan tidak sah." };

  const isAdmin = ADMIN_ROLES.includes(user.role);
  const students = await prisma.student.findMany({
    where: { status: "ACTIVE", monthlyFee: { gt: 0 }, ...(isAdmin ? {} : { branchId: user.branchId }) },
  });

  let count = 0;
  for (const s of students) {
    const existing = await prisma.invoice.findUnique({
      where: { studentId_month: { studentId: s.id, month } },
    });
    if (existing) continue; // jangan timpa invois sedia ada
    await prisma.invoice.create({
      data: {
        studentId: s.id,
        branchId: s.branchId,
        month,
        description: "Yuran Bulanan",
        amount: s.monthlyFee,
        dueDate: `${month}-10`,
      },
    });
    count++;
  }

  revalidatePath("/fees");
  revalidatePath("/dashboard");
  return { ok: true, message: `${count} invois baru dijana untuk ${month}.` };
}

// Rekod bayaran untuk satu invois
export async function recordPaymentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;
  const id = String(formData.get("id") || "");
  const amount = Number(formData.get("amount") || 0);
  const method = String(formData.get("method") || "CASH");
  if (!id || amount <= 0) return;

  const inv = await prisma.invoice.findUnique({ where: { id } });
  if (!inv) return;

  const paidAmount = Math.min(inv.amount, inv.paidAmount + amount);
  const status = paidAmount >= inv.amount ? "PAID" : paidAmount > 0 ? "PARTIAL" : "UNPAID";

  await prisma.invoice.update({
    where: { id },
    data: {
      paidAmount,
      status,
      method,
      paidAt: status === "PAID" ? new Date() : inv.paidAt,
    },
  });

  revalidatePath("/fees");
  revalidatePath("/dashboard");
}
