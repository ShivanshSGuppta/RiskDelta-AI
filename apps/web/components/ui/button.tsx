"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "rounded-none border-[rgba(163,255,18,0.24)] bg-[#a3ff12] text-[#050505] shadow-[0_0_10px_rgba(163,255,18,0.15)] hover:bg-[#8cf000]",
        secondary:
          "rounded-none border-[#1b1f1b] bg-[#0a0b0a] text-white hover:border-[#6f776f] hover:bg-[#111411]",
        ghost: "rounded-none border-transparent bg-transparent text-[var(--muted-strong)] hover:bg-[#111411] hover:text-white",
        destructive:
          "rounded-none border-[rgba(255,93,93,0.28)] bg-[rgba(255,93,93,0.12)] text-[#ff8a8a] hover:bg-[rgba(255,93,93,0.18)]",
        outline:
          "rounded-none border-[#1b1f1b] bg-transparent text-[var(--foreground-soft)] hover:border-[#6f776f] hover:bg-[#0a0b0a] hover:text-white",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-5 text-sm",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
