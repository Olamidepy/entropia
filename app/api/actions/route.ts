import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { actionService } from "@/lib/actions/action.service";
import { z } from "zod";
import { ActionType } from "@/lib/actions/action.types";

const CreateActionSchema = z.object({
  projectId: z.string().min(1),
  decisionId: z.string().optional(),
  actionType: z.enum([
    "PRESERVE_TO_FILECOIN",
    "RENEW_STORAGE_DEAL",
    "COMPRESS_MEMORY_INDEX",
    "MIGRATE_SECONDARY_STORAGE",
    "ALERT_STAKEHOLDERS",
    "DISMISS_RISK",
  ]),
  title: z.string().min(3),
  description: z.string().min(5),
  payload: z.record(z.unknown()).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const where = projectId ? { projectId } : {};
    const actions = await prisma.action.findMany({
      where,
      include: {
        project: { select: { name: true, slug: true } },
        decision: true,
        auditLogs: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: actions,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ACTIONS_FAILED", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CreateActionSchema.parse(body);

    const action = await actionService.createAction({
      projectId: validated.projectId,
      decisionId: validated.decisionId,
      actionType: validated.actionType as ActionType,
      title: validated.title,
      description: validated.description,
      payload: validated.payload,
    });

    return NextResponse.json({
      success: true,
      data: action,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: { code: "CREATE_ACTION_FAILED", message: error.message } },
      { status: 400 }
    );
  }
}
