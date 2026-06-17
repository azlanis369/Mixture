import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BRANCHES = [
  { name: "Tadika Mixture HQ", code: "HQ", isHQ: true, address: "Menara Mixture, Jalan Tun Razak, 50400 Kuala Lumpur", lat: 3.1654, lng: 101.7196 },
  { name: "Tadika Mixture Ampang", code: "AMP", address: "Jalan Ampang, 68000 Ampang, Selangor", lat: 3.1583, lng: 101.7600 },
  { name: "Tadika Mixture Cheras", code: "CRS", address: "Jalan Cheras, 56000 Kuala Lumpur", lat: 3.1042, lng: 101.7430 },
  { name: "Tadika Mixture Shah Alam", code: "SA", address: "Seksyen 7, 40000 Shah Alam, Selangor", lat: 3.0712, lng: 101.5183 },
  { name: "Tadika Mixture Subang Jaya", code: "SJ", address: "SS15, 47500 Subang Jaya, Selangor", lat: 3.0738, lng: 101.5853 },
  { name: "Tadika Mixture Kajang", code: "KJG", address: "Jalan Kajang, 43000 Kajang, Selangor", lat: 2.9927, lng: 101.7909 },
  { name: "Tadika Mixture Setapak", code: "STP", address: "Jalan Genting Klang, 53300 Setapak, KL", lat: 3.2010, lng: 101.7237 },
  { name: "Tadika Mixture Petaling Jaya", code: "PJ", address: "Jalan SS2, 47300 Petaling Jaya, Selangor", lat: 3.1177, lng: 101.6240 },
];

