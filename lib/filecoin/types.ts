export interface StoreOptions {
  dealDurationDays?: number;
  replicationFactor?: number;
  verified?: boolean;
  metadata?: Record<string, unknown>;
}

export interface StorageResult {
  dealId: string;
  pieceCid: string;
  payloadCid: string;
  provider: string;
  sizeBytes: number;
  dealStart: Date;
  dealEnd: Date;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "FAULTED";
}

export interface RetrievalResult {
  cid: string;
  data: string; // Base64 or string
  sizeBytes: number;
  latencyMs: number;
  verified: boolean;
}

export interface DealStatusResult {
  dealId: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "FAULTED";
  provider: string;
  sectorNumber: number;
  expirationEpoch: number;
  daysRemaining: number;
  verified: boolean;
}

export interface PreservationPayload {
  projectId: string;
  memoryGraph: Record<string, unknown>;
  snapshotTimestamp: Date;
  summary: string;
}

export interface PreservationReceipt {
  receiptId: string;
  dealId: string;
  pieceCid: string;
  payloadCid: string;
  provider: string;
  durationDays: number;
  timestamp: Date;
  verified: boolean;
}

export interface StorageProvider {
  name: string;
  store(data: Uint8Array | string, options?: StoreOptions): Promise<StorageResult>;
  retrieve(cid: string): Promise<RetrievalResult>;
  getStatus(dealId: string): Promise<DealStatusResult>;
  monitor(dealIds: string[]): Promise<DealStatusResult[]>;
  preserve(payload: PreservationPayload): Promise<PreservationReceipt>;
}
