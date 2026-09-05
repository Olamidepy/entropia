import {
  ShieldAlert,
  HardDrive,
  Cpu,
  Layers,
  FileCheck,
  Zap,
  Activity,
  GitPullRequest,
  CheckCircle2,
} from "lucide-react";

export function MarketingFeatures() {
  const steps = [
    {
      step: "01",
      title: "Telemetry Normalization",
      description: "Ingests runway, latency, balance, and sector expiration signals into a unified operational format.",
      icon: Activity,
    },
    {
      step: "02",
      title: "Deterministic Scoring",
      description: "Applies mathematical formula across 6 categorical weights to calculate an unbiasable 0–100 survival score.",
      icon: Cpu,
    },
    {
      step: "03",
      title: "Continuous Risk Rules",
      description: "Evaluates hard thresholds for storage expiry, retrieval failure, and runway depletion with concrete evidence.",
      icon: ShieldAlert,
    },
    {
      step: "04",
      title: "Persistent Memory Context",
      description: "Maintains chronological history of past incidents, decisions, and action outcomes to prevent redundant mistakes.",
      icon: Layers,
    },
    {
      step: "05",
      title: "AI Reasoning Agent",
      description: "Ingests deterministic metrics and reasons about threats, prioritizing validated actions from our registry.",
      icon: Zap,
    },
    {
      step: "06",
      title: "Filecoin Preservation",
      description: "Packages memory state into CAR files, pinning immutable cryptographic deals with verified miners.",
      icon: HardDrive,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#FAFAFA] border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 mb-4 shadow-sm">
            <GitPullRequest className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Autonomous Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            How Entropia Ensures Continuous Digital Longevity
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            A battle-tested architecture that pairs deterministic mathematical rigor with contextual AI reasoning — ensuring critical systems never sleepwalk into extinction.
          </p>
        </div>

        {/* 6-Stage Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative bg-white p-8 rounded-2xl border border-slate-200/80 hover:border-orange-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 group-hover:text-orange-200 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Highlights Banner */}
        <div id="features" className="mt-16 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="space-y-3 lg:pr-8">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Hallucinated Metrics</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">Deterministic Score Authority</h4>
              <p className="text-sm text-slate-600">
                The LLM never generates numbers. Scores are derived through transparent, weighted formulas that can be audited on-chain.
              </p>
            </div>

            <div className="space-y-3 pt-6 lg:pt-0 lg:px-8">
              <div className="flex items-center gap-2 text-[#FF6B00] font-semibold text-sm">
                <FileCheck className="w-4 h-4" />
                <span>Mandatory Confirmation Gates</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">Human-In-The-Loop Safety</h4>
              <p className="text-sm text-slate-600">
                Sensitive operations like capital deployment or state pruning strictly present four clear explanations before requesting approval.
              </p>
            </div>

            <div className="space-y-3 pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                <HardDrive className="w-4 h-4" />
                <span>Decentralized Proofs</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">Modular Filecoin Layer</h4>
              <p className="text-sm text-slate-600">
                Plug-and-play storage provider adapters supporting Glif, PiKnik, Lotus, and Web3.Storage with simulated failovers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
