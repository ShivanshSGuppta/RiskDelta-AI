"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const toneClasses = {
  neutral: "border-[#1b1f1b] bg-[#0d0f0d]",
  subtle: "border-[#1b1f1b] bg-[#0a0b0a]",
  elevated: "border-[#1b1f1b] bg-[#111411]",
  critical: "border-[rgba(255,93,93,0.32)] bg-[rgba(255,93,93,0.08)]",
  warning: "border-[rgba(245,181,70,0.26)] bg-[rgba(245,181,70,0.08)]",
  accent: "border-[rgba(163,255,18,0.22)] bg-[rgba(163,255,18,0.06)]",
} as const;

export function ConsoleKicker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f776f]", className)}>
      {children}
    </p>
  );
}

export function ConsolePageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-5", className)}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div className="max-w-4xl space-y-4">
          {eyebrow ? <ConsoleKicker>{eyebrow}</ConsoleKicker> : null}
          <div className="space-y-3">
            <h1 className="max-w-4xl font-sans text-[2.2rem] font-semibold tracking-[-0.05em] text-[#f5f7f4] md:text-[3.1rem]">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[#a0a8a0] md:text-[15px]">{description}</p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children ? <div className="border border-[#1b1f1b] bg-[#0a0a0a] p-4">{children}</div> : null}
    </section>
  );
}

export function ConsolePanel({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <div className={cn("border p-4", toneClasses[tone], className)}>
      {children}
    </div>
  );
}

export function ConsoleSurface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-[#1b1f1b] bg-[#0d0f0d] shadow-[0_20px_60px_rgba(0,0,0,0.34)]", className)}>
      {children}
    </div>
  );
}

export function ConsoleMetric({
  label,
  value,
  tone = "subtle",
  detail,
  className,
}: {
  label: string;
  value: React.ReactNode;
  tone?: keyof typeof toneClasses;
  detail?: React.ReactNode;
  className?: string;
}) {
  return (
    <ConsolePanel tone={tone} className={className}>
      <ConsoleKicker>{label}</ConsoleKicker>
      <div className="mt-3 font-sans text-2xl font-semibold tracking-[-0.05em] text-[#f5f7f4]">{value}</div>
      {detail ? <div className="mt-2 text-sm leading-6 text-[#a0a8a0]">{detail}</div> : null}
    </ConsolePanel>
  );
}

