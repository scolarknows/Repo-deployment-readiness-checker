"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? "bg-[var(--bg)]/90 backdrop-blur-md border-[var(--border)] py-3 shadow-md"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-[var(--fg)]">
            Preflight
          </span>
          <span className="text-xs px-2 py-0.5 rounded font-mono bg-[var(--primary)] text-[var(--accent-light)] border border-[var(--border)]">
            v0.1
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a
            href="#checks"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            Checks
          </a>
          <a
            href="#how-it-works"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            How it works
          </a>
          <a
            href="#sample-report"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            Sample report
          </a>
          <a
            href="#limits"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            Limits
          </a>
          <a
            href="#faq"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/85 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
