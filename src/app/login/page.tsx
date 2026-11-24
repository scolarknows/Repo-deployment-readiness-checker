"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Single-step login redirect
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8 shadow-2xl">
        <div className="mb-6">
          <Link href="/" className="text-xl font-black text-[var(--fg)] tracking-tight">
            Preflight
          </Link>
          <h1 className="text-2xl font-black text-[var(--fg)] mt-4">
            Sign in to Preflight
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Access your saved scans and deployment scorecards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--muted)] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-black/40 border border-[var(--border)] rounded px-3.5 py-2 text-sm text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[var(--muted)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-[var(--border)] rounded px-3.5 py-2 text-sm text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--secondary)] hover:bg-[var(--secondary)]/85 text-white font-medium py-2.5 rounded transition-colors text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)] flex justify-between">
          <span>Don&apos;t have an account?</span>
          <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
