"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayMY, distanceMeters } from "@/lib/date";

type PunchInput = {
  kind: "IN" | "OUT";
  lat: number;
  lng: number;
  address?: string;
  photo: string; // data URL
};

export async function punchAction(input: PunchInput) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Sesi tamat. Sila log masuk semula." };

  if (!input.photo || !input.photo.startsWith("data:image")) {
    return { ok: false, message: "Gambar bukti diperlukan." };
  }
  if (typeof input.lat !== "number" || typeof input.lng !== "number") {
    return { ok: false, message: "Lokasi GPS diperlukan. Sila benarkan akses lokasi." };
  }

  const today = todayMY();
  const branch = user.branch;

  // Semak geofence jika cawangan ada koordinat
  let withinRange = true;
  let dist = 0;
  if (branch?.latitude != null && branch?.longitude != null) {
    dist = distanceMeters(input.lat, input.lng, branch.latitude, branch.longitude);
    withinRange = dist <= (branch.radius ?? 150);
  }

  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });

  if (input.kind === "IN") {
    if (existing?.clockInAt) {
      return { ok: false, message: "Anda sudah daftar masuk hari ini." };
    }
    await prisma.attendance.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      create: {
        userId: user.id,
        branchId: user.branchId,
        date: today,
        clockInAt: new Date(),
        clockInLat: input.lat,
        clockInLng: input.lng,
        clockInAddr: input.address,
        clockInPhoto: input.photo,
        status: "PRESENT",
      },
      update: {
        clockInAt: new Date(),
        clockInLat: input.lat,
        clockInLng: input.lng,
        clockInAddr: input.address,
        clockInPhoto: input.photo,
      },
    });
  } else {
    if (!existing?.clockInAt) {
      return { ok: false, message: "Sila daftar masuk dahulu sebelum daftar keluar." };
    }
    if (existing?.clockOutAt) {
      return { ok: false, message: "Anda sudah daftar keluar hari ini." };
    }
    await prisma.attendance.update({
      where: { userId_date: { userId: user.id, date: today } },
      data: {
        clockOutAt: new Date(),
        clockOutLat: input.lat,
        clockOutLng: input.lng,
        clockOutAddr: input.address,
        clockOutPhoto: input.photo,
      },
    });
  }

  revalidatePath("/attendance");
  revalidatePath("/dashboard");

  return {
    ok: true,
    message:
      input.kind === "IN"
        ? withinRange
          ? "Daftar masuk berjaya."
          : `Daftar masuk direkod (di luar kawasan, ~${dist}m dari cawangan).`
        : "Daftar keluar berjaya. Terima kasih!",
    withinRange,
    distance: dist,
  };
}
