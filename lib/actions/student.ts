"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MANAGER_ROLES, ADMIN_ROLES } from "@/lib/constants";

export async function createStudentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return { error: "Tiada kebenaran." };

  const name = String(formData.get("name") || "").trim();
  const parentName = String(formData.get("parentName") || "").trim();
  const parentPhone = String(formData.get("parentPhone") || "").trim();
  if (!name || !parentName || !parentPhone) return { error: "Sila lengkapkan maklumat." };

  const isAdmin = ADMIN_ROLES.includes(user.role);
  const branchId = isAdmin
    ? String(formData.get("branchId") || "") || user.branchId
    : user.branchId;

  await prisma.student.create({
    data: {
      name,
      dob: String(formData.get("dob") || "") || null,
      gender: String(formData.get("gender") || "") || null,
      parentName,
      parentPhone,
      parentEmail: String(formData.get("parentEmail") || "") || null,
      address: String(formData.get("address") || "") || null,
      branchId,
      classId: String(formData.get("classId") || "") || null,
      enrollmentDate: String(formData.get("enrollmentDate") || "") || new Date().toISOString().slice(0, 10),
      monthlyFee: Number(formData.get("monthlyFee") || 0),
      registrationFee: Number(formData.get("registrationFee") || 0),
    },
  });

  revalidatePath("/students");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateStudentStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["ACTIVE", "GRADUATED", "WITHDRAWN"].includes(status)) return;
  await prisma.student.update({ where: { id }, data: { status } });
  revalidatePath("/students");
}

// Tukar prospek (ENROLLED) kepada murid berdaftar
export async function convertProspectAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return { error: "Tiada kebenaran." };
  const prospectId = String(formData.get("prospectId") || "");
  const monthlyFee = Number(formData.get("monthlyFee") || 0);
  const prospect = await prisma.prospect.findUnique({ where: { id: prospectId } });
  if (!prospect) return { error: "Prospek tidak dijumpai." };

  await prisma.student.create({
    data: {
      name: prospect.childName || `Anak ${prospect.parentName}`,
      parentName: prospect.parentName,
      parentPhone: prospect.phone,
      branchId: prospect.branchId,
      enrollmentDate: new Date().toISOString().slice(0, 10),
      monthlyFee,
      registrationFee: 150,
      notes: "Ditukar daripada prospek.",
    },
  });

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { status: "ENROLLED", converted: true },
  });

  revalidatePath("/students");
  revalidatePath("/prospects");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function createClassAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const branchId = isAdmin
    ? String(formData.get("branchId") || "") || user.branchId
    : user.branchId;

  await prisma.classRoom.create({
    data: {
      name,
      level: String(formData.get("level") || "") || null,
      capacity: Number(formData.get("capacity") || 25),
      branchId,
    },
  });
  revalidatePath("/students");
}
