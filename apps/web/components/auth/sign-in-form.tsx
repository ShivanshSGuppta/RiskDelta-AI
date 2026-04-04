"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/app";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, redirectTo }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to sign in");
      }

      toast.success("Signed in");
      startTransition(() => router.push(payload.redirectTo ?? redirectTo));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#f5f7f4]">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="founder@riskdelta.dev"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[#f5f7f4]">Password</Label>
            <Link href="#" className="text-xs text-[#a3ff12]">
              Forgot password
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Enter your password"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Button className="w-full rounded-none" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[#1b1f1b]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">or</span>
          <div className="h-px flex-1 bg-[#1b1f1b]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" className="h-11 justify-start rounded-none border-[#1b1f1b] bg-[#111411] hover:bg-[#111411]">
            Google placeholder
          </Button>
          <Button type="button" variant="secondary" className="h-11 justify-start rounded-none border-[#1b1f1b] bg-[#111411] hover:bg-[#111411]">
            GitHub placeholder
          </Button>
        </div>
      </div>
    </form>
  );
}
