import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateMY } from "@/lib/date";
import { ADMIN_ROLES, PROSPECT_STATUS, PROSPECT_SOURCE } from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState, Button } from "@/components/ui";
import { ProspectForm } from "@/components/prospect-form";
import { updateProspectStatusAction } from "@/lib/actions/prospect";
import { Icon } from "@/components/icons";

function waLink(phone: string, name: string) {
  let p = phone.replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "60" + p.slice(1);
  else if (!p.startsWith("60")) p = "60" + p;
  const msg = encodeURIComponent(
    `Salam ${name}, terima kasih kerana berminat dengan Tadika Mixture. Boleh saya bantu dengan maklumat pendaftaran?`
  );
  return `https://wa.me/${p}?text=${msg}`;
}

function statusTone(s: string) {
  return s === "ENROLLED"
    ? "green"
    : s === "LOST"
    ? "red"
    : s === "VISIT"
    ? "amber"
    : s === "CONTACTED"
    ? "blue"
    : "slate";
}

export default async function ProspectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const isAdmin = ADMIN_ROLES.includes(user.role);

  const prospects = await prisma.prospect.findMany({
    where: isAdmin ? {} : { branchId: user.branchId },
    include: { branch: true, handledBy: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = Object.keys(PROSPECT_STATUS);
  const counts: Record<string, number> = {};
  statuses.forEach((s) => (counts[s] = prospects.filter((p) => p.status === s).length));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Prospek Ibu Bapa</h1>
        <p className="text-sm text-slate-500">
          Uruskan lead & hubungi terus melalui WhatsApp untuk daftarkan anak mereka.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {statuses.map((s) => (
          <Card key={s} className="p-3 text-center">
            <div className="text-xl font-bold text-slate-800">{counts[s]}</div>
            <div className="text-[11px] text-slate-500">{PROSPECT_STATUS[s]}</div>
          </Card>
        ))}
      </div>

      {!isAdmin && (
        <Card className="p-5">
          <ProspectForm />
        </Card>
      )}

      <Card className="p-4">
        <SectionTitle
          title="Senarai Prospek"
          subtitle={isAdmin ? "Semua cawangan" : "Cawangan anda"}
        />
        {prospects.length === 0 ? (
          <EmptyState text="Belum ada prospek. Tambah lead baru di atas." />
        ) : (
          <div className="space-y-3">
            {prospects.map((p) => (
              <div key={p.id} className="p-3 rounded-xl border border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800">{p.parentName}</div>
                    <div className="text-xs text-slate-500">
                      {p.childName ? `Anak: ${p.childName}` : ""}
                      {p.childAge ? ` (${p.childAge})` : ""}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {p.phone} • Sumber: {PROSPECT_SOURCE[p.source]}
                      {isAdmin && p.branch ? ` • ${p.branch.code}` : ""}
                    </div>
                    {p.notes && (
                      <div className="text-xs text-slate-500 mt-1 italic">“{p.notes}”</div>
                    )}
                    {p.lastContactAt && (
                      <div className="text-[11px] text-slate-400 mt-1">
                        Dihubungi: {formatDateMY(p.lastContactAt)}
                      </div>
                    )}
                  </div>
                  <Badge tone={statusTone(p.status)}>{PROSPECT_STATUS[p.status]}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <a
                    href={waLink(p.phone, p.parentName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    <Icon.whatsapp className="w-4 h-4" /> WhatsApp
                  </a>
                  {!isAdmin && (
                    <form action={updateProspectStatusAction} className="inline-flex items-center gap-1">
                      <input type="hidden" name="id" value={p.id} />
                      <select
                        name="status"
                        defaultValue={p.status}
                        className="px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{PROSPECT_STATUS[s]}</option>
                        ))}
                      </select>
                      <Button type="submit" variant="secondary" className="!py-1.5 !px-2.5 !text-xs">
                        Kemas kini
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
