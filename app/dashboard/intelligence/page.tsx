"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { BrainCircuit, Sparkles, CheckCircle2, ShieldAlert, Cpu, ArrowRight, Zap } from "lucide-react";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { ConfirmationDialog } from "@/components/decisions/confirmation-dialog";
import { ActionType } from "@/lib/actions/action.types";

export default function IntelligencePage() {
  const searchParams = useSearchParams();
  const projectSlug = searchParams.get("project") || "synthetix-agent-alpha";

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intelData, setIntelData] = useState<any>(null);
  const [projectId, setProjectId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchIntelligence = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get project ID
      const pRes = await fetch(`/api/projects/${projectSlug}`);
      const pJson = await pRes.json();
      if (!pJson.success) throw new Error(pJson.error?.message || "Failed to load project");

      setProjectId(pJson.data.project.id);

      // 2. Trigger intelligence run
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: pJson.data.project.id }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Intelligence analysis failed");

      setIntelData(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to load survival intelligence");
    } finally {
      setLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    fetchIntelligence();
  }, [fetchIntelligence]);

  const handleReRun = async () => {
    if (!projectId) return;
    try {
      setRunning(true);
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const json = await res.json();
      if (json.success) {
        setIntelData(json.data);
      }
    } finally {
      setRunning(false);
    }
  };

  const handleExecute = async () => {
    if (!projectId || !intelData?.agentReasoning?.recommendedAction) return;
    await fetch("/api/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        actionType: intelData.agentReasoning.recommendedAction,
        title: `Intelligence Action: ${intelData.agentReasoning.recommendedAction}`,
        description: intelData.agentReasoning.summary,
      }),
    });
    fetchIntelligence();
  };

  if (loading) {
    return <LoadingState message="Engaging autonomous survival reasoning agent..." />;
  }

  if (error || !intelData) {
    return (
      <ErrorState
        title="Intelligence Pipeline Fault"
        message={error || "Could not complete intelligence run."}
        onRetry={fetchIntelligence}
      />
    );
  }

  const { survivalResult, detectedRisks, agentReasoning, decision } = intelData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-xs font-semibold text-[#FF6B00] border border-orange-200 mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Reasoning Layer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Survival Intelligence Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Qualitative analysis of deterministic scores, memory history, and recommended interventions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReRun}
          disabled={running}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{running ? "Synthesizing Run..." : "Run Fresh Analysis"}</span>
        </button>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deterministic Anchor
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-slate-900 font-mono">
                {survivalResult.score}
              </span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                {survivalResult.status}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1">
            <p className="text-slate-500">
              Active Risks Evaluated: <strong className="text-slate-900">{detectedRisks.length}</strong>
            </p>
            <p className="text-slate-500">
              Policy Rule Applied: <strong className="text-slate-900 font-mono">{decision?.policyRule || "N/A"}</strong>
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Agent Executive Summary
          </h3>
          <p className="text-base text-slate-800 font-medium leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
            {agentReasoning.summary}
          </p>
        </div>

        {/* Diagnostic Reasoning */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Qualitative Reasoning & Threat Model
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed bg-white p-5 rounded-2xl border border-slate-200">
            {agentReasoning.reasoning}
          </p>
        </div>

        {/* Key Findings */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Key Survival Findings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agentReasoning.keyFindings.map((finding: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Recommendation Banner */}
        <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Preservation Policy Recommendation
            </span>
            <h4 className="text-lg font-black text-slate-900 font-mono">
              {agentReasoning.recommendedAction}
            </h4>
            <p className="text-xs text-slate-600">
              Requires confirmation: {decision?.requiresConfirmation ? "Yes (Protected Protocol)" : "No"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
          >
            <span>Review & Authorize Action</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleExecute}
        actionType={agentReasoning.recommendedAction as ActionType}
        actionTitle={`Authorize ${agentReasoning.recommendedAction}`}
        contextReason={agentReasoning.reasoning}
      />
    </div>
  );
}
