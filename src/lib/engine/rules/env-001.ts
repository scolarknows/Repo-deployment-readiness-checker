import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkEnv001(context: ScanContext): Finding[] {
  const findings: Finding[] = [];
  const envExampleContent = context.files.get(".env.example") || "";

  // Extract env variables from .env.example (simple heuristic)
  const definedVars = new Set<string>();
  for (const line of envExampleContent.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_]+)=/);
    if (match) definedVars.add(match[1]);
  }

  // Common built-in environment variables to ignore
  const BUILTIN_ENV = new Set([
    "NODE_ENV",
    "PORT",
    "PWD",
    "HOME",
    "CI",
    "PATH",
    "DEBUG",
    "TZ"
  ]);

  // Track reported (varName, file) pairs to prevent duplicate findings
  const reported = new Set<string>();

  for (const [path, content] of context.files.entries()) {
    if (path.endsWith(".json")) continue;
    const lowerPath = path.toLowerCase();
    // Skip test fixtures and test specs
    if (lowerPath.includes("test") || lowerPath.includes("spec")) continue;

    const matches = content.matchAll(/(?:process\.env|import\.meta\.env)\.([A-Za-z0-9_]+)/g);
    for (const match of matches) {
      const varName = match[1];
      if (varName === "X") continue; // Skip generic template placeholders
      if (BUILTIN_ENV.has(varName)) continue;

      const key = `${varName}:${path}`;
      if (!definedVars.has(varName) && !reported.has(key)) {
        reported.add(key);
        findings.push({
          ruleId: "ENV-001",
          severity: "high",
          confidence: "high",
          message: `Environment variable '${varName}' used but not found in .env.example`,
          evidence: { file: path },
          fix: "Add the missing variable to .env.example",
        });
      }
    }
  }

  return findings;
}
