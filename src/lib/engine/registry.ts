import { ScanContext } from "./context";
import { Finding } from "./rules/types";
import { checkEnv001 } from "./rules/env-001";
import { checkEnv002 } from "./rules/env-002";
import { checkEnv003 } from "./rules/env-003";
import { checkSec001 } from "./rules/sec-001";
import { checkScr001 } from "./rules/scr-001";
import { checkScr002 } from "./rules/scr-002";
import { checkDep001 } from "./rules/dep-001";
import { checkSrv001 } from "./rules/srv-001";
import { checkSrv002 } from "./rules/srv-002";
import { checkCi001 } from "./rules/ci-001";
import { checkDoc001 } from "./rules/doc-001";
import { checkGit001 } from "./rules/git-001";

export interface RuleDefinition {
  id: string;
  category: "Environment" | "Security" | "Build" | "Dependencies" | "Server" | "Repository" | "Documentation" | "Automation" | "Deployment";
  defaultSeverity: "critical" | "high" | "medium" | "low";
  title: string;
  fixGuide: string;
  check: (context: ScanContext) => Finding[];
}

export const RULE_REGISTRY: RuleDefinition[] = [
  {
    id: "ENV-001",
    category: "Environment",
    defaultSeverity: "high",
    title: "Undocumented Environment Variable",
    fixGuide: "Add the variable to .env.example with a placeholder or default value.",
    check: checkEnv001,
  },
  {
    id: "ENV-002",
    category: "Environment",
    defaultSeverity: "medium",
    title: "Missing .env.example File",
    fixGuide: "Create a .env.example file listing all environment variables required by your application.",
    check: checkEnv002,
  },
  {
    id: "ENV-003",
    category: "Environment",
    defaultSeverity: "critical",
    title: "Committed Environment File",
    fixGuide: "Remove the .env file from git using 'git rm --cached .env', commit the change, and ensure .env is in .gitignore.",
    check: checkEnv003,
  },
  {
    id: "SEC-001",
    category: "Security",
    defaultSeverity: "critical",
    title: "Hardcoded Secret",
    fixGuide: "Replace hardcoded API keys, private keys, or tokens with environment variable references.",
    check: checkSec001,
  },
  {
    id: "SCR-001",
    category: "Build",
    defaultSeverity: "high",
    title: "Missing Build/Start Script",
    fixGuide: "Add 'build' or 'start' scripts to your package.json appropriate for your framework.",
    check: checkScr001,
  },
  {
    id: "SCR-002",
    category: "Build",
    defaultSeverity: "low",
    title: "Undeclared Node Version",
    fixGuide: "Add 'engines': { 'node': '>=18' } to package.json or create an .nvmrc file.",
    check: checkScr002,
  },
  {
    id: "DEP-001",
    category: "Dependencies",
    defaultSeverity: "medium",
    title: "Missing Lockfile",
    fixGuide: "Run your package manager install command to generate and commit a lockfile.",
    check: checkDep001,
  },
  {
    id: "SRV-001",
    category: "Server",
    defaultSeverity: "high",
    title: "Hardcoded Server Port",
    fixGuide: "Bind to process.env.PORT || fallbackPort so hosting providers can set the port dynamically.",
    check: checkSrv001,
  },
  {
    id: "SRV-002",
    category: "Server",
    defaultSeverity: "medium",
    title: "Permissive CORS",
    fixGuide: "Restrict allowed CORS origins to specific trusted domains instead of using wildcard '*'.",
    check: checkSrv002,
  },
  {
    id: "GIT-001",
    category: "Repository",
    defaultSeverity: "medium",
    title: "Missing or Incomplete .gitignore",
    fixGuide: "Create or update .gitignore to exclude node_modules, .env files, and build output directories.",
    check: checkGit001,
  },
  {
    id: "CI-001",
    category: "Automation",
    defaultSeverity: "low",
    title: "Missing CI/CD Workflow",
    fixGuide: "Create a CI/CD workflow file under .github/workflows.",
    check: checkCi001,
  },
  {
    id: "DOC-001",
    category: "Documentation",
    defaultSeverity: "medium",
    title: "Missing README Setup Instructions",
    fixGuide: "Add an Installation or Getting Started section to README.md detailing how to run the project.",
    check: checkDoc001,
  },
];

export function runAllRules(context: ScanContext): {
  findings: Finding[];
  passedRules: string[];
} {
  const findings: Finding[] = [];
  const passedRules: string[] = [];

  for (const rule of RULE_REGISTRY) {
    const ruleFindings = rule.check(context);
    if (ruleFindings.length > 0) {
      findings.push(...ruleFindings);
    } else {
      passedRules.push(rule.id);
    }
  }

  return { findings, passedRules };
}