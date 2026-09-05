import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const projectCount = await prisma.project.count();
    return NextResponse.json({
      success: true,
      data: {
        status: "healthy",
        service: "Entropia Survival Platform",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        database: "connected",
        monitoredProjects: projectCount,
        engines: {
          survivalEngine: "online (deterministic)",
          riskEngine: "online (deterministic)",
          memorySystem: "online (persistent)",
          aiAgent: "ready",
          filecoinAdapter: "active (modular)",
        },
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "HEALTH_CHECK_FAILED",
          message: error.message || "Failed to query database health",
        },
      },
      { status: 500 }
    );
  }
}
