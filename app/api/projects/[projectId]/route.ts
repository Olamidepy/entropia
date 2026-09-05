import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { monitorService } from "@/lib/monitoring/monitor.service";
import { calculateDeterministicSurvivalScore } from "@/lib/survival/survival.engine";
import { evaluateDeterministicRisks } from "@/lib/risk/risk.engine";

export async function GET(
  request: Request,
  props: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await props.params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: projectId }, { slug: projectId }],
      },
      include: {
        riskEvents: {
          orderBy: { detectedAt: "desc" },
        },
        actions: {
          orderBy: { createdAt: "desc" },
        },
        filecoinRecords: {
          orderBy: { createdAt: "desc" },
        },
        memories: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    // Get live deterministic calculation
    const metrics = await monitorService.getProjectMetrics(project.id);
    const survivalResult = calculateDeterministicSurvivalScore(metrics);
    const activeRisks = evaluateDeterministicRisks(metrics);

    return NextResponse.json({
      success: true,
      data: {
        project,
        metrics,
        survivalResult,
        activeRisks,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        success: false,
        error: { code: "FETCH_PROJECT_FAILED", message: error.message },
      },
      { status: 500 }
    );
  }
}
