import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateMY } from "@/lib/date";
import {
  ADMIN_ROLES,
  MANAGER_ROLES,
  TASK_CATEGORY,
  TASK_STATUS,
} from "@/lib/constants";
import { Card, SectionTitle, Badge, EmptyState, Button } from "@/components/ui";
import { TaskForm } from "@/components/task-form";
import { updateTaskStatusAction } from "@/lib/actions/task";

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const isManager = MANAGER_ROLES.includes(user.role);
  const isAdmin = ADMIN_ROLES.includes(user.role);

  const tasks = await prisma.task.findMany({
    where: isManager
      ? isAdmin
        ? {}
        : { branchId: user.branchId }
      : { assigneeId: user.id },
    include: { assignee: true, branch: true },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });

  const staff = isManager
    ? await prisma.user.findMany({
        where: { active: true, ...(isAdmin ? {} : { branchId: user.branchId }) },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    : [];

  const cols = [
    { key: "TODO", tone: "slate" as const },
    { key: "IN_PROGRESS", tone: "blue" as const },
    { key: "DONE", tone: "green" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Tugas</h1>
        <p className="text-sm text-slate-500">
          {isManager
            ? "Pantau & agih tugas: outreach, promosi, edukasi, mesyuarat."
            : "Senarai tugas yang diberikan kepada anda."}
        </p>
      </div>

      {isManager && (
        <Card className="p-5">
          <TaskForm staff={staff} />
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {cols.map((col) => {
          const items = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key}>
              <div className="flex items-center gap-2 mb-3">
                <Badge tone={col.tone}>{TASK_STATUS[col.key]}</Badge>
                <span className="text-sm text-slate-400">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <Card className="p-4">
                    <EmptyState text="Tiada tugas." />
                  </Card>
                ) : (
                  items.map((t) => (
                    <Card key={t.id} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium text-slate-800">{t.title}</div>
                        {t.priority === "HIGH" && <Badge tone="red">Penting</Badge>}
                      </div>
                      {t.description && (
                        <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-full">
                          {TASK_CATEGORY[t.category]}
                        </span>
                        {t.assignee && <span>👤 {t.assignee.name.replace(/\(.*?\)/g, "").trim()}</span>}
                        {t.dueDate && <span>📅 {formatDateMY(t.dueDate)}</span>}
                      </div>
                      <div className="flex gap-1.5 mt-3">
                        {cols
                          .filter((c) => c.key !== t.status)
                          .map((c) => (
                            <form key={c.key} action={updateTaskStatusAction}>
                              <input type="hidden" name="id" value={t.id} />
                              <input type="hidden" name="status" value={c.key} />
                              <Button type="submit" variant="secondary" className="!py-1 !px-2.5 !text-xs">
                                → {TASK_STATUS[c.key]}
                              </Button>
                            </form>
                          ))}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
