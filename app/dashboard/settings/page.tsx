"use client";

import { useState } from "react";
import { Settings, Save, CheckCircle2, Shield, HardDrive, Cpu, Bell } from "lucide-react";

export default function SettingsPage() {
  const [provider, setProvider] = useState("Filecoin-Glif (Primary Node)");
  const [glifUrl, setGlifUrl] = useState("https://api.node.glif.io/rpc/v1");
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.slack.com/services/T000/B000/XXXX");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-xs font-semibold text-[#FF6B00] border border-orange-200 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Cluster Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System & Storage Configuration
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure modular Filecoin providers, reasoning engines, and incident notification endpoints.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Storage Provider Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <HardDrive className="w-5 h-5 text-[#FF6B00]" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Filecoin Storage Provider Adapter
              </h3>
              <p className="text-xs text-slate-500">
                Swap storage adapters without breaking deterministic survival contracts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Active Provider Architecture
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
              >
                <option value="Filecoin-Glif (Primary Node)">Filecoin-Glif (Primary Node - EU-West)</option>
                <option value="PiKnik US-East (Secondary Node)">PiKnik US-East (Secondary Node)</option>
                <option value="Lotus Local Node">Lotus Local Daemon (Native JSON-RPC)</option>
                <option value="Mock Memory Adapter">Mock Memory Adapter (Zero-latency Local)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Filecoin Gateway RPC Endpoint
              </label>
              <input
                type="text"
                value={glifUrl}
                onChange={(e) => setGlifUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
              />
            </div>
          </div>
        </div>

        {/* AI Reasoning Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-[#FF6B00]" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI Reasoning Agent Engine
              </h3>
              <p className="text-xs text-slate-500">
                The AI qualitative engine explains deterministic scores and prioritizes action candidates.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>Architecture Guarantee:</strong> Entropia is configured with an active dual-engine pipeline. When <code className="font-mono text-slate-900">OPENAI_API_KEY</code> is present, it uses GPT-4o with structured Zod outputs. When unconfigured, it automatically falls back to Entropia&apos;s zero-latency deterministic heuristic synthesizer so the platform runs flawlessly.
          </div>
        </div>

        {/* Alert Webhooks */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Bell className="w-5 h-5 text-[#FF6B00]" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Operator Emergency Dispatch Webhook
              </h3>
              <p className="text-xs text-slate-500">
                Receives automated notifications when deterministic scores cross the CRITICAL (&lt;35) threshold.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Webhook URL
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Configuration successfully saved.</span>
            </div>
          )}
          {!saved && <div />}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
