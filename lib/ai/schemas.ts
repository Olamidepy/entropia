import { z } from "zod";

export const AgentReasoningOutputSchema = z.object({
  summary: z.string().min(10, "Summary must be at least 10 characters long."),
  keyFindings: z.array(z.string()).min(1, "At least one key finding is required."),
  reasoning: z.string().min(20, "Detailed reasoning is required."),
  recommendations: z.array(z.string()).min(1, "At least one recommendation is required."),
  recommendedAction: z.enum([
    "PRESERVE_TO_FILECOIN",
    "RENEW_STORAGE_DEAL",
    "COMPRESS_MEMORY_INDEX",
    "MIGRATE_SECONDARY_STORAGE",
    "ALERT_STAKEHOLDERS",
    "DISMISS_RISK",
  ]),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export type AgentReasoningOutput = z.infer<typeof AgentReasoningOutputSchema>;

export const IngestSignalSchema = z.object({
  projectId: z.string(),
  signals: z.array(
    z.object({
      name: z.string(),
      category: z.enum(["resource", "storage", "stability", "activity", "security"]),
      value: z.number(),
      unit: z.string(),
      metadata: z.record(z.unknown()).optional(),
    })
  ),
});

export const ConfirmActionSchema = z.object({
  actionId: z.string(),
  approved: z.boolean(),
  notes: z.string().optional(),
});
