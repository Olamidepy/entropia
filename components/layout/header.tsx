"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, Sparkles, Menu, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DASHBOARD_NAV_ITEMS } from "./sidebar";

interface ProjectItem {
  id: string;
  name: string;
  slug: string;
  currentScore: number;
  currentStatus: string;
}

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export function DashboardHeader({ onMobileMenuToggle }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentProjectId = searchParams.get("project") || "";

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setProjects(json.data);
          const found = currentProjectId
            ? json.data.find((p: ProjectItem) => p.id === currentProjectId || p.slug === currentProjectId)
            : json.data[0];
          setSelectedProject(found || json.data[0]);
        }
      } catch (err) {
        console.warn("Could not load projects for header:", err);
      }
    }
    loadProjects();
  }, [currentProjectId]);

  const handleSelectProject = (p: ProjectItem) => {
    setSelectedProject(p);
    setDropdownOpen(false);
    router.push(`/dashboard?project=${p.slug}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-500";
      case "stable":
        return "bg-blue-500";
      case "at-risk":
        return "bg-amber-500";
      default:
        return "bg-red-500";
    }
  };

  const isNavActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Primary Top Bar */}
      <div className="h-16 sm:h-20 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo on mobile/tablet */}
          <Link href="/" className="lg:hidden relative h-6 sm:h-7 w-20 sm:w-28 shrink-0">
            <Image
              src="/images/entropia-logo.png"
              alt="Entropia"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
        </div>

        {/* Center/Right: Project Selector + AI CTA */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 justify-end flex-1">
          {/* Project Selector Dropdown */}
          <div className="relative">
            {/* Mobile Compact Project Pill (< sm) */}
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200/90 bg-slate-50 hover:bg-slate-100 transition-all text-left shadow-xs max-w-[145px]"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(
                  selectedProject?.currentStatus || "healthy"
                )}`}
              />
              <span className="text-xs font-bold text-slate-900 truncate">
                {selectedProject?.name || "Target"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Desktop / Tablet Full Selector (>= sm) */}
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${getStatusColor(
                    selectedProject?.currentStatus || "healthy"
                  )}`}
                />
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 leading-none">Monitored Target</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {selectedProject?.name || "Select Project..."}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 sm:left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Monitored Projects
                </div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProject(p)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(p.currentStatus)}`} />
                      <span className="font-semibold text-slate-900 truncate">{p.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-500 shrink-0">
                      {p.currentScore.toFixed(0)}/100
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Engine Status indicator (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium shrink-0">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Engines Active</span>
          </div>

          {/* Quick Intelligence Run CTA */}
          <Link
            href={`/dashboard/intelligence${selectedProject ? `?project=${selectedProject.slug}` : ""}`}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow shrink-0"
            aria-label="Run Survival AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Run Survival AI</span>
            <span className="sm:hidden text-[11px]">AI Run</span>
          </Link>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation: Survival Control Tabs */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50/70 px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1 shrink-0">
          Control:
        </span>
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                active
                  ? "bg-white text-[#FF6B00] font-bold shadow-xs border border-orange-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? "text-[#FF6B00]" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
