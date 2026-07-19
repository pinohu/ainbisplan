import type { QualityFinding } from "./types.js";

export interface PerformanceBudget {
  lcpMs: number;
  inpMs: number;
  cls: number;
  totalJsKb: number;
  initialJsKb: number;
  totalCssKb: number;
  heroImageKb: number;
  totalPageWeightKb: number;
  thirdPartyJsKb: number;
}

export interface PerformanceMeasurement {
  pageId: string;
  lcpMs: number;
  inpMs: number;
  cls: number;
  totalJsKb: number;
  initialJsKb: number;
  totalCssKb: number;
  heroImageKb: number;
  totalPageWeightKb: number;
  thirdPartyJsKb: number;
  source: "lab" | "field";
  percentile?: number;
}

export const AUTHORITY_PUBLISHING_BUDGET: PerformanceBudget = {
  lcpMs: 2500,
  inpMs: 200,
  cls: 0.1,
  totalJsKb: 180,
  initialJsKb: 90,
  totalCssKb: 90,
  heroImageKb: 250,
  totalPageWeightKb: 1400,
  thirdPartyJsKb: 50
};

export const APPLICATION_BUDGET: PerformanceBudget = {
  lcpMs: 2500,
  inpMs: 200,
  cls: 0.1,
  totalJsKb: 450,
  initialJsKb: 180,
  totalCssKb: 120,
  heroImageKb: 250,
  totalPageWeightKb: 1900,
  thirdPartyJsKb: 80
};

export function auditPerformance(measurement: PerformanceMeasurement, budget: PerformanceBudget): QualityFinding[] {
  const findings: QualityFinding[] = [];
  const checks: Array<[keyof PerformanceBudget, "lower" | "higher", string]> = [
    ["lcpMs", "lower", "Largest Contentful Paint"],
    ["inpMs", "lower", "Interaction to Next Paint"],
    ["cls", "lower", "Cumulative Layout Shift"],
    ["totalJsKb", "lower", "total JavaScript"],
    ["initialJsKb", "lower", "initial JavaScript"],
    ["totalCssKb", "lower", "total CSS"],
    ["heroImageKb", "lower", "hero image"],
    ["totalPageWeightKb", "lower", "total page weight"],
    ["thirdPartyJsKb", "lower", "third-party JavaScript"]
  ];

  for (const [key, _direction, label] of checks) {
    const actual = measurement[key];
    const limit = budget[key];
    if (actual > limit) {
      const coreVital = ["lcpMs", "inpMs", "cls"].includes(key);
      findings.push({
        code: `performance.${key}`,
        severity: coreVital ? "blocker" : "error",
        message: `${label} exceeds its approved budget.`,
        evidence: [`actual=${actual}`, `budget=${limit}`, measurement.pageId, measurement.source]
      });
    }
  }

  if (measurement.source === "field" && measurement.percentile !== undefined && measurement.percentile < 75) {
    findings.push({ code: "performance.field_percentile", severity: "warning", message: "Field metric is not reported at the required 75th percentile or higher.", evidence: [String(measurement.percentile)] });
  }
  return findings;
}

export function budgetForArchetype(archetype: string): PerformanceBudget {
  return ["authority", "professional", "academic", "kids", "premium"].includes(archetype) ? AUTHORITY_PUBLISHING_BUDGET : APPLICATION_BUDGET;
}
