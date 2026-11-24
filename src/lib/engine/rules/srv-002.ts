import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkSrv002(context: ScanContext): Finding[] {
  const findings: Finding[] = [];

  for (const [path, content] of context.files.entries()) {
    if (path.endsWith(".json") || path.endsWith(".md")) continue;

    // Check for origin: '*' or cors() without options
    const wildcardOriginMatch = content.match(/origin\s*:\s*["'\`]\*["'\`]/);
    const emptyCorsMatch = content.match(/app\.use\(\s*cors\(\s*\)\s*\)/);

    if (wildcardOriginMatch || emptyCorsMatch) {
      findings.push({
        ruleId: "SRV-002",
        severity: "medium",
        confidence: "medium",
        message: "Permissive CORS configuration detected (wildcard origin or unconfigured cors middleware)",
        evidence: {
          file: path,
          snippet: wildcardOriginMatch ? wildcardOriginMatch[0] : emptyCorsMatch ? emptyCorsMatch[0] : undefined,
        },
        fix: "Restrict allowed CORS origins to specific trusted domains instead of using wildcard '*'.",
      });
    }
  }

  return findings;
}
