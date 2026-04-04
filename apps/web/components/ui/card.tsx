import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-[18px]", {
  variants: {
    variant: {
      default: "frame",
      inset: "rail",
      signal: "sheet",
      critical: "critical",
      shell: "canvas",
      bare: "",
    },
    density: {
      default: "p-5",
      compact: "p-4",
      spacious: "p-6 md:p-7",
      flush: "p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    density: "default",
  },
});

type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

function Card({ className, variant, density, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, density }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-2", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("page-title text-[1.05rem] font-semibold tracking-tight text-white md:text-[1.12rem]", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-6 text-[var(--muted-foreground)]", className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
