import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const CreateProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(["agent_vault", "decentralized_archive", "data_pipeline"]).default("agent_vault"),
  primaryProvider: z.string().default("Filecoin-Glif"),
});

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        riskEvents: {
          where: { status: "ACTIVE" },
        },
        actions: {
          where: { status: "PENDING_CONFIRMATION" },
        },
        filecoinRecords: {
          take: 2,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const serialized = JSON.parse(
      JSON.stringify(projects, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({
      success: true,
      data: serialized,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        success: false,
        error: { code: "FETCH_PROJECTS_FAILED", message: error.message },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CreateProjectSchema.parse(body);

    // Get default operator user or create one
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "operator@entropia.network",
          name: "Lead System Architect",
          role: "admin",
        },
      });
    }

    const slug = validated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(100 + Math.random() * 900);

    const project = await prisma.project.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description,
        category: validated.category,
        primaryProvider: validated.primaryProvider,
        userId: user.id,
        currentScore: 92.0,
        currentStatus: "healthy",
      },
    });

    // Initialize default baseline signals
    await prisma.signal.createMany({
      data: [
        { projectId: project.id, name: "runway_days", category: "resource", value: 90, unit: "days" },
        { projectId: project.id, name: "storage_expiry_days", category: "storage", value: 180, unit: "days" },
        { projectId: project.id, name: "retrieval_success_rate", category: "storage", value: 0.99, unit: "ratio" },
        { projectId: project.id, name: "uptime_pct", category: "stability", value: 99.9, unit: "pct" },
        { projectId: project.id, name: "recent_failure_count", category: "stability", value: 0, unit: "count" },
        { projectId: project.id, name: "last_heartbeat_seconds_ago", category: "activity", value: 10, unit: "seconds" },
        { projectId: project.id, name: "preservation_pin_count", category: "storage", value: 1, unit: "count" },
        { projectId: project.id, name: "verified_replicas", category: "storage", value: 2, unit: "count" },
      ],
    });

    // Record initialization memory
    await prisma.memory.create({
      data: {
        projectId: project.id,
        type: "TREND_SNAPSHOT",
        title: "Project Monitored Genesis",
        content: `Telemetry ingestion initiated for ${project.name} under Filecoin modular storage adapter.`,
        severity: "INFO",
        tags: "genesis,monitoring",
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        success: false,
        error: { code: "CREATE_PROJECT_FAILED", message: error.message },
      },
      { status: 400 }
    );
  }
}
