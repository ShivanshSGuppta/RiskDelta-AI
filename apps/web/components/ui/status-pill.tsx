import { ConsoleChip } from "@/components/ui/console-kit";

const tones = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "warning",
  CRITICAL: "critical",
  OPEN: "critical",
  INVESTIGATING: "warning",
  RESOLVED: "success",
  ALLOW: "success",
  TRANSFORM: "warning",
  BLOCK: "critical",
  REVIEW: "warning",
  CONNECTED: "accent",
  PENDING: "warning",
  ERROR: "critical",
  DRAFT: "neutral",
  ACTIVE: "accent",
  SIMULATE: "warning",
  ENFORCE: "critical",
  LOG: "neutral",
} as const;

export function StatusPill({ value }: { value: string }) {
  const tone = tones[value as keyof typeof tones] ?? "neutral";
  return <ConsoleChip tone={tone}>{value}</ConsoleChip>;
}
