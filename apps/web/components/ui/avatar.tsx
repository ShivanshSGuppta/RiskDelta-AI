import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, initials } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return <AvatarPrimitive.Root className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-2xl", className)} {...props} />;
}

function AvatarImage({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cn("aspect-square size-full object-cover", className)} {...props} />;
}

function AvatarFallback({
  className,
  label = "RiskDelta",
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & { label?: string }) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center rounded-2xl border border-[rgba(99,213,221,0.18)] bg-[linear-gradient(135deg,rgba(99,213,221,0.18),rgba(79,141,255,0.14))] text-xs font-semibold text-white",
        className,
      )}
      {...props}
    >
      {initials(label)}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
