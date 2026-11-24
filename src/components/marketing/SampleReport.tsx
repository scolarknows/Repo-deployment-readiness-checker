import React from "react";

export function SampleReport() {
  const sampleFindings = [
    {
      id: "ENV-001",
      severity: "high",
      confidence: "high",
      title: "Undocumented Environment Variable",
      file: "src/api/client.ts",
      snippet: "process.env.NEXT_PUBLIC_API_URL",
      fix: "Add NEXT_PUBLIC_API_URL to .env.example with a documentation placeholder.",
    },
    {
      id: "SCR-001",
      severity: "high",
      confidence: "high",
      title: "Missing Build Script",
      file: "package.json",
      snippet: "\"scripts\": { \"dev\": \"vite\" }",
      fix: "Add a 'build' script to package.json (e.g., 'vite build').",
    },
    {
      id: "DEP-001",
      severity: "medium",
      confidence: "high",
      title: "Missing Lockfile",
      file: "package.json",
      snippet: "No package-lock.json, yarn.lock, or pnpm-lock.yaml committed",
      fix: "Commit your lockfile to guarantee reproducible production builds.",
    },
  ];

  const samplePassed = [
    "ENV-003 No committed .env files",
    "SEC-001 No hardcoded secrets detected",
    "SRV-001 Dynamic PORT binding configured",
    "GIT-001 .gitignore includes node_modules & .env",
    "DOC-001 README contains setup documentation",
  ];

  return (
    <section id="sample-report" className="py-16 border-t border-[var(--border)] max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] mb-3">
          Sample scan report
        </h2>
        <p className="text-base font-extralight text-[var(--muted)] max-w-2xl">
          What your team sees after running an audit on a public GitHub repository.
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[var(--border)] mb-6 gap-4">
          <div>
            <span className="text-xs font-mono text-[var(--muted)]">Repository Audit</span>
            <h3 className="text-2xl font-bold text-[var(--fg)] mt-1">acme-corp/storefront-web</h3>
            <p className="text-xs font-mono text-[var(--muted)] mt-1">
              Branch: main • Scanned in 1.4s
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-4xl font-black text-[var(--accent)]">75</div>
              <div className="text-xs uppercase font-bold text-amber-400">Minor issues</div>
            </div>
          </div>
        </div>

        <h4 className="text-base font-bold text-[var(--fg)] mb-4">
          Detected Risks (3)
        </h4>

        <div className="space-y-4 mb-8">
          {sampleFindings.map((finding) => (
            <div
              key={finding.id}
              className="p-4 bg-black/30 border border-[var(--border)] rounded-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--primary)] text-[var(--accent-light)] border border-[var(--border)]">
                  {finding.id}
                </span>
                <span
                  className={`text-xs uppercase px-2 py-0.5 rounded font-bold ${
                    finding.severity === "high"
                      ? "bg-amber-900/40 text-amber-300 border border-amber-700/60"
                      : "bg-blue-900/40 text-blue-300 border border-blue-700/60"
                  }`}
                >
                  {finding.severity}
                </span>
              </div>
              <p className="text-sm font-bold text-[var(--fg)] mb-1">
                {finding.title}
              </p>
              <p className="text-xs font-mono text-[var(--muted)] mb-2">
                File: {finding.file} | Snippet: {finding.snippet}
              </p>
              <div className="text-xs bg-black/20 p-2.5 rounded text-[var(--accent-light)]">
                <span className="font-bold text-[var(--fg)]">Recommended Fix: </span>
                {finding.fix}
              </div>
            </div>
          ))}
        </div>

        <h4 className="text-sm font-bold text-[var(--muted)] mb-3">
          Passed Checks ({samplePassed.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {samplePassed.map((item, i) => (
            <span
              key={i}
              className="text-xs font-mono bg-[var(--primary)]/60 text-[var(--accent-light)] px-3 py-1 rounded border border-[var(--border)]"
            >
              ✓ {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
