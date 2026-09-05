"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  BrainCircuit,
  Database,
  Compass,
  PlayCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const DASHBOARD_NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Intelligence", href: "/dashboard/intelligence", icon: BrainCircuit },
  { name: "Memory", href: "/dashboard/memory", icon: Database },
  { name: "Decisions", href: "/dashboard/decisions", icon: Compass },
  { name: "Actions", href: "/dashboard/actions", icon: PlayCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white min-h-screen fixed left-0 top-0 bottom-0 z-30">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-36">
            <Image
              src="/images/entropia-logo.png"
              alt="Entropia"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Survival Control
        </div>
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 relative ${
                active
                  ? "text-[#FF6B00] bg-orange-50/80 font-bold"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              {/* Subtle orange active indicator pill on left edge */}
              {active && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#FF6B00] rounded-r-full" />
              )}
              <Icon className={`w-4 h-4 ${active ? "text-[#FF6B00]" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Operator System Health badge in sidebar footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-2xl border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Operator Cluster</p>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Engines Operational
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
