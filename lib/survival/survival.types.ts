/**
 * @fileoverview Survival engine type definitions and telemetry models.
 * @module lib/survival/survival.types
 */

/**
 * Health status classification calculated from composite survival score.
 */
export type SurvivalStatus = "healthy" | "stable" | "at-risk" | "critical";

/**
 * Individual analytical factor contributing to aggregate survival score.
 */
export interface SurvivalFactor {
  /** Unique identifier for the survival metric */
  id: string;
  /** Human-readable factor name */
  name: string;
  /** Analytical dimension grouping */
  category: "resource" | "storage" | "stability" | "risk" | "activity" | "preservation";
  /** Normalized score ranging from 0 to 100 */
  score: number;
  /** Relative weight contribution ranging from 0 to 1 */
  weight: number;
  /** Computed contribution value: score multiplied by weight */
  weightedContribution: number;
  /** Severity tier of this specific factor */
  status: "optimal" | "warning" | "critical";
  /** Diagnostic human-readable summary */
  description: string;
}

/**
 * Raw telemetry inputs ingested into the survival score heuristic engine.
 */
export interface RawSurvivalMetrics {
  /** Projected financial or compute runway remaining in days */
  runwayDays?: number;
  /** Total treasury balance in USD */
  balanceUsd?: number;
  /** Current storage capacity utilized as a percentage (0-100) */
  storageUsagePct?: number;
  /** Estimated days until primary storage lease expiration */
  storageExpiryDays?: number;
  /** Average retrieval response latency in milliseconds */
  retrievalLatencyMs?: number;
  /** Retrieval success probability ratio between 0 and 1 */
  retrievalSuccessRate?: number;
  /** System uptime availability percentage over 30 days */
  uptimePct?: number;
  /** Count of non-fatal operational anomalies in the trailing period */
  recentFailureCount?: number;
  /** Aggregate active unresolved risk incidents */
  activeRiskCount?: number;
  /** Active critical severity level incidents */
  criticalRiskCount?: number;
  /** Active high severity level incidents */
  highRiskCount?: number;
  /** Elapsed seconds since the last recorded system heartbeat */
  lastHeartbeatSecondsAgo?: number;
  /** Aggregated 24-hour transaction or message throughput */
  transactionVolume24h?: number;
  /** Number of active cryptographic IPFS/Filecoin preservation pins */
  preservationPinCount?: number;
  /** Number of geographically verified decentralized replicas */
  verifiedReplicas?: number;
  /** Elapsed hours since last state archive snapshot */
  lastBackupHoursAgo?: number;
}

/**
 * Composite survival assessment evaluated across all active telemetry signals.
 */
export interface SurvivalScoreResult {
  /** Normalized composite score between 0 and 100 */
  score: number;
  /** High-level operational health category */
  status: SurvivalStatus;
  /** Detailed breakdown of all contributing scoring dimensions */
  factors: SurvivalFactor[];
  /** Algorithmic explanations justifying the computed score */
  explanation: string[];
  /** Timestamp when calculation was finalized */
  calculatedAt: Date;
  /** Granular sub-category scores for fine-grained analysis */
  rawCategoryScores: {
    resourceHealth: number;
    storageHealth: number;
    historicalStability: number;
    riskExposure: number;
    systemActivity: number;
    preservationReadiness: number;
  };
}
