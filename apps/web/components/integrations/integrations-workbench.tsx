"use client";

import { z } from "zod";
import {
  ConsoleChip,
  ConsoleDetailPanel,
  ConsoleKicker,
  ConsoleRow,
  ConsoleSelectableList,
  ConsoleSurface,
} from "@/components/ui/console-kit";
import { useInteractiveFetch } from "@/lib/use-interactive-fetch";
import { useUrlState } from "@/lib/use-url-state";

type Integration = {
  id: string;
  name: string;
  slug: string;
  category: string;
  provider: string;
  connectionState: string;
  setupSteps: string[];
  logsHint: string;
  project?: { id: string; name: string } | null;
};

const schema = z.object({
  group: z.string().optional(),
  integration: z.string().optional(),
});

export function IntegrationsWorkbench({
  initialItems,
}: {
  initialItems: Integration[];
}) {
  const { state, setState } = useUrlState({
    schema,
    defaults: {
      group: initialItems[0]?.category ?? "sdk",
      integration: initialItems[0]?.id ?? "",
    },
  });

  const { data, loading, error } = useInteractiveFetch<{
    items: Integration[];
    selected: Integration | null;
  }>({
    url: `/api/integrations?interactive=1&category=${encodeURIComponent(state.group ?? "sdk")}&selectedId=${encodeURIComponent(
      state.integration ?? "",
    )}`,
  });

  const items = data?.items?.length ? data.items : initialItems.filter((item) => item.category === state.group);
  const selected = data?.selected ?? items.find((item) => item.id === state.integration) ?? items[0] ?? null;
  const categories = ["sdk", "api", "plugnplay"];

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <ConsoleSurface className="p-5">
        <ConsoleKicker>Integration groups</ConsoleKicker>
        <div className="mt-4 space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setState({ group: category })}
              className={`w-full border px-3 py-3 text-left text-sm uppercase tracking-[0.14em] ${
                state.group === category
                  ? "border-[rgba(163,255,18,0.3)] bg-[rgba(163,255,18,0.06)] text-white"
                  : "border-[#1b1f1b] bg-[#0a0b0a] text-[#a0a8a0] hover:text-white"
              }`}
            >
              {category === "plugnplay" ? "connectors" : category}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <ConsoleSelectableList
            items={items}
            selectedId={selected?.id ?? ""}
            onSelect={(id) => setState({ integration: id })}
            renderItem={(item) => (
              <div>
                <p className="text-sm font-medium text-[#f5f7f4]">{item.name}</p>
                <p className="mt-1 text-sm text-[#a0a8a0]">{item.provider}</p>
              </div>
            )}
          />
        </div>
      </ConsoleSurface>

      <div className="space-y-4">
        <ConsoleDetailPanel title="Selected integration" loading={loading} error={error}>
          {selected ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <ConsoleChip tone={selected.connectionState === "CONNECTED" ? "accent" : selected.connectionState === "ERROR" ? "critical" : "warning"}>
                  {selected.connectionState}
                </ConsoleChip>
                <ConsoleChip tone="neutral">{selected.category}</ConsoleChip>
              </div>
              <p className="text-xl font-semibold tracking-[-0.04em] text-[#f5f7f4]">{selected.name}</p>
              <p className="text-sm leading-7 text-[#a0a8a0]">{selected.logsHint}</p>
            </div>
          ) : null}
        </ConsoleDetailPanel>

        <ConsoleSurface className="p-5">
          <ConsoleKicker>Setup path</ConsoleKicker>
          <div className="mt-4 space-y-2">
            {(selected?.setupSteps ?? []).map((step, index) => (
              <ConsoleRow key={step} tone={index === 0 ? "accent" : "subtle"}>
                {step}
              </ConsoleRow>
            ))}
          </div>
        </ConsoleSurface>
      </div>
    </div>
  );
}
