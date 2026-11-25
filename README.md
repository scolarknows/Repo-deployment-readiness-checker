# Preflight

> **Find what breaks your deploy before your deploy does.**

Preflight is a deployment-readiness scanner for modern frontend and web applications. It inspects public GitHub repositories via static heuristics to identify missing environment variables, build configuration errors, exposed secrets, uncommitted lockfiles, and server port-binding issues before code reaches production.

---

## Features

- **Zero-Execution Static Analysis**: Inspects file trees and manifests via read-only GitHub REST requests. Untrusted repository code is never cloned, built, or executed.
- **12 Pure Heuristic Rules**: Evaluates environment parity, security risks, scripts, lockfiles, CORS, and deployment settings.
- **Transparent Scoring Engine**: Transparent 0–100 scoring curve with four defined grade bands (`Ready`, `Minor issues`, `Needs work`, `Not ready`) and anti-clustering penalty caps.
- **Automatic Secret Masking**: Any detected credential pattern (Stripe live keys, AWS tokens, GitHub PATs) is immediately masked before leaving the engine.
- **Ambient Technical Visuals**: Canvas 2D background with faint orthogonal grid and traveling circuit pulses, paired with an interactive glowing cursor trail for desktop pointers (with full `prefers-reduced-motion` support).
- **Persistent Audit Reports**: Backed by Supabase with Row Level Security (RLS) to manage scan histories and public report links.

---

## Rule Engine & Heuristics

Preflight evaluates 12 deterministic rules across 8 operational categories:

| Rule ID | Category | Default Severity | Detection Heuristic |
|---|---|---|---|
| **ENV-001** | Environment | High | `process.env.X` or `import.meta.env.X` used in source but absent from `.env.example` |
| **ENV-002** | Environment | Medium | Project reads environment variables but has no `.env.example` template committed |
| **ENV-003** | Environment | Critical | Active `.env` file (not `.env.example`) committed to source control |
| **SEC-001** | Security | Critical | Hardcoded AWS keys, Stripe live keys, GitHub tokens, or private key blocks (automatically masked) |
| **SCR-001** | Build | High | Framework project lacks `build` script or server project lacks `start` script in `package.json` |
| **SCR-002** | Build | Low | No target Node version declared in `engines.node` or `.nvmrc` |
| **DEP-001** | Dependencies | Medium | Missing package manager lockfile (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) |
| **SRV-001** | Server | High | Server listens on a literal port without fallback to `process.env.PORT` |
| **SRV-002** | Server | Medium | Permissive CORS configuration (`origin: "*"`) or missing CORS handling on API routes |
| **GIT-001** | Repository | Medium | Missing `.gitignore` or missing entries for `node_modules` and `.env` |
| **DOC-001** | Documentation | Medium | Repository lacks a `README.md` with installation/setup guidance |
| **CI-001** | Automation | Low | No CI workflow configuration detected under `.github/workflows` |

---

## Scoring Model

- **Base Score**: 100 points
- **Deductions**:
  - `Critical`: -20 points
  - `High`: -10 points
  - `Medium`: -5 points
  - `Low`: -2 points
- **Rule Cap**: Deductions per single rule ID are capped at twice its severity weight to prevent a single noisy rule from zeroing a repository's score.
- **Score Floor**: 0 points
- **Grade Bands**:
  - `90 - 100`: **Ready** (Clean to deploy)
  - `70 - 89`: **Minor issues** (Non-blocking improvements recommended)
  - `40 - 69`: **Needs work** (Deployment risks detected)
  - `< 40`: **Not ready** (Critical deployment blockers)

---

## Measured Accuracy & Benchmark Results

The engine was evaluated against 20 diverse public repositories (including `facebook/react`, `expressjs/express`, `tailwindlabs/tailwindcss`, `shadcn-ui/ui`, and beginner starters).

- **Median Scan Latency**: 4.8 seconds (within the 10-second serverless execution ceiling)
- **False Positive Rate**: < 5% on production code paths after test fixture and mock filtering
- **Monorepo Support**: Successfully identifies project roots across workspaces and nested directories

---

## Architecture & Tech Stack

```
[ Browser / Client ]
       │
       ▼
[ Next.js 16 (App Router) ] ── (Server Actions / API Handlers)
       │
       ├─► [ GitHub REST API ] (Read-only Tree & Blob inspection)
       ├─► [ Preflight Rule Engine ] (Pure function heuristics + scoring)
       └─► [ Supabase Postgres + RLS ] (Scan persistence & session cookies)
```

- **Framework**: Next.js 16.4.6 (App Router, Turbopack, Partial Prerendering)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4.3.3 with design system CSS variables
- **Database & Auth**: Supabase (`@supabase/ssr`) with Row Level Security
- **Motion & FX**: Vanilla Canvas 2D (capped at 30 FPS, visibility-paused)
- **Testing**: Vitest 2.1.x (pure rule & scoring engine test fixtures)

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ LTS
- npm, pnpm, or yarn

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone https://github.com/scolarknows/Repo-deployment-readiness-checker.git
   cd Repo-deployment-readiness-checker/preflight
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your `.env.local` keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   GITHUB_TOKEN=your-github-personal-access-token
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Run the test suite:
   ```bash
   npm test
   ```

5. Start the local development server:
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000** in your browser.

---

## Limitations

- **Static Analysis Only**: Preflight does not compile TypeScript, evaluate dynamic JavaScript, or test runtime network sockets.
- **Repository Size Caps**: Inspects up to 60 targeted configuration and source entry files per repository to remain within serverless timeout limits.
- **Public Repositories**: Designed for public repositories or repositories accessible via the configured server token.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
