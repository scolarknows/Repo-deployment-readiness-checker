import Link from "next/link";
import { Check, Shield, Server, Folder, Layout, Zap, BookOpen, Loader2, X, Clock, Users, Bookmark, Palette, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      {/* 1. Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)]/90 backdrop-blur-sm border-b border-[var(--border)] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          {/* Wordmark logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-[var(--fg)]">Preflight</span>
          </Link>

          {/* Desktop navigation links */}
          <div className="hidden sm:flex items-center gap-8">
            <Link href="#features" className="relative text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
              Features
            </Link>
            <Link href="#how-it-works" className="relative text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
              How it works
            </Link>
            <Link href="#features" className="relative text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
              Pricing
            </Link>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/signup"
              className="relative bg-[var(--accent)] text-white font-bold py-2 px-4 rounded hover:bg-[var(--accent)]/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 text-sm"
            >
              Sign Up
            </a>
            <a
              href="/login"
              className="relative border border-[var(--border)] text-[var(--fg)] font-medium py-2 px-4 rounded hover:bg-[var(--surface-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 text-sm"
            >
              Log In
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 mb-20">
        <h1 className="text-6xl font-black text-[var(--fg)] mb-4 leading-tight">
          Find what breaks your deploy before your deploy does
        </h1>
        <p className="text-xl text-[var(--accent-light)] max-w-xl mx-auto mb-8">
          Enter a public GitHub repository URL and discover deployment risks before you ship.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signup" className="bg-[var(--accent)] text-white font-bold py-3 px-8 rounded hover:bg-[var(--accent)]/80 transition-colors text-lg">
            Sign Up Free
          </a>
          <a href="#features" className="border border-[var(--border)] text-[var(--fg)] font-medium py-3 px-8 rounded hover:bg-[var(--surface-elevated)] transition-colors text-lg">
            Watch Demo
          </a>
        </div>
      </section>

      {/* 2. What it checks Section */}
      <section id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        <div className="bg-[var(--surface-elevated)] p-6 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors cursor-pointer">
          <div className="text-[var(--accent)] text-3xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-[var(--fg)] mb-2">Environment Variables</h3>
          <p className="text-[var(--muted)]">Detects process.env.X and import.meta.env.X usage missing from .env.example</p>
        </div>
        <div className="bg-[var(--surface-elevated)] p-6 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors cursor-pointer">
          <div className="text-[var(--accent)] text-3xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-[var(--fg)] mb-2">Hardcoded Secrets</h3>
          <p className="text-[var(--muted)]">Finds private keys, API tokens, and database URLs with embedded credentials</p>
        </div>
        <div className="bg-[var(--surface-elevated)] p-6 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors cursor-pointer">
          <div className="text-[var(--accent)] text-3xl mb-4">⚙️</div>
          <h3 className="text-xl font-bold text-[var(--fg)] mb-2">Build Scripts</h3>
          <p className="text-[var(--muted)]">Checks for missing build/start scripts in package.json</p>
        </div>
        <div className="bg-[var(--surface-elevated)] p-6 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors cursor-pointer">
          <div className="text-[var(--accent)] text-3xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-[var(--fg)] mb-2">Server Configuration</h3>
          <p className="text-[var(--muted)]">Hardcoded ports, permissive CORS, missing health checks</p>
        </div>
        <div className="bg-[var(--surface-elevated)] p-6 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors cursor-pointer">
          <div className="text-[var(--accent)] text-3xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-[var(--fg)] mb-2">Dependencies</h3>
          <p className="text-[var(--muted)]">Missing lockfiles (package-lock.json, yarn.lock, pnpm-lock.yaml)</p>
        </div>
        <div className="bg-[var(--surface-elevated)] p-6 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors cursor-pointer">
          <div className="text-[var(--accent)] text-3xl mb-4">📄</div>
          <h3 className="text-xl font-bold text-[var(--fg)] mb-2">Documentation</h3>
          <p className="text-[var(--muted)]">Missing README.md or no installation instructions</p>
        </div>
      </section>

      {/* 3. How it works Section */}
      <section id="how-it-works" className="mb-20">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <Check className="text-[var(--bg)] text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--fg)]">How it works in 3 steps</h2>
            <p className="text-[var(--muted)]">Paste a URL → Rules run → Get a report</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-4xl font-extrabold text-[var(--accent)]">1</p>
            <h3 className="text-xl font-bold text-[var(--fg)] mt-2">Paste Repository URL</h3>
            <p className="text-[var(--muted)]">Enter any public GitHub repo URL</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-[var(--accent)]">2</p>
            <h3 className="text-xl font-bold text-[var(--fg)] mt-2">Rules Run</h3>
            <p className="text-[var(--muted)]">14 rules scan file tree, configs, and code</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-[var(--accent)]">3</p>
            <h3 className="text-xl font-bold text-[var(--fg)] mt-2">Get Score & Report</h3>
            <p className="text-[var(--muted)]">Receive graded report with fix guidance</p>
          </div>
        </div>
      </section>

      {/* 4. Sample Report Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-[var(--fg)] mb-6">Sample Report</h2>
        <div className="bg-[var(--surface-elevated)] p-6 rounded-lg border border-[var(--border)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[var(--muted)]">owner/repo</span>
            <span className="text-xl font-bold">Score: 85</span>
          </div>
          <p className="text-[var(--muted)] text-sm">Grade: "Ready"</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-[var(--muted)]">Critical: 0</p>
              <p className="font-medium">Findings</p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">High: 2</p>
              <p className="font-medium">Findings</p>
            </div>
          </div>
          <ul className="text-[var(--muted)] text-sm space-y-2">
            <li>No .env.example - ENV-001 (High confidence)</li>
            <li>Hardcoded port - SRV-001 (High confidence)</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <a href="#" className="text-[var(--accent)] hover:underline text-sm">Copy as Markdown</a>
            <a href="#" className="text-[var(--accent)] hover:underline text-sm ms-2">Re-scan</a>
          </div>
        </div>
      </section>

      {/* 5. Honest Limits Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-[var(--fg)] mb-6">Honest Limits</h2>
        <ul className="text-[var(--muted)] space-y-3">
          <li>Scanner analyzes public JavaScript/TypeScript repositories only</li>
          <li>Findings are static heuristics — not all issues are caught</li>
          <li>No code execution, builds, or runtime verification performed</li>
          <li>Results depend on repository size and file structure</li>
        </ul>
      </section>

      {/* 6. FAQ Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-[var(--fg)] mb-6">Frequently Asked Questions</h2>
        <details className="space-y-3">
          <div className="cursor-pointer flex justify-between">
            <span>Is my code executed or built?</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
          <p>No. The scanner only reads file contents. It does not execute code, install dependencies, or run builds.</p>
          <div className="cursor-pointer flex justify-between">
            <span>Does it work with private repos?</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
          <p>No. Preflight only scans public GitHub repositories.</p>
        </details>
      </section>

      {/* 7. CTA Footer */}
      <footer className="pt-20 border-t border-[var(--border)] text-center">
        <h2 className="text-3xl font-black text-[var(--fg)] mb-4">Ready to ship?</h2>
        <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
          Get your free deployment readiness score in under 10 seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signup" className="bg-[var(--accent)] text-white font-bold py-3 px-8 rounded hover:bg-[var(--accent)]/80 transition-colors text-lg">
            Sign Up Free
          </a>
          <a href="/login" className="border border-[var(--border)] text-[var(--fg)] font-medium py-3 px-8 rounded hover:bg-[var(--surface-elevated)] transition-colors text-lg">
            Log In
          </a>
        </div>
      </footer>
    </main>
  );
}