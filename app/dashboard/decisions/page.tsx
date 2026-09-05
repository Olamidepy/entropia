"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Compass, ShieldCheck, CheckCircle2, Clock, ArrowRight, ShieldAlert } from "lucide-react";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { formatDate } from "@/lib/utils/helpers";
import Link from "next/link";

export default function DecisionsPage() {
  const searchParams = useSearchParams();
  const projectSlug = searchParams.get("project") || "synthetix-agent-alpha";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<any[]>([]);

  const loadDecisions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const pRes = await fetch(`/api/projects/${projectSlug}`);
      const pJson = await pRes.json();
      if (!pJson.success) throw new Error(pJson.error?.message || "Failed to load project");

      const res = await fetch(`/api/decisions?projectId=${pJson.data.project.id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Failed to load decisions");

      setDecisions(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to load decisions");
    } finally {
      setLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    loadDecisions();
  }, [loadDecisions]);

  if (loading) {
    return <LoadingState message="Querying deterministic decision engine logs..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Decisions Registry Unavailable"
        message={error}
        onRetry={loadDecisions}
      />
    );
  }

  const getExecutionBadge = (type: string) => {
    switch (type) {
      case "AUTOMATIC":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REQUIRES_CONFIRMATION":
        return "bg-orange-50 text-[#FF6B00] border-orange-200";
      case "RECOMMENDED_ONLY":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-xs font-semibold text-[#FF6B00] border border-orange-200 mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Policy Governance Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Deterministic Decisions & Safety Policies
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Algorithmic policies that govern whether actions execute automatically or demand explicit operator confirmation.
        </p>
      </div>

      {/* Policy Rules Explainer Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Standard Operating Safety Policies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="font-bold text-red-700 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              CRITICAL Risk &lt; 40 Score
            </div>
            <p className="text-slate-600">
              Mandatory confirmation. Forces immutable state serialization to Filecoin before catastrophic failure.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="font-bold text-orange-700 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Storage Expiry &lt; 14 Days
            </div>
            <p className="text-slate-600">
              Deal renewal required. Pre-empts miner sector tear-down and archival fault penalties.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Telemetry Heartbeat Delays
            </div>
            <p className="text-slate-600">
              Automatic execution. Dispatches non-destructive notifications to operational webhook channels.
            </p>
          </div>
        </div>
      </div>

      {/* Decisions Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">
            Decision Audit Trail ({decisions.length})
          </h3>
          <Link
            href={`/dashboard/actions?project=${projectSlug}`}
            className="text-xs font-semibold text-[#FF6B00] hover:text-[#E85F00] flex items-center gap-1"
          >
            Pending Actions Queue
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {decisions.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No decisions recorded for this project yet.
          </p>
        ) : (
          <div className="space-y-4">
            {decisions.map((dec) => (
              <div
                key={dec.id}
                className="p-5 rounded-xl border border-slate-200/80 hover:border-orange-200 transition-colors bg-white space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getExecutionBadge(
                        dec.executionType
                      )}`}
                    >
                      {dec.executionType.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      Rule: {dec.policyRule}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(dec.createdAt)}</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-900">Recommended Action: </span>
                  <span className="font-mono text-[#FF6B00] font-bold">{dec.recommendation}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-1">
                  {dec.reasoning}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <span>Status: <strong className="text-slate-800 uppercase">{dec.status}</strong></span>
                  {dec.actions && dec.actions.length > 0 && (
                    <span className="text-emerald-600 font-medium">
                      Action Created ({dec.actions.length})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