async function main() {
  console.log("Menjana data seed...");

  // Bersih data sedia ada
  await prisma.payslip.deleteMany();
  await prisma.overtime.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.prospect.deleteMany();
  await prisma.task.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.branch.deleteMany();

  const branches = [];
  for (const b of BRANCHES) {
    const created = await prisma.branch.create({
      data: {
        name: b.name,
        code: b.code,
        isHQ: b.isHQ ?? false,
        address: b.address,
        latitude: b.lat,
        longitude: b.lng,
        phone: "03-1234 5678",
      },
    });
    branches.push(created);
  }

  const hq = branches[0];
  const pass = await bcrypt.hash("password123", 10);

  // Syif kerja
  const shiftPagi = await prisma.shift.create({
    data: { name: "Syif Pagi", startTime: "07:30", endTime: "16:30", breakMinutes: 60 },
  });
  const shiftPetang = await prisma.shift.create({
    data: { name: "Syif Petang", startTime: "10:00", endTime: "19:00", breakMinutes: 60 },
  });

  // Super Admin + Admin HQ
  await prisma.user.create({
    data: { name: "Pn. Aishah (Pemilik)", email: "admin@mixture.my", phone: "0121111111", passwordHash: pass, role: "SUPER_ADMIN", position: "Pemilik / Pengarah", branchId: hq.id, basicSalary: 12000, allowance: 1500, shiftId: shiftPagi.id },
  });
  await prisma.user.create({
    data: { name: "En. Faiz (Admin HQ)", email: "hq@mixture.my", phone: "0122222222", passwordHash: pass, role: "ADMIN", position: "Admin HQ", branchId: hq.id, basicSalary: 5500, allowance: 600, shiftId: shiftPagi.id },
  });

  // Ketua Cawangan untuk setiap branch (kecuali HQ)
  const hobNames = ["Kak Mira", "Cikgu Rosli", "Kak Siti", "Cikgu Hana", "Kak Nora", "Cikgu Zaid", "Kak Lina"];
  const staffPositions = ["Guru Tadika", "Pembantu Guru", "Admin Cawangan"];
  const heads = [];
  for (let i = 1; i < branches.length; i++) {
    const br = branches[i];
    const head = await prisma.user.create({
      data: {
        name: `${hobNames[i - 1]} (Ketua ${br.code})`,
        email: `head.${br.code.toLowerCase()}@mixture.my`,
        phone: `01333${String(i).padStart(4, "0")}`,
        passwordHash: pass,
        role: "HEAD_OF_BRANCH",
        position: "Ketua Cawangan",
        branchId: br.id,
        basicSalary: 3800,
        allowance: 500,
        shiftId: shiftPagi.id,
      },
    });
    heads.push(head);

    // 2-3 pekerja biasa per cawangan
    for (let j = 0; j < 3; j++) {
      await prisma.user.create({
        data: {
          name: `Pekerja ${br.code}-${j + 1}`,
          email: `staff.${br.code.toLowerCase()}.${j + 1}@mixture.my`,
          phone: `01444${i}${j}00`,
          passwordHash: pass,
          role: "STAFF",
          position: staffPositions[j % staffPositions.length],
          branchId: br.id,
          basicSalary: 1800 + j * 200,
          allowance: 200,
          shiftId: j % 2 === 0 ? shiftPagi.id : shiftPetang.id,
        },
      });
    }
  }

  // Tugas contoh untuk Ketua Cawangan
  const taskTemplates = [
    { title: "Follow-up 5 prospek ibu bapa di WhatsApp", category: "OUTREACH", priority: "HIGH" },
    { title: "Muat naik update aktiviti tadika ke media sosial", category: "PROMOTION", priority: "MEDIUM" },
    { title: "Sesi edukasi parenting untuk ibu bapa baru", category: "EDUCATION", priority: "MEDIUM" },
    { title: "Hadir mesyuarat bulanan HQ (Telegram)", category: "MEETING", priority: "HIGH" },
  ];
  for (const head of heads) {
    for (const t of taskTemplates) {
      await prisma.task.create({
        data: {
          title: t.title,
          category: t.category,
          priority: t.priority,
          status: Math.random() > 0.5 ? "IN_PROGRESS" : "TODO",
          assigneeId: head.id,
          branchId: head.branchId,
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
        },
      });
    }
  }

  // Prospek contoh
  const prospectNames = ["Pn. Farah", "En. Hakim", "Pn. Wani", "En. Amir", "Pn. Dewi", "En. Razif"];
  const statuses = ["NEW", "CONTACTED", "VISIT", "ENROLLED", "LOST"];
  for (const head of heads) {
    for (let k = 0; k < 4; k++) {
      await prisma.prospect.create({
        data: {
          parentName: prospectNames[k % prospectNames.length],
          phone: `0195${Math.floor(1000000 + Math.random() * 8000000)}`,
          childName: `Anak ${k + 1}`,
          childAge: `${3 + (k % 3)} tahun`,
          source: ["WHATSAPP", "FACEBOOK", "REFERRAL", "WALK_IN"][k % 4],
          status: statuses[k % statuses.length],
          branchId: head.branchId,
          handledById: head.id,
          notes: "Berminat dengan program prasekolah 2026.",
          lastContactAt: new Date(Date.now() - k * 86400000),
        },
      });
    }
  }

  // Contoh permohonan cuti (untuk paparan baki)
  const someStaff = await prisma.user.findMany({ where: { role: "STAFF" }, take: 4 });
  const yr = new Date().getFullYear();
  for (let i = 0; i < someStaff.length; i++) {
    const s = someStaff[i];
    await prisma.leaveRequest.create({
      data: {
        userId: s.id,
        type: ["ANNUAL", "MEDICAL", "EMERGENCY", "ANNUAL"][i],
        startDate: `${yr}-0${(i % 8) + 1}-10`,
        endDate: `${yr}-0${(i % 8) + 1}-${i === 0 ? 12 : 10}`,
        reason: "Urusan peribadi.",
        status: i < 2 ? "APPROVED" : "PENDING",
      },
    });
  }

  // Contoh tuntutan
  for (let i = 0; i < someStaff.length; i++) {
    const s = someStaff[i];
    await prisma.claim.create({
      data: {
        userId: s.id,
        type: ["MEDICAL", "MILEAGE", "EXPENSE", "MEDICAL"][i],
        title: ["Klinik panel", "Perjalanan ke HQ (mesyuarat)", "Bahan kelas seni", "Ubat batuk"][i],
        amount: [85, 36, 120, 25][i],
        distanceKm: i === 1 ? 60 : null,
        claimDate: `${yr}-0${(i % 8) + 1}-15`,
        status: i === 0 ? "APPROVED" : "PENDING",
      },
    });
  }

  // Contoh lebih masa
  for (let i = 0; i < someStaff.length; i++) {
    const s = someStaff[i];
    await prisma.overtime.create({
      data: {
        userId: s.id,
        date: `${yr}-0${(i % 8) + 1}-20`,
        hours: [2, 3, 1.5, 2][i],
        rate: 1.5,
        reason: "Persediaan majlis hari keluarga tadika.",
        status: i === 0 ? "APPROVED" : "PENDING",
      },
    });
  }

  // Pengumuman contoh
  const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  await prisma.announcement.create({
    data: { title: "Mesyuarat Bulanan Semua Cawangan", body: "Mesyuarat bulanan akan diadakan secara online. Sila semak kumpulan Telegram untuk pautan dan agenda penuh.", channel: "TELEGRAM", category: "MEETING", pinned: true, authorId: admin?.id },
  });
  await prisma.announcement.create({
    data: { title: "Promosi Pendaftaran 2026 Dibuka", body: "Kempen pendaftaran tahun 2026 kini dibuka. Semua Ketua Cawangan diminta hebahkan kepada prospek ibu bapa melalui WhatsApp.", channel: "WHATSAPP", category: "PROGRAM", authorId: admin?.id },
  });
  await prisma.announcement.create({
    data: { title: "Latihan Pedagogi Awal Kanak-kanak", body: "Sesi latihan untuk semua guru akan diadakan minggu depan. Kehadiran adalah wajib.", channel: "INTERNAL", category: "TRAINING", authorId: admin?.id },
  });

  const userCount = await prisma.user.count();
  console.log(`Selesai! ${branches.length} cawangan, ${userCount} pengguna dijana.`);
  console.log("Log masuk admin: admin@mixture.my / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
