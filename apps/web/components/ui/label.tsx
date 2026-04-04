import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted-strong)]", className)} {...props} />
  );
}

export { Label };
