import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, Cpu, HardDrive } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#FF6B00] mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            System Manifesto & Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            The Philosophy of Machine Survival
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Why digital projects and autonomous AI agents need deterministic survival engines, not polite chatbots.
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-10 text-slate-700 leading-relaxed text-base">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Cpu className="w-6 h-6 text-[#FF6B00]" />
              The Deterministic Principle
            </h2>
            <p>
              In production autonomous computing, numerical survival metrics cannot be delegated to probabilistic language models. Large language models excel at synthesizing context, deriving nuances, and providing qualitative explanations, but they must <strong>never invent survival scores or define risk thresholds</strong>.
            </p>
            <p>
              Entropia strictly decouples the mathematical survival engine from the reasoning agent. The survival score (0–100) is deterministically computed from 6 transparent, weighted vectors: Resource Runway, Storage Health, Historical Stability, Risk Exposure, System Activity, and Preservation Readiness.
            </p>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-[#FF6B00]" />
              Human-in-the-Loop Confirmation
            </h2>
            <p>
              Autonomous systems should be empowered to protect themselves, but irreversible operational choices — such as spending on-chain resources, pruning memory indices, or migrating primary storage deals — require human verification.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">Every sensitive action must clearly state:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                <li><strong>WHAT WILL HAPPEN</strong>: The exact programmatic steps executed.</li>
                <li><strong>WHY IT IS RECOMMENDED</strong>: The deterministic risk or policy trigger.</li>
                <li><strong>RISK LEVEL</strong>: Low, Medium, High, or Critical threat tier.</li>
                <li><strong>EXPECTED OUTCOME</strong>: Guaranteed target state or duration extension.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <HardDrive className="w-6 h-6 text-[#FF6B00]" />
              Filecoin: The Cryptographic Memory Vault
            </h2>
            <p>
              Traditional centralized cloud providers represent single points of failure. Entropia uses a modular storage adapter to package critical system memory into CAR files and commit verifiable storage deals to the Filecoin decentralized storage network.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Proof of Replication
                </div>
                <p className="text-xs text-slate-500">Cryptographic proof that data is physically stored in unique sectors.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Modular Provider Adapter
                </div>
                <p className="text-xs text-slate-500">Switch between Glif, PiKnik, native Lotus, or local mock nodes without touching business logic.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
          >
            Go to Operational Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
