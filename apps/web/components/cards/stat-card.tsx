import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  delta,
  emphasis = "accent",
}: {
  label: string;
  value: string;
  delta?: string;
  emphasis?: "accent" | "blue" | "warning" | "danger" | "success";
}) {
  return (
    <Card density="spacious">
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{label}</p>
            <div className="metric-value mt-4 text-4xl font-semibold text-white">{value}</div>
          </div>
          {delta ? (
            <Badge variant={emphasis}>
              <ArrowUpRight className="size-3" />
              {delta}
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
