import { NextResponse } from "next/server";
import { actionService } from "@/lib/actions/action.service";
import { ConfirmActionSchema } from "@/lib/ai/schemas";

export async function POST(
  request: Request,
  props: { params: Promise<{ actionId: string }> }
) {
  try {
    const { actionId } = await props.params;
    const body = await request.json();

    const validated = ConfirmActionSchema.parse({
      actionId,
      approved: body.approved,
      notes: body.notes,
    });

    const result = await actionService.confirmAndExecuteAction(
      validated.actionId,
      validated.approved,
      "OPERATOR_USER"
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        success: false,
        error: { code: "CONFIRM_ACTION_FAILED", message: error.message },
      },
      { status: 400 }
    );
  }
}
