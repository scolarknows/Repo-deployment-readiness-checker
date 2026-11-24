"use client";

import React, { useState } from "react";

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How is the deployment readiness score computed?",
      a: "The score starts at 100 points. Penalties are deducted per unique finding: Critical deducts 20, High deducts 10, Medium deducts 5, and Low deducts 2. To avoid one noisy rule tanking a scan, deductions for any single rule id are capped at twice its severity weight. The score floor is 0.",
    },
    {
      q: "Does Preflight execute or run untrusted code?",
      a: "No. Preflight never clones, executes, or installs dependencies from scanned repositories. It inspects file trees and reads file contents via the GitHub Git Trees REST API using read-only requests.",
    },
    {
      q: "What happens if a hardcoded secret is found?",
      a: "Any detected secrets (such as API keys or connection credentials) are immediately masked before leaving the engine. Only a safe prefix and rule identifier are returned. Raw secrets are never stored or logged.",
    },
    {
      q: "What are the grade bands?",
      a: "Score 90-100: Ready (clean to deploy). Score 70-89: Minor issues. Score 40-69: Needs work. Below 40: Not ready (critical deployment blocks detected).",
    },
    {
      q: "Can I use Preflight with monorepos?",
      a: "Yes. Preflight detects multiple project roots in a single repository (such as apps/* or packages/*) and runs checks across detected project boundaries.",
    },
  ];

  function toggle(idx: number) {
    setOpenIdx(openIdx === idx ? null : idx);
  }

  return (
    <section id="faq" className="py-16 border-t border-[var(--border)] max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] mb-3">
          Frequently asked questions
        </h2>
        <p className="text-base font-extralight text-[var(--muted)] max-w-2xl">
          Everything you need to know about the scoring engine and safety model.
        </p>
      </div>

      <div className="space-y-3 max-w-3xl">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left p-5 flex justify-between items-center text-[var(--fg)] hover:text-[var(--accent)] font-medium text-base"
              >
                <span>{faq.q}</span>
                <span className="font-mono text-lg text-[var(--muted)] ml-4">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm font-extralight text-[var(--near-white)] leading-relaxed border-t border-[var(--border)] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
