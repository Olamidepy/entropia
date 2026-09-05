import { SurvivalScoreResult } from "../survival/survival.types";
import { DetectedRisk } from "../risk/risk.types";
import { MemorySummary } from "../memory/memory.types";
import { ACTION_REGISTRY } from "../actions/action.types";

export function buildAgentSurvivalPrompt(params: {
  projectName: string;
  projectDescription?: string;
  survivalResult: SurvivalScoreResult;
  activeRisks: DetectedRisk[];
  memorySummary: MemorySummary;
}) {
  const { projectName, projectDescription, survivalResult, activeRisks, memorySummary } = params;

  const actionListString = Object.values(ACTION_REGISTRY)
    .map((a) => `- ${a.type}: ${a.title} (Requires confirmation: ${a.requiresConfirmation}, Risk: ${a.riskLevel})`)
    .join("\n");

  const riskListString =
    activeRisks.length > 0
      ? activeRisks
          .map((r) => `- [${r.severity}] ${r.title}: ${r.description} (Evidence: ${JSON.stringify(r.evidence)})`)
          .join("\n")
      : "No active risk events detected.";

  const factorsString = survivalResult.factors
    .map((f) => `- ${f.name} [Weight: ${(f.weight * 100).toFixed(0)}%]: Score ${f.score}/100 (${f.status}) - ${f.description}`)
    .join("\n");

  return `You are ENTROPIA SURVIVAL INTELLIGENCE, an advanced autonomous reasoning agent protecting critical digital systems, AI memory vaults, and decentralized storage assets.

CRITICAL ARCHITECTURAL DIRECTIVE:
You DO NOT compute or alter numerical survival scores. The survival score (${survivalResult.score}/100, status: ${survivalResult.status.toUpperCase()}) was deterministically computed by our mathematical engines. Your mission is to analyze, explain, prioritize, and reason about the situation, and recommend an action strictly from the provided Action Registry.

CURRENT MONITORED PROJECT:
Name: ${projectName}
Description: ${projectDescription || "Autonomous memory and resource entity"}

DETERMINISTIC SURVIVAL METRICS:
Overall Survival Score: ${survivalResult.score}/100
Status: ${survivalResult.status.toUpperCase()}
Factor Breakdown:
${factorsString}

Deterministic Explanations:
${survivalResult.explanation.map((e) => `* ${e}`).join("\n")}

ACTIVE DETECTED RISK EVENTS:
${riskListString}

RELEVANT HISTORICAL MEMORY:
${memorySummary.historicalContextText || "No previous anomalies recorded in memory."}

AVAILABLE ACTION REGISTRY (You MUST pick recommendedAction from this exact list):
${actionListString}

Respond with a JSON object strictly matching this schema:
{
  "summary": "High-level 2-3 sentence executive synopsis of current survivability.",
  "keyFindings": ["3-5 clear bullet points highlighting key survival vulnerabilities or strengths"],
  "reasoning": "In-depth analytical explanation of why the score stands where it is and how current risk events threaten longevity.",
  "recommendations": ["Actionable steps prioritized for operational longevity"],
  "recommendedAction": "ONE_OF_THE_VALID_ACTION_TYPES_ABOVE",
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}`;
}
