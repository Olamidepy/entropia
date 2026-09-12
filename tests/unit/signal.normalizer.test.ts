import { describe, it, expect } from "vitest";
import { normalizeSignalsToMetrics } from "../../lib/monitoring/signal.normalizer";
import { NormalizedSignal } from "../../lib/monitoring/signal.types";

describe("Signal Normalizer Unit Tests", () => {
  it("correctly extracts known numeric metrics from signal collection", () => {
    const signals: NormalizedSignal[] = [
      {
        projectId: "test-proj",
        name: "runway_days",
        category: "resource",
        value: 45,
        unit: "days",
        observedAt: new Date(),
      },
      {
        projectId: "test-proj",
        name: "uptime_pct",
        category: "stability",
        value: 99.8,
        unit: "pct",
        observedAt: new Date(),
      },
      {
        projectId: "test-proj",
        name: "storage_expiry_days",
        category: "storage",
        value: 120,
        unit: "days",
        observedAt: new Date(),
      },
    ];

    const metrics = normalizeSignalsToMetrics(signals);

    expect(metrics.runwayDays).toBe(45);
    expect(metrics.uptimePct).toBe(99.8);
    expect(metrics.storageExpiryDays).toBe(120);
  });

  it("handles empty signals gracefully returning empty object", () => {
    const metrics = normalizeSignalsToMetrics([]);
    expect(metrics).toEqual({});
  });

  it("ignores unknown signal names cleanly", () => {
    const signals: NormalizedSignal[] = [
      {
        projectId: "test-proj",
        name: "unrecognized_custom_metric",
        category: "activity",
        value: 999,
        unit: "units",
        observedAt: new Date(),
      },
    ];

    const metrics = normalizeSignalsToMetrics(signals);
    expect(metrics).toEqual({});
  });
});
