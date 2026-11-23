import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkDep001(context: ScanContext): Finding[] {
  const LOCKFILES = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"];
  const hasLockfile = LOCKFILES.some((f) => context.files.has(f));

  if (!hasLockfile) {
    return [{
      ruleId: "DEP-001",
      severity: "medium",
      confidence: "high",
      message: "No lockfile detected (package-lock.json, yarn.lock, or pnpm-lock.yaml)",
      evidence: { file: "root" },
      fix: "Generate and commit a lockfile to ensure reproducible builds",
    }];
  }

  return [];
}