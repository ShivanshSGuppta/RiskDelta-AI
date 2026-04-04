"use client";

import { z } from "zod";
import { CodeBlock } from "@/components/ui/code-block";
import {
  ConsoleDetailPanel,
  ConsoleKicker,
  ConsoleRow,
  ConsoleSelectableList,
  ConsoleSurface,
} from "@/components/ui/console-kit";
import { useInteractiveFetch } from "@/lib/use-interactive-fetch";
import { useUrlState } from "@/lib/use-url-state";

type QuickstartPreset = {
  label: string;
  integrationType: "sdk" | "api" | "plugnplay";
  heading: string;
  install: string;
  snippet: string;
  verification: string[];
  expectedResults: string[];
};

type QuickstartData = {
  env: Record<string, string>;
  presets: QuickstartPreset[];
  selectedPreset?: QuickstartPreset | null;
};

const schema = z.object({
  preset: z.string().optional(),
  step: z.string().optional(),
  result: z.string().optional(),
});

export function QuickstartWorkbench({
  initialData,
}: {
  initialData: QuickstartData;
}) {
  const { state, setState } = useUrlState({
    schema,
    defaults: {
      preset: initialData.presets[0]?.integrationType ?? "sdk",
      step: "0",
      result: "0",
    },
  });
  const { data, loading, error } = useInteractiveFetch<QuickstartData>({
    url: `/api/quickstart?interactive=1&preset=${encodeURIComponent(state.preset ?? "sdk")}`,
  });

  const payload = data ?? initialData;
  const selectedPreset =
    payload.selectedPreset ??
    payload.presets.find((preset) => preset.integrationType === state.preset) ??
    payload.presets[0];

  const envBlock = Object.entries(payload.env)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const selectedStepIndex = Number(state.step ?? "0");
  const selectedResultIndex = Number(state.result ?? "0");
  const selectedStep = selectedPreset?.verification[selectedStepIndex] ?? selectedPreset?.verification[0];
  const selectedResult = selectedPreset?.expectedResults[selectedResultIndex] ?? selectedPreset?.expectedResults[0];

  return (
    <div className="space-y-4">
      <ConsoleSurface className="p-4">
        <ConsoleKicker>Integration presets</ConsoleKicker>
        <div className="mt-4">
          <ConsoleSelectableList
            items={payload.presets.map((preset) => ({
              id: preset.integrationType,
              label: preset.label,
            }))}
            selectedId={selectedPreset?.integrationType ?? ""}
            onSelect={(id) => setState({ preset: id, step: "0", result: "0" })}
            renderItem={(item) => <span className="text-sm text-[#f5f7f4]">{item.label}</span>}
          />
        </div>
      </ConsoleSurface>

      <div className="grid gap-4 xl:grid-cols-[1.06fr_0.94fr]">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <CodeBlock title=".env" language="bash" code={envBlock} />
            <CodeBlock title="Install / setup" language="bash" code={selectedPreset?.install ?? ""} />
          </div>
          <CodeBlock
            title="First request"
            language={selectedPreset?.integrationType === "api" ? "bash" : "typescript"}
            code={selectedPreset?.snippet ?? ""}
          />
        </div>

        <div className="space-y-4">
          <ConsoleDetailPanel title="Preset detail" loading={loading} error={error}>
            <p className="text-sm leading-7 text-[#a0a8a0]">{selectedPreset?.heading}</p>
          </ConsoleDetailPanel>
          <ConsoleSurface className="p-5">
            <ConsoleKicker>Verification flow</ConsoleKicker>
            <div className="mt-4">
              <ConsoleSelectableList
                items={(selectedPreset?.verification ?? []).map((step, index) => ({
                  id: String(index),
                  label: step,
                }))}
                selectedId={String(selectedStepIndex)}
                onSelect={(id) => setState({ step: id })}
                renderItem={(item) => <span className="text-sm text-[#f5f7f4]">{item.label}</span>}
              />
            </div>
            <div className="mt-4 border-t border-[#1b1f1b] pt-4">
              <p className="text-sm text-[#a0a8a0]">{selectedStep}</p>
            </div>
          </ConsoleSurface>
          <ConsoleSurface className="p-5">
            <ConsoleKicker>Expected product result</ConsoleKicker>
            <div className="mt-4">
              <ConsoleSelectableList
                items={(selectedPreset?.expectedResults ?? []).map((result, index) => ({
                  id: String(index),
                  label: result,
                }))}
                selectedId={String(selectedResultIndex)}
                onSelect={(id) => setState({ result: id })}
                renderItem={(item) => <span className="text-sm text-[#f5f7f4]">{item.label}</span>}
                getTone={(item, selected) => (selected ? "accent" : "subtle")}
              />
            </div>
            <div className="mt-4 border-t border-[#1b1f1b] pt-4">
              <ConsoleRow tone="accent">{selectedResult}</ConsoleRow>
            </div>
          </ConsoleSurface>
        </div>
      </div>
    </div>
  );
}
