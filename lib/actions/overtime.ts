"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MANAGER_ROLES } from "@/lib/constants";

export async function createOvertimeAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const date = String(formData.get("date") || "");
  const hours = Number(formData.get("hours") || 0);
  const rate = Number(formData.get("rate") || 1.5);
  const reason = String(formData.get("reason") || "").trim();
  if (!date || hours <= 0 || !reason) return;

  await prisma.overtime.create({
    data: { userId: user.id, date, hours, rate, reason },
  });

  revalidatePath("/overtime");
}

export async function reviewOvertimeAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;
  const id = String(formData.get("id") || "");
  const decision = String(formData.get("decision") || "");
  if (!id || !["APPROVED", "REJECTED"].includes(decision)) return;

  await prisma.overtime.update({
    where: { id },
    data: { status: decision, approverId: user.id },
  });

  revalidatePath("/overtime");
}
