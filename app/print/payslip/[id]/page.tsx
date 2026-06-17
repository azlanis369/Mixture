import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_ROLES, PAYSLIP_STATUS } from "@/lib/constants";
import { PrintButton } from "@/components/print-button";

function rm(n: number) {
  return `RM ${n.toFixed(2)}`;
}

export default async function PayslipPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const slip = await prisma.payslip.findUnique({
    where: { id },
    include: { user: { include: { branch: true } } },
  });
  if (!slip) notFound();

  // Akses: pemilik slip atau admin sahaja
  if (slip.userId !== user.id && !ADMIN_ROLES.includes(user.role)) {
    redirect("/dashboard");
  }

  const earnings = [
    ["Gaji Asas", slip.basicSalary],
    ["Elaun", slip.allowance],
    ["Lebih Masa", slip.overtimePay],
    ["Tuntutan", slip.claimsTotal],
  ] as const;
  const deductions = [
    ["KWSP (Pekerja)", slip.epfEmployee],
    ["PERKESO (Pekerja)", slip.socsoEmployee],
    ["SIP/EIS (Pekerja)", slip.eisEmployee],
    ["PCB (Cukai)", slip.pcb],
  ] as const;

  return (
    <div>
      <div className="mb-4">
        <PrintButton />
      </div>

      <div className="bg-white rounded-xl print:rounded-none shadow-sm print:shadow-none border border-slate-200 print:border-0 p-8">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">M</div>
            <div>
              <div className="text-lg font-bold text-slate-800">Tadika Mixture</div>
              <div className="text-xs text-slate-500">{slip.user.branch?.name ?? "Ibu Pejabat"}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-800">SLIP GAJI</div>
            <div className="text-xs text-slate-500">Bulan: {slip.month}</div>
            <div className="text-[11px] text-slate-400">{PAYSLIP_STATUS[slip.status]}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-5">
          <div><span className="text-slate-400">Nama:</span> <span className="font-medium text-slate-700">{slip.user.name}</span></div>
          <div><span className="text-slate-400">Jawatan:</span> <span className="text-slate-700">{slip.user.position ?? "-"}</span></div>
          <div><span className="text-slate-400">No. KWSP:</span> <span className="text-slate-700">{slip.user.epfNo ?? "-"}</span></div>
          <div><span className="text-slate-400">No. PERKESO:</span> <span className="text-slate-700">{slip.user.socsoNo ?? "-"}</span></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">Pendapatan</div>
            {earnings.map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm py-1">
                <span className="text-slate-600">{label}</span>
                <span className="text-slate-800 tabular-nums">{rm(val)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t border-slate-200 mt-1 pt-1">
              <span>Jumlah Kasar</span><span className="tabular-nums">{rm(slip.grossPay)}</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">Potongan</div>
            {deductions.map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm py-1">
                <span className="text-slate-600">{label}</span>
                <span className="text-rose-600 tabular-nums">-{rm(val)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t border-slate-200 mt-1 pt-1">
              <span>Jumlah Potongan</span>
              <span className="text-rose-600 tabular-nums">-{rm(slip.epfEmployee + slip.socsoEmployee + slip.eisEmployee + slip.pcb)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-indigo-50 rounded-xl px-5 py-3 mt-6">
          <span className="font-semibold text-slate-700">GAJI BERSIH</span>
          <span className="text-xl font-bold text-indigo-700 tabular-nums">{rm(slip.netPay)}</span>
        </div>

        <div className="mt-4 text-[11px] text-slate-400 border-t border-slate-200 pt-3">
          Caruman majikan: KWSP {rm(slip.epfEmployer)} • PERKESO {rm(slip.socsoEmployer)} • SIP {rm(slip.eisEmployer)}.
          <br />Slip ini dijana secara automatik. Potongan berkanun adalah anggaran — sila sahkan dengan jadual rasmi.
        </div>
      </div>
    </div>
  );
}
