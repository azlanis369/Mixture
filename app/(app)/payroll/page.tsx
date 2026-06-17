import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayMY } from "@/lib/date";
import { ADMIN_ROLES, PAYSLIP_STATUS } from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState, StatCard, Button } from "@/components/ui";
import { PayrollGenerate } from "@/components/payroll-generate";
import { finalizePayslipAction } from "@/lib/actions/payroll";

type Slip = {
  id: string;
  month: string;
  basicSalary: number;
  allowance: number;
  overtimePay: number;
  claimsTotal: number;
  grossPay: number;
  epfEmployee: number;
  epfEmployer: number;
  socsoEmployee: number;
  socsoEmployer: number;
  eisEmployee: number;
  eisEmployer: number;
  pcb: number;
  netPay: number;
  status: string;
};

function rm(n: number) {
  return `RM ${n.toFixed(2)}`;
}

function PayslipCard({
  slip,
  name,
  showFinalize,
}: {
  slip: Slip;
  name?: string;
  showFinalize?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          {name && <div className="font-semibold text-slate-800">{name}</div>}
          <div className="text-xs text-slate-400">Bulan: {slip.month}</div>
        </div>
        <Badge tone={slip.status === "FINALIZED" ? "green" : "amber"}>
          {PAYSLIP_STATUS[slip.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
        <Row label="Gaji Asas" value={rm(slip.basicSalary)} />
        <Row label="Elaun" value={rm(slip.allowance)} />
        <Row label="Lebih Masa" value={rm(slip.overtimePay)} />
        <Row label="Tuntutan" value={rm(slip.claimsTotal)} />
      </div>

      <div className="border-t border-slate-100 mt-3 pt-3">
        <div className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Potongan Pekerja</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
          <Row label="KWSP (11%)" value={`- ${rm(slip.epfEmployee)}`} red />
          <Row label="PERKESO" value={`- ${rm(slip.socsoEmployee)}`} red />
          <Row label="SIP/EIS" value={`- ${rm(slip.eisEmployee)}`} red />
          <Row label="PCB (cukai)" value={`- ${rm(slip.pcb)}`} red />
        </div>
      </div>

      <div className="border-t border-slate-100 mt-3 pt-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">Gaji Bersih</span>
        <span className="text-lg font-bold text-emerald-600">{rm(slip.netPay)}</span>
      </div>

      <div className="mt-2 text-[11px] text-slate-400">
        Caruman majikan: KWSP {rm(slip.epfEmployer)} • PERKESO {rm(slip.socsoEmployer)} • SIP {rm(slip.eisEmployer)}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <Link
          href={`/print/payslip/${slip.id}`}
          target="_blank"
          className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Cetak / PDF
        </Link>
        {showFinalize && slip.status === "DRAFT" && (
          <form action={finalizePayslipAction}>
            <input type="hidden" name="id" value={slip.id} />
            <Button type="submit" variant="secondary" className="!py-1.5 !px-3 !text-xs">
              Muktamadkan
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}

function Row({ label, value, red }: { label: string; value: string; red?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={red ? "text-rose-600 font-medium" : "text-slate-700 font-medium"}>{value}</span>
    </div>
  );
}

export default async function PayrollPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const currentMonth = todayMY().slice(0, 7);

  if (!isAdmin) {
    const slips = await prisma.payslip.findMany({
      where: { userId: user.id },
      orderBy: { month: "desc" },
    });
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Slip Gaji Saya</h1>
          <p className="text-sm text-slate-500">Penyata gaji bulanan & potongan berkanun.</p>
        </div>
        {slips.length === 0 ? (
          <Card className="p-4"><EmptyState text="Belum ada slip gaji dijana." /></Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {slips.map((s) => <PayslipCard key={s.id} slip={s} />)}
          </div>
        )}
      </div>
    );
  }

  // Paparan Admin
  const slips = await prisma.payslip.findMany({
    where: { month: currentMonth },
    include: { user: { include: { branch: true } } },
    orderBy: { netPay: "desc" },
  });

  const totalNet = slips.reduce((s, p) => s + p.netPay, 0);
  const totalEpfEmployer = slips.reduce((s, p) => s + p.epfEmployer, 0);
  const totalGross = slips.reduce((s, p) => s + p.grossPay, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Gaji & Payroll</h1>
        <p className="text-sm text-slate-500">
          Jana slip gaji automatik dengan potongan KWSP, PERKESO, SIP & PCB.
        </p>
      </div>

      <Card className="p-5">
        <PayrollGenerate defaultMonth={currentMonth} />
        <p className="text-xs text-slate-400 mt-3">
          Lebih masa & tuntutan yang diluluskan dalam bulan berkenaan dimasukkan automatik.
          Kadar berkanun adalah anggaran — sahkan dengan jadual rasmi sebelum bayaran.
        </p>
      </Card>

      {slips.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard label="Jumlah Slip" value={slips.length} tone="indigo" />
          <StatCard label="Jumlah Gaji Bersih" value={rm(totalNet)} tone="green" />
          <StatCard label="Caruman KWSP Majikan" value={rm(totalEpfEmployer)} tone="blue" hint={`Kasar: ${rm(totalGross)}`} />
        </div>
      )}

      <SectionTitle title={`Slip Gaji — ${currentMonth}`} />
      {slips.length === 0 ? (
        <Card className="p-4">
          <EmptyState text="Tiada slip untuk bulan ini. Klik 'Jana Slip Gaji' di atas." />
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {slips.map((s) => (
            <PayslipCard key={s.id} slip={s} name={`${s.user.name} • ${s.user.branch?.code ?? ""}`} showFinalize />
          ))}
        </div>
      )}
    </div>
  );
}
