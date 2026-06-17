import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateMY, formatDateTimeMY } from "@/lib/date";
import { ADMIN_ROLES, MANAGER_ROLES, INVOICE_STATUS, PAYMENT_METHOD } from "@/lib/constants";
import { PrintButton } from "@/components/print-button";

function rm(n: number) {
  return `RM ${n.toFixed(2)}`;
}

export default async function ReceiptPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!MANAGER_ROLES.includes(user.role)) redirect("/dashboard");

  const inv = await prisma.invoice.findUnique({
    where: { id },
    include: { student: { include: { branch: true, classRoom: true } } },
  });
  if (!inv) notFound();
  if (!ADMIN_ROLES.includes(user.role) && inv.student.branchId !== user.branchId) {
    redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-4">
        <PrintButton label="Cetak / Simpan Resit PDF" />
      </div>

      <div className="bg-white rounded-xl print:rounded-none shadow-sm print:shadow-none border border-slate-200 print:border-0 p-8">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">M</div>
            <div>
              <div className="text-lg font-bold text-slate-800">Tadika Mixture</div>
              <div className="text-xs text-slate-500">{inv.student.branch?.name ?? "-"}</div>
              <div className="text-[11px] text-slate-400">{inv.student.branch?.address ?? ""}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-800">RESIT BAYARAN</div>
            <div className="text-xs text-slate-500">No: {inv.id.slice(-8).toUpperCase()}</div>
            <div className="text-[11px] text-slate-400">{formatDateTimeMY(inv.paidAt ?? inv.createdAt)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-5">
          <div><span className="text-slate-400">Murid:</span> <span className="font-medium text-slate-700">{inv.student.name}</span></div>
          <div><span className="text-slate-400">Kelas:</span> <span className="text-slate-700">{inv.student.classRoom?.name ?? "-"}</span></div>
          <div><span className="text-slate-400">Ibu Bapa:</span> <span className="text-slate-700">{inv.student.parentName}</span></div>
          <div><span className="text-slate-400">Telefon:</span> <span className="text-slate-700">{inv.student.parentPhone}</span></div>
        </div>

        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="py-2 px-3 font-medium">Perihal</th>
              <th className="py-2 px-3 font-medium">Bulan</th>
              <th className="py-2 px-3 font-medium text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200">
              <td className="py-2 px-3 text-slate-700">{inv.description}</td>
              <td className="py-2 px-3 text-slate-600">{inv.month}</td>
              <td className="py-2 px-3 text-right text-slate-800 tabular-nums">{rm(inv.amount)}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Jumlah Invois</span><span className="tabular-nums text-slate-700">{rm(inv.amount)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Telah Dibayar ({inv.method ? PAYMENT_METHOD[inv.method] : "-"})</span><span className="tabular-nums text-emerald-600 font-medium">{rm(inv.paidAmount)}</span></div>
          {inv.amount - inv.paidAmount > 0 && (
            <div className="flex justify-between"><span className="text-slate-500">Baki</span><span className="tabular-nums text-rose-600">{rm(inv.amount - inv.paidAmount)}</span></div>
          )}
        </div>

        <div className="flex justify-between items-center bg-emerald-50 rounded-xl px-5 py-3 mt-5">
          <span className="font-semibold text-slate-700">STATUS: {INVOICE_STATUS[inv.status]}</span>
          <span className="text-lg font-bold text-emerald-700 tabular-nums">{rm(inv.paidAmount)}</span>
        </div>

        <div className="mt-6 text-[11px] text-slate-400 border-t border-slate-200 pt-3 text-center">
          Terima kasih atas pembayaran anda. Resit ini dijana secara automatik oleh sistem Mixture.
        </div>
      </div>
    </div>
  );
}
