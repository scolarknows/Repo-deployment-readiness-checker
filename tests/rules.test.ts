import { describe, it, expect } from "vitest";
import { checkEnv001 } from "../src/lib/engine/rules/env-001";
import { checkEnv002 } from "../src/lib/engine/rules/env-002";
import { checkEnv003 } from "../src/lib/engine/rules/env-003";
import { checkSec001 } from "../src/lib/engine/rules/sec-001";
import { buildScanContext } from "../src/lib/engine/context";

describe("Rule Engine Tests", () => {
  it("ENV-001 detects undocumented env var", () => {
    const context = buildScanContext(
      [{ path: "app.js", type: "blob", mode: "100644", sha: "1", url: "" }],
      [
        { path: "app.js", content: "const key = process.env.SECRET_KEY;", size: 35 },
        { path: ".env.example", content: "PORT=3000", size: 9 },
      ],
      ["."]
    );

    const findings = checkEnv001(context);
    expect(findings.length).toBe(1);
    expect(findings[0].ruleId).toBe("ENV-001");
  });

  it("ENV-002 detects missing .env.example when env vars are used", () => {
    const context = buildScanContext(
      [{ path: "app.js", type: "blob", mode: "100644", sha: "1", url: "" }],
      [{ path: "app.js", content: "const key = process.env.KEY;", size: 27 }],
      ["."]
    );

    const findings = checkEnv002(context);
    expect(findings.length).toBe(1);
    expect(findings[0].ruleId).toBe("ENV-002");
  });

  it("ENV-003 detects committed .env file", () => {
    const context = buildScanContext(
      [{ path: ".env", type: "blob", mode: "100644", sha: "1", url: "" }],
      [{ path: ".env", content: "SECRET=123", size: 10 }],
      ["."]
    );

    const findings = checkEnv003(context);
    expect(findings.length).toBe(1);
    expect(findings[0].ruleId).toBe("ENV-003");
  });

  it("SEC-001 detects hardcoded secrets and masks them", () => {
    const context = buildScanContext(
      [{ path: "config.js", type: "blob", mode: "100644", sha: "1", url: "" }],
      [{ path: "config.js", content: "const key = 'AKIA1234567890ABCDEF';", size: 35 }],
      ["."]
    );

    const findings = checkSec001(context);
    expect(findings.length).toBe(1);
    expect(findings[0].ruleId).toBe("SEC-001");
    expect(findings[0].evidence.snippet).toBe("AKIA...[MASKED]");
  });
});