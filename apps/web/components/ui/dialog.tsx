"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-black/72 backdrop-blur-md", className)} {...props} />
);

const DialogContent = ({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 border border-[#1b1f1b] bg-[#0d0f0d] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.48)] md:p-7",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-none border border-[#1b1f1b] bg-[#0a0a0a] p-2 text-[var(--muted-foreground)] transition hover:bg-[#111411] hover:text-white">
        <X className="size-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
);

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-5 flex flex-col gap-1.5", className)} {...props} />
);

const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-[1.65rem] font-semibold tracking-[-0.04em] text-white", className)} {...props} />
);

const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm leading-7 text-[var(--muted-foreground)]", className)} {...props} />
);

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger };
