"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MANAGER_ROLES } from "@/lib/constants";
import { canApproveLeave } from "@/lib/leave-balance";

export async function applyLeaveAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const type = String(formData.get("type") || "ANNUAL");
  const startDate = String(formData.get("startDate") || "");
  const endDate = String(formData.get("endDate") || startDate);
  const startTime = String(formData.get("startTime") || "") || null;
  const reason = String(formData.get("reason") || "").trim();

  if (!startDate || !reason) return;

  await prisma.leaveRequest.create({
    data: {
      userId: user.id,
      type,
      startDate,
      endDate: endDate || startDate,
      startTime,
      reason,
    },
  });

  revalidatePath("/leave");
  revalidatePath("/dashboard");
}

export async function reviewLeaveAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;

  const id = String(formData.get("id") || "");
  const decision = String(formData.get("decision") || "");
  let note = String(formData.get("note") || "") || null;
  if (!id || !["APPROVED", "REJECTED"].includes(decision)) return;

  const leave = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!leave) return;

  // Semak baki kuota sebelum lulus (kecuali EARLY_LEAVE / UNPAID)
  if (decision === "APPROVED") {
    const check = await canApproveLeave(
      leave.userId,
      leave.type,
      leave.startDate,
      leave.endDate
    );
    if (!check.ok) {
      note = `Baki tidak mencukupi (perlu ${check.needed} hari, baki ${check.remaining} hari).`;
      await prisma.leaveRequest.update({
        where: { id },
        data: { status: "REJECTED", approverId: user.id, reviewNote: note },
      });
      revalidatePath("/leave");
      revalidatePath("/dashboard");
      return;
    }
  }

  await prisma.leaveRequest.update({
    where: { id },
    data: { status: decision, approverId: user.id, reviewNote: note },
  });

  revalidatePath("/leave");
  revalidatePath("/dashboard");
}
