import React from "react";
import { RULE_REGISTRY } from "@/lib/engine/registry";

export function CategoryChecks() {
  const categoryCounts = RULE_REGISTRY.reduce((acc, rule) => {
    acc[rule.category] = (acc[rule.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryDescriptions: Record<string, string> = {
    Environment: "Checks .env.example parity, undocumented variables, and committed secrets in source.",
    Security: "Scans for hardcoded access tokens, API keys, and sensitive connection strings.",
    Build: "Verifies scripts, build commands, and target Node runtime version declarations.",
    Dependencies: "Ensures lockfile integrity across npm, yarn, and pnpm package managers.",
    Server: "Inspects dynamic port bindings, health-check endpoints, and CORS configurations.",
    Repository: "Verifies .gitignore rules to prevent accidental leaks of build output and credentials.",
    Documentation: "Confirms setup instructions and installation steps are documented for deployers.",
    Automation: "Checks for continuous integration workflow files under .github/workflows.",
    Deployment: "Validates hosting configuration templates and container deployment recipes.",
  };

  const categories = Object.keys(categoryCounts);

  return (
    <section id="checks" className="py-16 border-t border-[var(--border)] max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] mb-3">
          What Preflight checks
        </h2>
        <p className="text-base font-extralight text-[var(--muted)] max-w-2xl">
          Derived directly from the rule registry. {RULE_REGISTRY.length} automated static rules evaluating your repository configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = categoryCounts[cat];
          const desc = categoryDescriptions[cat] || "Checks project readiness and configuration.";
          return (
            <div
              key={cat}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[var(--fg)]">{cat}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--primary)] text-[var(--accent-light)] border border-[var(--border)]">
                    {count} {count === 1 ? "rule" : "rules"}
                  </span>
                </div>
                <p className="text-sm font-extralight text-[var(--near-white)] leading-normal">
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
