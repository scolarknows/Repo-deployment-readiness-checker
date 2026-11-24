"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.includes("@")) {
      setStep(2);
    }
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length >= 6) {
      setStep(3);
    }
  }

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username) return;
    setLoading(true);

    // Simulate conversational account creation
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 700);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative z-10">
      {/* Left decorative terminal panel */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-[var(--surface)]/60 border-r border-[var(--border)]">
        <div>
          <Link href="/" className="text-2xl font-black text-[var(--fg)] tracking-tight">
            Preflight
          </Link>
          <div className="mt-16 space-y-4">
            <h2 className="text-3xl font-black text-[var(--fg)] leading-tight">
              Instant deployment audits for every release.
            </h2>
            <p className="text-base text-[var(--muted)] font-extralight leading-relaxed max-w-md">
              Create an account to save repository scan histories, monitor pull request readiness, and generate audit scorecards.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-[var(--muted)] space-y-1">
          <div>✓ Free tier: up to 10 scans per 24 hours</div>
          <div>✓ GitHub REST API: read-only & isolated</div>
          <div>✓ Zero code execution sandbox guarantee</div>
        </div>
      </div>

      {/* Right stepwise form */}
      <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16 max-w-xl mx-auto w-full">
        <div className="mb-8">
          <Link href="/" className="md:hidden text-xl font-black text-[var(--fg)] mb-6 block">
            Preflight
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] mb-2">
            <span>STEP {step} OF 3</span>
            <span>•</span>
            <span>{step === 1 ? "Email" : step === 2 ? "Password" : "Username"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--fg)]">
            Create your account
          </h1>
        </div>

        <div className="space-y-6">
          {/* Step 1: Email */}
          <div className="transition-all duration-300">
            {step === 1 ? (
              <form onSubmit={handleEmailSubmit}>
                <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                  Enter your email address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-2.5 text-sm text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                  <button
                    type="submit"
                    className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/85 text-white text-sm font-medium px-5 py-2.5 rounded transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            ) : (
              <div
                onClick={() => setStep(1)}
                className="p-3 bg-[var(--surface)]/80 border border-[var(--border)] rounded flex justify-between items-center cursor-pointer hover:border-[var(--accent)]/50"
              >
                <div>
                  <div className="text-[11px] font-mono text-[var(--muted)]">EMAIL</div>
                  <div className="text-sm font-medium text-[var(--fg)]">{email}</div>
                </div>
                <span className="text-xs text-[var(--accent)]">Edit</span>
              </div>
            )}
          </div>

          {/* Step 2: Password */}
          {step >= 2 && (
            <div className="transition-all duration-300 animate-fadeIn">
              {step === 2 ? (
                <form onSubmit={handlePasswordSubmit}>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                    Create a secure password (min. 6 characters)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      required
                      autoFocus
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-2.5 text-sm text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                    />
                    <button
                      type="submit"
                      className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/85 text-white text-sm font-medium px-5 py-2.5 rounded transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  onClick={() => setStep(2)}
                  className="p-3 bg-[var(--surface)]/80 border border-[var(--border)] rounded flex justify-between items-center cursor-pointer hover:border-[var(--accent)]/50"
                >
                  <div>
                    <div className="text-[11px] font-mono text-[var(--muted)]">PASSWORD</div>
                    <div className="text-sm font-medium text-[var(--fg)]">••••••••</div>
                  </div>
                  <span className="text-xs text-[var(--accent)]">Edit</span>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Username & Submit */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="transition-all duration-300 animate-fadeIn">
              <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                Choose your username or handle
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="developer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-2.5 text-sm text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] mb-4"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--secondary)] hover:bg-[var(--secondary)]/85 text-white font-medium py-3 rounded transition-colors text-sm disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Complete Sign Up"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)] text-xs text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
