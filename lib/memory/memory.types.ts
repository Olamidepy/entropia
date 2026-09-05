export type MemoryType =
  | "INCIDENT"
  | "DECISION"
  | "ACTION_OUTCOME"
  | "TREND_SNAPSHOT"
  | "HUMAN_OVERRIDE"
  | "PRESERVATION_EVENT";

export interface MemoryItem {
  id: string;
  projectId: string;
  type: MemoryType;
  title: string;
  content: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  tags?: string[];
  timestamp: Date;
}

export interface MemoryQueryContext {
  activeRiskCodes?: string[];
  category?: string;
  limit?: number;
  urgency?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface MemorySummary {
  recentCriticalEvents: MemoryItem[];
  unresolvedIncidents: MemoryItem[];
  previousDecisions: MemoryItem[];
  actionOutcomes: MemoryItem[];
  historicalContextText: string;
}
