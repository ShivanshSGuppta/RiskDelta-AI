import { ConsoleKicker, ConsoleMetric, ConsolePanel, ConsoleRow, ConsoleSurface } from "@/components/ui/console-kit";
import { cn } from "@/lib/utils";

export function MetricStack({
  title,
  value,
  detail,
  tone = "default",
}: {
  title: string;
  value: string;
  detail?: string;
  tone?: "default" | "accent" | "danger" | "warning";
}) {
  const toneClass =
    tone === "danger"
      ? "border-[rgba(218,110,98,0.2)]"
      : tone === "accent"
        ? "border-[rgba(183,255,58,0.2)]"
        : tone === "warning"
          ? "border-[rgba(203,163,93,0.2)]"
          : "";

  return (
    <ConsoleMetric
      label={title}
      value={value}
      detail={detail}
      tone={tone === "danger" ? "critical" : tone === "accent" ? "accent" : tone === "warning" ? "warning" : "subtle"}
      className={toneClass}
    />
  );
}

export function PanelList({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ConsoleSurface className={cn("p-4 md:p-5", className)}>
      <ConsoleKicker>{title}</ConsoleKicker>
      {description ? <p className="mt-2 text-sm leading-7 text-[#a0a8a0]">{description}</p> : null}
      <div className="mt-4 space-y-3">{children}</div>
    </ConsoleSurface>
  );
}

export function SignalListItem({
  title,
  meta,
  description,
  tone = "default",
  action,
  className,
}: {
  title: string;
  meta?: React.ReactNode;
  description?: React.ReactNode;
  tone?: "default" | "accent" | "critical";
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <ConsoleRow
      tone={tone === "critical" ? "critical" : tone === "accent" ? "accent" : "subtle"}
      className={className}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{title}</p>
          {description ? <div className="mt-2 text-sm leading-6 text-[#a0a8a0]">{description}</div> : null}
        </div>
        {meta ? <div className="shrink-0">{meta}</div> : null}
      </div>
      {action ? <div className="mt-3">{action}</div> : null}
    </ConsoleRow>
  );
}

export function TimelineRail({
  items,
  className,
}: {
  items: Array<{ label: string; title: string; detail: string }>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div key={`${item.label}-${item.title}-${index}`} className="grid grid-cols-[22px_minmax(0,1fr)] gap-4">
          <div className="flex flex-col items-center">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
            {index < items.length - 1 ? <span className="mt-2 w-px flex-1 bg-white/10" /> : null}
          </div>
          <ConsoleRow>
            <ConsoleKicker>{item.label}</ConsoleKicker>
            <p className="mt-2 text-sm font-medium text-white">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-[#a0a8a0]">{item.detail}</p>
          </ConsoleRow>
        </div>
      ))}
    </div>
  );
}

export function DefinitionList({
  items,
  className,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <ConsoleRow key={item.label}>
          <dt>
            <ConsoleKicker>{item.label}</ConsoleKicker>
          </dt>
          <dd className="mt-2 text-sm leading-6 text-white">{item.value}</dd>
        </ConsoleRow>
      ))}
    </dl>
  );
}

export function ComparisonRow({
  label,
  expected,
  actual,
  note,
}: {
  label: string;
  expected: React.ReactNode;
  actual: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <ConsolePanel tone="subtle" className="p-4">
      <ConsoleKicker>{label}</ConsoleKicker>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <ConsoleRow>
          <ConsoleKicker>Expected</ConsoleKicker>
          <div className="mt-2 text-sm leading-6 text-white">{expected}</div>
        </ConsoleRow>
        <ConsoleRow tone="critical">
          <ConsoleKicker>Actual</ConsoleKicker>
          <div className="mt-2 text-sm leading-6 text-white">{actual}</div>
        </ConsoleRow>
      </div>
      {note ? <div className="mt-3 text-sm leading-6 text-[#a0a8a0]">{note}</div> : null}
    </ConsolePanel>
  );
}
