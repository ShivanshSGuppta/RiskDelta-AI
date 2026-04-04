"use client";

import Link from "next/link";
import { Activity, Bell, ChevronsUpDown, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AppHeader({
  userName,
  organizationName,
  projectNames,
  collapsed,
  onToggleCollapsed,
  onOpenMobileNav,
}: {
  userName: string;
  organizationName: string;
  projectNames: string[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMobileNav: () => void;
}) {
  const [selectedProject, setSelectedProject] = useState(projectNames[0] ?? "No project");
  const [environment, setEnvironment] = useState("production");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <header className="sticky top-0 z-30 border-b border-[#1b1f1b] bg-[rgba(5,5,5,0.92)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" className="border-[#1b1f1b] bg-[#111411] xl:hidden" onClick={onOpenMobileNav}>
            <Menu className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden border border-[#1b1f1b] bg-[#111411] text-[#6f776f] hover:bg-[#111411] hover:text-[#f5f7f4] xl:inline-flex" onClick={onToggleCollapsed}>
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        </div>

        <div className="order-3 flex w-full items-center gap-2 border border-[#1b1f1b] bg-[#050505] px-3 py-1.5 md:order-none md:w-auto md:min-w-[320px] md:flex-1">
          <Search className="size-4 text-[#6f776f]" />
          <Input
            className="h-8 border-none bg-transparent px-0 text-[#f5f7f4] shadow-none placeholder:text-[#6f776f] focus:bg-transparent"
            placeholder="Search traces, policies, incidents... (⌘K)"
          />
        </div>

        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="border-[#1b1f1b] bg-[#111411] text-[#f5f7f4] hover:bg-[#111411]">
                {organizationName}
                <ChevronsUpDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Organization</DropdownMenuLabel>
              <DropdownMenuItem>{organizationName}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Project</DropdownMenuLabel>
              {projectNames.map((projectName) => (
                <DropdownMenuItem key={projectName} onClick={() => setSelectedProject(projectName)}>
                  {projectName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="secondary" size="sm" className="border-[#1b1f1b] bg-[#111411] text-[#f5f7f4] hover:bg-[#111411]">
            {organizationName}
            <ChevronsUpDown className="size-4" />
          </Button>
        )}

        <div className="hidden lg:block">
          {mounted ? (
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="h-9 w-[210px] border-[#1b1f1b] bg-[#111411] text-[#f5f7f4]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projectNames.map((projectName) => (
                  <SelectItem key={projectName} value={projectName}>
                    {projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-9 w-[210px] items-center justify-between border border-[#1b1f1b] bg-[#111411] px-3.5 text-sm text-[#f5f7f4]">
              <span>{selectedProject}</span>
              <ChevronsUpDown className="size-4 text-[#6f776f]" />
            </div>
          )}
        </div>

        <div className="hidden md:block">
          {mounted ? (
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger className="h-9 w-[150px] border-[#1b1f1b] bg-[#111411] text-[#f5f7f4]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-9 w-[150px] items-center justify-between border border-[#1b1f1b] bg-[#111411] px-3.5 text-sm text-[#f5f7f4]">
              <span className="capitalize">{environment}</span>
              <ChevronsUpDown className="size-4 text-[#6f776f]" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 border border-[#1b1f1b] bg-[#111411] px-2 py-1 md:flex">
            <div className="size-2 rounded-full bg-[#a3ff12]" />
            <span className="font-mono text-xs text-[#a0a8a0]">{environment}</span>
          </div>

          <div className="hidden h-4 w-px bg-[#1b1f1b] md:block" />

          <Button variant="secondary" size="icon" className="border-[#1b1f1b] bg-[#111411] hover:bg-[#111411]">
          <Bell className="size-4" />
          </Button>
        </div>

        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-10 border border-[#1b1f1b] bg-[#111411] text-[#a0a8a0] hover:bg-[#111411] hover:text-[#f5f7f4]">
                <Avatar>
                  <AvatarFallback label={userName} />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userName}</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/app/settings">Profile & Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/docs">Docs</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/api/auth/sign-out">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="icon" className="size-10 border border-[#1b1f1b] bg-[#111411] text-[#a0a8a0] hover:bg-[#111411] hover:text-[#f5f7f4]">
            <Avatar>
              <AvatarFallback label={userName} />
            </Avatar>
          </Button>
        )}

        <div className="hidden items-center gap-2 text-[#a0a8a0] md:flex">
          <Activity className="size-4" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f776f]">
            Control Plane Active
          </span>
        </div>
      </div>
    </header>
  );
}
