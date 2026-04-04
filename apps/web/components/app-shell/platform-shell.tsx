"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-shell/app-header";
import { AppSidebar } from "@/components/app-shell/app-sidebar";

const SIDEBAR_KEY = "riskdelta-sidebar-collapsed";

export function PlatformShell({
  children,
  userName,
  organizationName,
  projectNames,
}: {
  children: React.ReactNode;
  userName: string;
  organizationName: string;
  projectNames: string[];
}) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_KEY) === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f7f4]">
      <div className="flex min-h-screen w-full">
        <AppSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />
        <div className="min-w-0 flex-1">
          <AppHeader
            userName={userName}
            organizationName={organizationName}
            projectNames={projectNames}
            collapsed={collapsed}
            onOpenMobileNav={() => setMobileOpen(true)}
            onToggleCollapsed={() => setCollapsed((value) => !value)}
          />
          <main className="mx-auto min-h-[calc(100vh-48px)] w-full max-w-[1680px] px-4 py-5 md:px-6 md:py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
