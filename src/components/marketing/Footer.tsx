import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-12 max-w-6xl mx-auto px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-base font-bold text-[var(--fg)]">Preflight</span>
          <p className="text-xs text-[var(--muted)] mt-1">
            Repo deploy-readiness checker for modern frontend teams.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--muted)]">
          <Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">
            Dashboard
          </Link>
          <a href="#checks" className="hover:text-[var(--accent)] transition-colors">
            Rule Registry
          </a>
          <a href="#faq" className="hover:text-[var(--accent)] transition-colors">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}
