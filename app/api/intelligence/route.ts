import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { monitorService } from "@/lib/monitoring/monitor.service";
import { calculateDeterministicSurvivalScore } from "@/lib/survival/survival.engine";
import { evaluateDeterministicRisks } from "@/lib/risk/risk.engine";
import { memoryService } from "@/lib/memory/memory.service";
import { runSurvivalAgentReasoning } from "@/lib/ai/agent";
import { decisionEngine } from "@/lib/decisions/decision.engine";
import { z } from "zod";

const RunIntelligenceSchema = z.object({
  projectId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId } = RunIntelligenceSchema.parse(body);

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: projectId }, { slug: projectId }],
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    // 1. Fetch normalized metrics from monitoring engine
    const metrics = await monitorService.getProjectMetrics(project.id);

    // 2. Deterministic survival scoring (LLM NEVER modifies this score)
    const survivalResult = calculateDeterministicSurvivalScore(metrics);

    // 3. Deterministic risk detection
    const detectedRisks = evaluateDeterministicRisks(metrics);

    // Sync active risks with database
    for (const risk of detectedRisks) {
      const existing = await prisma.riskEvent.findFirst({
        where: { projectId: project.id, code: risk.code, status: "ACTIVE" },
      });
      if (!existing) {
        await prisma.riskEvent.create({
          data: {
            projectId: project.id,
            code: risk.code,
            title: risk.title,
            description: risk.description,
            severity: risk.severity,
            status: "ACTIVE",
            evidence: JSON.stringify(risk.evidence),
          },
        });
      }
    }

    // 4. Memory synthesis: getRelevantMemory(projectId, context)
    const memorySummary = await memoryService.getRelevantMemory(project.id, {
      activeRiskCodes: detectedRisks.map((r) => r.code),
    });

    // 5. AI Reasoning Agent: reasons over deterministic findings
    const agentReasoning = await runSurvivalAgentReasoning({
      projectName: project.name,
      projectDescription: project.description || undefined,
      survivalResult,
      activeRisks: detectedRisks,
      memorySummary,
    });

    // 6. Deterministic Decision Engine
    const decision = await decisionEngine.makeDecision({
      projectId: project.id,
      survivalResult,
      activeRisks: detectedRisks,
      aiRecommendedAction: agentReasoning.recommendedAction,
    });

    // 7. Update Project record with latest deterministic score
    await prisma.project.update({
      where: { id: project.id },
      data: {
        currentScore: survivalResult.score,
        currentStatus: survivalResult.status,
      },
    });

    // 8. Record SurvivalScore snapshot
    await prisma.survivalScore.create({
      data: {
        projectId: project.id,
        score: survivalResult.score,
        status: survivalResult.status,
        resourceHealth: survivalResult.rawCategoryScores.resourceHealth,
        storageHealth: survivalResult.rawCategoryScores.storageHealth,
        historicalStability: survivalResult.rawCategoryScores.historicalStability,
        riskExposure: survivalResult.rawCategoryScores.riskExposure,
        systemActivity: survivalResult.rawCategoryScores.systemActivity,
        preservationReadiness: survivalResult.rawCategoryScores.preservationReadiness,
        factorsJson: JSON.stringify(survivalResult.factors),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        survivalResult,
        detectedRisks,
        agentReasoning,
        decision,
        memorySummary,
        calculatedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTELLIGENCE_RUN_FAILED", message: error.message },
      },
      { status: 500 }
    );
  }
}
