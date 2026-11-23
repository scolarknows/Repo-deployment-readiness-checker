export type Severity = "critical" | "high" | "medium" | "low";
export type Confidence = "high" | "medium";

export interface Finding {
  ruleId: string;
  severity: Severity;
  confidence: Confidence;
  message: string;
  evidence: {
    file: string;
    line?: number;
    snippet?: string;
  };
  fix: string;
}