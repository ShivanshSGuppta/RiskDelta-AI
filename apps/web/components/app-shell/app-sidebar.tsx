"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { appNavigation } from "@/lib/navigation";
import { BrandMark } from "@/components/ui/brand-mark";
import { cn } from "@/lib/utils";
import { isCommercialEdition } from "@/lib/edition";

const navigationGroups = [
  {
    label: "Operations",
    items: ["Overview", "TraceVault", "Incidents"],
  },
  {
    label: "Controls",
    items: ["Policies", "Runtime Controls", "Risk"],
  },
  {
    label: "Systems",
    items: ["Applications", "Integrations", "Quickstart", "Docs", "Settings"],
  },
] as const;

export function AppSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}) {
  const pathname = usePathname();
  const commercialEdition = isCommercialEdition();
  const groupedNavigation = navigationGroups.map((group) => ({
    ...group,
    items: appNavigation.filter((item) => (group.items as readonly string[]).includes(item.title)),
  }));

  const navContent = (
    <>
      <div className={cn("flex items-center justify-between gap-3", collapsed && "xl:justify-center")}>
        <BrandMark href="/app/overview" compact iconOnly={collapsed && !mobileOpen} />

        <button
          type="button"
          onClick={onToggleCollapsed}
          className="hidden border border-[#1b1f1b] bg-[#111411] p-2 text-[#6f776f] transition hover:text-[#f5f7f4] xl:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <div className="mt-8 flex-1 space-y-6">
        {groupedNavigation.map((group) => (
          <div key={group.label}>
            <p className={cn("px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f776f]", collapsed && "xl:hidden")}>
              {group.label}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "group flex items-center gap-3 border-l-2 px-4 py-2 text-sm font-sans transition",
                      active
                        ? "border-[#a3ff12] bg-[#111411] text-[#f5f7f4]"
                        : "border-transparent text-[#a0a8a0] hover:bg-[#0a0a0a] hover:text-[#f5f7f4]",
                      collapsed && "xl:justify-center xl:px-2",
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", active ? "text-[#a3ff12]" : "text-[#6f776f]")} />
                    <span className={cn("truncate", collapsed && "xl:hidden")}>{item.title}</span>
                    {item.commercial && !commercialEdition ? (
                      <span className={cn("ml-auto border border-[rgba(245,181,70,0.28)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#f5b546]", collapsed && "xl:hidden")}>
                        BUSL
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={cn("border-t border-[#1b1f1b] pt-4", collapsed && "xl:text-center")}>
        <p className={cn("font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]", collapsed && "xl:hidden")}>
          System posture
        </p>
        <div className={cn("mt-3 border border-[#1b1f1b] bg-[#0a0b0a] px-3 py-3", collapsed && "xl:px-2")}>
          <p className={cn("text-xs text-[#f5f7f4]", collapsed && "xl:hidden")}>All core controls active in current workspace.</p>
          <p className={cn("mt-1 text-[12px] leading-5 text-[#a0a8a0]", collapsed && "xl:hidden")}>
            Trace capture healthy. Escalation chain online.
          </p>
          <span className="mt-2 block h-1.5 bg-[linear-gradient(90deg,#a3ff12,rgba(255,255,255,0.12))]" />
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className={cn("hidden shrink-0 border-r border-[#1b1f1b] bg-[#090a09] xl:block", collapsed ? "w-[88px]" : "w-[248px]")}>
        <div className="sticky top-0 flex h-screen flex-col p-4">{navContent}</div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/70"
            onClick={onCloseMobile}
          />
          <div className="relative h-full w-[min(84vw,320px)] border-r border-[#1b1f1b] bg-[#090a09] p-4">{navContent}</div>
        </div>
      ) : null}
    </>
  );
}
