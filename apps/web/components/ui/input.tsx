import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-none border border-[#1b1f1b] bg-[#0a0a0a] px-3.5 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[#6f776f] focus:bg-[#111411] focus:shadow-[var(--shadow-focus)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
