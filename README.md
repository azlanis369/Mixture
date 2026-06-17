# Mixture — Sistem Pengurusan Tadika

Aplikasi web untuk menguruskan rangkaian tadika (1 HQ + cawangan di sekitar Kuala Lumpur & Selangor). Dibina ringkas, mesra mobile, dan berfungsi penuh — diilhamkan daripada gaya **MySyarikat** tetapi dipermudahkan.

## Ciri Utama

### Dashboard Admin (HQ)
- Pemantauan menyeluruh semua cawangan: kehadiran, tugas aktif & prospek setiap cawangan.
- Statistik pekerja, kehadiran harian, permohonan cuti tertunda.
- Corong prospek ibu bapa (NEW → CONTACTED → VISIT → ENROLLED).
- Pengurusan pekerja & cawangan.

### Dashboard Ketua Cawangan (Head of Branch)
- Pemantauan pekerja & kehadiran cawangan sendiri.
- Kelulusan cuti pekerja cawangan.
- **Prospek ibu bapa** dengan butang **WhatsApp terus** untuk outreach, promosi & edukasi.
- Agih & pantau tugas (outreach, promosi, edukasi, mesyuarat, latihan).

### Dashboard Pekerja
- **Sistem punch card** (clock in / clock out) dengan:
  - Pengesahan **lokasi GPS sebenar** (geofence radius cawangan).
  - **Gambar bukti** (kamera langsung atau muat naik).
- Permohonan **cuti** (kecemasan, keluar awal, sakit, tahunan, tanpa gaji).
- Senarai tugas peribadi & pengumuman terkini.

### Pengumuman & Notis
- Saluran **Telegram** (program, mesyuarat, latihan) & **WhatsApp** (umum).
- Butang kongsi terus ke Telegram / WhatsApp.

## Teknologi
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Prisma 6** + **SQLite** (mudah ditukar ke PostgreSQL untuk production)
- Auth: JWT dalam cookie httpOnly (`jose`) + `bcryptjs`

## Mula Pantas

```bash
npm install            # pasang dependency (prisma generate berjalan automatik)
npm run db:reset       # cipta skema + seed data demo
npm run dev            # http://localhost:3000
```

### Akaun Demo (kata laluan: `password123`)
| Peranan          | Emel                     |
|------------------|--------------------------|
| Admin HQ         | `admin@mixture.my`       |
| Admin HQ (staf)  | `hq@mixture.my`          |
| Ketua Cawangan   | `head.amp@mixture.my`    |
| Pekerja          | `staff.amp.1@mixture.my` |

## Skrip
- `npm run dev` — pelayan pembangunan
- `npm run build` — bina untuk production
- `npm run db:push` — selaras skema ke database
- `npm run db:seed` — jana data demo
- `npm run db:reset` — reset + seed semula

## Struktur
```
app/
  login/                 Halaman log masuk
  (app)/                 Kawasan berkebenaran (sidebar + bottom nav mobile)
    dashboard/           Dashboard ikut peranan
    attendance/          Punch card + pemantauan kehadiran
    leave/               Permohonan & kelulusan cuti
    tasks/               Pengurusan tugas (papan Kanban ringkas)
    prospects/           Prospek ibu bapa + WhatsApp outreach
    announcements/       Pengumuman (Telegram/WhatsApp)
    staff/               Pengurusan pekerja
    branches/            Senarai cawangan
components/              Komponen UI boleh guna semula
lib/                     Auth, Prisma, helper, server actions
prisma/                  Skema & seed
```

## Nota Production
- Tukar `AUTH_SECRET` dalam `.env`.
- Tukar datasource Prisma ke PostgreSQL untuk berbilang pengguna serentak.
- Simpan gambar punch card di storan objek (cth: Cloudinary/S3) berbanding data URL.
