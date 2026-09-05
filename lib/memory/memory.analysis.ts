import { MemoryItem, MemorySummary } from "./memory.types";

/**
 * Synthesizes a structured memory summary tailored for the AI reasoning agent,
 * preventing context overflow while preserving vital historical knowledge.
 */
export function synthesizeMemoryForAgent(memories: MemoryItem[]): MemorySummary {
  const recentCriticalEvents = memories
    .filter((m) => m.severity === "CRITICAL" || m.type === "INCIDENT")
    .slice(0, 4);

  const unresolvedIncidents = memories
    .filter((m) => m.type === "INCIDENT")
    .slice(0, 3);

  const previousDecisions = memories
    .filter((m) => m.type === "DECISION" || m.type === "HUMAN_OVERRIDE")
    .slice(0, 3);

  const actionOutcomes = memories
    .filter((m) => m.type === "ACTION_OUTCOME" || m.type === "PRESERVATION_EVENT")
    .slice(0, 3);

  const textLines: string[] = [];

  if (recentCriticalEvents.length > 0) {
    textLines.push("CRITICAL HISTORICAL EVENTS:");
    recentCriticalEvents.forEach((m) =>
      textLines.push(`- [${m.timestamp.toISOString().split("T")[0]}] ${m.title}: ${m.content}`)
    );
  }

  if (previousDecisions.length > 0) {
    textLines.push("\nPREVIOUS OPERATIONAL DECISIONS:");
    previousDecisions.forEach((m) =>
      textLines.push(`- [${m.timestamp.toISOString().split("T")[0]}] ${m.title}: ${m.content}`)
    );
  }

  if (actionOutcomes.length > 0) {
    textLines.push("\nPAST PRESERVATION OUTCOMES:");
    actionOutcomes.forEach((m) =>
      textLines.push(`- [${m.timestamp.toISOString().split("T")[0]}] ${m.title}: ${m.content}`)
    );
  }

  return {
    recentCriticalEvents,
    unresolvedIncidents,
    previousDecisions,
    actionOutcomes,
    historicalContextText: textLines.join("\n"),
  };
}
