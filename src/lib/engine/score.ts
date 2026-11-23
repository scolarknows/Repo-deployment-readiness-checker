/**
 * Scoring model for Preflight (PRD 6.4)
 * - Start at 100. Subtract per finding: Critical 20, High 10, Medium 5, Low 2. Floor at 0.
 * - Cap deduction per rule ID at twice its severity weight.
 */

import { Finding } from "./rules/types";

const SEVERITY_WEIGHTS: Record<string, number> = {
  critical: 20,
  high: 10,
  medium: 5,
  low: 2,
};

export interface ScoreResult {
  score: number;
  grade: string;
}

export function computeScore(findings: Finding[]): ScoreResult {
  // Count findings per rule ID and severity
  const ruleCounts = new Map<string, { severity: string; count: number }>();

  for (const f of findings) {
    const existing = ruleCounts.get(f.ruleId) || { severity: f.severity, count: 0 };
    existing.count++;
    ruleCounts.set(f.ruleId, existing);
  }

  let totalDeduction = 0;

  for (const [ruleId, data] of ruleCounts.entries()) {
    const weight = SEVERITY_WEIGHTS[data.severity] || 2;
    const maxDeduction = weight * 2; // Cap per rule ID at twice its severity weight
    const deduction = Math.min(weight * data.count, maxDeduction);
    totalDeduction += deduction;
  }

  const score = Math.max(0, 100 - totalDeduction);
  let grade = "Not ready";

  if (score >= 90) {
    grade = "Ready";
  } else if (score >= 70) {
    grade = "Minor issues";
  } else if (score >= 40) {
    grade = "Needs work";
  } else {
    grade = "Not ready";
  }

  return { score, grade };
}