export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  HEAD_OF_BRANCH: "HEAD_OF_BRANCH",
  STAFF: "STAFF",
} as const;

export type Role = keyof typeof ROLES;

export const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin (HQ)",
  ADMIN: "Admin HQ",
  HEAD_OF_BRANCH: "Ketua Cawangan",
  STAFF: "Pekerja",
};

// Peranan yang boleh akses fungsi pentadbiran (HQ)
export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];
// Peranan yang boleh lulus cuti & uruskan cawangan
export const MANAGER_ROLES = ["SUPER_ADMIN", "ADMIN", "HEAD_OF_BRANCH"];

export const LEAVE_TYPES: Record<string, string> = {
  ANNUAL: "Cuti Tahunan",
  EMERGENCY: "Cuti Kecemasan",
  MEDICAL: "Cuti Sakit",
  EARLY_LEAVE: "Keluar Awal",
  UNPAID: "Cuti Tanpa Gaji",
};

export const LEAVE_STATUS: Record<string, string> = {
  PENDING: "Menunggu",
  APPROVED: "Diluluskan",
  REJECTED: "Ditolak",
};

export const TASK_CATEGORY: Record<string, string> = {
  OUTREACH: "Outreach Ibu Bapa",
  PROMOTION: "Promosi",
  EDUCATION: "Edukasi",
  MEETING: "Mesyuarat",
  TRAINING: "Latihan",
  GENERAL: "Umum",
};

export const TASK_STATUS: Record<string, string> = {
  TODO: "Belum Mula",
  IN_PROGRESS: "Sedang Berjalan",
  DONE: "Selesai",
};

export const TASK_PRIORITY: Record<string, string> = {
  LOW: "Rendah",
  MEDIUM: "Sederhana",
  HIGH: "Tinggi",
};

export const PROSPECT_STATUS: Record<string, string> = {
  NEW: "Baru",
  CONTACTED: "Dihubungi",
  VISIT: "Lawatan",
  ENROLLED: "Berdaftar",
  LOST: "Gagal",
};

export const PROSPECT_SOURCE: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  FACEBOOK: "Facebook",
  REFERRAL: "Rujukan",
  WALK_IN: "Walk-in",
  OTHER: "Lain-lain",
};

export const CHANNEL_LABEL: Record<string, string> = {
  TELEGRAM: "Telegram",
  WHATSAPP: "WhatsApp",
  INTERNAL: "Dalaman",
};

export const ANNOUNCE_CATEGORY: Record<string, string> = {
  PROGRAM: "Program",
  TRAINING: "Latihan",
  MEETING: "Mesyuarat",
  NOTICE: "Notis",
  GENERAL: "Umum",
};

export const CLAIM_TYPES: Record<string, string> = {
  MEDICAL: "Perubatan",
  MILEAGE: "Batuan / Mileage",
  EXPENSE: "Perbelanjaan",
  OTHER: "Lain-lain",
};

export const CLAIM_STATUS: Record<string, string> = {
  PENDING: "Menunggu",
  APPROVED: "Diluluskan",
  REJECTED: "Ditolak",
  PAID: "Telah Dibayar",
};

export const OT_STATUS: Record<string, string> = {
  PENDING: "Menunggu",
  APPROVED: "Diluluskan",
  REJECTED: "Ditolak",
};

export const PAYSLIP_STATUS: Record<string, string> = {
  DRAFT: "Draf",
  FINALIZED: "Dimuktamadkan",
};

// Kadar batuan (RM sekilometer) — boleh dikonfigurasi
export const MILEAGE_RATE = 0.6;
