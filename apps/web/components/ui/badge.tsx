import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "border-[var(--border)] bg-white/[0.03] text-[var(--muted-strong)]",
        accent: "border-[rgba(183,255,58,0.2)] bg-[rgba(183,255,58,0.08)] text-[var(--accent-strong)]",
        blue: "border-[rgba(183,255,58,0.18)] bg-[rgba(183,255,58,0.05)] text-[#e3ffb7]",
        warning: "border-[rgba(203,163,93,0.18)] bg-[rgba(203,163,93,0.08)] text-[var(--warning)]",
        danger: "border-[rgba(218,110,98,0.18)] bg-[rgba(218,110,98,0.08)] text-[#efb2ab]",
        success: "border-[rgba(168,240,106,0.18)] bg-[rgba(168,240,106,0.08)] text-[var(--success)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
