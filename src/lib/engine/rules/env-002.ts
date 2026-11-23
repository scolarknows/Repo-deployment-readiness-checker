import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkEnv002(context: ScanContext): Finding[] {
  const hasEnvExample = context.files.has(".env.example");

  if (hasEnvExample) return [];

  // Check if any source file uses process.env or import.meta.env
  let usesEnv = false;
  for (const content of context.files.values()) {
    if (content.includes("process.env") || content.includes("import.meta.env")) {
      usesEnv = true;
      break;
    }
  }

  if (usesEnv) {
    return [{
      ruleId: "ENV-002",
      severity: "medium",
      confidence: "high",
      message: "No .env.example file found, but project appears to read environment variables",
      evidence: { file: "root" },
      fix: "Create an .env.example file to document required environment variables",
    }];
  }

  return [];
}