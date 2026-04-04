import { Suspense } from "react";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <div className="inline-flex border border-[#1b1f1b] bg-[#111411] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#a0a8a0]">
          Workspace creation
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-balance text-[3rem] font-semibold tracking-[-0.06em] text-white md:text-[3.8rem]">
            Create the workspace that controls AI runtime behavior.
          </h2>
          <p className="text-sm leading-7 text-[#a0a8a0] md:text-[15px]">
            Provision the organization, first project, onboarding path, and initial access key without leaving the product.
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="border border-[#1b1f1b] bg-[#0a0b0a] p-5 text-sm text-[#a0a8a0]">Loading sign-up flow...</div>}>
        <SignUpForm />
      </Suspense>
      <p className="text-sm text-[#a0a8a0]">
        Already have an account?{" "}
        <Link href="/signin" className="text-[#a3ff12]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
