import { describe, it, expect } from "vitest";
import { SURVIVAL_THRESHOLDS, SURVIVAL_WEIGHTS } from "../../lib/survival/survival.weights";

describe("Survival Weights and Thresholds", () => {
  it("ensures all categorical weights sum precisely to 1.0", () => {
    const totalWeight =
      SURVIVAL_WEIGHTS.RESOURCE_HEALTH +
      SURVIVAL_WEIGHTS.STORAGE_HEALTH +
      SURVIVAL_WEIGHTS.HISTORICAL_STABILITY +
      SURVIVAL_WEIGHTS.RISK_EXPOSURE +
      SURVIVAL_WEIGHTS.SYSTEM_ACTIVITY +
      SURVIVAL_WEIGHTS.PRESERVATION_READINESS;

    expect(Math.round(totalWeight * 100) / 100).toBe(1.0);
  });

  it("verifies hierarchical order of survival thresholds", () => {
    expect(SURVIVAL_THRESHOLDS.HEALTHY_MIN).toBeGreaterThan(SURVIVAL_THRESHOLDS.STABLE_MIN);
    expect(SURVIVAL_THRESHOLDS.STABLE_MIN).toBeGreaterThan(SURVIVAL_THRESHOLDS.AT_RISK_MIN);
  });
});
