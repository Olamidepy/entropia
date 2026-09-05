"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, X } from "lucide-react";
import { ActionType } from "@/lib/actions/action.types";
import { getActionConfirmationDetails } from "@/lib/actions/confirmation.policy";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  actionType: ActionType;
  actionTitle?: string;
  contextReason?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  actionTitle,
  contextReason,
}: ConfirmationDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const details = getActionConfirmationDetails(actionType, contextReason);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "HIGH":
        return "bg-[#FF6B00] text-white";
      case "MEDIUM":
        return "bg-amber-500 text-white";
      default:
        return "bg-emerald-500 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {actionTitle || "Operator Action Confirmation"}
              </h3>
              <p className="text-xs text-slate-500">Explicit Authorization Required</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Part Structured Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* 1. WHAT WILL HAPPEN */}
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              WHAT WILL HAPPEN
            </span>
            <p className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              {details.whatWillHappen}
            </p>
          </div>

          {/* 2. WHY IT IS RECOMMENDED */}
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              WHY IT IS RECOMMENDED
            </span>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              {details.whyRecommended}
            </p>
          </div>

          {/* 3. RISK LEVEL & 4. EXPECTED OUTCOME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                RISK LEVEL
              </span>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getRiskBadge(
                    details.riskLevel
                  )}`}
                >
                  {details.riskLevel}
                </span>
                <span className="text-xs text-slate-500">Protocol Classification</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                EXPECTED OUTCOME
              </span>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 font-medium">
                {details.expectedOutcome}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Executing Protocol...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Action</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
