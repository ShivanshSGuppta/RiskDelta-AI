import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta?: { label: string; href?: string };
}) {
  return (
    <div className="surface-panel flex min-h-[240px] flex-col items-center justify-center rounded-[30px] p-8 text-center">
      <div className="surface-inset mb-4 flex size-14 items-center justify-center rounded-[22px]">
        <Inbox className="size-6 text-[var(--muted-foreground)]" />
      </div>
      <h3 className="section-title text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      {cta ? (
        <Button className="mt-5" variant="secondary">
          {cta.label}
        </Button>
      ) : null}
    </div>
  );
}
