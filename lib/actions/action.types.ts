export type ActionType =
  | "PRESERVE_TO_FILECOIN"
  | "RENEW_STORAGE_DEAL"
  | "COMPRESS_MEMORY_INDEX"
  | "MIGRATE_SECONDARY_STORAGE"
  | "ALERT_STAKEHOLDERS"
  | "DISMISS_RISK";

export type ActionStatus =
  | "PENDING_CONFIRMATION"
  | "APPROVED"
  | "REJECTED"
  | "EXECUTING"
  | "COMPLETED"
  | "FAILED";

export interface ActionRegistryItem {
  type: ActionType;
  title: string;
  description: string;
  requiresConfirmation: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  expectedOutcome: string;
  category: "preservation" | "maintenance" | "optimization" | "security";
  defaultPayload?: Record<string, unknown>;
}

export const ACTION_REGISTRY: Record<ActionType, ActionRegistryItem> = {
  PRESERVE_TO_FILECOIN: {
    type: "PRESERVE_TO_FILECOIN",
    title: "Create Sealed Filecoin Preservation Deal",
    description:
      "Packages the current project memory state, vector indices, and cryptographic hashes into a CAR file, publishing a verified storage deal across distributed Filecoin miners.",
    requiresConfirmation: true,
    riskLevel: "CRITICAL",
    expectedOutcome:
      "Generates an immutable PieceCID, provisions at least 2 geographically dispersed storage deals, and guarantees state retrieval for 540 days.",
    category: "preservation",
  },
  RENEW_STORAGE_DEAL: {
    type: "RENEW_STORAGE_DEAL",
    title: "Renew Approaching Filecoin Storage Deal",
    description:
      "Extends active storage sector leases with existing storage providers before sector expiration occurs.",
    requiresConfirmation: true,
    riskLevel: "HIGH",
    expectedOutcome:
      "Extends deal duration by 180 epochs (days) and eliminates impending storage expiration risk.",
    category: "preservation",
  },
  COMPRESS_MEMORY_INDEX: {
    type: "COMPRESS_MEMORY_INDEX",
    title: "Prune & Compress Ephemeral Memory Index",
    description:
      "Compacts memory embeddings and vector checkpoints by removing redundant debug traces and low-weight historical tokens.",
    requiresConfirmation: true,
    riskLevel: "MEDIUM",
    expectedOutcome:
      "Reduces memory footprint by 25-40%, extending resource runway without losing critical semantic knowledge.",
    category: "optimization",
  },
  MIGRATE_SECONDARY_STORAGE: {
    type: "MIGRATE_SECONDARY_STORAGE",
    title: "Failover to Secondary Storage Provider",
    description:
      "Transfers primary read/write routing to a secondary verified Filecoin storage provider due to degraded performance on primary node.",
    requiresConfirmation: true,
    riskLevel: "HIGH",
    expectedOutcome:
      "Restores retrieval latency to <250ms and resolves active sector fault warnings.",
    category: "maintenance",
  },
  ALERT_STAKEHOLDERS: {
    type: "ALERT_STAKEHOLDERS",
    title: "Dispatch Emergency Operator Alert",
    description:
      "Transmits prioritized webhook and notification payloads to designated incident response channels.",
    requiresConfirmation: false,
    riskLevel: "LOW",
    expectedOutcome:
      "Notifies systems administrators of critical anomalies within 30 seconds.",
    category: "security",
  },
  DISMISS_RISK: {
    type: "DISMISS_RISK",
    title: "Acknowledge and Dismiss Risk Alert",
    description: "Marks an active risk event as acknowledged or resolved by the operator.",
    requiresConfirmation: false,
    riskLevel: "LOW",
    expectedOutcome: "Clears warning from active dashboard risk queue and updates audit log.",
    category: "maintenance",
  },
};

export function isValidActionType(action: string): action is ActionType {
  return action in ACTION_REGISTRY;
}
