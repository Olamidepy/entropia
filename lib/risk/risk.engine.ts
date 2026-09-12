import { DetectedRisk } from "./risk.types";
import { RISK_RULES } from "./risk.rules";
import { RawSurvivalMetrics } from "../survival/survival.types";

/**
 * Deterministic Risk Engine.
 * Evaluates normalized signals against safety and survival rules.
 * Generates verified risk events with audit-ready evidence.
 * 
 * @param metrics Ingested raw or normalized survival metrics
 * @returns Array of detected risks ordered strictly by severity descending
 */
export function evaluateDeterministicRisks(metrics: RawSurvivalMetrics): DetectedRisk[] {
  const detected: DetectedRisk[] = [];

  // Iterate across all registered safety and operational rules
  for (const rule of RISK_RULES) {
    const risk = rule.evaluate(metrics);
    if (risk) {
      detected.push(risk);
    }
  }

  // Define ranking weight for severity ordering: CRITICAL > HIGH > MEDIUM > LOW
  const severityOrder: Record<string, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  // Sort detected risks so critical interventions always surface first
  return detected.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
}
