import { describe, it, expect } from "vitest";
import { computeScore } from "../src/lib/engine/score";
import { Finding } from "../src/lib/engine/rules/types";

describe("computeScore", () => {
  it("returns 100 for no findings", () => {
    const result = computeScore([]);
    expect(result.score).toBe(100);
    expect(result.grade).toBe("Ready");
  });

  it("subtracts correctly for findings", () => {
    const findings: Finding[] = [
      {
        ruleId: "ENV-001",
        severity: "high",
        confidence: "high",
        message: "Missing var",
        evidence: { file: ".env.example" },
        fix: "Fix it",
      },
    ];
    const result = computeScore(findings);
    expect(result.score).toBe(90); // 100 - 10
    expect(result.grade).toBe("Ready");
  });

  it("caps deduction per rule ID at twice its severity weight", () => {
    // 10 critical findings for the SAME rule ID cap at 20 * 2 = 40 total deduction
    const findings: Finding[] = Array(10).fill({
      ruleId: "SEC-001",
      severity: "critical",
      confidence: "high",
      message: "Secret",
      evidence: { file: "index.js" },
      fix: "Fix it",
    });
    const result = computeScore(findings);
    expect(result.score).toBe(60); // 100 - 40
    expect(result.grade).toBe("Needs work");
  });

  it("floors score at 0 with multiple distinct critical rules", () => {
    // 3 distinct critical rules capped at 40 each = 120 deduction -> floors at 0
    const findings: Finding[] = [
      { ruleId: "SEC-001", severity: "critical", confidence: "high", message: "m", evidence: { file: "f" }, fix: "x" },
      { ruleId: "SEC-001", severity: "critical", confidence: "high", message: "m", evidence: { file: "f" }, fix: "x" },
      { ruleId: "ENV-003", severity: "critical", confidence: "high", message: "m", evidence: { file: "f" }, fix: "x" },
      { ruleId: "ENV-003", severity: "critical", confidence: "high", message: "m", evidence: { file: "f" }, fix: "x" },
      { ruleId: "SEC-002", severity: "critical", confidence: "high", message: "m", evidence: { file: "f" }, fix: "x" },
      { ruleId: "SEC-002", severity: "critical", confidence: "high", message: "m", evidence: { file: "f" }, fix: "x" },
    ];
    const result = computeScore(findings);
    expect(result.score).toBe(0);
    expect(result.grade).toBe("Not ready");
  });
});