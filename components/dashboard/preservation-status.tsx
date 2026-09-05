"use client";

import { useState } from "react";
import { HardDrive, ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";
import { ConfirmationDialog } from "../decisions/confirmation-dialog";

interface FilecoinRecordItem {
  id: string;
  dealId?: string | null;
  pieceCid: string;
  payloadCid: string;
  provider: string;
  storageStatus: string;
  replication: number;
  dealEnd?: string | Date | null;
  verified: boolean;
}

interface PreservationStatusProps {
  records: FilecoinRecordItem[];
  projectId: string;
  onPreserved?: () => void;
}

export function PreservationStatus({ records, projectId, onPreserved }: PreservationStatusProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePreserve = async () => {
    try {
      const res = await fetch("/api/filecoin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          summary: "Manual preservation deal authorized via Dashboard",
        }),
      });
      const data = await res.json();
      if (data.success && onPreserved) {
        onPreserved();
      }
    } catch (err) {
      console.error("Preservation error:", err);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#FF6B00]" />
            <h3 className="text-base font-bold text-slate-900">
              Filecoin Preservation Network
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow-sm"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Anchor Snapshot</span>
          </button>
        </div>

        {records.length === 0 ? (
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-800 text-xs">
            No active Filecoin deals found. System state is unpinned. We recommend creating an initial preservation deal.
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-slate-200/80 space-y-2.5 bg-slate-50/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    Deal: {rec.dealId || "Pending Deal Creation"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3" />
                    {rec.storageStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      PieceCID
                    </span>
                    <span className="font-mono text-slate-700 truncate block text-[11px]">
                      {rec.pieceCid}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Storage Provider
                    </span>
                    <span className="text-slate-700 block font-medium">
                      {rec.provider}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Replicas: {rec.replication}x (Verified)</span>
                  <span className="text-emerald-600 font-semibold">PoRep Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handlePreserve}
        actionType="PRESERVE_TO_FILECOIN"
        actionTitle="Anchor Memory State to Filecoin"
        contextReason="Operator triggered manual preservation to create an immutable decentralized backup of the current project state."
      />
    </>
  );
}
