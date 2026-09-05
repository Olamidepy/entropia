"use client";

import { useState } from "react";
import { calculateDeterministicSurvivalScore } from "@/lib/survival/survival.engine";
import { evaluateDeterministicRisks } from "@/lib/risk/risk.engine";
import { ArrowRight, AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function MarketingSimulator() {
  const [runwayDays, setRunwayDays] = useState(45);
  const [storageExpiryDays, setStorageExpiryDays] = useState(28);
  const [retrievalSuccessRate, setRetrievalSuccessRate] = useState(98);
  const [uptimePct, setUptimePct] = useState(99.4);
  const [preservationPins, setPreservationPins] = useState(2);

  const survivalResult = calculateDeterministicSurvivalScore({
    runwayDays,
    storageExpiryDays,
    retrievalSuccessRate: retrievalSuccessRate / 100,
    uptimePct,
    preservationPinCount: preservationPins,
    verifiedReplicas: preservationPins > 0 ? 2 : 0,
    recentFailureCount: retrievalSuccessRate < 90 ? 3 : 0,
  });

  const activeRisks = evaluateDeterministicRisks({
    runwayDays,
    storageExpiryDays,
    retrievalSuccessRate: retrievalSuccessRate / 100,
    uptimePct,
    preservationPinCount: preservationPins,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "stable":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "at-risk":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-[#FF6B00]">
            <span>Live Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Experience Deterministic Survival Intelligence
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Drag the telemetry telemetry controls below. Observe how the mathematical engine recalibrates the survival score and trips safety thresholds without AI hallucination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-slate-50/60 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Telemetry Telemetry Inputs
            </h3>

            {/* Runway slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700">Financial / Compute Runway</label>
                <span className="font-mono text-slate-900 font-bold">{runwayDays} days</span>
              </div>
              <input
                type="range"
                min="2"
                max="180"
                value={runwayDays}
                onChange={(e) => setRunwayDays(Number(e.target.value))}
                className="w-full accent-[#FF6B00] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>Critical (2d)</span>
                <span>Warning (30d)</span>
                <span>Optimal (180d)</span>
              </div>
            </div>

            {/* Storage Deal Expiry */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700">Filecoin Storage Deal Expiry</label>
                <span className="font-mono text-slate-900 font-bold">{storageExpiryDays} days left</span>
              </div>
              <input
                type="range"
                min="1"
                max="180"
                value={storageExpiryDays}
                onChange={(e) => setStorageExpiryDays(Number(e.target.value))}
                className="w-full accent-[#FF6B00] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>Critical (&lt;5d)</span>
                <span>Warning (&lt;14d)</span>
                <span>Secure (180d)</span>
              </div>
            </div>

            {/* Retrieval Success Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700">Storage Retrieval Success Rate</label>
                <span className="font-mono text-slate-900 font-bold">{retrievalSuccessRate}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                value={retrievalSuccessRate}
                onChange={(e) => setRetrievalSuccessRate(Number(e.target.value))}
                className="w-full accent-[#FF6B00] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>Degraded (70%)</span>
                <span>Acceptable (95%)</span>
                <span>High SLA (100%)</span>
              </div>
            </div>

            {/* Preservation Deal Pins */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-700">Filecoin Verified Pinned Deals</label>
                <span className="font-mono text-slate-900 font-bold">{preservationPins} deals</span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPreservationPins(num)}
                    className={`py-2 text-sm font-semibold rounded-lg border transition-all ${
                      preservationPins === num
                        ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {num === 0 ? "0 (Unpinned)" : `${num} Pinned`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Output Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Score Showcase */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Calculated Survival Score
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusBadge(
                    survivalResult.status
                  )}`}
                >
                  {survivalResult.status}
                </span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                  {survivalResult.score}
                </span>
                <span className="text-xl font-bold text-slate-500">/ 100</span>
              </div>

              {/* Factors mini bar breakdown */}
              <div className="space-y-3 pt-2">
                {survivalResult.factors.map((factor) => (
                  <div key={factor.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>{factor.name}</span>
                      <span className="font-mono font-semibold">{factor.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          factor.score >= 75
                            ? "bg-emerald-500"
                            : factor.score >= 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Active risks list in simulator */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tripped Risk Events ({activeRisks.length})
                </span>
                {activeRisks.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                    <span>No critical thresholds tripped. All signals within safety corridors.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeRisks.map((risk) => (
                      <div
                        key={risk.id}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                          risk.severity === "CRITICAL"
                            ? "bg-red-50/70 border-red-200 text-red-800"
                            : "bg-amber-50/70 border-amber-200 text-amber-800"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{risk.title}</p>
                          <p className="opacity-80 mt-0.5">{risk.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
                >
                  Enter Operational Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
