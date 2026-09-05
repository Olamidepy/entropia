"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PlayCircle, ShieldAlert, CheckCircle2, XCircle, Clock, ShieldCheck, ArrowRight, History } from "lucide-react";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { ConfirmationDialog } from "@/components/decisions/confirmation-dialog";
import { formatDate } from "@/lib/utils/helpers";
import { ActionType } from "@/lib/actions/action.types";

export default function ActionsPage() {
  const searchParams = useSearchParams();
  const projectSlug = searchParams.get("project") || "synthetix-agent-alpha";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<string>("");

  // Confirmation modal state
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadActions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const pRes = await fetch(`/api/projects/${projectSlug}`);
      const pJson = await pRes.json();
      if (!pJson.success) throw new Error(pJson.error?.message || "Failed to load project");

      setProjectId(pJson.data.project.id);

      const res = await fetch(`/api/actions?projectId=${pJson.data.project.id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Failed to load actions");

      setActions(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to load actions and audit trail");
    } finally {
      setLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  const handleOpenConfirm = (action: any) => {
    setSelectedAction(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = async (approved = true) => {
    if (!selectedAction) return;

    try {
      const res = await fetch(`/api/actions/${selectedAction.id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const json = await res.json();
      if (json.success) {
        loadActions();
      }
    } catch (err) {
      console.error("Confirmation error:", err);
    }
  };

  if (loading) {
    return <LoadingState message="Loading action registry and audit logs..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Action Service Unavailable"
        message={error}
        onRetry={loadActions}
      />
    );
  }

  const pendingActions = actions.filter((a) => a.status === "PENDING_CONFIRMATION");
  const pastActions = actions.filter((a) => a.status !== "PENDING_CONFIRMATION");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-xs font-semibold text-[#FF6B00] border border-orange-200 mb-2">
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Execution & Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Actions & Immutable Audit Logs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review pending sensitive operations requiring explicit authorization, view executed workflows, and inspect audit records.
        </p>
      </div>

      {/* Pending Actions Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FF6B00]" />
            <span>Pending Operator Confirmations</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-100 text-[#FF6B00]">
              {pendingActions.length}
            </span>
          </h2>
        </div>

        {pendingActions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No Pending Approvals</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All sensitive workflows are up to date. No actions are currently waiting for confirmation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingActions.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-orange-200 p-6 shadow-sm space-y-4 hover:border-orange-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF6B00] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 font-mono">
                      {act.actionType}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">
                      {act.title}
                    </h3>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    Created: {formatDate(act.createdAt)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {act.description}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Status: <strong className="text-amber-600 uppercase">PENDING CONFIRMATION</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenConfirm(act)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
                    >
                      <span>Review Confirmation Dialog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-base font-bold text-slate-900">
            Immutable Audit Trail & Execution History
          </h3>
        </div>

        {pastActions.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No past actions in history.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Audit Events</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pastActions.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {act.actionType}
                    </td>
                    <td className="py-3 px-4 font-medium">{act.title}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          act.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : act.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {act.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
                        {act.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                        {act.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {act.auditLogs && act.auditLogs.length > 0 ? (
                        <span className="font-mono text-slate-500 text-[11px]">
                          {act.auditLogs.map((l: any) => l.eventType).join(", ")}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {formatDate(act.completedAt || act.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog Component */}
      {selectedAction && (
        <ConfirmationDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={() => handleConfirmAction(true)}
          actionType={selectedAction.actionType as ActionType}
          actionTitle={selectedAction.title}
          contextReason={selectedAction.description}
        />
      )}
    </div>
  );
}