export function ConsoleChip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "warning" | "critical" | "success";
  className?: string;
}) {
  const chipTone =
    tone === "critical"
      ? "border-[rgba(255,93,93,0.28)] bg-[rgba(255,93,93,0.12)] text-[#ff8a8a]"
      : tone === "warning"
        ? "border-[rgba(245,181,70,0.28)] bg-[rgba(245,181,70,0.12)] text-[#f5b546]"
        : tone === "accent"
          ? "border-[rgba(163,255,18,0.26)] bg-[rgba(163,255,18,0.08)] text-[#a3ff12]"
          : tone === "success"
            ? "border-[rgba(125,255,122,0.24)] bg-[rgba(125,255,122,0.08)] text-[#7dff7a]"
            : "border-[#1b1f1b] bg-[#0a0b0a] text-[#a0a8a0]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
        chipTone,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ConsoleRow({
  children,
  tone = "subtle",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  return <ConsolePanel tone={tone} className={cn("px-4 py-3", className)}>{children}</ConsolePanel>;
}

export function ConsoleSelectableRow({
  id,
  selected = false,
  expanded = false,
  loading = false,
  disabled = false,
  tone = "subtle",
  onSelect,
  onToggleExpand,
  children,
  detail,
  className,
}: {
  id: string;
  selected?: boolean;
  expanded?: boolean;
  loading?: boolean;
  disabled?: boolean;
  tone?: keyof typeof toneClasses;
  onSelect?: (id: string) => void;
  onToggleExpand?: (id: string) => void;
  children: React.ReactNode;
  detail?: React.ReactNode;
  className?: string;
}) {
  return (
    <ConsolePanel
      tone={tone}
      className={cn(
        "group px-0 py-0 transition-colors motion-reduce:transition-none",
        selected && "border-[rgba(163,255,18,0.3)] bg-[rgba(163,255,18,0.08)]",
        className,
      )}
    >
      <button
        type="button"
        aria-pressed={selected}
        aria-expanded={detail ? expanded : undefined}
        disabled={disabled}
        onClick={() => {
          onSelect?.(id);
          if (detail) onToggleExpand?.(id);
        }}
        className={cn(
          "w-full px-4 py-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-[rgba(163,255,18,0.6)]",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">{children}</div>
          {loading ? (
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">loading</span>
          ) : detail ? (
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">
              {expanded ? "collapse" : "expand"}
            </span>
          ) : null}
        </div>
      </button>
      {detail && expanded ? <div className="border-t border-[#1b1f1b] px-4 py-3">{detail}</div> : null}
    </ConsolePanel>
  );
}

export function ConsoleAccordionRail<T extends { id: string }>({
  items,
  selectedId,
  expandedIds,
  onSelect,
  onToggleExpand,
  renderItem,
  renderDetail,
  getTone,
  className,
}: {
  items: T[];
  selectedId: string;
  expandedIds: string[];
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  renderDetail?: (item: T) => React.ReactNode;
  getTone?: (item: T, selected: boolean) => keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const selected = item.id === selectedId;
        return (
          <ConsoleSelectableRow
            key={item.id}
            id={item.id}
            selected={selected}
            expanded={expandedIds.includes(item.id)}
            onSelect={onSelect}
            onToggleExpand={onToggleExpand}
            tone={getTone?.(item, selected) ?? (selected ? "accent" : "subtle")}
            detail={renderDetail ? renderDetail(item) : undefined}
          >
            {renderItem(item, selected)}
          </ConsoleSelectableRow>
        );
      })}
    </div>
  );
}

export function ConsoleSelectableList<T extends { id: string }>({
  items,
  selectedId,
  onSelect,
  renderItem,
  getTone,
  className,
}: {
  items: T[];
  selectedId: string;
  onSelect: (id: string) => void;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  getTone?: (item: T, selected: boolean) => keyof typeof toneClasses;
  className?: string;
}) {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  function move(direction: 1 | -1) {
    if (items.length === 0) return;
    const currentIndex = items.findIndex((item) => item.id === selectedId);
    const base = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (base + direction + items.length) % items.length;
    const next = items[nextIndex];
    if (!next) return;
    onSelect(next.id);
    refs.current[next.id]?.focus();
  }

  return (
    <div
      role="listbox"
      aria-activedescendant={selectedId}
      className={cn("space-y-2", className)}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      {items.map((item) => {
        const selected = item.id === selectedId;
        return (
          <ConsolePanel
            key={item.id}
            tone={getTone?.(item, selected) ?? (selected ? "accent" : "subtle")}
            className={cn("px-0 py-0 transition-colors motion-reduce:transition-none", selected && "border-[rgba(163,255,18,0.3)]")}
          >
            <button
              ref={(node) => {
                refs.current[item.id] = node;
              }}
              id={item.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(item.id)}
              className="w-full px-4 py-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-[rgba(163,255,18,0.6)]"
            >
              {renderItem(item, selected)}
            </button>
          </ConsolePanel>
        );
      })}
    </div>
  );
}

export function ConsoleDetailPanel({
  title,
  loading = false,
  error,
  emptyLabel = "No detail available",
  children,
  className,
}: {
  title?: string;
  loading?: boolean;
  error?: string | null;
  emptyLabel?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <ConsoleSurface className={cn("p-4", className)}>
      {title ? <ConsoleKicker>{title}</ConsoleKicker> : null}
      <div className="mt-3">
        {loading ? (
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6f776f]">Loading detail…</div>
        ) : error ? (
          <div className="text-sm text-[#ff8a8a]">{error}</div>
        ) : children ? (
          children
        ) : (
          <div className="text-sm text-[#a0a8a0]">{emptyLabel}</div>
        )}
      </div>
    </ConsoleSurface>
  );
}

export function ConsoleStepRail({
  steps,
  activeStep,
  onStepChange,
  renderDetail,
  className,
}: {
  steps: Array<{ id: string; label: string; description?: string }>;
  activeStep: string;
  onStepChange: (id: string) => void;
  renderDetail?: (step: { id: string; label: string; description?: string }) => React.ReactNode;
  className?: string;
}) {
  const current = steps.find((step) => step.id === activeStep) ?? steps[0];

  return (
    <div className={cn("space-y-4", className)}>
      <ConsoleSelectableList
        items={steps}
        selectedId={current?.id ?? ""}
        onSelect={onStepChange}
        renderItem={(step) => (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">{step.id}</p>
            <p className="mt-2 text-sm text-[#f5f7f4]">{step.label}</p>
            {step.description ? <p className="mt-2 text-sm text-[#a0a8a0]">{step.description}</p> : null}
          </div>
        )}
      />
      <ConsoleDetailPanel title="Selected step detail">
        {current && renderDetail ? renderDetail(current) : current?.description}
      </ConsoleDetailPanel>
    </div>
  );
}

export function ConsoleEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <ConsoleSurface className="p-8 text-center">
      <h2 className="font-sans text-lg font-medium text-[#f5f7f4]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#a0a8a0]">{description}</p>
    </ConsoleSurface>
  );
}
