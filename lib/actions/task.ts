"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MANAGER_ROLES } from "@/lib/constants";

export async function createTaskAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;

  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  const assigneeId = String(formData.get("assigneeId") || "") || null;
  const branchId = assigneeId
    ? (await prisma.user.findUnique({ where: { id: assigneeId } }))?.branchId
    : user.branchId;

  await prisma.task.create({
    data: {
      title,
      description: String(formData.get("description") || "") || null,
      category: String(formData.get("category") || "GENERAL"),
      priority: String(formData.get("priority") || "MEDIUM"),
      dueDate: String(formData.get("dueDate") || "") || null,
      assigneeId,
      creatorId: user.id,
      branchId: branchId ?? user.branchId,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function updateTaskStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["TODO", "IN_PROGRESS", "DONE"].includes(status)) return;

  await prisma.task.update({
    where: { id },
    data: {
      status,
      completedAt: status === "DONE" ? new Date() : null,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
