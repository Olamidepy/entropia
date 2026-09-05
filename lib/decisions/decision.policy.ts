import { ActionType, ACTION_REGISTRY } from "../actions/action.types";
import { ExecutionType } from "./decision.types";
import { DetectedRisk } from "../risk/risk.types";
import { SurvivalScoreResult } from "../survival/survival.types";

export interface PolicyEvaluation {
  ruleCode: string;
  recommendedAction: ActionType;
  executionType: ExecutionType;
  requiresConfirmation: boolean;
  reasoning: string;
}

/**
 * Deterministic Decision Policies.
 * Explicitly guards sensitive operations behind mandatory user confirmation.
 */
export function evaluateDecisionPolicy(params: {
  survivalResult: SurvivalScoreResult;
  activeRisks: DetectedRisk[];
  aiRecommendedAction: ActionType;
}): PolicyEvaluation {
  const { survivalResult, activeRisks, aiRecommendedAction } = params;
  const score = survivalResult.score;
  const hasCritical = activeRisks.some((r) => r.severity === "CRITICAL");
  const hasHigh = activeRisks.some((r) => r.severity === "HIGH");

  // Rule 1: CRITICAL Risk with low survival score -> Force Preservation Confirmation
  if (hasCritical && score < 40) {
    return {
      ruleCode: "CRITICAL_SURVIVAL_EMERGENCY_PRESERVATION",
      recommendedAction: "PRESERVE_TO_FILECOIN",
      executionType: "REQUIRES_CONFIRMATION",
      requiresConfirmation: true,
      reasoning:
        "CRITICAL risk detected with survival score < 40. Immediate immutable snapshot to Filecoin is mandatory to avoid irreversible loss.",
    };
  }

  // Rule 2: Imminent Storage Expiry -> Deal Renewal
  if (activeRisks.some((r) => r.code.includes("STORAGE_EXPIRY"))) {
    return {
      ruleCode: "STORAGE_DEAL_RENEWAL_REQUIRED",
      recommendedAction: "RENEW_STORAGE_DEAL",
      executionType: "REQUIRES_CONFIRMATION",
      requiresConfirmation: true,
      reasoning:
        "Filecoin storage sector lease is nearing end-of-life. Timely renewal prevents sector termination and penalty burn.",
    };
  }

  // Rule 3: Degraded Retrieval -> Storage Migration
  if (activeRisks.some((r) => r.code.includes("RETRIEVAL"))) {
    return {
      ruleCode: "RETRIEVAL_LATENCY_DEGRADATION_FAILOVER",
      recommendedAction: "MIGRATE_SECONDARY_STORAGE",
      executionType: "REQUIRES_CONFIRMATION",
      requiresConfirmation: true,
      reasoning:
        "Storage retrieval failure rate is breaching SLA. Failover to secondary verified miner node required.",
    };
  }

  // Rule 4: Moderate runway constraint -> Memory Index Compression
  if (score < 65 || activeRisks.some((r) => r.code.includes("RUNWAY_DEPLETION_HIGH"))) {
    return {
      ruleCode: "RESOURCE_RUNWAY_COMPRESSION",
      recommendedAction: "COMPRESS_MEMORY_INDEX",
      executionType: "REQUIRES_CONFIRMATION",
      requiresConfirmation: true,
      reasoning:
        "Runway is under 30 days. Compressing vector memory index reduces compute expenditure by ~30%.",
    };
  }

  // Rule 5: Low-risk alert or telemetry delays -> Notification
  if (hasHigh || activeRisks.some((r) => r.code.includes("HEARTBEAT"))) {
    return {
      ruleCode: "OPERATIONAL_STAKEHOLDER_ALERT",
      recommendedAction: "ALERT_STAKEHOLDERS",
      executionType: "AUTOMATIC",
      requiresConfirmation: false,
      reasoning: "System telemetry anomaly detected; dispatching automated alert to operational channels.",
    };
  }

  // Default: system is healthy, action from AI if valid, or NO_ACTION
  const actionDetails = ACTION_REGISTRY[aiRecommendedAction];
  return {
    ruleCode: "STEADY_STATE_OPTIMIZATION",
    recommendedAction: aiRecommendedAction,
    executionType: actionDetails?.requiresConfirmation ? "REQUIRES_CONFIRMATION" : "RECOMMENDED_ONLY",
    requiresConfirmation: actionDetails?.requiresConfirmation ?? false,
    reasoning: "All core telemetry parameters stable. Routine maintenance suggested.",
  };
}
