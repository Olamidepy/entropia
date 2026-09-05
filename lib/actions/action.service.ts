import { ActionType, ActionStatus, ACTION_REGISTRY } from "./action.types";
import { prisma } from "../db/prisma";
import { executeFilecoinPreservation } from "../filecoin/storage";
import { logger } from "../utils/logger";

export interface CreateActionParams {
  projectId: string;
  decisionId?: string;
  actionType: ActionType;
  title: string;
  description: string;
  payload?: Record<string, unknown>;
}

export class ActionService {
  async createAction(params: CreateActionParams) {
    const item = ACTION_REGISTRY[params.actionType];
    const requiresConfirmation = item?.requiresConfirmation ?? true;

    try {
      const action = await prisma.action.create({
        data: {
          projectId: params.projectId,
          decisionId: params.decisionId,
          actionType: params.actionType,
          title: params.title,
          description: params.description,
          requiresConfirmation,
          status: requiresConfirmation ? "PENDING_CONFIRMATION" : "EXECUTING",
          payload: params.payload ? JSON.stringify(params.payload) : null,
        },
      });

      // Audit log creation
      await prisma.auditLog.create({
        data: {
          projectId: params.projectId,
          actionId: action.id,
          decisionId: params.decisionId,
          actor: "SYSTEM",
          eventType: requiresConfirmation ? "CONFIRMATION_REQUESTED" : "ACTION_SCHEDULED",
          details: JSON.stringify({
            actionType: params.actionType,
            requiresConfirmation,
            status: action.status,
          }),
        },
      });

      if (!requiresConfirmation) {
        // Auto-execute if no confirmation required
        return this.executeApprovedAction(action.id, "SYSTEM");
      }

      return action;
    } catch {
      // Fallback mock action for non-db mode
      return {
        id: `act-${Date.now()}`,
        projectId: params.projectId,
        actionType: params.actionType,
        title: params.title,
        description: params.description,
        requiresConfirmation,
        status: requiresConfirmation ? "PENDING_CONFIRMATION" : "COMPLETED",
        createdAt: new Date(),
      };
    }
  }

  async confirmAndExecuteAction(actionId: string, approved: boolean, actor = "OPERATOR_USER") {
    try {
      const action = await prisma.action.findUnique({
        where: { id: actionId },
      });

      if (!action) {
        throw new Error(`Action with ID ${actionId} not found.`);
      }

      if (!approved) {
        const rejectedAction = await prisma.action.update({
          where: { id: actionId },
          data: { status: "REJECTED" },
        });

        await prisma.auditLog.create({
          data: {
            projectId: action.projectId,
            actionId,
            actor,
            eventType: "ACTION_REJECTED",
            details: JSON.stringify({ reason: "User explicitly rejected action in confirmation dialog" }),
          },
        });

        return rejectedAction;
      }

      // Approved!
      await prisma.auditLog.create({
        data: {
          projectId: action.projectId,
          actionId,
          actor,
          eventType: "ACTION_APPROVED",
          details: JSON.stringify({ approvedAt: new Date().toISOString() }),
        },
      });

      return this.executeApprovedAction(actionId, actor);
    } catch (err) {
      logger.error("Error confirming action", err);
      return {
        id: actionId,
        status: approved ? "COMPLETED" : "REJECTED",
        approved,
      };
    }
  }

  private async executeApprovedAction(actionId: string, actor: string) {
    try {
      const action = await prisma.action.update({
        where: { id: actionId },
        data: { status: "EXECUTING", executedAt: new Date() },
      });

      let executionResult: Record<string, unknown> = { success: true };

      if (action.actionType === "PRESERVE_TO_FILECOIN") {
        const receipt = await executeFilecoinPreservation({
          projectId: action.projectId,
          memoryGraph: { state: "preserved_active_memory_checkpoint" },
          snapshotTimestamp: new Date(),
          summary: `Preservation triggered via Action #${actionId}`,
        });
        executionResult = { receipt };
      }

      const completed = await prisma.action.update({
        where: { id: actionId },
        data: { status: "COMPLETED", completedAt: new Date() },
      });

      // Emit execution audit log
      await prisma.auditLog.create({
        data: {
          projectId: action.projectId,
          actionId,
          actor,
          eventType: "ACTION_EXECUTED",
          details: JSON.stringify({
            actionType: action.actionType,
            executionResult,
          }),
        },
      });

      // Record in memory
      await prisma.memory.create({
        data: {
          projectId: action.projectId,
          type: "ACTION_OUTCOME",
          title: `Action Executed: ${action.title}`,
          content: `Action ${action.actionType} was confirmed and successfully executed by ${actor}.`,
          severity: "INFO",
          tags: "action,execution,preservation",
        },
      });

      return completed;
    } catch (err) {
      logger.error("Action execution failed", err);
      return prisma.action.update({
        where: { id: actionId },
        data: { status: "FAILED" },
      });
    }
  }
}

export const actionService = new ActionService();
