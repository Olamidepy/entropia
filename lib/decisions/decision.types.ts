import { ActionType } from "../actions/action.types";

export type ExecutionType =
  | "AUTOMATIC"
  | "REQUIRES_CONFIRMATION"
  | "RECOMMENDED_ONLY"
  | "NO_ACTION";

export type DecisionStatus = "PROPOSED" | "CONFIRMED" | "REJECTED" | "EXECUTED";

export interface DecisionResult {
  id: string;
  projectId: string;
  policyRule: string;
  recommendation: ActionType;
  reasoning: string;
  executionType: ExecutionType;
  requiresConfirmation: boolean;
  status: DecisionStatus;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  expectedOutcome: string;
  createdAt: Date;
}
