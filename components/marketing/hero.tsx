"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden bg-white min-h-[580px] lg:min-h-[660px] xl:min-h-[720px] flex items-center pt-8 pb-16 lg:py-0">
      {/* Centered Left Content Container */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Occupies 48% / 6 cols with max-w-xl for clean typography */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-7 py-4 lg:py-16 max-w-xl">
            {/* Main Headline - Starts cleanly without chip */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
              An AI Agent <br />
              that Decides <br />
              What to Remember <br />
              to <span className="text-[#FF6B00]">Survive.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-[18px] text-slate-600 leading-relaxed max-w-lg font-normal">
              Entropia monitors your AI agent&apos;s financial runway and makes
              intelligent decisions on what to preserve, compress or discard — so
              you keep what matters.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-all duration-200 orange-glow hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-all duration-200"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-orange-50 text-[#FF6B00]">
                  <Play className="w-3 h-3 fill-[#FF6B00] translate-x-0.5" />
                </div>
                Watch Demo
              </Link>
            </div>

            {/* Quick Metrics Guarantee */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Deterministic Scoring Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
                <span>Filecoin Preservation Anchoring</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>Immutable Audit Logs</span>
              </div>
            </div>

            {/* Mobile & Tablet 3D visual (displayed below content) */}
            <div className="lg:hidden relative w-full aspect-[4/3] max-w-md mx-auto pt-6">
              <Image
                src="/images/entropia-3d.png"
                alt="Entropia 3D Survival Intelligence Architecture"
                fill
                priority
                className="object-contain object-center drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop 3D Visual: Occupies the entire right side of the hero composition */}
      <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-[52vw] max-w-[850px] xl:max-w-[1000px] h-full pointer-events-none z-0 items-center justify-end overflow-hidden">
        {/* Subtle ambient glow behind 3D asset */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-orange-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="relative w-[110%] h-[115%] -mr-6 xl:-mr-12 -mt-2">
          <Image
            src="/images/entropia-3d.png"
            alt="Entropia 3D Survival Intelligence Architecture"
            fill
            priority
            className="object-contain object-right drop-shadow-2xl select-none"
          />
        </div>
      </div>
    </section>
  );
}
