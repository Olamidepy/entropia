export type SignalCategory = "resource" | "storage" | "stability" | "activity" | "security";

export interface NormalizedSignal {
  id?: string;
  projectId: string;
  name: string;
  category: SignalCategory;
  value: number;
  unit: string;
  metadata?: Record<string, unknown>;
  observedAt: Date;
}

export interface IngestSignalPayload {
  projectId: string;
  signals: Array<{
    name: string;
    category: SignalCategory;
    value: number;
    unit: string;
    metadata?: Record<string, unknown>;
  }>;
}
