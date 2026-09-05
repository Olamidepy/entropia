import { Activity, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/helpers";

interface MemoryFeedItem {
  id: string;
  type: string;
  title: string;
  content: string;
  severity: string;
  timestamp: string | Date;
}

export function ActivityFeed({ memories }: { memories: MemoryFeedItem[] }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "PRESERVATION_EVENT":
        return "bg-emerald-500";
      case "INCIDENT":
        return "bg-red-500";
      case "DECISION":
        return "bg-[#FF6B00]";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FF6B00]" />
          <h3 className="text-base font-bold text-slate-900">
            System Activity & Chronology
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Live Telemetry</span>
      </div>

      {memories.length === 0 ? (
        <p className="text-xs text-slate-500 py-4">No recent observations recorded.</p>
      ) : (
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {memories.map((m) => (
            <div key={m.id} className="relative space-y-1">
              {/* Dot */}
              <span
                className={`absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${getTypeColor(
                  m.type
                )}`}
              />

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{m.title}</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(m.timestamp)}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{m.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
