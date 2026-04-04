"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ConsoleKicker, ConsoleSurface } from "@/components/ui/console-kit";

const strokeColor = "#d6ff88";
const accentColor = "#b7ff3a";
const accentStrong = "#e5ffb8";
const warningColor = "#cba35d";
const dangerColor = "#da6e62";
const mutedGrid = "rgba(255,255,255,0.07)";

const tooltipStyle = {
  background: "rgba(5, 7, 4, 0.96)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
};

export function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <ConsoleSurface className="h-full p-5">
      <ConsoleKicker>Signal view</ConsoleKicker>
      <p className="mt-2 text-xl font-semibold tracking-[-0.05em] text-white">{title}</p>
      {description ? <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p> : null}
      <div className="mt-5 h-[290px]">{children}</div>
    </ConsoleSurface>
  );
}

export function RequestsAreaChart({
  data,
}: {
  data: Array<{ date: string; requests: number; blocked: number; alerts: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={accentStrong} stopOpacity={0.46} />
            <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={mutedGrid} vertical={false} />
        <XAxis dataKey="date" tick={{ fill: "#8d9aaa", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#8d9aaa", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="requests" stroke={accentStrong} fill="url(#requestsGradient)" strokeWidth={2.5} />
        <Area type="monotone" dataKey="blocked" stroke={dangerColor} fill="transparent" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DistributionBarChart({
  data,
}: {
  data: Array<{ band: string; count: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke={mutedGrid} vertical={false} />
        <XAxis dataKey="band" tick={{ fill: "#8d9aaa", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#8d9aaa", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="count" fill={strokeColor} radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OutcomePieChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const colors = [accentColor, strokeColor, dangerColor, warningColor];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#8d9aaa" }} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ProviderTrafficChart({
  data,
}: {
  data: Array<{ provider: string; traffic: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid stroke={mutedGrid} horizontal={false} />
        <XAxis type="number" tick={{ fill: "#8d9aaa", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="provider" tick={{ fill: "#8d9aaa", fontSize: 12 }} width={96} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="traffic" fill={accentColor} radius={[0, 10, 10, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RiskRadarChart({
  data,
}: {
  data: Array<{ label: string; score: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid stroke={mutedGrid} />
        <PolarAngleAxis dataKey="label" tick={{ fill: "#8d9aaa", fontSize: 11 }} />
        <Radar dataKey="score" stroke={accentStrong} fill={accentColor} fillOpacity={0.3} strokeWidth={2.5} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
