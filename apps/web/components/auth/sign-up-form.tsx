"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/app/onboarding";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    companyName: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const passwordScore = useMemo(() => {
    let score = 0;
    if (form.password.length >= 10) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/\d/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;
    return score;
  }, [form.password]);

  const passwordLabel = ["Weak", "Fair", "Good", "Strong"][Math.max(0, passwordScore - 1)] ?? "Weak";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, redirectTo }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create account");
      }

      toast.success("Account created");
      startTransition(() => router.push(payload.redirectTo ?? "/app/onboarding"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="fullName" className="text-[#f5f7f4]">Full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            required
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workEmail" className="text-[#f5f7f4]">Work email</Label>
          <Input
            id="workEmail"
            type="email"
            autoComplete="email"
            required
            value={form.workEmail}
            onChange={(event) => setForm((current) => ({ ...current, workEmail: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-[#f5f7f4]">Company name</Label>
          <Input
            id="companyName"
            autoComplete="organization"
            required
            value={form.companyName}
            onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#f5f7f4]">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <div className="flex items-center gap-2 pt-1">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 ${index < passwordScore ? "bg-[#a3ff12]" : "bg-[#1b1f1b]"}`}
              />
            ))}
          </div>
          <p className="text-xs text-[#6f776f]">Password strength: {passwordLabel}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[#f5f7f4]">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirmPassword}
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 border border-[#1b1f1b] bg-[#0a0b0a] p-4 text-sm text-[#a0a8a0]">
        <Checkbox
          checked={form.acceptTerms}
          onCheckedChange={(checked) => setForm((current) => ({ ...current, acceptTerms: checked === true }))}
        />
        <span>I accept the platform terms, data handling policy, and the local demo runtime-control disclaimer.</span>
      </label>

      <div className="space-y-3">
        <Button className="w-full rounded-none" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[#1b1f1b]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">or</span>
          <div className="h-px flex-1 bg-[#1b1f1b]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            disabled
            aria-disabled="true"
            className="h-11 justify-start rounded-none border-[#1b1f1b] bg-[#111411] opacity-70"
          >
            Google SSO (coming soon)
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled
            aria-disabled="true"
            className="h-11 justify-start rounded-none border-[#1b1f1b] bg-[#111411] opacity-70"
          >
            GitHub SSO (coming soon)
          </Button>
        </div>
      </div>
    </form>
  );
}
