import { activeStorageProvider } from "./client";
import { RetrievalResult } from "./types";

export async function retrieveFilecoinArtifact(cid: string): Promise<RetrievalResult> {
  return activeStorageProvider.retrieve(cid);
}
