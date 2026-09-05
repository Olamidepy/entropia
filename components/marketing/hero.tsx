"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-20 lg:pt-16 lg:pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 z-10 space-y-8 max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF6ED] border border-[#FFD6B3] text-[#D95700] text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>AI Survival Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
              An AI Agent <br />
              that Decides <br />
              What to Remember <br />
              to <span className="text-[#FF6B00]">Survive.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-[19px] text-slate-600 leading-relaxed max-w-xl font-normal">
              Entropia monitors your AI agent&apos;s financial runway and makes
              intelligent decisions on what to preserve, compress or discard — so
              you keep what matters.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
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
            <div className="pt-6 flex flex-wrap items-center gap-8 text-xs sm:text-sm text-slate-500 border-t border-slate-100">
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
          </div>

          {/* Right Column: 3D Visual Asset */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            {/* Subtle radial ambient warmth behind asset */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] bg-gradient-to-tr from-orange-100/40 via-amber-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="relative w-full max-w-[460px] sm:max-w-[540px] lg:max-w-[620px] aspect-square animate-float">
              <Image
                src="/images/entropia-3d.png"
                alt="Entropia 3D Survival Intelligence Architecture"
                fill
                priority
                className="object-contain object-right drop-shadow-2xl scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
