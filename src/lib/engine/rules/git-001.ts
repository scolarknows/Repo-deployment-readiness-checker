import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkGit001(context: ScanContext): Finding[] {
  const hasGitignore = context.files.has(".gitignore");

  if (!hasGitignore) {
    return [{
      ruleId: "GIT-001",
      severity: "medium",
      confidence: "high",
      message: "No .gitignore file found",
      evidence: { file: "root" },
      fix: "Create a .gitignore file to prevent committing node_modules, .env, and build output",
    }];
  }

  const content = context.files.get(".gitignore") || "";
  const missingEntries: string[] = [];

  if (!content.includes("node_modules")) missingEntries.push("node_modules");
  if (!content.includes(".env")) missingEntries.push(".env");

  if (missingEntries.length > 0) {
    return [{
      ruleId: "GIT-001",
      severity: "medium",
      confidence: "high",
      message: `.gitignore is missing recommended entries: ${missingEntries.join(", ")}`,
      evidence: { file: ".gitignore" },
      fix: `Add ${missingEntries.join(", ")} to .gitignore`,
    }];
  }

  return [];
}