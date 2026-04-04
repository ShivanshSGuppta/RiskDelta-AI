"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MarketingSection({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
}) {
  return (
    <section {...props} className={cn("mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20", className)}>
      {children}
    </section>
  );
}

export function MarketingEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-mono text-[10px] uppercase tracking-[0.22em] text-[#a0a8a0]", className)}>
      {children}
    </p>
  );
}

export function MarketingTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "font-display text-balance text-[3.4rem] font-semibold leading-[0.92] tracking-[-0.065em] text-white md:text-[4.6rem] xl:text-[5.15rem]",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function MarketingLead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("max-w-2xl text-[15px] leading-8 text-[#a0a8a0]", className)}>
      {children}
    </p>
  );
}

export function MarketingSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-[#1b1f1b] bg-[linear-gradient(180deg,rgba(255,255,255,0.014),transparent_16%),linear-gradient(180deg,rgba(13,15,13,0.98),rgba(8,9,8,0.98))] shadow-[0_28px_80px_rgba(0,0,0,0.42)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MarketingInset({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-[#1b1f1b] bg-[rgba(10,11,10,0.96)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MarketingDivider({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("h-px w-full bg-[#1b1f1b]", className)} />;
}
