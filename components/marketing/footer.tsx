import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-8 w-36">
                <Image
                  src="/images/entropia-logo.png"
                  alt="Entropia"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Entropia is an AI-powered survival intelligence platform monitoring digital agents, resources, and decentralized storage condition using deterministic mathematical analysis.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Deterministic Engines Operational</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/dashboard" className="hover:text-[#FF6B00] transition-colors">
                  Operational Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/intelligence" className="hover:text-[#FF6B00] transition-colors">
                  Survival Intelligence
                </Link>
              </li>
              <li>
                <Link href="/dashboard/memory" className="hover:text-[#FF6B00] transition-colors">
                  Persistent Memory
                </Link>
              </li>
              <li>
                <Link href="/dashboard/actions" className="hover:text-[#FF6B00] transition-colors">
                  Confirmation Workflows
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Architecture
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="#how-it-works" className="hover:text-[#FF6B00] transition-colors">
                  Deterministic Scoring (0–100)
                </Link>
              </li>
              <li>
                <Link href="#filecoin" className="hover:text-[#FF6B00] transition-colors">
                  Filecoin Modular Adapter
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF6B00] transition-colors">
                  Architecture Principles
                </Link>
              </li>
              <li>
                <Link href="/api/health" className="hover:text-[#FF6B00] transition-colors">
                  System Health API
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Entropia. All rights reserved.</p>
          <p className="font-mono">Engine: Deterministic v1.4.2 • Storage: Filecoin Protocol</p>
        </div>
      </div>
    </footer>
  );
}
