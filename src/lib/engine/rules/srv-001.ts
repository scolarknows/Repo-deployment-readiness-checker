import { ScanContext } from "../context";
import { Finding } from "./types";

export function checkSrv001(context: ScanContext): Finding[] {
  const findings: Finding[] = [];

  for (const [path, content] of context.files.entries()) {
    if (path.endsWith(".json")) continue;
    const lowerPath = path.toLowerCase();
    // Exclude test specs, examples, and benchmarks from server port warnings
    if (
      lowerPath.includes("test") ||
      lowerPath.includes("spec") ||
      lowerPath.includes("examples") ||
      lowerPath.includes("benchmark")
    ) {
      continue;
    }

    // Look for app.listen(3000) or server.listen(8080) hardcoded
    const listenMatch = content.match(/\.(listen|serve)\s*\(\s*(\d{4,5})/);
    if (listenMatch) {
      const port = listenMatch[2];
      const readsPort = content.includes("process.env.PORT");

      if (!readsPort) {
        findings.push({
          ruleId: "SRV-001",
          severity: "high",
          confidence: "high",
          message: `Server binds hardcoded port ${port} and does not read process.env.PORT`,
          evidence: { file: path },
          fix: "Use process.env.PORT || " + port + " so deployment platforms can specify the port",
        });
      }
    }
  }

  return findings;
}
