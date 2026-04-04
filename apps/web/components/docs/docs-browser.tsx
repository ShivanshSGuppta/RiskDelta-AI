"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { docsSections } from "@/content/docs";
import { ConsoleKicker } from "@/components/ui/console-kit";
import { cn } from "@/lib/utils";
import { useUrlState } from "@/lib/use-url-state";

const urlSchema = z.object({
  section: z.string().optional(),
});

export function DocsBrowser() {
  const { state, setState } = useUrlState({
    schema: urlSchema,
    defaults: {
      section: docsSections[0]?.id,
    },
  });
  const active = docsSections.find((section) => section.id === state.section) ?? docsSections[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="h-fit border border-[#1b1f1b] bg-[#0d0f0d] p-4">
        <ConsoleKicker>Docs index</ConsoleKicker>
        <div className="mt-4 space-y-1.5">
          {docsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setState({ section: section.id })}
              className={cn(
                "block w-full border-l-2 px-3 py-3 text-left text-sm transition",
                section.id === state.section
                  ? "border-[#a3ff12] bg-[#111411] text-white"
                  : "border-transparent text-[#a0a8a0] hover:bg-[#0a0a0a] hover:text-white",
              )}
            >
              {section.title}
            </button>
          ))}
        </div>
      </aside>

      <div className="border border-[#1b1f1b] bg-[#050505] p-5 md:p-6">
        <div className="border-b border-[#1b1f1b] pb-4">
          <ConsoleKicker>Documentation</ConsoleKicker>
          <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-white">{active.title}</h2>
        </div>
        <div className="prose prose-invert mt-6 max-w-none prose-headings:font-sans prose-headings:text-white prose-p:text-[#a0a8a0] prose-li:text-[#a0a8a0] prose-strong:text-white prose-code:text-[#a3ff12]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
