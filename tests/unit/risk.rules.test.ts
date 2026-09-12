import { describe, it, expect } from "vitest";
import { RISK_RULES } from "../../lib/risk/risk.rules";
import { RawSurvivalMetrics } from "../../lib/survival/survival.types";

describe("Risk Rules Evaluation Engine", () => {
  it("triggers critical runway risk when runway is below 7 days", () => {
    const criticalMetrics: RawSurvivalMetrics = {
      runwayDays: 5,
    };

    const runwayRule = RISK_RULES.find((r) => r.code === "RISK-RUNWAY-001");
    expect(runwayRule).toBeDefined();

    const detected = runwayRule?.evaluate(criticalMetrics);
    expect(detected).toBeDefined();
    expect(detected?.severity).toBe("CRITICAL");
  });

  it("triggers warning runway risk when runway is between 7 and 30 days", () => {
    const warningMetrics: RawSurvivalMetrics = {
      runwayDays: 20,
    };

    const runwayRule = RISK_RULES.find((r) => r.code === "RISK-RUNWAY-001");
    expect(runwayRule).toBeDefined();

    const detected = runwayRule?.evaluate(warningMetrics);
    expect(detected).toBeDefined();
    expect(detected?.severity).toBe("HIGH");
  });

  it("does not trigger risk when all metrics are in safe territory", () => {
    const safeMetrics: RawSurvivalMetrics = {
      runwayDays: 120,
      uptimePct: 99.9,
      storageExpiryDays: 180,
      recentFailureCount: 0,
    };

    const runwayRule = RISK_RULES.find((r) => r.code === "RISK-RUNWAY-001");
    const detected = runwayRule?.evaluate(safeMetrics);
    expect(detected).toBeNull();
  });
});
