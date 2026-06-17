import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Shell } from "@/components/shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <Shell
      user={{
        name: user.name,
        role: user.role,
        branchName: user.branch?.name ?? null,
      }}
    >
      {children}
    </Shell>
  );
}
