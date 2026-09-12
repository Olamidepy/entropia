/**
 * @fileoverview Immutable telemetry payload schemas and branded types.
 * @module lib/monitoring/telemetry.types
 */

import { SignalCategory } from "./signal.types";

/**
 * Branded nominal type for cryptographic project identifiers.
 */
export type ProjectId = string & { readonly __brand: unique symbol };

/**
 * Immutable telemetry snapshot captured at a discrete point in time.
 */
export interface ReadonlyTelemetrySnapshot {
  readonly timestamp: number;
  readonly projectId: string;
  readonly signals: ReadonlyArray<{
    readonly key: string;
    readonly category: SignalCategory;
    readonly value: number;
    readonly unit: string;
  }>;
}

/**
 * Type guard verifying if a signal payload conforms to ReadonlyTelemetrySnapshot.
 */
export function isTelemetrySnapshot(val: unknown): val is ReadonlyTelemetrySnapshot {
  if (!val || typeof val !== "object") return false;
  const candidate = val as Partial<ReadonlyTelemetrySnapshot>;
  return (
    typeof candidate.timestamp === "number" &&
    typeof candidate.projectId === "string" &&
    Array.isArray(candidate.signals)
  );
}
