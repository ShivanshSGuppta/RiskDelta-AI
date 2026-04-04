import { DocsBrowser } from "@/components/docs/docs-browser";
import { DocsFoundationPanels } from "@/components/docs/docs-foundation-panels";
import { RiskPlayground } from "@/components/docs/risk-playground";
import { PageHeader } from "@/components/app-shell/page-header";
import { requirePlatformAccess } from "@/server/auth/session";
import { getDocsFoundation } from "@/server/services/docs-service";

export default async function DocsPage() {
  const context = await requirePlatformAccess();
  const docsFoundation = await getDocsFoundation(context.organization.id);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Docs"
        title="Read the product model and simulate a request without leaving the workspace"
        description="Documentation, technical snippets, and the runtime playground stay inside the same operator environment."
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_380px]">
        <DocsBrowser />
        <RiskPlayground
          projects={context.projects.map((project) => ({
            id: project.id,
            name: project.name,
            environment: project.environment,
            provider: project.provider,
          }))}
        />
      </div>
      <DocsFoundationPanels
        initialData={{
          sections: docsFoundation.sections,
          latestAudit: docsFoundation.latestAudit ?? [],
          selectedSection: docsFoundation.sections[0] ?? null,
        }}
      />
    </div>
  );
}
