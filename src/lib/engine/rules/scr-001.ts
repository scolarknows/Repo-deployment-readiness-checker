import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkScr001(context: ScanContext): Finding[] {
  const findings: Finding[] = [];

  for (const [root, pkg] of context.packageJsons.entries()) {
    const scripts = pkg.scripts || {};
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

    // Check build script
    if (dependencies.react || dependencies.vue || dependencies.next || dependencies.angular) {
      if (!scripts.build) {
        findings.push({
          ruleId: "SCR-001",
          severity: "high",
          confidence: "high",
          message: `Missing 'build' script in package.json at '${root}'`,
          evidence: { file: `${root === "." ? "" : root + "/"}package.json` },
          fix: "Add a 'build' script to package.json",
        });
      }
    }

    // Check start script if express or node server detected
    if (dependencies.express || dependencies.fastify || dependencies.koa) {
      if (!scripts.start) {
        findings.push({
          ruleId: "SCR-001",
          severity: "high",
          confidence: "high",
          message: `Missing 'start' script in package.json at '${root}'`,
          evidence: { file: `${root === "." ? "" : root + "/"}package.json` },
          fix: "Add a 'start' script to package.json",
        });
      }
    }
  }

  return findings;
}