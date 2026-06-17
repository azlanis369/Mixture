"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Rekod kehadiran sekumpulan murid bagi satu tarikh
export async function markStudentAttendanceAction(input: {
  date: string;
  records: { studentId: string; status: string; arrivedAt?: string }[];
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Sesi tamat." };
  if (!input.date || !Array.isArray(input.records)) return { ok: false, message: "Data tidak sah." };

  for (const r of input.records) {
    const student = await prisma.student.findUnique({ where: { id: r.studentId } });
    if (!student) continue;
    await prisma.studentAttendance.upsert({
      where: { studentId_date: { studentId: r.studentId, date: input.date } },
      create: {
        studentId: r.studentId,
        branchId: student.branchId,
        date: input.date,
        status: r.status,
        arrivedAt: r.arrivedAt || null,
        recordedById: user.id,
      },
      update: {
        status: r.status,
        arrivedAt: r.arrivedAt || null,
        recordedById: user.id,
      },
    });
  }

  revalidatePath("/student-attendance");
  revalidatePath("/dashboard");
  return { ok: true, message: `Kehadiran ${input.records.length} murid disimpan.` };
}

// Tandakan ibu bapa sudah dimaklumkan (selepas hantar WhatsApp)
export async function markNotifiedAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.studentAttendance.update({ where: { id }, data: { notified: true } });
  revalidatePath("/student-attendance");
}
