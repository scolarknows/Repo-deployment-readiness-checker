import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkScr002(context: ScanContext): Finding[] {
  const findings: Finding[] = [];

  for (const [root, pkg] of context.packageJsons.entries()) {
    const hasEngine = pkg.engines && pkg.engines.node;
    const hasNvmrc = context.files.has(root === "." ? ".nvmrc" : `${root}/.nvmrc`);

    if (!hasEngine && !hasNvmrc) {
      findings.push({
        ruleId: "SCR-002",
        severity: "low",
        confidence: "high",
        message: `No Node.js version declared in package.json (engines.node) or .nvmrc at '${root}'`,
        evidence: { file: `${root === "." ? "" : root + "/"}package.json` },
        fix: "Add 'engines.node' to package.json or create an .nvmrc file",
      });
    }
  }

  return findings;
}