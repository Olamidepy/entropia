/**
 * @fileoverview Telemetry signal schemas and ingestion structures.
 * @module lib/monitoring/signal.types
 */

/**
 * Functional category classifying monitored operational signals.
 */
export type SignalCategory = "resource" | "storage" | "stability" | "activity" | "security";

/**
 * Clean, validated telemetry signal normalized for timeseries indexing.
 */
export interface NormalizedSignal {
  /** Optional unique record ID */
  id?: string;
  /** Associated project identifier */
  projectId: string;
  /** Standardized signal identifier */
  name: string;
  /** Categorical classification */
  category: SignalCategory;
  /** Normalized numerical metric value */
  value: number;
  /** Unit of measurement (e.g., ms, pct, bytes) */
  unit: string;
  /** Auxiliary metadata payload */
  metadata?: Record<string, unknown>;
  /** Timestamp when metric was captured */
  observedAt: Date;
}

/**
 * Payload envelope for batch signal ingestion endpoints.
 */
export interface IngestSignalPayload {
  /** Target project identifier */
  projectId: string;
  /** Array of raw signals pending normalization */
  signals: Array<{
    name: string;
    category: SignalCategory;
    value: number;
    unit: string;
    metadata?: Record<string, unknown>;
  }>;
}
