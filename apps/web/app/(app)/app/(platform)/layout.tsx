import { PlatformShell } from "@/components/app-shell/platform-shell";
import { requirePlatformAccess } from "@/server/auth/session";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const context = await requirePlatformAccess();

  return (
    <PlatformShell
      userName={context.user.fullName}
      organizationName={context.organization.name}
      projectNames={context.projects.map((project) => project.name)}
    >
      {children}
    </PlatformShell>
  );
}
