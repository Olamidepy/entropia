import { RawSurvivalMetrics, SurvivalFactor, SurvivalScoreResult, SurvivalStatus } from "./survival.types";
import { SURVIVAL_THRESHOLDS, SURVIVAL_WEIGHTS } from "./survival.weights";

/**
 * Calculates deterministic survival score from raw telemetry and signals.
 * Scores are strictly bounded [0, 100].
 * The LLM NEVER computes or alters this numerical score.
 */
export function calculateDeterministicSurvivalScore(metrics: RawSurvivalMetrics): SurvivalScoreResult {
  const explanation: string[] = [];

  // 1. Resource Health (Runway, account balance, operational capacity)
  let resourceHealth = 100;
  const runway = metrics.runwayDays ?? 90;
  if (runway <= 7) {
    resourceHealth = Math.max(0, runway * 4); // 0-28
    explanation.push(`Severe resource depletion: runway critical at ${runway} days.`);
  } else if (runway <= 30) {
    resourceHealth = 30 + (runway - 7) * 2; // 30-76
    explanation.push(`Depleting resource runway: ${runway} days remaining.`);
  } else if (runway < 60) {
    resourceHealth = 80;
    explanation.push(`Moderate resource runway: ${runway} days remaining.`);
  } else {
    resourceHealth = 98;
  }

  // 2. Storage Health (Capacity, deal expiration, retrieval performance)
  let storageHealth = 100;
  const expiry = metrics.storageExpiryDays ?? 180;
  const retrievalSuccess = metrics.retrievalSuccessRate ?? 0.99;
  const storageUsage = metrics.storageUsagePct ?? 50;

  if (expiry <= 5) {
    storageHealth -= 60;
    explanation.push(`Critical storage deal expiration approaching: ${expiry} days left.`);
  } else if (expiry <= 14) {
    storageHealth -= 35;
    explanation.push(`Storage renewal required soon: ${expiry} days remaining.`);
  }

  if (retrievalSuccess < 0.9) {
    storageHealth -= 40;
    explanation.push(`Degraded storage retrieval success rate: ${(retrievalSuccess * 100).toFixed(1)}%.`);
  } else if (retrievalSuccess < 0.98) {
    storageHealth -= 15;
  }

  if (storageUsage > 95) {
    storageHealth -= 25;
    explanation.push(`Storage near full capacity (${storageUsage.toFixed(1)}%).`);
  }
  storageHealth = Math.max(0, Math.min(100, storageHealth));

  // 3. Historical Stability (Uptime, recent failures, anomalies)
  let historicalStability = 100;
  const uptime = metrics.uptimePct ?? 99.9;
  const failures = metrics.recentFailureCount ?? 0;

  if (uptime < 95) {
    historicalStability -= 45;
    explanation.push(`Sub-optimal operational uptime: ${uptime.toFixed(1)}%.`);
  } else if (uptime < 99) {
    historicalStability -= 20;
  }

  if (failures >= 5) {
    historicalStability -= 35;
    explanation.push(`Elevated failure frequency: ${failures} faults recorded.`);
  } else if (failures > 0) {
    historicalStability -= failures * 5;
  }
  historicalStability = Math.max(0, Math.min(100, historicalStability));

  // 4. Risk Exposure (Active risks penalty)
  let riskExposure = 100;
  let criticalRisks = metrics.criticalRiskCount ?? 0;
  let highRisks = metrics.highRiskCount ?? 0;

  // Derive from raw signals if counts were not pre-calculated
  if (metrics.criticalRiskCount === undefined && metrics.highRiskCount === undefined) {
    if ((metrics.storageExpiryDays ?? 180) <= 5) criticalRisks++;
    if ((metrics.runwayDays ?? 90) <= 7) criticalRisks++;
    if ((metrics.retrievalSuccessRate ?? 1.0) < 0.85) criticalRisks++;
    if ((metrics.storageExpiryDays ?? 180) > 5 && (metrics.storageExpiryDays ?? 180) <= 14) highRisks++;
    if ((metrics.runwayDays ?? 90) > 7 && (metrics.runwayDays ?? 90) <= 30) highRisks++;
    if ((metrics.preservationPinCount ?? 1) === 0) highRisks++;
    if ((metrics.recentFailureCount ?? 0) >= 5) highRisks++;
  }

  const activeRisks = metrics.activeRiskCount ?? (criticalRisks + highRisks);

  if (criticalRisks > 0) {
    riskExposure -= criticalRisks * 35;
    explanation.push(`${criticalRisks} CRITICAL risk alert(s) currently active.`);
  }
  if (highRisks > 0) {
    riskExposure -= highRisks * 15;
    explanation.push(`${highRisks} HIGH risk event(s) detected.`);
  }
  if (activeRisks > 0 && criticalRisks === 0 && highRisks === 0) {
    riskExposure -= activeRisks * 5;
  }
  riskExposure = Math.max(0, Math.min(100, riskExposure));

  // 5. System Activity (Heartbeat freshness, liveness)
  let systemActivity = 100;
  const heartbeatSec = metrics.lastHeartbeatSecondsAgo ?? 30;
  if (heartbeatSec > 86400) {
    systemActivity = 10;
    explanation.push(`Telemetry heartbeat stale (>24 hours inactive).`);
  } else if (heartbeatSec > 3600) {
    systemActivity = 50;
    explanation.push(`Telemetry heartbeat delayed (${Math.round(heartbeatSec / 60)} minutes ago).`);
  } else {
    systemActivity = 98;
  }

  // 6. Preservation Readiness (Decentralized backup, Filecoin pinning, replicas)
  let preservationReadiness = 100;
  const pinCount = metrics.preservationPinCount ?? 1;
  const replicas = metrics.verifiedReplicas ?? 2;
  const backupHours = metrics.lastBackupHoursAgo ?? 12;

  if (pinCount === 0) {
    preservationReadiness -= 50;
    explanation.push("No active Filecoin preservation deals pinned.");
  }
  if (replicas < 2) {
    preservationReadiness -= 25;
    explanation.push(`Single replica detected (${replicas}). Recommended replication factor: >=2.`);
  }
  if (backupHours > 168) {
    preservationReadiness -= 30;
    explanation.push(`Cold snapshot is overdue (>7 days since last snapshot).`);
  }
  preservationReadiness = Math.max(0, Math.min(100, preservationReadiness));

  // Weighted aggregation
  const weightedSum =
    resourceHealth * SURVIVAL_WEIGHTS.RESOURCE_HEALTH +
    storageHealth * SURVIVAL_WEIGHTS.STORAGE_HEALTH +
    historicalStability * SURVIVAL_WEIGHTS.HISTORICAL_STABILITY +
    riskExposure * SURVIVAL_WEIGHTS.RISK_EXPOSURE +
    systemActivity * SURVIVAL_WEIGHTS.SYSTEM_ACTIVITY +
    preservationReadiness * SURVIVAL_WEIGHTS.PRESERVATION_READINESS;

  const score = Math.max(0, Math.min(100, Math.round(weightedSum * 10) / 10));

  let status: SurvivalStatus = "healthy";
  if (score < SURVIVAL_THRESHOLDS.AT_RISK_MIN) {
    status = "critical";
  } else if (score < SURVIVAL_THRESHOLDS.STABLE_MIN) {
    status = "at-risk";
  } else if (score < SURVIVAL_THRESHOLDS.HEALTHY_MIN) {
    status = "stable";
  }

  const getFactorStatus = (s: number): "optimal" | "warning" | "critical" => {
    if (s >= 75) return "optimal";
    if (s >= 50) return "warning";
    return "critical";
  };

  const factors: SurvivalFactor[] = [
    {
      id: "f-resource",
      name: "Resource Health",
      category: "resource",
      score: resourceHealth,
      weight: SURVIVAL_WEIGHTS.RESOURCE_HEALTH,
      weightedContribution: Math.round(resourceHealth * SURVIVAL_WEIGHTS.RESOURCE_HEALTH * 10) / 10,
      status: getFactorStatus(resourceHealth),
      description: `Runway: ${runway} days remaining. Liquidity & compute capacity.`,
    },
    {
      id: "f-storage",
      name: "Storage Health",
      category: "storage",
      score: storageHealth,
      weight: SURVIVAL_WEIGHTS.STORAGE_HEALTH,
      weightedContribution: Math.round(storageHealth * SURVIVAL_WEIGHTS.STORAGE_HEALTH * 10) / 10,
      status: getFactorStatus(storageHealth),
      description: `Expiry: ${expiry} days. Retrieval success: ${(retrievalSuccess * 100).toFixed(0)}%.`,
    },
    {
      id: "f-stability",
      name: "Historical Stability",
      category: "stability",
      score: historicalStability,
      weight: SURVIVAL_WEIGHTS.HISTORICAL_STABILITY,
      weightedContribution: Math.round(historicalStability * SURVIVAL_WEIGHTS.HISTORICAL_STABILITY * 10) / 10,
      status: getFactorStatus(historicalStability),
      description: `Uptime: ${uptime.toFixed(1)}%. Recent fault events: ${failures}.`,
    },
    {
      id: "f-risk",
      name: "Risk Exposure",
      category: "risk",
      score: riskExposure,
      weight: SURVIVAL_WEIGHTS.RISK_EXPOSURE,
      weightedContribution: Math.round(riskExposure * SURVIVAL_WEIGHTS.RISK_EXPOSURE * 10) / 10,
      status: getFactorStatus(riskExposure),
      description: `Active risks: ${activeRisks} (${criticalRisks} critical, ${highRisks} high).`,
    },
    {
      id: "f-activity",
      name: "System Activity",
      category: "activity",
      score: systemActivity,
      weight: SURVIVAL_WEIGHTS.SYSTEM_ACTIVITY,
      weightedContribution: Math.round(systemActivity * SURVIVAL_WEIGHTS.SYSTEM_ACTIVITY * 10) / 10,
      status: getFactorStatus(systemActivity),
      description: `Telemetry cadence: ${heartbeatSec}s ago.`,
    },
    {
      id: "f-preservation",
      name: "Preservation Readiness",
      category: "preservation",
      score: preservationReadiness,
      weight: SURVIVAL_WEIGHTS.PRESERVATION_READINESS,
      weightedContribution: Math.round(preservationReadiness * SURVIVAL_WEIGHTS.PRESERVATION_READINESS * 10) / 10,
      status: getFactorStatus(preservationReadiness),
      description: `Replication factor: ${replicas}x. Filecoin pinned deals active: ${pinCount}.`,
    },
  ];

  return {
    score,
    status,
    factors,
    explanation: explanation.length > 0 ? explanation : ["All operational indicators operating within normal parameters."],
    calculatedAt: new Date(),
    rawCategoryScores: {
      resourceHealth,
      storageHealth,
      historicalStability,
      riskExposure,
      systemActivity,
      preservationReadiness,
    },
  };
}
