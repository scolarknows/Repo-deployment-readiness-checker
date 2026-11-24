import React from "react";

export function HonestLimits() {
  const limits = [
    {
      title: "Static heuristics only",
      desc: "Preflight parses files, package manifests, and configuration patterns. It does not execute dynamic JavaScript, build bundles, or test network sockets.",
    },
    {
      title: "Public GitHub repositories",
      desc: "Designed for public repositories or repositories accessible via server-configured GitHub tokens. It never clones code to local disks.",
    },
    {
      title: "False positives are possible",
      desc: "Certain frameworks or monorepo tools define scripts or environment variables indirectly. All medium-confidence findings are clearly tagged.",
    },
    {
      title: "Rate limits and repo size caps",
      desc: "To keep scans within serverless execution bounds (under 10 seconds), scans inspect up to 30 relevant configuration and entry files per repository.",
    },
  ];

  return (
    <section id="limits" className="py-16 border-t border-[var(--border)] max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] mb-3">
          Honest limits
        </h2>
        <p className="text-base font-extralight text-[var(--muted)] max-w-2xl">
          What Preflight does not do. Clear expectations for engineering teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {limits.map((lim, i) => (
          <div
            key={i}
            className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-lg"
          >
            <h3 className="text-base font-bold text-[var(--fg)] mb-2">
              {lim.title}
            </h3>
            <p className="text-sm font-extralight text-[var(--near-white)] leading-relaxed">
              {lim.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
