"use client";

import { z } from "zod";
import { useInteractiveFetch } from "@/lib/use-interactive-fetch";
import { useUrlState } from "@/lib/use-url-state";
import { ConsoleDetailPanel, ConsoleKicker, ConsoleSelectableList, ConsoleSurface } from "@/components/ui/console-kit";

const schema = z.object({
  selected: z.string().optional(),
});

type RailItem = {
  id: string;
  title: string;
  subtitle?: string;
  detail?: string;
};

export function InteractiveRail({
  title,
  items,
  fetchPathTemplate,
  detailTitle = "Selected detail",
}: {
  title: string;
  items: RailItem[];
  fetchPathTemplate?: string;
  detailTitle?: string;
}) {
  const { state, setState } = useUrlState({
    schema,
    defaults: {
      selected: items[0]?.id ?? "",
    },
  });

  const selectedId = state.selected || items[0]?.id || "";
  const selectedLocal = items.find((item) => item.id === selectedId) ?? items[0] ?? null;
  const resolvedFetchUrl =
    fetchPathTemplate && selectedId
      ? fetchPathTemplate.replaceAll("{id}", encodeURIComponent(selectedId))
      : null;

  const { data, loading, error } = useInteractiveFetch<{
    selected?: { id: string; detail?: string; title?: string; subtitle?: string } | null;
  }>({
    url: resolvedFetchUrl,
    enabled: Boolean(resolvedFetchUrl),
  });

  const selectedDetail = data?.selected?.detail ?? selectedLocal?.detail;
  const selectedTitle = data?.selected?.title ?? selectedLocal?.title;

  return (
    <div className="space-y-4">
      <ConsoleSurface className="p-5">
        <ConsoleKicker>{title}</ConsoleKicker>
        <div className="mt-4">
          <ConsoleSelectableList
            items={items}
            selectedId={selectedId}
            onSelect={(id) => setState({ selected: id })}
            renderItem={(item) => (
              <div>
                <p className="text-sm font-medium text-[#f5f7f4]">{item.title}</p>
                {item.subtitle ? <p className="mt-1 text-sm text-[#a0a8a0]">{item.subtitle}</p> : null}
              </div>
            )}
          />
        </div>
      </ConsoleSurface>
      <ConsoleDetailPanel title={detailTitle} loading={loading} error={error}>
        <p className="text-sm font-medium text-[#f5f7f4]">{selectedTitle}</p>
        <p className="mt-2 text-sm leading-7 text-[#a0a8a0]">{selectedDetail ?? "No detail available."}</p>
      </ConsoleDetailPanel>
    </div>
  );
}
