import { PageHeader } from "@/components/app-shell/page-header";
import { ConsoleChip, ConsoleKicker, ConsoleRow, ConsoleSurface } from "@/components/ui/console-kit";
import { InteractiveRail } from "@/components/ui/interactive-rail";
import { requirePlatformAccess } from "@/server/auth/session";
import { getOrganizationSettings } from "@/server/services/settings-service";

export default async function SettingsPage() {
  const context = await requirePlatformAccess();
  const settings = await getOrganizationSettings(context.organization.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Organization, API keys, and security posture"
        description="Manage organization identity, runtime credentials, team access, audit visibility, and the placeholder enterprise controls reserved for a deeper backend pass."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_320px]">
        <ConsoleSurface className="p-6">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              {[
                ["Name", settings.organization?.name ?? "—"],
                ["Tier", settings.organization?.tier ?? "—"],
                ["Domain", settings.organization?.domain ?? "—"],
              ].map(([label, value], index) => (
                <ConsoleRow key={label} tone={index === 0 ? "accent" : "subtle"}>
                  <ConsoleKicker>{label}</ConsoleKicker>
                  <p className="mt-2 text-sm text-[#f5f7f4]">{value}</p>
                </ConsoleRow>
              ))}
            </div>
            <div className="border border-[#1b1f1b] bg-[#050505] p-4">
              <ConsoleKicker>Team access</ConsoleKicker>
              <div className="mt-4 space-y-3">
                {settings.members.map((member) => (
                  <ConsoleRow key={member.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#f5f7f4]">{member.user.fullName}</p>
                        <p className="mt-1 text-sm text-[#a0a8a0]">{member.user.email}</p>
                      </div>
                      <ConsoleChip tone="accent">{member.role}</ConsoleChip>
                    </div>
                  </ConsoleRow>
                ))}
              </div>
            </div>
          </div>
        </ConsoleSurface>

        <ConsoleSurface className="p-4">
          <ConsoleKicker>Security posture</ConsoleKicker>
          <p className="mt-2 text-sm text-[#a0a8a0]">Current build placeholders that stay visible to the operator.</p>
          <div className="mt-4 space-y-2">
            {[
              "Environment defaults, webhooks, retention, and billing remain structured placeholders.",
              "API keys are visible with prefix-only display and revocation state.",
              "Audit activity remains attached to the organization configuration surface.",
            ].map((item) => (
              <ConsoleRow key={item}>{item}</ConsoleRow>
            ))}
          </div>
        </ConsoleSurface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <ConsoleSurface className="p-6">
          <div className="flex items-center justify-between gap-4 border-b border-[#1b1f1b] pb-4">
            <div>
              <ConsoleKicker>API keys</ConsoleKicker>
              <p className="mt-2 text-xl font-semibold text-[#f5f7f4]">Runtime credentials and scope visibility</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {settings.apiKeys.map((apiKey, index) => (
              <ConsoleRow key={apiKey.id} tone={index === 0 ? "accent" : "subtle"}>
                <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center">
                  <div>
                    <p className="text-sm font-medium text-[#f5f7f4]">{apiKey.name}</p>
                    <p className="mt-1 font-mono text-[12px] text-[#6f776f]">
                      {apiKey.prefix}…{apiKey.lastFour}
                    </p>
                  </div>
                  <p className="text-sm text-[#a0a8a0]">{apiKey.scopes.join(", ")}</p>
                  <p className="text-sm text-[#a0a8a0]">{apiKey.revokedAt ? "Revoked" : "Active"}</p>
                  <ConsoleChip tone={apiKey.revokedAt ? "critical" : "accent"}>
                    {apiKey.revokedAt ? "ERROR" : "CONNECTED"}
                  </ConsoleChip>
                </div>
              </ConsoleRow>
            ))}
          </div>
        </ConsoleSurface>

        <InteractiveRail
          title="Audit activity"
          detailTitle="Audit log detail"
          fetchPathTemplate="/api/settings/audit?interactive=1&selectedId={id}"
          items={settings.auditLogs.map((log) => ({
            id: log.id,
            title: log.action,
            subtitle: `${log.actorName} · ${log.targetType}`,
            detail: JSON.stringify(log.metadata ?? {}, null, 2),
          }))}
        />
      </div>
    </div>
  );
}
