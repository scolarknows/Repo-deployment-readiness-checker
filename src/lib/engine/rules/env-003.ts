import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkEnv003(context: ScanContext): Finding[] {
  const findings: Finding[] = [];
  const ENV_FILES = [".env", ".env.local", ".env.development", ".env.production"];

  for (const path of context.files.keys()) {
    const filename = path.split("/").pop() || "";
    if (ENV_FILES.includes(filename)) {
      findings.push({
        ruleId: "ENV-003",
        severity: "critical",
        confidence: "high",
        message: `Committed environment file detected: '${path}'`,
        evidence: { file: path },
        fix: "Remove this file from git history and add it to .gitignore",
      });
    }
  }

  return findings;
}