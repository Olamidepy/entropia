import { describe, it, expect } from "vitest";
import { calculateDeterministicSurvivalScore } from "../../lib/survival/survival.engine";
import { SURVIVAL_WEIGHTS } from "../../lib/survival/survival.weights";

describe("Deterministic Survival Engine", () => {
  it("should calculate a healthy score for optimal metrics", () => {
    const result = calculateDeterministicSurvivalScore({
      runwayDays: 180,
      storageExpiryDays: 300,
      retrievalSuccessRate: 1.0,
      uptimePct: 99.99,
      recentFailureCount: 0,
      activeRiskCount: 0,
      lastHeartbeatSecondsAgo: 5,
      preservationPinCount: 3,
      verifiedReplicas: 2,
    });

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.status).toBe("healthy");
    expect(result.factors).toHaveLength(6);
  });

  it("should calculate a critical score when runway and storage are failing", () => {
    const result = calculateDeterministicSurvivalScore({
      runwayDays: 3,
      storageExpiryDays: 2,
      retrievalSuccessRate: 0.6,
      uptimePct: 90.0,
      recentFailureCount: 8,
      criticalRiskCount: 2,
      activeRiskCount: 4,
      lastHeartbeatSecondsAgo: 90000,
      preservationPinCount: 0,
      verifiedReplicas: 0,
    });

    expect(result.score).toBeLessThan(35);
    expect(result.status).toBe("critical");
    expect(result.explanation.length).toBeGreaterThan(0);
  });

  it("should maintain strict bounds between 0 and 100 under all conditions", () => {
    const worstCase = calculateDeterministicSurvivalScore({
      runwayDays: 0,
      storageExpiryDays: 0,
      retrievalSuccessRate: 0,
      uptimePct: 0,
      recentFailureCount: 100,
      criticalRiskCount: 10,
      lastHeartbeatSecondsAgo: 999999,
      preservationPinCount: 0,
      verifiedReplicas: 0,
    });
    expect(worstCase.score).toBeGreaterThanOrEqual(0);
    expect(worstCase.score).toBeLessThanOrEqual(100);

    const bestCase = calculateDeterministicSurvivalScore({
      runwayDays: 999,
      storageExpiryDays: 999,
      retrievalSuccessRate: 1.0,
      uptimePct: 100,
      recentFailureCount: 0,
      criticalRiskCount: 0,
      highRiskCount: 0,
      activeRiskCount: 0,
      lastHeartbeatSecondsAgo: 1,
      preservationPinCount: 10,
      verifiedReplicas: 5,
    });
    expect(bestCase.score).toBeGreaterThanOrEqual(0);
    expect(bestCase.score).toBeLessThanOrEqual(100);
  });

  it("should verify weights sum to exactly 1.0", () => {
    const sum =
      SURVIVAL_WEIGHTS.RESOURCE_HEALTH +
      SURVIVAL_WEIGHTS.STORAGE_HEALTH +
      SURVIVAL_WEIGHTS.HISTORICAL_STABILITY +
      SURVIVAL_WEIGHTS.RISK_EXPOSURE +
      SURVIVAL_WEIGHTS.SYSTEM_ACTIVITY +
      SURVIVAL_WEIGHTS.PRESERVATION_READINESS;

    expect(Math.round(sum * 100) / 100).toBe(1.0);
  });
});
