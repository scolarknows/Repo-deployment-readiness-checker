"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/app/fx/use-reduced-motion";

const TARGET_REPO = "github.com/acme/frontend-storefront";

interface FindingItem {
  id: string;
  severity: "critical" | "high" | "medium";
  title: string;
  file: string;
  deduction: number;
}

const MOCK_FINDINGS: FindingItem[] = [
  {
    id: "SEC-001",
    severity: "critical",
    title: "Hardcoded Stripe Secret Key",
    file: "src/lib/checkout.ts",
    deduction: 20,
  },
  {
    id: "ENV-001",
    severity: "high",
    title: "Missing from .env.example: VITE_API_BASE",
    file: "src/api/client.ts",
    deduction: 10,
  },
  {
    id: "DEP-001",
    severity: "medium",
    title: "No package lockfile committed",
    file: "package.json",
    deduction: 5,
  },
];

export function HeroScanDemo() {
  const reducedMotion = useReducedMotion();
  const [typedUrl, setTypedUrl] = useState("");
  const [phase, setPhase] = useState<"typing" | "scanning" | "results">("typing");
  const [visibleFindings, setVisibleFindings] = useState<FindingItem[]>([]);
  const [score, setScore] = useState(100);

  useEffect(() => {
    if (reducedMotion) {
      setTypedUrl(TARGET_REPO);
      setPhase("results");
      setVisibleFindings(MOCK_FINDINGS);
      setScore(65);
      return;
    }

    let isMounted = true;
    let charIdx = 0;

    // 1. Typing animation
    const typeInterval = setInterval(() => {
      if (charIdx <= TARGET_REPO.length) {
        setTypedUrl(TARGET_REPO.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        if (!isMounted) return;

        // 2. Transition to scanning state
        setPhase("scanning");
        setTimeout(() => {
          if (!isMounted) return;
          setPhase("results");

          // 3. Staggered stream-in of findings & score count-down
          MOCK_FINDINGS.forEach((item, index) => {
            setTimeout(() => {
              if (!isMounted) return;
              setVisibleFindings((prev) => [...prev, item]);
              setScore((prevScore) => Math.max(0, prevScore - item.deduction));
            }, (index + 1) * 600);
          });
        }, 800);
      }
    }, 45);

    return () => {
      isMounted = false;
      clearInterval(typeInterval);
    };
  }, [reducedMotion]);

  const grade =
    score >= 90
      ? "Ready"
      : score >= 70
      ? "Minor issues"
      : score >= 40
      ? "Needs work"
      : "Not ready";

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 max-w-3xl shadow-xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[var(--border)] mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-light)]">
              {phase === "typing"
                ? "Entering repository..."
                : phase === "scanning"
                ? "Running static heuristics..."
                : "Heuristics Complete"}
            </span>
          </div>
          <div className="text-base font-bold text-[var(--fg)] font-mono mt-1">
            {typedUrl}
            {phase === "typing" && <span className="animate-ping font-normal">|</span>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-black text-[var(--accent)] font-mono transition-all duration-300">
              {score}
            </div>
            <div
              className={`text-xs uppercase font-bold px-2 py-0.5 rounded border ${
                score >= 90
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                  : score >= 70
                  ? "bg-sky-950/60 text-sky-300 border-sky-800"
                  : "bg-amber-950/60 text-amber-300 border-amber-800"
              }`}
            >
              {grade}
            </div>
          </div>
        </div>
      </div>

      {phase === "scanning" && (
        <div className="py-6 flex flex-col items-center justify-center gap-3 text-xs text-[var(--muted)] font-mono">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span>Analyzing tree manifests, lockfiles & environment files...</span>
        </div>
      )}

      {phase === "results" && (
        <div className="space-y-3 font-mono text-xs">
          {visibleFindings.map((f) => (
            <div
              key={f.id}
              className={`p-3 bg-black/40 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all duration-300 ${
                f.severity === "critical"
                  ? "border-red-900/60"
                  : f.severity === "high"
                  ? "border-amber-900/60"
                  : "border-sky-900/60"
              }`}
            >
              <div>
                <span
                  className={`font-bold mr-2 ${
                    f.severity === "critical"
                      ? "text-red-400"
                      : f.severity === "high"
                      ? "text-amber-400"
                      : "text-sky-400"
                  }`}
                >
                  [{f.id}]
                </span>
                <span className="text-[var(--fg)]">{f.title}</span>
                <div className="text-[var(--muted)] mt-1">File: {f.file}</div>
              </div>
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-black/50 text-[var(--accent-light)] self-start sm:self-auto whitespace-nowrap">
                -{f.deduction} pts
              </span>
            </div>
          ))}

          {visibleFindings.length === MOCK_FINDINGS.length && (
            <div className="pt-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>✓ 8 passed checks verified</span>
              <Link
                href="/dashboard"
                className="text-[var(--accent)] hover:underline font-sans font-medium"
              >
                Scan your repo →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
