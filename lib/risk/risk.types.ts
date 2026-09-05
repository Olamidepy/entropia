export type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RiskStatus = "ACTIVE" | "MITIGATED" | "DISMISSED";

export interface RiskEvidence {
  metric: string;
  observedValue: number | string | boolean;
  threshold: number | string;
  unit?: string;
  timestamp: string;
}

export interface DetectedRisk {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  status: RiskStatus;
  evidence: RiskEvidence[];
  detectedAt: Date;
  suggestedAction?: string;
}
