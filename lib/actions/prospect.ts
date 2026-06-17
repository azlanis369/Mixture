"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MANAGER_ROLES } from "@/lib/constants";

export async function createProspectAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;

  const parentName = String(formData.get("parentName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  if (!parentName || !phone) return;

  await prisma.prospect.create({
    data: {
      parentName,
      phone,
      childName: String(formData.get("childName") || "") || null,
      childAge: String(formData.get("childAge") || "") || null,
      source: String(formData.get("source") || "WALK_IN"),
      status: "NEW",
      notes: String(formData.get("notes") || "") || null,
      branchId: user.branchId,
      handledById: user.id,
    },
  });

  revalidatePath("/prospects");
  revalidatePath("/dashboard");
}

export async function updateProspectStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id) return;

  await prisma.prospect.update({
    where: { id },
    data: { status, lastContactAt: new Date() },
  });

  revalidatePath("/prospects");
  revalidatePath("/dashboard");
}
