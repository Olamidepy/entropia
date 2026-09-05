export type SurvivalStatus = "healthy" | "stable" | "at-risk" | "critical";

export interface SurvivalFactor {
  id: string;
  name: string;
  category: "resource" | "storage" | "stability" | "risk" | "activity" | "preservation";
  score: number; // 0 - 100
  weight: number; // 0 - 1
  weightedContribution: number; // score * weight
  status: "optimal" | "warning" | "critical";
  description: string;
}

export interface RawSurvivalMetrics {
  runwayDays?: number; // Financial/compute runway in days
  balanceUsd?: number;
  storageUsagePct?: number; // 0 - 100
  storageExpiryDays?: number;
  retrievalLatencyMs?: number;
  retrievalSuccessRate?: number; // 0 - 1
  uptimePct?: number; // 0 - 100
  recentFailureCount?: number;
  activeRiskCount?: number;
  criticalRiskCount?: number;
  highRiskCount?: number;
  lastHeartbeatSecondsAgo?: number;
  transactionVolume24h?: number;
  preservationPinCount?: number;
  verifiedReplicas?: number;
  lastBackupHoursAgo?: number;
}

export interface SurvivalScoreResult {
  score: number; // 0 - 100 (rounded to 1 decimal place)
  status: SurvivalStatus;
  factors: SurvivalFactor[];
  explanation: string[];
  calculatedAt: Date;
  rawCategoryScores: {
    resourceHealth: number;
    storageHealth: number;
    historicalStability: number;
    riskExposure: number;
    systemActivity: number;
    preservationReadiness: number;
  };
}
