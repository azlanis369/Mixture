"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_ROLES } from "@/lib/constants";

export async function createActivityAction(input: {
  title: string;
  caption?: string;
  photo: string;
  classId?: string;
  date?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Sesi tamat." };
  if (!input.title.trim()) return { ok: false, message: "Tajuk diperlukan." };
  if (!input.photo?.startsWith("data:image")) return { ok: false, message: "Gambar diperlukan." };

  await prisma.activity.create({
    data: {
      title: input.title.trim(),
      caption: input.caption?.trim() || null,
      photo: input.photo,
      date: input.date || new Date().toISOString().slice(0, 10),
      branchId: user.branchId,
      classId: input.classId || null,
      authorId: user.id,
    },
  });

  revalidatePath("/activities");
  return { ok: true, message: "Aktiviti dikongsi." };
}

export async function deleteActivityAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  const act = await prisma.activity.findUnique({ where: { id } });
  if (!act) return;
  // Penulis sendiri atau admin sahaja boleh padam
  if (act.authorId !== user.id && !ADMIN_ROLES.includes(user.role)) return;
  await prisma.activity.delete({ where: { id } });
  revalidatePath("/activities");
}
