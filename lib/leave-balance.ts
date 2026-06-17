import "server-only";
import { prisma } from "./prisma";

// Jenis cuti yang ditolak daripada kuota
const QUOTA_TYPES: Record<string, "annualQuota" | "medicalQuota" | "emergencyQuota"> = {
  ANNUAL: "annualQuota",
  MEDICAL: "medicalQuota",
  EMERGENCY: "emergencyQuota",
};

// Bilangan hari (inklusif) antara dua tarikh YYYY-MM-DD
export function leaveDays(startDate: string, endDate: string): number {
  const s = new Date(startDate + "T00:00:00");
  const e = new Date((endDate || startDate) + "T00:00:00");
  const diff = Math.round((e.getTime() - s.getTime()) / 86400000);
  return Math.max(1, diff + 1);
}

export type Balance = {
  type: string;
  quota: number;
  used: number;
  remaining: number;
};

// Kira baki cuti untuk seorang pengguna bagi tahun semasa
export async function getLeaveBalances(
  userId: string,
  year = new Date().getFullYear()
): Promise<Balance[]> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return [];

  const approved = await prisma.leaveRequest.findMany({
    where: {
      userId,
      status: "APPROVED",
      startDate: { gte: `${year}-01-01`, lte: `${year}-12-31` },
    },
  });

  const usedByType: Record<string, number> = {};
  for (const l of approved) {
    if (QUOTA_TYPES[l.type]) {
      usedByType[l.type] = (usedByType[l.type] || 0) + leaveDays(l.startDate, l.endDate);
    }
  }

  return [
    { type: "ANNUAL", quota: user.annualQuota },
    { type: "MEDICAL", quota: user.medicalQuota },
    { type: "EMERGENCY", quota: user.emergencyQuota },
  ].map((q) => {
    const used = usedByType[q.type] || 0;
    return { ...q, used, remaining: Math.max(0, q.quota - used) };
  });
}

// Semak sama ada permohonan boleh diluluskan tanpa melebihi kuota
export async function canApproveLeave(
  userId: string,
  type: string,
  startDate: string,
  endDate: string
): Promise<{ ok: boolean; remaining?: number; needed?: number }> {
  if (!QUOTA_TYPES[type]) return { ok: true }; // EARLY_LEAVE / UNPAID tiada kuota
  const balances = await getLeaveBalances(userId);
  const bal = balances.find((b) => b.type === type);
  if (!bal) return { ok: true };
  const needed = leaveDays(startDate, endDate);
  return { ok: needed <= bal.remaining, remaining: bal.remaining, needed };
}
