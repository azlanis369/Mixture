import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateMY } from "@/lib/date";
import { ADMIN_ROLES, MANAGER_ROLES, CLAIM_TYPES, CLAIM_STATUS } from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState, Button } from "@/components/ui";
import { ClaimForm } from "@/components/claim-form";
import { reviewClaimAction } from "@/lib/actions/claim";

function statusTone(s: string) {
  return s === "APPROVED" ? "green" : s === "PAID" ? "blue" : s === "REJECTED" ? "red" : "amber";
}

export default async function ClaimsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const isManager = MANAGER_ROLES.includes(user.role);
  const isAdmin = ADMIN_ROLES.includes(user.role);

  const myClaims = await prisma.claim.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const pending = isManager
    ? await prisma.claim.findMany({
        where: {
          status: "PENDING",
          user: isAdmin ? {} : { branchId: user.branchId },
          NOT: { userId: user.id },
        },
        include: { user: { include: { branch: true } } },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const totalApproved = myClaims
    .filter((c) => c.status === "APPROVED" || c.status === "PAID")
    .reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Tuntutan</h1>
        <p className="text-sm text-slate-500">
          Perubatan, batuan/mileage & perbelanjaan — imbas resit, hantar untuk kelulusan.
        </p>
      </div>

      <Card className="p-5">
        <ClaimForm />
      </Card>

      {isManager && (
        <Card className="p-4">
          <SectionTitle title="Tuntutan Perlu Kelulusan" subtitle={isAdmin ? "Semua cawangan" : "Cawangan anda"} />
          {pending.length === 0 ? (
            <EmptyState text="Tiada tuntutan tertunda." />
          ) : (
            <div className="space-y-3">
              {pending.map((c) => (
                <div key={c.id} className="p-3 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{c.title}</div>
                      <div className="text-xs text-slate-400">
                        {c.user.name} • {c.user.branch?.code} • {CLAIM_TYPES[c.type]} • {formatDateMY(c.claimDate)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">RM {c.amount.toFixed(2)}</div>
                      {c.distanceKm && <div className="text-[11px] text-slate-400">{c.distanceKm} km</div>}
                    </div>
                  </div>
                  {c.receiptPhoto && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.receiptPhoto} alt="resit" className="mt-2 w-20 h-20 object-cover rounded-lg" />
                  )}
                  <div className="flex gap-2 mt-3">
                    {["APPROVED", "REJECTED"].map((d) => (
                      <form key={d} action={reviewClaimAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="decision" value={d} />
                        <Button type="submit" variant={d === "APPROVED" ? "primary" : "danger"} className="!py-1.5 !px-3">
                          {d === "APPROVED" ? "Luluskan" : "Tolak"}
                        </Button>
                      </form>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card className="p-4">
        <SectionTitle
          title="Tuntutan Saya"
          subtitle={`Jumlah diluluskan: RM ${totalApproved.toFixed(2)}`}
        />
        {myClaims.length === 0 ? (
          <EmptyState text="Belum ada tuntutan." />
        ) : (
          <div className="space-y-2">
            {myClaims.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  {c.receiptPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.receiptPhoto} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">{c.title}</div>
                    <div className="text-xs text-slate-400">{CLAIM_TYPES[c.type]} • {formatDateMY(c.claimDate)}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-slate-800 text-sm">RM {c.amount.toFixed(2)}</div>
                  <Badge tone={statusTone(c.status)}>{CLAIM_STATUS[c.status]}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
