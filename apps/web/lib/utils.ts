import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number, maximumFractionDigits = 0) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maximumFractionDigits > 0 ? 1 : 0,
    maximumFractionDigits,
  }).format(value * 100)}%`;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatDateTime(value: string | Date) {
  return format(new Date(value), "MMM d, yyyy · HH:mm");
}

export function formatRelativeTime(value: string | Date) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(value: string) {
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function seededNumber(seed: string, min: number, max: number) {
  const normalized = hashString(seed) / 2147483647;
  return min + normalized * (max - min);
}

export function toTitleCase(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (part) => part.toUpperCase());
}
