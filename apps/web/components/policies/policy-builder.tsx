"use client";

import { startTransition, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConsoleChip, ConsoleKicker, ConsoleRow, ConsoleSurface } from "@/components/ui/console-kit";

export function PolicyBuilder() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [form, setForm] = useState({
    name: "Block risky external exfiltration",
    description: "Blocks when tool exfiltration and outbound URLs appear together in a high-risk request.",
    category: "Agent Safety",
    severity: "CRITICAL",
    scope: "Production agents",
    mode: "ENFORCE",
    signal: "agent.tool_exfil",
    minWeight: "0.60",
    action: "BLOCK",
    conditionText: "signal:agent.tool_exfil >= 0.6",
  });

  const previewRuleId = useMemo(
    () =>
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    [form.name],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          severity: form.severity,
          scope: form.scope,
          mode: form.mode,
          tags: ["custom", "playground"],
          rules: [
            {
              id: previewRuleId,
              title: form.name,
              conditionText: form.conditionText,
              action: form.action,
              when: {
                signal: form.signal,
                minWeight: Number(form.minWeight),
              },
            },
          ],
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to create policy");

      toast.success("Policy created");
      setOpen(false);
      startTransition(() => router.refresh());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create policy");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mounted ? (
        <DialogTrigger asChild>
          <Button className="rounded-none">Create policy</Button>
        </DialogTrigger>
      ) : (
        <Button className="rounded-none" type="button">
          Create policy
        </Button>
      )}
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create runtime policy</DialogTitle>
        </DialogHeader>
        <form className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="policy-name">Policy name</Label>
              <Input id="policy-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="policy-description">Description</Label>
              <Textarea
                id="policy-description"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
            </div>
            <div>
              <Label>Scope</Label>
              <Input value={form.scope} onChange={(event) => setForm((current) => ({ ...current, scope: event.target.value }))} />
            </div>
            <div>
              <Label>Severity</Label>
              <Select value={form.severity} onValueChange={(value) => setForm((current) => ({ ...current, severity: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mode</Label>
              <Select value={form.mode} onValueChange={(value) => setForm((current) => ({ ...current, mode: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIMULATE">Simulate</SelectItem>
                  <SelectItem value="ENFORCE">Enforce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Signal</Label>
              <Input value={form.signal} onChange={(event) => setForm((current) => ({ ...current, signal: event.target.value }))} />
            </div>
            <div>
              <Label>Minimum signal weight</Label>
              <Input value={form.minWeight} onChange={(event) => setForm((current) => ({ ...current, minWeight: event.target.value }))} />
            </div>
            <div>
              <Label>Action</Label>
              <Select value={form.action} onValueChange={(value) => setForm((current) => ({ ...current, action: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BLOCK">Block</SelectItem>
                  <SelectItem value="REDACT">Redact</SelectItem>
                  <SelectItem value="ALERT">Alert</SelectItem>
                  <SelectItem value="REQUIRE_APPROVAL">Require approval</SelectItem>
                  <SelectItem value="FALLBACK_MODEL">Fallback model</SelectItem>
                  <SelectItem value="QUARANTINE_TRACE">Quarantine trace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition text</Label>
              <Input value={form.conditionText} onChange={(event) => setForm((current) => ({ ...current, conditionText: event.target.value }))} />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={loading}>{loading ? "Saving..." : "Save policy"}</Button>
            </div>
          </div>

          <ConsoleSurface className="p-5">
            <ConsoleKicker>Preview</ConsoleKicker>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{form.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{form.description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <ConsoleChip tone={form.severity === "CRITICAL" ? "critical" : form.severity === "HIGH" ? "warning" : "accent"}>
                {form.severity}
              </ConsoleChip>
              <ConsoleChip tone={form.mode === "ENFORCE" ? "critical" : "warning"}>{form.mode}</ConsoleChip>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ConsoleRow>
                <ConsoleKicker>Scope</ConsoleKicker>
                <p className="mt-2 text-sm text-white">{form.scope}</p>
              </ConsoleRow>
              <ConsoleRow>
                <ConsoleKicker>Signal</ConsoleKicker>
                <p className="mt-2 font-mono text-xs text-[#ddffc1]">{form.signal}</p>
              </ConsoleRow>
            </div>

            <div className="mt-5 border border-[#1b1f1b] bg-[#050505] p-4">
              <ConsoleKicker>Rule preview</ConsoleKicker>
              <div className="mt-3 space-y-2 font-mono text-[13px] text-[#ddffc1]">
                <p>id: {previewRuleId}</p>
                <p>condition: {form.conditionText}</p>
                <p>action: {form.action}</p>
                <p>threshold: {form.minWeight}</p>
              </div>
            </div>
          </ConsoleSurface>
        </form>
      </DialogContent>
    </Dialog>
  );
}
