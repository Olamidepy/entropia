import { describe, it, expect } from "vitest";
import { evaluateDeterministicRisks } from "../../lib/risk/risk.engine";

describe("Deterministic Risk Engine", () => {
  it("should trigger STORAGE_EXPIRY_CRITICAL when expiration is <= 5 days", () => {
    const risks = evaluateDeterministicRisks({
      storageExpiryDays: 3,
    });

    const criticalRisk = risks.find((r) => r.code === "STORAGE_EXPIRY_CRITICAL");
    expect(criticalRisk).toBeDefined();
    expect(criticalRisk?.severity).toBe("CRITICAL");
    expect(criticalRisk?.evidence[0].observedValue).toBe(3);
  });

  it("should trigger RUNWAY_DEPLETION_CRITICAL when runway is <= 7 days", () => {
    const risks = evaluateDeterministicRisks({
      runwayDays: 4,
    });

    const runwayRisk = risks.find((r) => r.code === "RUNWAY_DEPLETION_CRITICAL");
    expect(runwayRisk).toBeDefined();
    expect(runwayRisk?.severity).toBe("CRITICAL");
    expect(runwayRisk?.suggestedAction).toBe("PRESERVE_TO_FILECOIN");
  });

  it("should detect missing preservation backups", () => {
    const risks = evaluateDeterministicRisks({
      preservationPinCount: 0,
    });

    const backupRisk = risks.find((r) => r.code === "MISSING_PRESERVATION_BACKUP");
    expect(backupRisk).toBeDefined();
    expect(backupRisk?.severity).toBe("HIGH");
  });

  it("should sort detected risks by severity descending (CRITICAL before HIGH/MEDIUM)", () => {
    const risks = evaluateDeterministicRisks({
      storageExpiryDays: 3, // CRITICAL
      runwayDays: 20, // HIGH
      lastHeartbeatSecondsAgo: 5000, // MEDIUM
    });

    expect(risks.length).toBeGreaterThanOrEqual(2);
    expect(risks[0].severity).toBe("CRITICAL");
  });
});
