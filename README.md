# Preflight

**Find what breaks your deploy before your deploy does.**

Preflight is an automated deployment readiness checker for modern web applications. By analyzing your public GitHub repository using static heuristics, Preflight spots missing environment variables, build misconfigurations, leaked API secrets, and server port issues—giving you a clean readiness scorecard before your code hits production.

---

## ⚡ At a Glance

- **Fast & Isolated**: Scans complete in seconds using read-only GitHub REST queries. Code is **never executed, built, or cloned**.
- **12 Deployment Health Checks**: Evaluates your project across environment settings, build scripts, package locks, CORS policies, and server bindings.
- **Clear 0–100 Scoring**: Transparent scoring model with letter grades (`Ready`, `Minor issues`, `Needs work`, `Not ready`) and actionable fix guides.
- **Zero-Leak Secret Masking**: Detected credentials (AWS keys, Stripe keys, tokens) are immediately obfuscated before leaving the engine.
- **Monorepo Aware**: Automatically discovers nested project workspaces and evaluates each sub-application root.

---

## 🚀 How It Works

```
1. Paste Repository URL
         │
         ▼
2. Read-Only GitHub Tree Inspection
   (Inspects package.json, configs, manifests & env templates)
         │
         ▼
3. Deterministic Heuristic Analysis
   (Runs 12 static rules in parallel — 0% code execution)
         │
         ▼
4. Scorecard & Actionable Fix Guide
   (0–100 Score, Severity Badges, Masked Snippets & Database Record)
```

---

## 🔍 The 12 Readiness Checks

| Rule ID | Category | Default Severity | What It Checks |
|---|---|---|---|
| **ENV-001** | Environment | High | Checks if `process.env.X` or `import.meta.env.X` variables in code are missing from `.env.example`. |
| **ENV-002** | Environment | Medium | Ensures projects reading environment variables commit a `.env.example` template for deployers. |
| **ENV-003** | Environment | Critical | Alerts if real `.env` or secret files are accidentally tracked in Git. |
| **SEC-001** | Security | Critical | Scans for hardcoded AWS keys, Stripe live keys, GitHub tokens, or private certificates (safely masked). |
| **SCR-001** | Build | High | Verifies that frontend apps have a `build` script and servers have a `start` script in `package.json`. |
| **SCR-002** | Build | Low | Checks if a target Node.js runtime version is pinned in `engines.node` or `.nvmrc`. |
| **DEP-001** | Dependencies | Medium | Confirms a package lockfile (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) is committed. |
| **SRV-001** | Server | High | Flags servers that listen on fixed ports without falling back to `process.env.PORT`. |
| **SRV-002** | Server | Medium | Identifies open CORS configurations (`*`) or unhandled cross-origin policies. |
| **GIT-001** | Repository | Medium | Ensures `.gitignore` exists and excludes sensitive directories (`node_modules`, `.env`). |
| **DOC-001** | Documentation | Medium | Checks that a `README.md` is present with installation or run instructions. |
| **CI-001** | Automation | Low | Detects whether continuous integration workflows exist under `.github/workflows`. |

---

## 📊 Scoring & Grade Bands

Every repository starts with a baseline score of **100 points**. Penalties are deducted based on finding severity:

- **Critical**: `-20 points`
- **High**: `-10 points`
- **Medium**: `-5 points`
- **Low**: `-2 points`

> **Fair Scoring**: Deductions for any single rule are capped at twice its severity weight. This ensures one noisy rule cannot disproportionately zero out an otherwise healthy project.

### Grade Categories

| Score Range | Status | Meaning |
|---|---|---|
| **90 – 100** | 🟢 **Ready** | Clean configuration. Ready for production deployment. |
| **70 – 89** | 🟡 **Minor issues** | Safe to deploy, but recommended improvements should be addressed. |
| **40 – 69** | 🟠 **Needs work** | Configuration or environment risks detected that could break builds. |
| **Below 40** | 🔴 **Not ready** | Critical deployment blockers found (missing build script, leaked secrets, etc.). |

---

## 🧪 Accuracy & Benchmark Summary

Preflight has been validated across 20 popular production and tutorial repositories (including React, Express.js, Tailwind CSS, and Shadcn UI):

- **Median Scan Time**: **4.8 seconds** (engineered to remain well under the 10-second serverless execution ceiling).
- **False-Positive Filtering**: Excludes test suites, mock files, and standard runtime constants (`NODE_ENV`, `PORT`) to deliver **< 5% false positive rate** on production code.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with dark design system tokens
- **Database & Auth**: [Supabase](https://supabase.com/) with Row Level Security (RLS)
- **Visuals**: Native HTML5 Canvas 2D (capped at 30 FPS with visibility pausing and reduced-motion support)
- **Unit Testing**: [Vitest](https://vitest.dev/)

---

## 💻 Local Setup & Development

### 1. Clone & Install

```bash
git clone https://github.com/scolarknows/Repo-deployment-readiness-checker.git
cd Repo-deployment-readiness-checker/preflight
npm install
```

### 2. Configure Environment

Create your `.env.local` file:

```bash
cp .env.example .env.local
```

Provide the following credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GITHUB_TOKEN=your-personal-access-token   # Recommended to avoid GitHub API rate limits
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Tests & Dev Server

```bash
# Run unit tests
npm test

# Start development server
npm run dev
```

Visit **http://localhost:3000** to preview the app.

---

## 📌 Practical Limits

- **Static Inspection Only**: Analyzes codebase structure and configuration files; does not execute code, build bundles, or test network connections.
- **Repository Scope**: Scans public GitHub repositories (or private ones accessible via your configured server token), inspecting up to 60 targeted manifest and entry files per repository.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
