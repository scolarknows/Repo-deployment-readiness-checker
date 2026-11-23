import { ScanContext } from "../context";
import { Finding } from "./types";
import { maskSecret } from "../mask";

export function checkSec001(context: ScanContext): Finding[] {
  const findings: Finding[] = [];

  // Patterns for secrets
  const PATTERNS = [
    { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/ },
    { name: "Stripe Live Key", regex: /sk_live_[0-9a-zA-Z]{24}/ },
    { name: "GitHub Token", regex: /ghp_[a-zA-Z0-9]{36}/ },
    { name: "Private Key", regex: /-----BEGIN (RSA|OPENSSH|EC) PRIVATE KEY-----/ },
  ];

  for (const [path, content] of context.files.entries()) {
    for (const p of PATTERNS) {
      const match = content.match(p.regex);
      if (match) {
        findings.push({
          ruleId: "SEC-001",
          severity: "critical",
          confidence: "high",
          message: `Possible hardcoded ${p.name} detected`,
          evidence: {
            file: path,
            snippet: maskSecret(match[0]),
          },
          fix: "Remove this secret from code and rotate it immediately. Use environment variables instead.",
        });
      }
    }
  }

  return findings;
}