"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = ({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) => (
  <SelectPrimitive.Trigger
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-none border border-[#1b1f1b] bg-[#0a0a0a] px-3.5 py-2 text-sm text-white outline-none transition focus:border-[#6f776f] focus:bg-[#111411] focus:shadow-[var(--shadow-focus)]",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 text-[var(--muted-foreground)]" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectContent = ({ className, children, position = "popper", ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      position={position}
      className={cn("z-50 max-h-[360px] min-w-[180px] overflow-hidden rounded-none border border-[#1b1f1b] bg-[#0d0f0d] p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.42)]", className)}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
        <ChevronUp className="size-4" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
        <ChevronDown className="size-4" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectLabel = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>) => (
  <SelectPrimitive.Label className={cn("px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]", className)} {...props} />
);

const SelectItem = ({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item
    className={cn(
      "relative flex cursor-default select-none items-center rounded-none py-2.5 pl-8 pr-3 text-sm text-[var(--muted-strong)] outline-none transition focus:bg-[#111411] focus:text-white",
      className,
    )}
    {...props}
  >
    <span className="absolute left-3 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

const SelectSeparator = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>) => (
  <SelectPrimitive.Separator className={cn("my-2 h-px bg-white/8", className)} {...props} />
);

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue };
