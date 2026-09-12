/**
 * @fileoverview Risk analysis types and threat detection structures.
 * @module lib/risk/risk.types
 */

/**
 * Severity ranking assigned to detected anomalies.
 */
export type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * Lifecycle state of a detected operational risk.
 */
export type RiskStatus = "ACTIVE" | "MITIGATED" | "DISMISSED";

/**
 * Quantitative evidence supporting a risk identification trigger.
 */
export interface RiskEvidence {
  /** Metric identifier that breached threshold */
  metric: string;
  /** Actual observed telemetry value */
  observedValue: number | string | boolean;
  /** Permissible safety limit */
  threshold: number | string;
  /** Unit of measurement (e.g. ms, days, pct) */
  unit?: string;
  /** ISO timestamp when metric was sampled */
  timestamp: string;
}

/**
 * Comprehensive representation of an identified threat condition.
 */
export interface DetectedRisk {
  /** Unique risk record identifier */
  id: string;
  /** Standardized error code identifier (e.g., RISK-RUNWAY-001) */
  code: string;
  /** Short descriptive headline */
  title: string;
  /** In-depth context regarding risk mechanism and threat scope */
  description: string;
  /** Assigned severity tier */
  severity: RiskSeverity;
  /** Current mitigation status */
  status: RiskStatus;
  /** Empirical metrics that triggered the detection */
  evidence: RiskEvidence[];
  /** Timestamp when the risk was registered */
  detectedAt: Date;
  /** Automated or recommended human mitigation step */
  suggestedAction?: string;
}
