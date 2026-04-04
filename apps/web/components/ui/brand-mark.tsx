"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

function TriangleMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      data-brand-mark-icon
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-[#a3ff12] [filter:drop-shadow(0_0_7px_rgba(163,255,18,0.34))]",
        compact ? "size-5" : "size-6",
        className,
      )}
    >
      <svg viewBox="0 0 24 22" fill="none" className="size-full">
        <path
          d="M12 2.5L21 19.5H3L12 2.5Z"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function BrandMark({
  href = "/",
  compact = false,
  muted = false,
  iconOnly = false,
  label = "RiskDelta",
  sublabel = "Runtime control plane",
  className,
}: {
  href?: string;
  compact?: boolean;
  muted?: boolean;
  iconOnly?: boolean;
  label?: string;
  sublabel?: string | null;
  className?: string;
}) {
  const showSublabel = !compact && !iconOnly && sublabel;

  return (
    <Link
      href={href}
      aria-label={label}
      data-brand-mark
      className={cn("group inline-flex items-center gap-3", compact && "gap-2.5", className)}
    >
      <TriangleMark compact={compact} />
      <span className={cn("min-w-0 leading-none", iconOnly && "hidden")}>
        <span
          className={cn(
            "block text-sm font-semibold tracking-[-0.04em]",
            muted ? "text-[var(--foreground-soft)]" : "text-white",
          )}
        >
          {label}
        </span>
        {showSublabel ? (
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            {sublabel}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
