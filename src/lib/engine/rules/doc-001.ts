import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkDoc001(context: ScanContext): Finding[] {
  const findings: Finding[] = [];

  let readmePath: string | null = null;
  let readmeContent: string | null = null;

  for (const [path, content] of context.files.entries()) {
    if (path.toLowerCase() === "readme.md") {
      readmePath = path;
      readmeContent = content;
      break;
    }
  }

  if (!readmePath || !readmeContent) {
    findings.push({
      ruleId: "DOC-001",
      severity: "medium",
      confidence: "high",
      message: "Missing README.md documentation file",
      evidence: { file: "README.md" },
      fix: "Create a README.md file explaining your project, installation, and usage instructions.",
    });
    return findings;
  }

  // Check if README contains installation / setup instructions
  const setupKeywords = ["install", "getting started", "usage", "run", "setup", "pnpm", "npm", "yarn"];
  const lowerReadme = readmeContent.toLowerCase();
  const hasSetupSection = setupKeywords.some((keyword) => lowerReadme.includes(keyword));

  if (!hasSetupSection) {
    findings.push({
      ruleId: "DOC-001",
      severity: "medium",
      confidence: "medium",
      message: "README.md lacks installation or getting-started instructions",
      evidence: { file: readmePath },
      fix: "Add an Installation or Getting Started section to README.md detailing how to run the project.",
    });
  }

  return findings;
}
