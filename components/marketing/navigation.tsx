"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";

export function MarketingNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between h-20">
        {/* Logo matching exact reference design scale, reduced by 2px */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-90 py-1">
          <div className="relative h-[30px] sm:h-[32px] w-[145px] sm:w-[170px]">
            <Image
              src="/images/entropia-logo.png"
              alt="Entropia"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          <Link
            href="/"
            className="text-slate-950 font-semibold relative after:absolute after:bottom-[-26px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#FF6B00] after:rounded-full"
          >
            Home
          </Link>
          <Link href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">
            How It Works
          </Link>
          <Link href="#filecoin" className="hover:text-slate-900 transition-colors">
            Filecoin Storage
          </Link>
          <Link href="/about" className="hover:text-slate-900 transition-colors">
            About
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-all duration-200 orange-glow hover:scale-[1.02] active:scale-[0.98]"
          >
            Launch App
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-[15px] font-medium text-slate-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#FF6B00] font-semibold py-1"
            >
              Home
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-slate-900 py-1"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-slate-900 py-1"
            >
              How It Works
            </Link>
            <Link
              href="#filecoin"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-slate-900 py-1"
            >
              Filecoin Storage
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-slate-900 py-1"
            >
              About
            </Link>
          </nav>
          <div className="pt-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl font-semibold text-white bg-[#FF6B00] orange-glow text-center"
            >
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
