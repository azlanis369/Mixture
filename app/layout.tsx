import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mixture — Sistem Pengurusan Tadika",
  description:
    "Platform pengurusan pekerja, kehadiran, cuti dan prospek untuk rangkaian tadika.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
