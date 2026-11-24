"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function ScanReportContent() {
  const params = useParams();
  const id = params?.id as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      if (!id) return;
      try {
        const res = await fetch(`/api/scans/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load report");
        }
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] p-8 max-w-5xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[var(--muted)] font-mono">
          <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span>Loading scan report {id}...</span>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] p-8 max-w-5xl mx-auto">
        <div className="p-6 bg-red-950/40 border border-red-800 rounded-lg">
          <h2 className="text-lg font-bold text-red-300 mb-2">Unable to load report</h2>
          <p className="text-sm text-red-200 mb-4">{error || "Scan not found."}</p>
          <Link href="/dashboard" className="text-xs text-[var(--accent)] hover:underline">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8 border-b border-[var(--border)] pb-4">
        <div>
          <span className="text-xs font-mono text-[var(--accent-light)]">Scan Report</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {report.repoOwner}/{report.repoName}
          </h1>
          <p className="text-xs text-[var(--muted)] font-mono mt-1">
            Branch: {report.branch} • Scanned: {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-[var(--accent)] font-mono">{report.score}</div>
          <div className="text-xs uppercase font-bold text-[var(--fg)]">{report.grade}</div>
        </div>
      </header>

      {/* Findings */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">Detected Findings ({report.findings?.length || 0})</h2>
        {report.findings?.length === 0 ? (
          <div className="p-6 bg-emerald-950/30 border border-emerald-800 rounded-lg text-emerald-300 text-sm">
            ✓ No deployment readiness risks detected! This repository is clean.
          </div>
        ) : (
          <div className="space-y-4">
            {report.findings.map((f: any, idx: number) => (
              <div key={idx} className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--primary)] text-[var(--accent-light)] border border-[var(--border)]">
                    {f.ruleId}
                  </span>
                  <span
                    className={`text-xs uppercase px-2 py-0.5 rounded font-bold ${
                      f.severity === "critical"
                        ? "bg-red-950/80 text-red-300 border border-red-800"
                        : f.severity === "high"
                        ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                        : "bg-sky-950/80 text-sky-300 border border-sky-800"
                    }`}
                  >
                    {f.severity}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--fg)] mb-1">{f.message}</h3>
                <p className="text-xs font-mono text-[var(--muted)] mb-3">
                  File: {f.evidence.file}
                  {f.evidence.snippet ? ` | ${f.evidence.snippet}` : ""}
                </p>
                <div className="text-xs bg-black/30 p-3 rounded text-[var(--accent-light)] border border-black/40">
                  <span className="font-bold text-[var(--fg)]">Fix Guide: </span>
                  {f.fix}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Passed Checks */}
      {report.passedRules && report.passedRules.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-bold text-[var(--muted)] mb-3">
            Passed Checks ({report.passedRules.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {report.passedRules.map((r: string, i: number) => (
              <span
                key={i}
                className="text-xs font-mono bg-[var(--primary)]/60 text-[var(--accent-light)] px-3 py-1 rounded border border-[var(--border)]"
              >
                ✓ {r} passed
              </span>
            ))}
          </div>
        </section>
      )}

      <footer className="pt-6 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--muted)]">
        <Link href="/dashboard" className="text-[var(--accent)] hover:underline">
          ← Back to Dashboard
        </Link>
        <span>Report ID: {id}</span>
      </footer>
    </div>
  );
}

export default function ScanReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[var(--fg)]">Loading...</div>}>
      <ScanReportContent />
    </Suspense>
  );
}
