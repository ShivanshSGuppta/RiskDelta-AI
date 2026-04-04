import { Button } from "@/components/ui/button";
import { ConsolePageHeader } from "@/components/ui/console-kit";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return <ConsolePageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} className={className}>{children}</ConsolePageHeader>;
}

export function HeaderActionGroup({ primary, secondary }: { primary?: string; secondary?: string }) {
  return (
    <div className="flex gap-2">
      {secondary ? (
        <Button variant="secondary" size="sm">
          {secondary}
        </Button>
      ) : null}
      {primary ? <Button size="sm">{primary}</Button> : null}
    </div>
  );
}
