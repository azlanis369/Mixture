import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayMY, formatDateMY } from "@/lib/date";
import { ADMIN_ROLES, MANAGER_ROLES, INVOICE_STATUS, PAYMENT_METHOD } from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState, StatCard } from "@/components/ui";
import { FeeGenerate, PaymentButton } from "@/components/fee-widgets";
import { Icon } from "@/components/icons";

function statusTone(s: string) {
  return s === "PAID" ? "green" : s === "PARTIAL" ? "amber" : "red";
}

function waReminder(phone: string, parent: string, student: string, month: string, amount: number) {
  let p = phone.replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "60" + p.slice(1);
  else if (!p.startsWith("60")) p = "60" + p;
  const msg = encodeURIComponent(
    `Salam ${parent}, ini peringatan mesra daripada Tadika Mixture. Yuran bulan ${month} bagi ${student} berjumlah RM${amount.toFixed(2)} masih belum dijelaskan. Mohon kerjasama untuk menjelaskannya. Terima kasih.`
  );
  return `https://wa.me/${p}?text=${msg}`;
}

export default async function FeesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!MANAGER_ROLES.includes(user.role)) redirect("/dashboard");
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const currentMonth = todayMY().slice(0, 7);
  const scope = isAdmin ? {} : { branchId: user.branchId };

  const invoices = await prisma.invoice.findMany({
    where: { month: currentMonth, ...scope },
    include: { student: { include: { branch: true } } },
    orderBy: [{ status: "desc" }, { createdAt: "asc" }],
  });

  const collected = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const billed = invoices.reduce((s, i) => s + i.amount, 0);
  const outstanding = billed - collected;
  const unpaidCount = invoices.filter((i) => i.status !== "PAID").length;
  const rate = billed > 0 ? Math.round((collected / billed) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Yuran & Kutipan</h1>
        <p className="text-sm text-slate-500">
          Jana invois bulanan, rekod bayaran & hantar peringatan WhatsApp kepada ibu bapa.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Dikutip Bulan Ini" value={`RM ${collected.toFixed(0)}`} tone="green" hint={`${rate}% daripada RM${billed.toFixed(0)}`} />
        <StatCard label="Tertunggak" value={`RM ${outstanding.toFixed(0)}`} tone="red" hint={`${unpaidCount} invois`} />
        <StatCard label="Jumlah Invois" value={invoices.length} tone="indigo" />
        <StatCard label="Kadar Kutipan" value={`${rate}%`} tone="blue" />
      </div>

      <Card className="p-5">
        <FeeGenerate defaultMonth={currentMonth} />
        <p className="text-xs text-slate-400 mt-3">
          Invois dijana untuk semua murid aktif yang belum ada invois bulan berkenaan (tidak menimpa yang sedia ada).
        </p>
      </Card>

      <Card className="p-4">
        <SectionTitle title={`Invois — ${currentMonth}`} subtitle={isAdmin ? "Semua cawangan" : "Cawangan anda"} />
        {invoices.length === 0 ? (
          <EmptyState text="Tiada invois untuk bulan ini. Klik 'Jana Invois Bulanan' di atas." />
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => {
              const due = inv.amount - inv.paidAmount;
              return (
                <div key={inv.id} className="py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-700 truncate">{inv.student.name}</div>
                      <div className="text-xs text-slate-400">
                        {inv.description}
                        {isAdmin ? ` • ${inv.student.branch?.code}` : ""} • Tarikh akhir {formatDateMY(inv.dueDate)}
                        {inv.method ? ` • ${PAYMENT_METHOD[inv.method]}` : ""}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-slate-800">
                        RM {inv.paidAmount.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ {inv.amount.toFixed(2)}</span>
                      </div>
                      <Badge tone={statusTone(inv.status)}>{INVOICE_STATUS[inv.status]}</Badge>
                    </div>
                  </div>
                  {inv.status !== "PAID" && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <PaymentButton invoiceId={inv.id} outstanding={due} />
                      <a
                        href={waReminder(inv.student.parentPhone, inv.student.parentName, inv.student.name, inv.month, due)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        <Icon.whatsapp className="w-4 h-4" /> Peringatan
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
