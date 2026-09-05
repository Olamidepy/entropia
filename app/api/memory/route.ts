import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const RecordMemorySchema = z.object({
  projectId: z.string().min(1),
  type: z.enum(["INCIDENT", "DECISION", "ACTION_OUTCOME", "TREND_SNAPSHOT", "HUMAN_OVERRIDE", "PRESERVATION_EVENT"]),
  title: z.string().min(3),
  content: z.string().min(5),
  severity: z.enum(["INFO", "WARNING", "CRITICAL"]).default("INFO"),
  tags: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const where = projectId ? { projectId } : {};
    const memories = await prisma.memory.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: 50,
      include: {
        project: {
          select: { name: true, slug: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: memories,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: { code: "FETCH_MEMORY_FAILED", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = RecordMemorySchema.parse(body);

    const memory = await prisma.memory.create({
      data: validated,
    });

    return NextResponse.json({
      success: true,
      data: memory,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: { code: "RECORD_MEMORY_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}
