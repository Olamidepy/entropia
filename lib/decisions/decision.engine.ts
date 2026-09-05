import { DecisionResult } from "./decision.types";
import { evaluateDecisionPolicy } from "./decision.policy";
import { SurvivalScoreResult } from "../survival/survival.types";
import { DetectedRisk } from "../risk/risk.types";
import { ActionType, ACTION_REGISTRY } from "../actions/action.types";
import { prisma } from "../db/prisma";

export class DecisionEngine {
  /**
   * Evaluates deterministic policies and generates structured Decision items.
   */
  async makeDecision(params: {
    projectId: string;
    survivalResult: SurvivalScoreResult;
    activeRisks: DetectedRisk[];
    aiRecommendedAction: ActionType;
  }): Promise<DecisionResult> {
    const { projectId, survivalResult, activeRisks, aiRecommendedAction } = params;

    const evaluation = evaluateDecisionPolicy({
      survivalResult,
      activeRisks,
      aiRecommendedAction,
    });

    const actionInfo = ACTION_REGISTRY[evaluation.recommendedAction];

    const decision: DecisionResult = {
      id: `dec-${Date.now()}`,
      projectId,
      policyRule: evaluation.ruleCode,
      recommendation: evaluation.recommendedAction,
      reasoning: evaluation.reasoning,
      executionType: evaluation.executionType,
      requiresConfirmation: evaluation.requiresConfirmation,
      status: "PROPOSED",
      riskLevel: actionInfo?.riskLevel ?? "MEDIUM",
      expectedOutcome: actionInfo?.expectedOutcome ?? "State maintained.",
      createdAt: new Date(),
    };

    // Optionally persist in database if available
    try {
      await prisma.decision.create({
        data: {
          projectId,
          policyRule: decision.policyRule,
          recommendation: decision.recommendation,
          reasoning: decision.reasoning,
          executionType: decision.executionType,
          status: decision.status,
        },
      });
    } catch {
      // Graceful fallback for non-persistent environments
    }

    return decision;
  }
}

export const decisionEngine = new DecisionEngine();
