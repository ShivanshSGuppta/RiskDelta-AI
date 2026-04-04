"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConsoleKicker, ConsoleSurface } from "@/components/ui/console-kit";

export function CodeBlock({
  code,
  language,
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <ConsoleSurface className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#1b1f1b] bg-[#0a0a0a] px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{title ?? "Snippet"}</p>
          {language ? <ConsoleKicker className="mt-1">{language}</ConsoleKicker> : null}
        </div>
        <Button size="sm" variant="ghost" className="rounded-none" onClick={handleCopy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto bg-[#050505] px-4 py-4 font-mono text-[13px] leading-7 text-[#e6ffc4]">
        <code>{code}</code>
      </pre>
    </ConsoleSurface>
  );
}
