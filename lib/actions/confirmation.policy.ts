import { ActionType, ACTION_REGISTRY } from "./action.types";

export interface ConfirmationDetails {
  actionType: ActionType;
  whatWillHappen: string;
  whyRecommended: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  expectedOutcome: string;
  requiresConfirmation: boolean;
}

/**
 * Builds the required 4-part confirmation detail view:
 * 1. WHAT WILL HAPPEN
 * 2. WHY IT IS RECOMMENDED
 * 3. RISK LEVEL
 * 4. EXPECTED OUTCOME
 */
export function getActionConfirmationDetails(
  actionType: ActionType,
  contextReason?: string
): ConfirmationDetails {
  const item = ACTION_REGISTRY[actionType];

  let whatWillHappen = item?.description || "Execute system preservation operation.";
  let whyRecommended =
    contextReason || "Recommended by Entropia deterministic policy to preserve operational survival.";
  const riskLevel = item?.riskLevel || "MEDIUM";
  const expectedOutcome = item?.expectedOutcome || "Preserves system integrity.";

  switch (actionType) {
    case "PRESERVE_TO_FILECOIN":
      whatWillHappen =
        "The system will package the active state, vector embeddings, and memory indices into a content-addressed CAR payload and commit a verifiable storage deal across decentralized Filecoin storage providers.";
      whyRecommended =
        contextReason ||
        "Resource runway depletion or impending infrastructure failure threatens data survival. Filecoin creates an immutable, verifiable cryptographic archive.";
      break;

    case "RENEW_STORAGE_DEAL":
      whatWillHappen =
        "An on-chain or gateway transaction will be submitted to extend existing Filecoin storage deals before sector expiration occurs.";
      whyRecommended =
        contextReason || "Deal expiration is within the 14-day threshold. Failure to renew results in sector teardown.";
      break;

    case "COMPRESS_MEMORY_INDEX":
      whatWillHappen =
        "Historical observation traces will be pruned, low-weight vector embeddings quantized, and memory indices defragmented.";
      whyRecommended =
        contextReason || "Operational memory consumption exceeds optimal limits. Compression recovers 25-40% capacity.";
      break;

    case "MIGRATE_SECONDARY_STORAGE":
      whatWillHappen =
        "Active retrieval routes will be reassigned from the degraded miner node to a high-reputation secondary Filecoin provider.";
      whyRecommended =
        contextReason || "Primary provider retrieval success rate has fallen below the 90% SLA threshold.";
      break;
  }

  return {
    actionType,
    whatWillHappen,
    whyRecommended,
    riskLevel,
    expectedOutcome,
    requiresConfirmation: item?.requiresConfirmation ?? true,
  };
}
