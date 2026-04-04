"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuContent = ({ className, sideOffset = 8, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn("z-50 min-w-[240px] rounded-none border border-[#1b1f1b] bg-[#0d0f0d] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.42)]", className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

const DropdownMenuItem = ({ className, inset, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "relative flex cursor-default select-none items-center rounded-none px-3 py-2.5 text-sm text-[var(--muted-strong)] outline-none transition focus:bg-[#111411] focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
);

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>) => (
  <DropdownMenuPrimitive.CheckboxItem
    className={cn(
      "relative flex cursor-default select-none items-center rounded-none py-2.5 pl-8 pr-3 text-sm text-[var(--muted-strong)] outline-none transition focus:bg-[#111411] focus:text-white",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-3 flex size-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
);

const DropdownMenuLabel = ({ className, inset, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) => (
  <DropdownMenuPrimitive.Label className={cn("px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]", inset && "pl-8", className)} {...props} />
);

const DropdownMenuSeparator = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator className={cn("my-2 h-px bg-white/8", className)} {...props} />
);

const DropdownMenuSubTrigger = ({ className, inset, children, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) => (
  <DropdownMenuPrimitive.SubTrigger
    className={cn(
      "flex cursor-default select-none items-center rounded-none px-3 py-2.5 text-sm text-[var(--muted-strong)] outline-none transition focus:bg-[#111411] focus:text-white",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
);

const DropdownMenuSubContent = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>) => (
  <DropdownMenuPrimitive.SubContent className={cn("z-50 min-w-[240px] rounded-none border border-[#1b1f1b] bg-[#0d0f0d] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.42)]", className)} {...props} />
);

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
