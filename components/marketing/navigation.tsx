"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/", id: "home" },
  { name: "Features", href: "/#features", id: "features" },
  { name: "How It Works", href: "/#how-it-works", id: "how-it-works" },
  { name: "Filecoin Storage", href: "/#filecoin", id: "filecoin" },
  { name: "About", href: "/about", id: "about" },
];

export function MarketingNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    if (pathname === "/about") {
      setActiveId("about");
      return;
    }

    if (pathname === "/") {
      const updateFromHashOrScroll = () => {
        const hash = window.location.hash.replace("#", "");
        if (hash && ["features", "how-it-works", "filecoin"].includes(hash)) {
          setActiveId(hash);
          return;
        }

        if (window.scrollY < 200) {
          setActiveId("home");
          return;
        }

        const sections = ["filecoin", "features", "how-it-works"];
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 250 && rect.bottom >= 150) {
              setActiveId(id);
              return;
            }
          }
        }
      };

      updateFromHashOrScroll();

      const handleScroll = () => {
        updateFromHashOrScroll();
      };

      const handleHashChange = () => {
        updateFromHashOrScroll();
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("hashchange", handleHashChange);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("hashchange", handleHashChange);
      };
    }
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    setActiveId(item.id);
    setMobileMenuOpen(false);

    if (pathname === "/") {
      if (item.id === "home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      } else if (item.href.startsWith("/#")) {
        const targetId = item.id;
        const el = document.getElementById(targetId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${targetId}`);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
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
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "text-slate-950 font-semibold relative after:absolute after:bottom-[-26px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#FF6B00] after:rounded-full"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
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
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`py-1 transition-colors flex items-center justify-between ${
                    isActive
                      ? "text-[#FF6B00] font-semibold"
                      : "hover:text-slate-900"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                  )}
                </Link>
              );
            })}
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
