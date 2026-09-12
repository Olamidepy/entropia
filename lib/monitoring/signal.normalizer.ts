import { NormalizedSignal } from "./signal.types";
import { RawSurvivalMetrics } from "../survival/survival.types";

/**
 * Normalizes an array of observed project signals into structured metrics
 * consumable by the deterministic Survival Engine and Risk Engine.
 * 
 * Maps known string telemetry keys into strongly typed numeric fields on the
 * RawSurvivalMetrics payload, discarding unmapped or unsupported auxiliary keys.
 * 
 * @param signals Collection of validated signals from ingestion pipeline
 * @returns Structured raw survival metrics object
 */
export function normalizeSignalsToMetrics(signals: NormalizedSignal[]): RawSurvivalMetrics {
  const metrics: RawSurvivalMetrics = {};

  // Process each signal and assign to corresponding strongly-typed metric field
  for (const sig of signals) {
    switch (sig.name) {
      // Resource dimension signals
      case "runway_days":
        metrics.runwayDays = sig.value;
        break;
      case "balance_usd":
        metrics.balanceUsd = sig.value;
        break;

      // Storage dimension signals
      case "storage_usage_pct":
        metrics.storageUsagePct = sig.value;
        break;
      case "storage_expiry_days":
        metrics.storageExpiryDays = sig.value;
        break;
      case "retrieval_latency_ms":
        metrics.retrievalLatencyMs = sig.value;
        break;
      case "retrieval_success_rate":
        metrics.retrievalSuccessRate = sig.value;
        break;

      // Stability and reliability signals
      case "uptime_pct":
        metrics.uptimePct = sig.value;
        break;
      case "recent_failure_count":
        metrics.recentFailureCount = sig.value;
        break;

      // Activity and heartbeat signals
      case "last_heartbeat_seconds_ago":
        metrics.lastHeartbeatSecondsAgo = sig.value;
        break;
      case "transaction_volume_24h":
        metrics.transactionVolume24h = sig.value;
        break;

      // Decentralized preservation signals
      case "preservation_pin_count":
        metrics.preservationPinCount = sig.value;
        break;
      case "verified_replicas":
        metrics.verifiedReplicas = sig.value;
        break;
      case "last_backup_hours_ago":
        metrics.lastBackupHoursAgo = sig.value;
        break;
    }
  }

  return metrics;
}
