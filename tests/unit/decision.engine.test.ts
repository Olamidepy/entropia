import { describe, it, expect } from "vitest";
import { evaluateDecisionPolicy } from "../../lib/decisions/decision.policy";
import { calculateDeterministicSurvivalScore } from "../../lib/survival/survival.engine";
import { evaluateDeterministicRisks } from "../../lib/risk/risk.engine";

describe("Deterministic Decision Policy Engine", () => {
  it("should mandate user confirmation and PRESERVE_TO_FILECOIN when risk is CRITICAL and score < 40", () => {
    const rawMetrics = {
      runwayDays: 4,
      storageExpiryDays: 3,
      retrievalSuccessRate: 0.75,
      preservationPinCount: 0,
    };

    const survivalResult = calculateDeterministicSurvivalScore(rawMetrics);
    const activeRisks = evaluateDeterministicRisks(rawMetrics);

    const policy = evaluateDecisionPolicy({
      survivalResult,
      activeRisks,
      aiRecommendedAction: "PRESERVE_TO_FILECOIN",
    });

    expect(policy.ruleCode).toBe("CRITICAL_SURVIVAL_EMERGENCY_PRESERVATION");
    expect(policy.recommendedAction).toBe("PRESERVE_TO_FILECOIN");
    expect(policy.executionType).toBe("REQUIRES_CONFIRMATION");
    expect(policy.requiresConfirmation).toBe(true);
  });

  it("should trigger RENEW_STORAGE_DEAL when storage is approaching expiry", () => {
    const rawMetrics = {
      storageExpiryDays: 12,
      runwayDays: 100,
      preservationPinCount: 2,
    };

    const survivalResult = calculateDeterministicSurvivalScore(rawMetrics);
    const activeRisks = evaluateDeterministicRisks(rawMetrics);

    const policy = evaluateDecisionPolicy({
      survivalResult,
      activeRisks,
      aiRecommendedAction: "RENEW_STORAGE_DEAL",
    });

    expect(policy.ruleCode).toBe("STORAGE_DEAL_RENEWAL_REQUIRED");
    expect(policy.recommendedAction).toBe("RENEW_STORAGE_DEAL");
    expect(policy.requiresConfirmation).toBe(true);
  });

  it("should permit automatic execution for low-risk notification policies", () => {
    const rawMetrics = {
      lastHeartbeatSecondsAgo: 5000, // Medium/High telemetry delay
      runwayDays: 120,
      storageExpiryDays: 200,
    };

    const survivalResult = calculateDeterministicSurvivalScore(rawMetrics);
    const activeRisks = evaluateDeterministicRisks(rawMetrics);

    const policy = evaluateDecisionPolicy({
      survivalResult,
      activeRisks,
      aiRecommendedAction: "ALERT_STAKEHOLDERS",
    });

    expect(policy.recommendedAction).toBe("ALERT_STAKEHOLDERS");
    expect(policy.executionType).toBe("AUTOMATIC");
    expect(policy.requiresConfirmation).toBe(false);
  });
});
