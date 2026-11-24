import React from "react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Inspect repository tree via GitHub API",
      desc: "Preflight parses your repository URL, queries the GitHub Git Tree API, and identifies project roots without running or cloning untrusted code.",
    },
    {
      num: "02",
      title: "Evaluate pure static heuristics",
      desc: "Selected configuration files, scripts, package manifests, and environment templates are analyzed through pure deterministic rule engines.",
    },
    {
      num: "03",
      title: "Receive actionable fixes & readiness score",
      desc: "Get an overall score out of 100 with a letter grade, masked evidence snippets, and direct guidance on how to fix each risk before deployment.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 border-t border-[var(--border)] max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] mb-3">
          How it works
        </h2>
        <p className="text-base font-extralight text-[var(--muted)] max-w-2xl">
          Three sequential steps from repository link to deployment audit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 relative"
          >
            <div className="text-xs font-mono font-bold text-[var(--accent)] mb-3">
              STEP {step.num}
            </div>
            <h3 className="text-lg font-bold text-[var(--fg)] mb-2">
              {step.title}
            </h3>
            <p className="text-sm font-extralight text-[var(--near-white)] leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
