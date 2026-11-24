# Design Plan: Preflight Landing & Experience (Phase 5)

## 1. Principles
- **Clarity over ornament**: No generic AI template tropes (no fake numbers, no tracked-out uppercase eyebrow above every heading, no arrow glyphs on every button, no emojis).
- **Faithful to PRD**: Strict palette adhering to `#1B365D` (navy), `#005A9C` (blue), `#60C1E5` (sky), `#A0E0EF` (ice), and dark page background `#08111F`.
- **True data**: Rule category counts generated directly from the actual `RULE_REGISTRY`.
- **Typography hierarchy**: H1 at weight 900, subheads/body at weight 200 (>=18px) or weight 500 (<18px), buttons/badges/labels at weight 500.

## 2. Palette & Design Tokens
- `--bg`: `#08111F` (Deep near-navy)
- `--surface`: `#13253F` (Elevated dark card surface)
- `--primary`: `#1B365D` (Navy foundation)
- `--secondary`: `#005A9C` (Solid accent blue for interactive buttons)
- `--accent`: `#60C1E5` (Sky blue for links and active states)
- `--accent-light`: `#A0E0EF` (Ice blue for highlights and badges)
- `--border`: `#233854` (Subtle boundary border)
- `--fg`: `#F5F5F5` (Near-white foreground)
- `--muted`: `#8E9CAE` (Secondary label text)

## 3. Homepage Layout Wireframe (PRD 8.4)

```
+----------------------------------------------------------------------------+
| [Preflight]         Checks   How It Works   Sample Report   [Dashboard]    |  <-- Compact on scroll
+----------------------------------------------------------------------------+
|                                                                            |
|   Find what breaks your deploy                                             |
|   before your deploy does.                                                 |
|                                                                            |
|   Static deployment readiness heuristics for frontend repositories.        |
|                                                                            |
|   [ Enter GitHub repo URL or email... ]  [ Scan Repository ]               |
|                                                                            |
|   +--------------------------------------------------------------------+   |
|   | Mock Scan Preview: github.com/acme/web-app                         |   |
|   | Branch: main   |   Grade: Needs work (65/100)                      |   |
|   | [CRITICAL] SEC-001 Hardcoded Stripe Key found in src/lib/api.ts    |   |
|   | [HIGH]     ENV-001 VITE_API_URL missing from .env.example          |   |
|   +--------------------------------------------------------------------+   |
|                                                                            |
+----------------------------------------------------------------------------+
| 3. WHAT IT CHECKS (Derived from RULE_REGISTRY)                            |
| +-----------------+ +-----------------+ +-----------------+ +------------+ |
| | Environment (3) | | Security (1)    | | Build (2)       | | Server (2) | |
| +-----------------+ +-----------------+ +-----------------+ +------------+ |
+----------------------------------------------------------------------------+
| 4. HOW IT WORKS (Three genuine steps)                                      |
|  1. Inspect repository tree & files via GitHub API (read-only, no exec)   |
|  2. Pure static heuristics scan configuration, scripts, secrets & env      |
|  3. Actionable fix guide with exact files, line hints, and readiness score |
+----------------------------------------------------------------------------+
| 5. SAMPLE REPORT CARD                                                      |
|   Full interactive card showing realistic findings & passed check badges   |
+----------------------------------------------------------------------------+
| 6. HONEST LIMITS                                                           |
|   What Preflight does not do: No runtime execution, static analysis only,  |
|   public repos by default, heuristics may have false positives.            |
+----------------------------------------------------------------------------+
| 7. FAQ (Accordion)                                                         |
|   - How does scoring work?                                                 |
|   - Does Preflight run or build my code?                                   |
|   - What rate limits apply?                                                |
+----------------------------------------------------------------------------+
| 8. FOOTER                                                                  |
+----------------------------------------------------------------------------+
```
