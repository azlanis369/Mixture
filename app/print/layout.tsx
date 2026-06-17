import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

// Layout bersih untuk dokumen boleh cetak (tanpa sidebar/nav)
export default async function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white py-6 print:py-0">
      <div className="max-w-2xl mx-auto px-4 print:px-0 print:max-w-none">
        {children}
      </div>
    </div>
  );
}
