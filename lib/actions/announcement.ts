"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MANAGER_ROLES } from "@/lib/constants";

export async function createAnnouncementAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!title || !body) return;

  const scope = String(formData.get("scope") || "ALL");

  await prisma.announcement.create({
    data: {
      title,
      body,
      channel: String(formData.get("channel") || "INTERNAL"),
      category: String(formData.get("category") || "GENERAL"),
      pinned: formData.get("pinned") === "on",
      authorId: user.id,
      branchId: scope === "BRANCH" ? user.branchId : null,
    },
  });

  revalidatePath("/announcements");
  revalidatePath("/dashboard");
}
