import { DetectedRisk, RiskSeverity } from "./risk.types";
import { RawSurvivalMetrics } from "../survival/survival.types";

export interface RiskRule {
  code: string;
  name: string;
  evaluate: (metrics: RawSurvivalMetrics) => DetectedRisk | null;
}

export const RISK_RULES: RiskRule[] = [
  {
    code: "STORAGE_EXPIRY_CRITICAL",
    name: "Filecoin Storage Expiry Critical",
    evaluate: (m) => {
      const days = m.storageExpiryDays ?? 180;
      if (days <= 5) {
        return {
          id: `risk-exp-${Date.now()}`,
          code: "STORAGE_EXPIRY_CRITICAL",
          title: "Filecoin Storage Deal Expiration Imminent",
          description: `Storage deal expires in ${days} days. Monitored dataset will enter sealing fault and loss state without renewal.`,
          severity: "CRITICAL",
          status: "ACTIVE",
          evidence: [
            {
              metric: "storage_expiry_days",
              observedValue: days,
              threshold: "<= 5",
              unit: "days",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "RENEW_STORAGE_DEAL",
        };
      }
      if (days <= 14) {
        return {
          id: `risk-exp-${Date.now()}`,
          code: "STORAGE_EXPIRY_APPROACHING",
          title: "Storage Deal Approaching Expiry",
          description: `Primary storage deal has ${days} days remaining before expiration.`,
          severity: "HIGH",
          status: "ACTIVE",
          evidence: [
            {
              metric: "storage_expiry_days",
              observedValue: days,
              threshold: "<= 14",
              unit: "days",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "RENEW_STORAGE_DEAL",
        };
      }
      return null;
    },
  },
  {
    code: "RETRIEVAL_FAILURE",
    name: "Storage Retrieval Failure Rate High",
    evaluate: (m) => {
      const rate = m.retrievalSuccessRate ?? 1.0;
      if (rate < 0.85) {
        return {
          id: `risk-ret-${Date.now()}`,
          code: "RETRIEVAL_FAILURE_CRITICAL",
          title: "Degraded Retrieval Pipeline",
          description: `Piece retrieval success rate has fallen to ${(rate * 100).toFixed(1)}%. Primary storage provider may be experiencing sector failure.`,
          severity: "CRITICAL",
          status: "ACTIVE",
          evidence: [
            {
              metric: "retrieval_success_rate",
              observedValue: `${(rate * 100).toFixed(1)}%`,
              threshold: "< 85%",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "MIGRATE_SECONDARY_STORAGE",
        };
      }
      if (rate < 0.95) {
        return {
          id: `risk-ret-${Date.now()}`,
          code: "RETRIEVAL_DEGRADATION",
          title: "Suboptimal Storage Retrieval Performance",
          description: `Intermittent retrieval failures observed (${(rate * 100).toFixed(1)}% success rate).`,
          severity: "MEDIUM",
          status: "ACTIVE",
          evidence: [
            {
              metric: "retrieval_success_rate",
              observedValue: `${(rate * 100).toFixed(1)}%`,
              threshold: "< 95%",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "MIGRATE_SECONDARY_STORAGE",
        };
      }
      return null;
    },
  },
  {
    code: "RUNWAY_DEPLETION",
    name: "Resource Runway Depletion",
    evaluate: (m) => {
      const runway = m.runwayDays ?? 90;
      if (runway <= 7) {
        return {
          id: `risk-run-${Date.now()}`,
          code: "RUNWAY_DEPLETION_CRITICAL",
          title: "Resource Liquidity Depletion",
          description: `Operational financial/compute runway stands at only ${runway} days. Immediate preservation protocol must be triggered.`,
          severity: "CRITICAL",
          status: "ACTIVE",
          evidence: [
            {
              metric: "runway_days",
              observedValue: runway,
              threshold: "<= 7",
              unit: "days",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "PRESERVE_TO_FILECOIN",
        };
      }
      if (runway <= 30) {
        return {
          id: `risk-run-${Date.now()}`,
          code: "RUNWAY_DEPLETION_HIGH",
          title: "Resource Runway Warning",
          description: `Operational runway has decreased to ${runway} days. Memory compression and priority archiving recommended.`,
          severity: "HIGH",
          status: "ACTIVE",
          evidence: [
            {
              metric: "runway_days",
              observedValue: runway,
              threshold: "<= 30",
              unit: "days",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "COMPRESS_MEMORY_INDEX",
        };
      }
      return null;
    },
  },
  {
    code: "MISSING_PRESERVATION_BACKUP",
    name: "Missing Filecoin Decentralized Preservation Deal",
    evaluate: (m) => {
      const pins = m.preservationPinCount ?? 1;
      if (pins === 0) {
        return {
          id: `risk-pin-${Date.now()}`,
          code: "MISSING_PRESERVATION_BACKUP",
          title: "Zero Verified Preservation Deals",
          description: "No immutable cryptographic storage deal has been confirmed on the Filecoin network.",
          severity: "HIGH",
          status: "ACTIVE",
          evidence: [
            {
              metric: "preservation_pin_count",
              observedValue: 0,
              threshold: ">= 1",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "PRESERVE_TO_FILECOIN",
        };
      }
      return null;
    },
  },
  {
    code: "HEARTBEAT_INACTIVITY",
    name: "System Telemetry Stale",
    evaluate: (m) => {
      const secs = m.lastHeartbeatSecondsAgo ?? 30;
      if (secs > 86400) {
        return {
          id: `risk-hb-${Date.now()}`,
          code: "HEARTBEAT_INACTIVITY_HIGH",
          title: "Extended Telemetry Inactivity (>24h)",
          description: `No telemetry received for ${Math.round(secs / 3600)} hours. Monitored agent may be unresponsive.`,
          severity: "HIGH",
          status: "ACTIVE",
          evidence: [
            {
              metric: "last_heartbeat_seconds_ago",
              observedValue: secs,
              threshold: "> 86400",
              unit: "seconds",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "ALERT_STAKEHOLDERS",
        };
      }
      if (secs > 3600) {
        return {
          id: `risk-hb-${Date.now()}`,
          code: "HEARTBEAT_INACTIVITY_MEDIUM",
          title: "Delayed Telemetry Heartbeat",
          description: `Telemetry update delayed by ${Math.round(secs / 60)} minutes.`,
          severity: "MEDIUM",
          status: "ACTIVE",
          evidence: [
            {
              metric: "last_heartbeat_seconds_ago",
              observedValue: secs,
              threshold: "> 3600",
              unit: "seconds",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "ALERT_STAKEHOLDERS",
        };
      }
      return null;
    },
  },
  {
    code: "REPEATED_SYSTEM_FAILURES",
    name: "Repeated System Failures",
    evaluate: (m) => {
      const failures = m.recentFailureCount ?? 0;
      if (failures >= 5) {
        return {
          id: `risk-fail-${Date.now()}`,
          code: "REPEATED_SYSTEM_FAILURES_HIGH",
          title: "High Frequency Incident Failures",
          description: `${failures} operational execution faults registered in the recent monitoring cycle.`,
          severity: "HIGH",
          status: "ACTIVE",
          evidence: [
            {
              metric: "recent_failure_count",
              observedValue: failures,
              threshold: ">= 5",
              timestamp: new Date().toISOString(),
            },
          ],
          detectedAt: new Date(),
          suggestedAction: "ALERT_STAKEHOLDERS",
        };
      }
      return null;
    },
  },
];
