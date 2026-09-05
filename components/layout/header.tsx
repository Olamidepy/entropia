"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Sparkles, Menu, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <header className="sticky top-0 z-20 h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile menu toggle + Project Selector */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo */}
        <Link href="/" className="lg:hidden relative h-7 w-28">
          <Image
            src="/images/entropia-logo.png"
            alt="Entropia"
            fill
            className="object-contain"
          />
        </Link>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${getStatusColor(
                  selectedProject?.currentStatus || "healthy"
                )}`}
              />
              <div>
                <p className="text-xs font-semibold text-slate-400 leading-none">Monitored Target</p>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {selectedProject?.name || "Select Project..."}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
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
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(p.currentStatus)}`} />
                    <span className="font-semibold text-slate-900">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-500">
                    {p.currentScore.toFixed(0)}/100
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Health & Intelligence Trigger */}
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>Deterministic Engines Active</span>
        </div>

        {/* Quick Intelligence Run CTA */}
        <Link
          href={`/dashboard/intelligence${selectedProject ? `?project=${selectedProject.slug}` : ""}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Run Survival AI</span>
          <span className="sm:hidden">AI Run</span>
        </Link>
      </div>
    </header>
  );
}
