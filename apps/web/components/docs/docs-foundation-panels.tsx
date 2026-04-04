"use client";

import { z } from "zod";
import {
  ConsoleDetailPanel,
  ConsoleKicker,
  ConsoleRow,
  ConsoleSelectableList,
  ConsoleSurface,
} from "@/components/ui/console-kit";
import { formatDateTime } from "@/lib/utils";
import { useInteractiveFetch } from "@/lib/use-interactive-fetch";
import { useUrlState } from "@/lib/use-url-state";

const schema = z.object({
  section: z.string().optional(),
  selected: z.string().optional(),
});

type FoundationPayload = {
  sections: Array<{ id: string; title: string; summary: string }>;
  latestAudit: Array<{
    id: string;
    action: string;
    actorName: string;
    createdAt: string | Date;
    targetType: string;
  }>;
  selectedSection?: { id: string; title: string; summary: string } | null;
};

export function DocsFoundationPanels({
  initialData,
}: {
  initialData: FoundationPayload;
}) {
  const { state, setState } = useUrlState({
    schema,
    defaults: {
      section: initialData.sections[0]?.id ?? "",
      selected: initialData.latestAudit[0]?.id ?? "",
    },
  });

  const { data, loading, error } = useInteractiveFetch<FoundationPayload>({
    url: `/api/docs/foundation?interactive=1&section=${encodeURIComponent(state.section ?? "")}`,
  });

  const sections = data?.sections ?? initialData.sections;
  const audit = data?.latestAudit ?? initialData.latestAudit;
  const selectedSection =
    data?.selectedSection ??
    sections.find((entry) => entry.id === state.section) ??
    sections[0] ??
    null;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <ConsoleSurface className="p-5">
        <ConsoleKicker>Docs foundation</ConsoleKicker>
        <div className="mt-4">
          <ConsoleSelectableList
            items={sections}
            selectedId={selectedSection?.id ?? ""}
            onSelect={(id) => setState({ section: id })}
            renderItem={(item) => (
              <div>
                <div className="text-sm font-medium text-[#f5f7f4]">{item.title}</div>
                <div className="mt-1 text-sm text-[#a0a8a0]">{item.summary}</div>
              </div>
            )}
          />
        </div>
      </ConsoleSurface>

      <div className="space-y-4">
        <ConsoleDetailPanel title="Section detail" loading={loading} error={error}>
          <p className="text-sm leading-7 text-[#a0a8a0]">{selectedSection?.summary ?? "No section selected."}</p>
        </ConsoleDetailPanel>
        <ConsoleSurface className="p-5">
          <ConsoleKicker>Recent docs-linked audit</ConsoleKicker>
          <div className="mt-4 space-y-2">
            {audit.map((entry) => (
              <ConsoleRow key={entry.id}>
                <div className="text-sm font-medium text-[#f5f7f4]">{entry.action}</div>
                <div className="mt-1 text-sm text-[#a0a8a0]">{entry.actorName}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">
                  {formatDateTime(entry.createdAt)}
                </div>
              </ConsoleRow>
            ))}
          </div>
        </ConsoleSurface>
      </div>
    </div>
  );
}
