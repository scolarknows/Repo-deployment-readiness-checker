"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";

function ScanReportContent() {
  const params = useParams();
  const id = params?.id as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(false);
      } catch (err: any) {
        setError("Failed to load report");
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  if (loading) return <div className="p-8 text-[var(--fg)]">Loading report {id}...</div>;
  if (error) return <div className="p-8 text-[var(--severity-critical)]">{error}</div>;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Scan Report</h1>
        <p className="text-[var(--accent-light)]">ID: {id}</p>
      </header>

      <div className="bg-[var(--surface)] p-8 rounded-lg border border-[var(--border)]">
        <p className="text-gray-400">Report details for {id} will be displayed here.</p>
      </div>
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
