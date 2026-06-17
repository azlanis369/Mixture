"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_ROLES, MANAGER_ROLES } from "@/lib/constants";

export async function createStaffAction(formData: FormData) {
  const actor = await getCurrentUser();
  if (!actor || !MANAGER_ROLES.includes(actor.role)) return { error: "Tiada kebenaran." };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!name || !email || !password) return { error: "Sila lengkapkan maklumat." };

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "Emel sudah digunakan." };

  const isAdmin = ADMIN_ROLES.includes(actor.role);
  let role = String(formData.get("role") || "STAFF");
  // Ketua cawangan hanya boleh tambah STAFF; admin boleh apa saja
  if (!isAdmin) role = "STAFF";

  // Admin boleh pilih cawangan; ketua cawangan terhad ke cawangannya
  const branchId = isAdmin
    ? String(formData.get("branchId") || "") || actor.branchId
    : actor.branchId;

  await prisma.user.create({
    data: {
      name,
      email,
      phone: String(formData.get("phone") || "") || null,
      passwordHash: await bcrypt.hash(password, 10),
      role,
      position: String(formData.get("position") || "") || null,
      branchId,
    },
  });

  revalidatePath("/staff");
  return { ok: true };
}

export async function toggleStaffActiveAction(formData: FormData) {
  const actor = await getCurrentUser();
  if (!actor || !MANAGER_ROLES.includes(actor.role)) return;
  const id = String(formData.get("id") || "");
  if (!id || id === actor.id) return;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return;
  // Ketua cawangan hanya boleh urus pekerja dalam cawangannya
  if (!ADMIN_ROLES.includes(actor.role) && target.branchId !== actor.branchId) return;

  await prisma.user.update({ where: { id }, data: { active: !target.active } });
  revalidatePath("/staff");
}
