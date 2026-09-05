import { HardDrive, Shield, RefreshCw, Database, Server } from "lucide-react";

export function MarketingFilecoinSection() {
  const filecoinFeatures = [
    {
      title: "Content-Addressed CAR Packaging",
      description: "Memory graphs, vector embeddings, and telemetry indices are packed into Content Addressable aRchive (CAR) payloads.",
      icon: Database,
    },
    {
      title: "Cryptographic PieceCID Verification",
      description: "Every preservation snapshot produces an immutable root PieceCID and PayloadCID verifiable across Filecoin node explorers.",
      icon: Shield,
    },
    {
      title: "Automated Lease Lifecycle Monitoring",
      description: "Monitors deal sectors continuously, tripping early warning flags when active storage durations fall below 14 days.",
      icon: RefreshCw,
    },
    {
      title: "Modular Storage Provider Adapters",
      description: "Decoupled architecture enabling seamless switching between Glif, PiKnik, native Lotus nodes, or decentralized pinning gateways.",
      icon: Server,
    },
  ];

  return (
    <section id="filecoin" className="py-24 bg-[#FAFAFA] border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 mb-4 shadow-sm">
            <HardDrive className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Decentralized Archival Layer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Preserving System Memory on the Filecoin Network
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            When autonomous agents or digital systems face critical resource depletion, Entropia executes cryptographic preservation deals to safeguard state forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filecoinFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-200 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Technical Architecture Badge Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-sm font-bold text-slate-900">Filecoin Glif RPC Gateway</p>
              <p className="text-xs text-slate-500">Connected: https://api.node.glif.io/rpc/v1 (Simulated & Production Ready)</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono text-slate-600">
            <span>Replication SLA: 2x</span>
            <span>Proof Type: PoRep / PoSt</span>
            <span>Deal Duration: 540 Epochs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
