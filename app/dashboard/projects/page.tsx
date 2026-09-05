"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban, Plus, ArrowRight, Activity, ShieldCheck, AlertTriangle } from "lucide-react";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("agent_vault");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Failed to load projects");
      setProjects(json.data);
    } catch (err: any) {
      setError(err.message || "Could not fetch projects list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, category }),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        setName("");
        setDescription("");
        loadProjects();
      }
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  if (loading) {
    return <LoadingState message="Loading monitored targets..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadProjects} />;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "stable":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "at-risk":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-xs font-semibold text-[#FF6B00] border border-orange-200 mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Telemetry Targets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Monitored Projects
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Active digital systems, autonomous agent memory vaults, and decentralized archives.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Target</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-orange-200 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {p.category.replace(/_/g, " ")}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                    p.currentStatus
                  )}`}
                >
                  {p.currentStatus}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {p.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {p.description || "Monitored autonomous system."}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-400">Survival Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono text-slate-900">
                    {p.currentScore.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Active Risks: <strong>{p.riskEvents?.length || 0}</strong></span>
                <span>Storage: <strong>{p.primaryProvider}</strong></span>
              </div>

              <Link
                href={`/dashboard?project=${p.slug}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-orange-50 hover:text-[#FF6B00] transition-colors border border-slate-200"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Register Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Register New Monitored Target
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Vector Indexer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 bg-white"
                >
                  <option value="agent_vault">Autonomous Agent Vault</option>
                  <option value="decentralized_archive">Decentralized Archive</option>
                  <option value="data_pipeline">Data & Oracle Pipeline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the monitored architecture..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] orange-glow"
                >
                  Register Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
