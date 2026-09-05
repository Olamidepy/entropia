import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { executeFilecoinPreservation } from "@/lib/filecoin/storage";
import { checkFilecoinDealsHealth } from "@/lib/filecoin/monitoring";
import { z } from "zod";

const PreservePayloadSchema = z.object({
  projectId: z.string().min(1),
  summary: z.string().optional(),
  memoryGraph: z.record(z.unknown()).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const where = projectId ? { projectId } : {};
    const records = await prisma.filecoinRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { name: true, slug: true } },
      },
    });

    // Serialize BigInt for JSON response
    const serialized = records.map((r) => ({
      ...r,
      sizeBytes: r.sizeBytes ? r.sizeBytes.toString() : null,
    }));

    const dealsHealth = projectId ? await checkFilecoinDealsHealth(projectId) : [];

    return NextResponse.json({
      success: true,
      data: {
        records: serialized,
        dealsHealth,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FILECOIN_FAILED", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = PreservePayloadSchema.parse(body);

    const receipt = await executeFilecoinPreservation({
      projectId: validated.projectId,
      memoryGraph: validated.memoryGraph || { timestamp: new Date().toISOString(), status: "manual_snapshot" },
      snapshotTimestamp: new Date(),
      summary: validated.summary || "Manual Filecoin snapshot initiated by operator",
    });

    return NextResponse.json({
      success: true,
      data: receipt,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: { code: "FILECOIN_PRESERVATION_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}
