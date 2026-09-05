import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const where = projectId ? { projectId } : {};
    const decisions = await prisma.decision.findMany({
      where,
      include: {
        project: { select: { name: true, slug: true } },
        riskEvent: true,
        actions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: decisions,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: { code: "FETCH_DECISIONS_FAILED", message: error.message } },
      { status: 500 }
    );
  }
}
