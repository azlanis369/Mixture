"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MANAGER_ROLES, MILEAGE_RATE } from "@/lib/constants";

export async function createClaimAction(input: {
  type: string;
  title: string;
  amount: number;
  distanceKm?: number;
  claimDate: string;
  receiptPhoto?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Sesi tamat." };
  if (!input.title || !input.claimDate) return { ok: false, message: "Sila lengkapkan maklumat." };

  let amount = Number(input.amount) || 0;
  let distanceKm: number | null = null;
  if (input.type === "MILEAGE") {
    distanceKm = Number(input.distanceKm) || 0;
    amount = Math.round(distanceKm * MILEAGE_RATE * 100) / 100;
  }
  if (amount <= 0) return { ok: false, message: "Jumlah tuntutan tidak sah." };

  await prisma.claim.create({
    data: {
      userId: user.id,
      type: input.type,
      title: input.title,
      amount,
      distanceKm,
      claimDate: input.claimDate,
      receiptPhoto: input.receiptPhoto || null,
    },
  });

  revalidatePath("/claims");
  return { ok: true, message: "Tuntutan dihantar." };
}

export async function reviewClaimAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !MANAGER_ROLES.includes(user.role)) return;
  const id = String(formData.get("id") || "");
  const decision = String(formData.get("decision") || "");
  if (!id || !["APPROVED", "REJECTED", "PAID"].includes(decision)) return;

  await prisma.claim.update({
    where: { id },
    data: { status: decision, approverId: user.id },
  });

  revalidatePath("/claims");
}
