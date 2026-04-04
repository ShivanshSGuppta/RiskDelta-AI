"use client";

import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          className: "surface-panel text-sm text-[var(--foreground)] border-[var(--border)]",
        }}
      />
    </>
  );
}
