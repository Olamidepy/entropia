/**
 * @fileoverview Survival engine weighting constants and categorical thresholds.
 * @module lib/survival/survival.weights
 */

/**
 * Normalized category weights summing to 1.0.
 * Determines the relative influence of each analytical sub-score on overall survival.
 */
export const SURVIVAL_WEIGHTS = {
  /** Financial and computational runway solvency */
  RESOURCE_HEALTH: 0.25,
  /** IPFS/Filecoin storage lease duration and capacity headroom */
  STORAGE_HEALTH: 0.20,
  /** Service uptime history and anomaly frequency */
  HISTORICAL_STABILITY: 0.15,
  /** Active critical and elevated risk severity exposure */
  RISK_EXPOSURE: 0.20,
  /** Ingress heartbeat and 24h transactional throughput */
  SYSTEM_ACTIVITY: 0.10,
  /** Multi-region backup redundancy and cryptographic pinning */
  PRESERVATION_READINESS: 0.10,
} as const;

/**
 * Baseline score boundary thresholds for classifying operational health.
 */
export const SURVIVAL_THRESHOLDS = {
  /** Scores >= 80 represent optimal operational posture */
  HEALTHY_MIN: 80,
  /** Scores >= 60 represent acceptable but monitored posture */
  STABLE_MIN: 60,
  /** Scores >= 35 represent degraded state requiring intervention */
  AT_RISK_MIN: 35,
  /** Scores below 35 are designated as CRITICAL emergency states */
} as const;
