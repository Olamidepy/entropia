"use client";

import { SurvivalScoreResult } from "@/lib/survival/survival.types";
import { TrendingUp, AlertTriangle, ShieldCheck, Activity } from "lucide-react";

interface SurvivalScoreCardProps {
  survivalResult: SurvivalScoreResult;
  projectName: string;
}

export function SurvivalScoreCard({ survivalResult, projectName }: SurvivalScoreCardProps) {
  const { score, status, factors, explanation } = survivalResult;

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "healthy":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: ShieldCheck,
          label: "HEALTHY",
        };
      case "stable":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Activity,
          label: "STABLE",
        };
      case "at-risk":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: AlertTriangle,
          label: "AT RISK",
        };
      default:
        return {
          bg: "bg-red-50 text-red-700 border-red-200",
          icon: AlertTriangle,
          label: "CRITICAL",
        };
    }
  };

  const statusInfo = getStatusBadge(status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Deterministic Survival Index</span>
            <span>•</span>
            <span className="text-slate-600 font-semibold">{projectName}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Is my system surviving?
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2.4% this cycle</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusInfo.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Main Score & Big Typography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex items-baseline gap-4">
          <div className="flex items-baseline">
            <span className="text-6xl sm:text-7xl font-black tracking-tight text-slate-900 font-mono">
              {score}
            </span>
            <span className="text-2xl font-bold text-slate-400 ml-2">/ 100</span>
          </div>
        </div>

        {/* Narrative explanation summary */}
        <div className="lg:col-span-8 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/70">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Deterministic Engine Synthesis
          </p>
          <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
            {explanation.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#FF6B00] font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 6 Categorical Factors Breakdown */}
      <div className="pt-2">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
          Weighted Factor Matrix
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {factors.map((factor) => {
            const factorOptimal = factor.score >= 75;
            const factorWarning = factor.score >= 50 && factor.score < 75;

            return (
              <div
                key={factor.id}
                className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-orange-200 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{factor.name}</span>
                  <span className="font-mono font-bold text-slate-900">
                    {factor.score}/100
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      factorOptimal
                        ? "bg-emerald-500"
                        : factorWarning
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="truncate max-w-[180px]">{factor.description}</span>
                  <span className="font-mono text-slate-400">
                    {Math.round(factor.weight * 100)}% wt
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
