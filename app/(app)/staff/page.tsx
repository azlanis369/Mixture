import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_ROLES, MANAGER_ROLES, ROLE_LABEL } from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState, Button } from "@/components/ui";
import { StaffForm } from "@/components/staff-form";
import { toggleStaffActiveAction } from "@/lib/actions/staff";

function roleTone(r: string) {
  return r === "SUPER_ADMIN" || r === "ADMIN"
    ? "indigo"
    : r === "HEAD_OF_BRANCH"
    ? "purple"
    : "slate";
}

export default async function StaffPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!MANAGER_ROLES.includes(user.role)) redirect("/dashboard");
  const isAdmin = ADMIN_ROLES.includes(user.role);

  const [staff, branches] = await Promise.all([
    prisma.user.findMany({
      where: isAdmin ? {} : { branchId: user.branchId },
      include: { branch: true },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    }),
    prisma.branch.findMany({ orderBy: { isHQ: "desc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Pengurusan Pekerja</h1>
        <p className="text-sm text-slate-500">
          {isAdmin ? "Semua pekerja seluruh rangkaian." : "Pekerja di cawangan anda."} •{" "}
          {staff.filter((s) => s.active).length} aktif
        </p>
      </div>

      <Card className="p-5">
        <StaffForm isAdmin={isAdmin} branches={branches} />
      </Card>

      <Card className="p-4">
        <SectionTitle title="Senarai Pekerja" />
        {staff.length === 0 ? (
          <EmptyState text="Tiada pekerja." />
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 font-medium">Nama</th>
                  <th className="py-2 font-medium">Jawatan</th>
                  {isAdmin && <th className="py-2 font-medium">Cawangan</th>}
                  <th className="py-2 font-medium">Peranan</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5">
                      <div className="font-medium text-slate-700">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.email}</div>
                    </td>
                    <td className="py-2.5 text-slate-600">{s.position || "-"}</td>
                    {isAdmin && <td className="py-2.5 text-slate-500">{s.branch?.code}</td>}
                    <td className="py-2.5">
                      <Badge tone={roleTone(s.role)}>{ROLE_LABEL[s.role]}</Badge>
                    </td>
                    <td className="py-2.5">
                      <Badge tone={s.active ? "green" : "red"}>
                        {s.active ? "Aktif" : "Nyahaktif"}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right">
                      {s.id !== user.id && (
                        <form action={toggleStaffActiveAction}>
                          <input type="hidden" name="id" value={s.id} />
                          <Button type="submit" variant="ghost" className="!py-1 !px-2 !text-xs">
                            {s.active ? "Nyahaktif" : "Aktif"}
                          </Button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
