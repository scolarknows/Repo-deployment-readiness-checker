import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkCi001(context: ScanContext): Finding[] {
  const findings: Finding[] = [];

  let hasWorkflow = false;

  for (const [path, content] of context.files.entries()) {
    if (path.toLowerCase().includes(".github/workflows")) {
      hasWorkflow = true;
      break;
    }
  }

  if (!hasWorkflow) {
    findings.push({
      ruleId: "CI-001",
      severity: "low",
      confidence: "high",
      message: "No CI/CD workflow file found under .github/workflows",
      evidence: { file: ".github/workflows" },
      fix: "Create a CI/CD workflow file (e.g., GitHub Actions) for your project.",
    });
  }

  return findings;
}