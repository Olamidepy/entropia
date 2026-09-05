"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { ConfirmationDialog } from "../decisions/confirmation-dialog";
import { ActionType } from "@/lib/actions/action.types";

interface AgentInsightProps {
  summary: string;
  keyFindings: string[];
  reasoning: string;
  recommendedAction: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  projectId: string;
  onActionConfirmed?: () => void;
}

export function AgentInsight({
  summary,
  keyFindings,
  reasoning,
  recommendedAction,
  urgency,
  projectId,
  onActionConfirmed,
}: AgentInsightProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const getUrgencyColor = (urg: string) => {
    switch (urg) {
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

  const handleExecute = async () => {
    try {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          actionType: recommendedAction,
          title: `Action: ${recommendedAction}`,
          description: `Triggered from AI Reasoning Recommendation: ${summary.slice(0, 80)}...`,
        }),
      });
      const data = await res.json();
      if (data.success && onActionConfirmed) {
        onActionConfirmed();
      }
    } catch (err) {
      console.error("Failed to trigger recommended action:", err);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Agent Survival Reasoning
              </h3>
              <p className="text-xs text-slate-500">Autonomous Qualitative Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Priority:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getUrgencyColor(
                urgency
              )}`}
            >
              {urgency}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Executive Summary
          </span>
          <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
            {summary}
          </p>
        </div>

        {/* Key Findings List */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Key Diagnostic Findings
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            {keyFindings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-[#FF6B00] font-bold mt-0.5">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Action Ribbon */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
              <Zap className="w-3.5 h-3.5" />
              <span>Recommended Operational Protocol</span>
            </div>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {recommendedAction}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow flex-shrink-0"
          >
            <span>Review & Authorize</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleExecute}
        actionType={recommendedAction as ActionType}
        actionTitle={`Execute ${recommendedAction.replace(/_/g, " ")}`}
        contextReason={reasoning}
      />
    </>
  );
}
