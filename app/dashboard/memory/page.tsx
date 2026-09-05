"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Database, Plus, Search, Filter, Clock, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { formatDate } from "@/lib/utils/helpers";

export default function MemoryPage() {
  const searchParams = useSearchParams();
  const projectSlug = searchParams.get("project") || "synthetix-agent-alpha";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memories, setMemories] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // New Memory Modal state
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("TREND_SNAPSHOT");
  const [newSeverity, setNewSeverity] = useState("INFO");

  const loadMemories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const pRes = await fetch(`/api/projects/${projectSlug}`);
      const pJson = await pRes.json();
      if (!pJson.success) throw new Error(pJson.error?.message || "Failed to load project");

      setProjectId(pJson.data.project.id);

      const res = await fetch(`/api/memory?projectId=${pJson.data.project.id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Failed to fetch memories");

      setMemories(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to load memory stream");
    } finally {
      setLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !newTitle || !newContent) return;

    try {
      const res = await fetch("/api/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: newTitle,
          content: newContent,
          type: newType,
          severity: newSeverity,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNewModalOpen(false);
        setNewTitle("");
        setNewContent("");
        loadMemories();
      }
    } catch (err) {
      console.error("Failed to record memory:", err);
    }
  };

  const filteredMemories = memories.filter((m) => {
    const matchesType = filterType === "ALL" || m.type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return <LoadingState message="Retrieving persistent memory graph from storage..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Memory Stream Unavailable"
        message={error}
        onRetry={loadMemories}
      />
    );
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "PRESERVATION_EVENT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "INCIDENT":
        return "bg-red-50 text-red-700 border-red-200";
      case "DECISION":
        return "bg-orange-50 text-[#FF6B00] border-orange-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-xs font-semibold text-[#FF6B00] border border-orange-200 mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Persistent Knowledge Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Memory & Historical Graph
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chronological audit of incidents, autonomous decisions, human confirmations, and preservation deals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Record Observation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search memory timeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {["ALL", "PRESERVATION_EVENT", "INCIDENT", "DECISION", "ACTION_OUTCOME"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === t
                  ? "bg-[#FF6B00] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t === "ALL" ? "All Memories" : t.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No memory entries match the selected filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-5 rounded-xl border border-slate-200/80 hover:border-orange-200 transition-colors bg-white space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getTypeBadge(
                        mem.type
                      )}`}
                    >
                      {mem.type.replace(/_/g, " ")}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{mem.title}</h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(mem.timestamp)}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1">
                  {mem.content}
                </p>

                {mem.tags && (
                  <div className="pt-2 flex flex-wrap gap-1.5 pl-1">
                    {mem.tags.split(",").map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-500"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Observation Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Record Persistent Observation
            </h3>

            <form onSubmit={handleCreateMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Node Heartbeat Latency Spike"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 bg-white"
                  >
                    <option value="TREND_SNAPSHOT">TREND_SNAPSHOT</option>
                    <option value="INCIDENT">INCIDENT</option>
                    <option value="DECISION">DECISION</option>
                    <option value="HUMAN_OVERRIDE">HUMAN_OVERRIDE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 bg-white"
                  >
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observation Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide concrete details for the persistent memory store..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] orange-glow"
                >
                  Commit to Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
