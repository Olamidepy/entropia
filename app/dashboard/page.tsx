"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SurvivalScoreCard } from "@/components/dashboard/survival-score-card";
import { RiskOverview } from "@/components/dashboard/risk-overview";
import { AgentInsight } from "@/components/dashboard/agent-insight";
import { PreservationStatus } from "@/components/dashboard/preservation-status";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { Sparkles } from "lucide-react";

export default function DashboardOverviewPage() {
  const searchParams = useSearchParams();
  const projectSlug = searchParams.get("project") || "synthetix-agent-alpha";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [agentReasoning, setAgentReasoning] = useState<any>(null);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch project data
      const res = await fetch(`/api/projects/${projectSlug}`);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error?.message || "Failed to load project telemetry");
      }

      setData(json.data);

      // 2. Fetch or trigger latest AI intelligence for this project
      const intelRes = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: json.data.project.id }),
      });
      const intelJson = await intelRes.json();
      if (intelJson.success) {
        setAgentReasoning(intelJson.data.agentReasoning);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handleRunFreshAnalysis = async () => {
    if (!data?.project?.id) return;
    try {
      setRunningAnalysis(true);
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: data.project.id }),
      });
      const json = await res.json();
      if (json.success) {
        setAgentReasoning(json.data.agentReasoning);
        fetchProjectData();
      }
    } finally {
      setRunningAnalysis(false);
    }
  };

  if (loading) {
    return <LoadingState message="Executing deterministic evaluation for monitored target..." />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Telemetry Pipeline Disconnected"
        message={error || "Could not retrieve project data."}
        onRetry={fetchProjectData}
      />
    );
  }

  const { project, survivalResult, activeRisks } = data;

  return (
    <div className="space-y-8">
      {/* Top Banner with Re-calculate CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Survival Intelligence Console
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time deterministic telemetry, risk detection, and preservation safeguards.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunFreshAnalysis}
          disabled={runningAnalysis}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow disabled:opacity-60 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{runningAnalysis ? "Synthesizing AI Reasoning..." : "Run AI Intelligence"}</span>
        </button>
      </div>

      {/* Top Main Section: Large Survival Score Card */}
      <SurvivalScoreCard
        survivalResult={survivalResult}
        projectName={project.name}
      />

      {/* Grid: Active Risks & AI Reasoning Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <RiskOverview
            risks={activeRisks}
            projectId={project.id}
          />
        </div>

        <div className="lg:col-span-7">
          <AgentInsight
            summary={
              agentReasoning?.summary ||
              "Autonomous reasoning synthesis evaluating current factor weights and longevity corridors."
            }
            keyFindings={
              agentReasoning?.keyFindings || [
                "Survival metrics operating within normal baseline boundaries.",
                "Storage deal verified on Filecoin network.",
              ]
            }
            reasoning={
              agentReasoning?.reasoning ||
              "Calculated survival score is based on weighted inputs from resource runway and storage health."
            }
            recommendedAction={
              agentReasoning?.recommendedAction || "PRESERVE_TO_FILECOIN"
            }
            urgency={agentReasoning?.urgency || "LOW"}
            projectId={project.id}
            onActionConfirmed={fetchProjectData}
          />
        </div>
      </div>

      {/* Grid: Preservation Status & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <PreservationStatus
            records={project.filecoinRecords || []}
            projectId={project.id}
            onPreserved={fetchProjectData}
          />
        </div>

        <div className="lg:col-span-6">
          <ActivityFeed memories={project.memories || []} />
        </div>
      </div>
    </div>
  );
}
