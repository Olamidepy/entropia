"use client";

import { DetectedRisk } from "@/lib/risk/risk.types";
import { AlertOctagon, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RiskOverviewProps {
  risks: DetectedRisk[];
  projectId: string;
}

export function RiskOverview({ risks, projectId }: RiskOverviewProps) {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-red-50 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-50 text-[#FF6B00] border-orange-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-[#FF6B00]" />
          <h3 className="text-base font-bold text-slate-900">
            Active Risk Events
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
            {risks.length}
          </span>
        </div>

        <Link
          href={`/dashboard/decisions?project=${projectId}`}
          className="text-xs font-semibold text-[#FF6B00] hover:text-[#E85F00] flex items-center gap-1"
        >
          View Policies
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {risks.length === 0 ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-800 text-xs font-medium">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>All operational risk signals are clear. No threshold breaches detected.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors space-y-2 bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getSeverityBadge(
                      risk.severity
                    )}`}
                  >
                    {risk.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{risk.title}</span>
                </div>

                {risk.suggestedAction && (
                  <span className="text-[11px] font-mono text-slate-400">
                    Target: {risk.suggestedAction}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{risk.description}</p>

              {risk.evidence && risk.evidence.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-slate-500 font-mono">
                  {risk.evidence.map((ev, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/60"
                    >
                      {ev.metric}: <strong className="text-slate-900">{String(ev.observedValue)}</strong> (limit: {ev.threshold})
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
