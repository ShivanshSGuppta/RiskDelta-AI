"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    className={cn("inline-flex min-h-11 items-center rounded-none border border-[#1b1f1b] bg-[#0a0a0a] p-1", className)}
    {...props}
  />
);

const TabsTrigger = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex min-h-9 items-center justify-center rounded-none px-3.5 py-2 text-sm font-medium text-[var(--muted-foreground)] transition data-[state=active]:bg-[#111411] data-[state=active]:text-white",
      className,
    )}
    {...props}
  />
);

const TabsContent = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content className={cn("mt-5 outline-none", className)} {...props} />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
