import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
          ref={ref}
          className={cn(
          "flex min-h-[132px] w-full rounded-none border border-[#1b1f1b] bg-[#0a0a0a] px-4 py-3 text-sm leading-7 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[#6f776f] focus:bg-[#111411] focus:shadow-[var(--shadow-focus)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
