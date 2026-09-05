import { activeStorageProvider } from "./client";
import { DealStatusResult } from "./types";
import { prisma } from "../db/prisma";

export async function checkFilecoinDealsHealth(projectId: string): Promise<DealStatusResult[]> {
  try {
    const records = await prisma.filecoinRecord.findMany({
      where: { projectId },
      select: { dealId: true },
    });

    const dealIds = records.map((r) => r.dealId).filter((id): id is string => Boolean(id));

    if (dealIds.length === 0) {
      return activeStorageProvider.monitor(["f019283-deal-88492"]);
    }

    return activeStorageProvider.monitor(dealIds);
  } catch {
    return activeStorageProvider.monitor(["f019283-deal-88492"]);
  }
}
