"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: repoUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to scan repository");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function viewReport() {
    if (result) {
       // In a full app, we would save to DB and navigate by DB ID
       // Here we navigate to results page. For now, the dashboard
       // shows it inline as implemented.
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-12 border-b border-[var(--border)] pb-4">
        <h1 className="text-2xl font-bold">Preflight Dashboard</h1>
        <a href="/" className="text-[var(--accent)] hover:underline text-sm">Home</a>
      </header>

      <section className="bg-[var(--surface)] p-6 rounded-lg border border-[var(--border)] mb-8">
        <h2 className="text-xl font-semibold mb-4">Scan a Public GitHub Repository</h2>
        <form onSubmit={handleScan} className="flex gap-4">
          <input
            type="text"
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="flex-1 bg-black/30 border border-[var(--border)] rounded px-4 py-2 text-[var(--near-white)] focus:outline-none focus:border-[var(--secondary)]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-white font-medium px-6 py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan Repository"}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-[var(--severity-critical)]/20 border border-[var(--severity-critical)] rounded text-red-200 text-sm">
            {error}
          </div>
        )}
      </section>

      {result && (
        <section className="bg-[var(--surface)] p-6 rounded-lg border border-[var(--border)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold">{result.repoOwner}/{result.repoName}</h3>
              <p className="text-sm text-gray-400">Branch: {result.branch} | Scanned roots: {result.scannedRoots.join(", ")}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold text-[var(--accent)]">{result.score}</div>
              <div className="text-sm uppercase tracking-wide font-medium text-gray-300">{result.grade}</div>
            </div>
          </div>

          <h4 className="text-lg font-semibold mb-4">Findings ({result.findings.length})</h4>
          {result.findings.length === 0 ? (
            <p className="text-green-400">No deployment risks detected. Ready to ship!</p>
          ) : (
            <div className="space-y-4">
              {result.findings.map((f: any, i: number) => (
                <div key={i} className="p-4 bg-black/40 border border-[var(--border)] rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs bg-[var(--secondary)]/30 text-[var(--accent)] px-2 py-0.5 rounded">
                      {f.ruleId}
                    </span>
                    <span className={`text-xs uppercase px-2 py-0.5 rounded font-bold ${
                      f.severity === "critical" ? "bg-red-900/50 text-red-300 border border-red-700" :
                      f.severity === "high" ? "bg-amber-900/50 text-amber-300 border border-amber-700" :
                      "bg-blue-900/50 text-blue-300 border border-blue-700"
                    }`}>
                      {f.severity} ({f.confidence} confidence)
                    </span>
                  </div>
                  <p className="font-medium mb-1">{f.message}</p>
                  <p className="text-sm text-gray-400 font-mono mb-2">File: {f.evidence.file}{f.evidence.snippet ? ` | Snippet: ${f.evidence.snippet}` : ""}</p>
                  <div className="text-sm bg-black/20 p-2 rounded text-[var(--accent-light)]">
                    <strong>Fix:</strong> {f.fix}
                  </div>
                </div>
              ))}
            </div>
          )}

          <h4 className="text-lg font-semibold mt-8 mb-4">Passed Checks ({result.passedRules.length})</h4>
          <div className="flex flex-wrap gap-2">
            {result.passedRules.map((ruleId: string, i: number) => (
              <span key={i} className="text-xs bg-sky-950 text-sky-300 px-3 py-1 rounded border border-sky-800">
                {ruleId} passed
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}