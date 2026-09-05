import { getOpenAIClient } from "./client";
import { buildAgentSurvivalPrompt } from "./prompts";
import { AgentReasoningOutput, AgentReasoningOutputSchema } from "./schemas";
import { SurvivalScoreResult } from "../survival/survival.types";
import { DetectedRisk } from "../risk/risk.types";
import { MemorySummary } from "../memory/memory.types";
import { ActionType, isValidActionType } from "../actions/action.types";
import { logger } from "../utils/logger";

interface AgentParams {
  projectName: string;
  projectDescription?: string;
  survivalResult: SurvivalScoreResult;
  activeRisks: DetectedRisk[];
  memorySummary: MemorySummary;
}

/**
 * Executes AI Reasoning over the deterministic metrics and persistent memories.
 * Strictly honors the rule: LLM explains and reasons, but NEVER invents the score.
 */
export async function runSurvivalAgentReasoning(params: AgentParams): Promise<AgentReasoningOutput> {
  const { projectName, survivalResult, activeRisks } = params;
  const client = getOpenAIClient();

  if (client) {
    try {
      const prompt = buildAgentSurvivalPrompt(params);
      logger.info(`Invoking OpenAI Survival Agent for project: ${projectName}`);

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are the Entropia Survival Intelligence Agent. You analyze deterministic health scores and risk signals to generate actionable preservation recommendations in valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const rawJson = response.choices[0]?.message?.content;
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        const validated = AgentReasoningOutputSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data;
        } else {
          logger.warn("OpenAI output schema validation warning, falling back to heuristic synthesizer", {
            errors: validated.error.errors,
          });
        }
      }
    } catch (err) {
      logger.error("OpenAI reasoning call failed, using high-fidelity local engine", err);
    }
  }

  // High-fidelity fallback / offline heuristic reasoning engine
  return generateDeterministicHeuristicReasoning(params);
}

/**
 * Deterministic heuristic reasoning engine when OpenAI API key is not configured.
 * Generates insightful, context-aware analysis matching the Zod schema.
 */
function generateDeterministicHeuristicReasoning(params: AgentParams): AgentReasoningOutput {
  const { projectName, survivalResult, activeRisks } = params;
  const score = survivalResult.score;
  const status = survivalResult.status;

  const criticalRisks = activeRisks.filter((r) => r.severity === "CRITICAL");
  const highRisks = activeRisks.filter((r) => r.severity === "HIGH");

  let recommendedAction: ActionType = "ALERT_STAKEHOLDERS";
  let urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";

  // Deterministic action recommendation selection based on risk profile
  if (activeRisks.some((r) => r.code.includes("STORAGE_EXPIRY"))) {
    recommendedAction = "RENEW_STORAGE_DEAL";
    urgency = criticalRisks.length > 0 ? "CRITICAL" : "HIGH";
  } else if (activeRisks.some((r) => r.code.includes("RUNWAY") || r.code.includes("MISSING_PRESERVATION"))) {
    recommendedAction = "PRESERVE_TO_FILECOIN";
    urgency = score < 50 ? "CRITICAL" : "HIGH";
  } else if (activeRisks.some((r) => r.code.includes("RETRIEVAL"))) {
    recommendedAction = "MIGRATE_SECONDARY_STORAGE";
    urgency = "HIGH";
  } else if (score < 65) {
    recommendedAction = "COMPRESS_MEMORY_INDEX";
    urgency = "MEDIUM";
  } else {
    recommendedAction = "ALERT_STAKEHOLDERS";
    urgency = "LOW";
  }

  const keyFindings: string[] = [];
  if (criticalRisks.length > 0) {
    keyFindings.push(`Immediate survivability threat: ${criticalRisks.map((r) => r.title).join("; ")}.`);
  }
  if (survivalResult.rawCategoryScores.resourceHealth < 60) {
    keyFindings.push(
      `Resource runway depletion is compressing operational lifespan; liquidity runway is under target threshold.`
    );
  }
  if (survivalResult.rawCategoryScores.storageHealth < 70) {
    keyFindings.push(`Storage reliability indicators show degraded retrieval or imminent deal expiration.`);
  }
  if (survivalResult.rawCategoryScores.preservationReadiness >= 80) {
    keyFindings.push(`Decentralized preservation foundation is well-established with verified Filecoin deals.`);
  } else {
    keyFindings.push(`Decentralized redundancy is below minimum fault tolerance thresholds.`);
  }

  const recommendations: string[] = [
    `Execute ${recommendedAction.replace(/_/g, " ")} to safeguard system continuity.`,
    `Monitor secondary storage provider proof verification cycles over the next 48 hours.`,
    `Review resource expenditure and consider pruning non-critical memory traces.`,
  ];

  const summary = `Entropia has analyzed ${projectName} with a deterministically verified survival score of ${score}/100 (${status.toUpperCase()}). ${
    criticalRisks.length > 0
      ? `System is facing ${criticalRisks.length} critical vulnerability requiring explicit operator intervention.`
      : score >= 80
      ? "Operational metrics indicate solid resilience across resource, storage, and activity vectors."
      : "Proactive maintenance is advised to prevent escalation into degraded survivability."
  }`;

  const reasoning = `Survival score is weighted across resource runway (${survivalResult.rawCategoryScores.resourceHealth}/100), storage health (${survivalResult.rawCategoryScores.storageHealth}/100), and historical stability (${survivalResult.rawCategoryScores.historicalStability}/100). The current active risks (${activeRisks.length} total) directly depress the risk exposure factor. Without executing '${recommendedAction}', the projected mean-time-to-degradation is estimated within the active risk horizons.`;

  return {
    summary,
    keyFindings,
    reasoning,
    recommendations,
    recommendedAction: isValidActionType(recommendedAction) ? recommendedAction : "PRESERVE_TO_FILECOIN",
    urgency,
  };
}
