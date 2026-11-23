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

  // Search source files for process.env.X or import.meta.env.X
  for (const [path, content] of context.files.entries()) {
    if (path.endsWith(".json")) continue;

    const matches = content.matchAll(/(?:process\.env|import\.meta\.env)\.([A-Za-z0-9_]+)/g);
    for (const match of matches) {
      const varName = match[1];
      if (!definedVars.has(varName)) {
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