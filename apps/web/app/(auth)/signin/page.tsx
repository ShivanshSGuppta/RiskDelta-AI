import { Suspense } from "react";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <div className="inline-flex border border-[rgba(163,255,18,0.24)] bg-[rgba(163,255,18,0.08)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#a3ff12]">
          Operator access
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-balance text-[3rem] font-semibold tracking-[-0.06em] text-white md:text-[3.8rem]">
            Sign in to inspect live runtime decisions.
          </h2>
          <p className="text-sm leading-7 text-[#a0a8a0] md:text-[15px]">
            Open TraceVault, read the policy chain, inspect tool calls, and move directly into incident workflows.
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="border border-[#1b1f1b] bg-[#0a0b0a] p-5 text-sm text-[#a0a8a0]">Loading sign-in flow...</div>}>
        <SignInForm />
      </Suspense>
      <p className="text-sm text-[#a0a8a0]">
        Need an account?{" "}
        <Link href="/signup" className="text-[#a3ff12]">
          Create one
        </Link>
      </p>
    </div>
  );
}
