"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeroScanDemo } from "./HeroScanDemo";
import { AnalysingLoader } from "@/components/ui/AnalysingLoader";

export function Hero() {
  const router = useRouter();
  const [repoInput, setRepoInput] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (repoInput.trim()) {
      setShowLoader(true);
      router.push(`/dashboard?repo=${encodeURIComponent(repoInput.trim())}`);
    } else {
      router.push("/dashboard");
    }
  }

  // Hide loader after navigation completes (simple timeout-based approach)
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 max-w-6xl mx-auto px-6">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--fg)] mb-6">
          Find what breaks your deploy before your deploy does.
        </h1>
        <p className="text-lg md:text-xl font-extralight text-[var(--near-white)] leading-relaxed mb-8">
          Static deployment readiness heuristics for frontend repositories. Inspect environment variables, build configuration, missing lockfiles, and server bindings before shipping to production.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-xl"
        >
          <input
            type="text"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            placeholder="https://github.com/owner/repository"
            className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-md px-4 py-3 text-sm text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          <button
            type="submit"
            className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/85 text-white font-medium px-6 py-3 rounded-md text-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            Scan Repository
          </button>
        </form>
      </div>

      <HeroScanDemo />

      {/* Show analysing loader if we just navigated to dashboard with a scan */}
      {showLoader && (
        <AnalysingLoader
          title="Analysing Repository"
          message="Fetching tree, reading files, and running static heuristics..."
        />
      )}
    </section>
  );
}
