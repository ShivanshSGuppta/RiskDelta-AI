"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/brand-mark";

const navigation = [
  { label: "Product", href: "/" },
  { label: "Integrations", href: "/integrations" },
  { label: "Docs", href: "/docs-preview" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
] as const;

function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[rgba(5,5,5,0.9)] backdrop-blur-md">
      <div className="site-shell">
        <div className="flex items-center justify-between border-b border-[#1b1f1b] py-4">
          <BrandMark compact label="RiskDelta" sublabel={null} />
        <nav className="hidden items-center gap-7 text-sm text-[var(--muted-foreground)] lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans font-medium text-[#a0a8a0] transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/signin"
            className="font-sans text-sm font-medium text-[#a0a8a0] transition hover:text-white"
          >
            Sign in
          </Link>
          <Button asChild size="sm" variant="outline" className="rounded-none border-[#1b1f1b] bg-transparent text-[#f5f7f4] hover:border-[rgba(163,255,18,0.24)] hover:bg-[rgba(163,255,18,0.04)]">
            <Link href="/signup">Try free</Link>
          </Button>
        </div>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex border border-[#1b1f1b] bg-[rgba(13,15,13,0.78)] p-2 text-[#a0a8a0] transition hover:text-white lg:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      </div>
      {open ? (
        <div className="site-shell lg:hidden">
          <div className="mt-3 border border-[#1b1f1b] bg-[rgba(13,15,13,0.96)] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 font-sans text-sm text-[#a0a8a0] transition hover:bg-[rgba(163,255,18,0.05)] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button asChild variant="secondary" size="sm">
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-none border-[#1b1f1b] bg-transparent text-[#f5f7f4] hover:border-[rgba(163,255,18,0.24)] hover:bg-[rgba(163,255,18,0.04)]">
                <Link href="/signup">Try free</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-[#050505] pb-10 pt-14 md:pb-12 md:pt-16">
      <div className="site-shell">
        <div className="border-t border-[#1b1f1b] pt-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <BrandMark muted compact label="RiskDelta" sublabel={null} />
              <p className="mt-4 max-w-sm text-sm leading-7 text-[#a0a8a0]">
                AI runtime control for prompts, tools, outputs, models, incidents, and operator evidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-sans text-sm text-[#6f776f]">
              <Link href="/" className="transition hover:text-white">
                Product
              </Link>
              <Link href="/integrations" className="transition hover:text-white">
                Integrations
              </Link>
              <Link href="/docs-preview" className="transition hover:text-white">
                Docs
              </Link>
              <Link href="/security" className="transition hover:text-white">
                Security
              </Link>
              <Link href="/pricing" className="transition hover:text-white">
                Pricing
              </Link>
              <Link href="/signin" className="transition hover:text-white">
                Sign in
              </Link>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-[#1b1f1b] pt-6 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f776f]">
              Built for operators shipping real AI systems in production.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f776f]">
              © {new Date().getFullYear()} RiskDelta
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <div className={`min-h-screen ${className ?? ""}`}>{children}</div>;
  }

  return (
    <div className={`min-h-screen bg-[#050505] ${className ?? ""}`}>
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
