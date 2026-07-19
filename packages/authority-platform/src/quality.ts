import type { BusinessPlan, QualityFinding } from "./types.js";

const meaningful = (value: unknown): boolean => {
  if (typeof value === "string") return value.trim().length >= 20;
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return false;
};

const decisionApproved = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;
  const record = value as { status?: string; text?: string };
  return record.status === "approved" && meaningful(record.text);
};

export function evaluatePlanReadiness(plan: BusinessPlan): QualityFinding[] {
  const findings: QualityFinding[] = [];
  const add = (code: string, severity: QualityFinding["severity"], message: string, evidence: string[] = []): void => {
    findings.push({ code, severity, message, evidence });
  };

  if (!plan.business.blueprint_sha256) add("identity.blueprint_hash", "blocker", "Blueprint provenance hash is missing.");
  if (!decisionApproved(plan.strategy.independent_purpose)) add("strategy.independent_purpose", "blocker", "Independent purpose has not been approved.");
  if (!decisionApproved(plan.strategy.differentiation)) add("strategy.differentiation", "blocker", "Portfolio differentiation has not been approved.");
  if (!decisionApproved(plan.authority.thesis)) add("authority.thesis", "blocker", "Authority thesis has not been approved.");
  if (!meaningful(plan.search.topic_boundary)) add("search.topic_boundary", "blocker", "Topic boundary is not defined.");
  if ((plan.search.intent_clusters ?? []).length === 0) add("search.intent_clusters", "error", "No search-intent clusters are defined.");
  if ((plan.search.entities ?? []).length === 0) add("search.entities", "warning", "No entity model is defined.");
  if ((plan.site_architecture.pages ?? []).length === 0) add("architecture.pages", "blocker", "No page architecture is defined.");
  if ((plan.content.launch_portfolio ?? []).length === 0) add("content.launch_portfolio", "blocker", "Launch content portfolio is empty.");
  if (!plan.utilities.some((utility) => ["specified", "review", "approved", "implemented", "published"].includes(utility.status))) {
    add("utility.original_value", "blocker", "No original utility has reached specification.");
  }
  if (plan.classification.review_intensity !== "standard" && !plan.provenance.human_review.some((entry) => /domain|legal|clinical|financial|safety|privacy/i.test(entry))) {
    add("review.domain", "blocker", "Required qualified domain review is not recorded.");
  }
  if (plan.accessibility.status !== "passed") add("accessibility.status", "blocker", "Accessibility requirements have not passed.");
  if (plan.performance.status !== "passed") add("performance.status", "blocker", "Performance requirements have not passed.");
  if (plan.privacy_security.status !== "passed") add("privacy_security.status", "blocker", "Privacy and security requirements have not passed.");
  if (plan.analytics.status !== "passed") add("analytics.status", "error", "Analytics and consent requirements have not passed.");
  if (plan.offsite_authority.status === "not_started") add("authority.offsite", "warning", "Off-site authority operations have not started.");

  const blockingGates = plan.gates.filter((gate) => gate.blocking && gate.status !== "passed" && gate.status !== "not_applicable");
  if (blockingGates.length > 0) add("gates.blocking", "blocker", `${blockingGates.length} mandatory gates remain unresolved.`, blockingGates.map((gate) => gate.id));

  if (plan.state.indexability === "indexable" && findings.some((finding) => finding.severity === "blocker")) {
    add("indexability.invalid", "blocker", "Plan is marked indexable while mandatory blockers remain.");
  }
  return findings;
}

function terms(value: string): Set<string> {
  return new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 3 && !["engine", "desk", "clear", "compliance", "service"].includes(token)));
}

export function similarity(left: BusinessPlan, right: BusinessPlan): number {
  const a = terms(`${left.business.slug} ${left.business.title}`);
  const b = terms(`${right.business.slug} ${right.business.title}`);
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / union.size;
}

export function detectPortfolioCollisions(plans: BusinessPlan[], threshold = 0.48): Array<{ left: string; right: string; score: number }> {
  const collisions: Array<{ left: string; right: string; score: number }> = [];
  for (let index = 0; index < plans.length; index += 1) {
    for (let compare = index + 1; compare < plans.length; compare += 1) {
      const left = plans[index];
      const right = plans[compare];
      if (!left || !right) continue;
      const score = similarity(left, right);
      if (score >= threshold) collisions.push({ left: left.business.slug, right: right.business.slug, score: Number(score.toFixed(3)) });
    }
  }
  return collisions.sort((a, b) => b.score - a.score);
}

export function canBecomeIndexable(plan: BusinessPlan): boolean {
  return evaluatePlanReadiness(plan).every((finding) => finding.severity !== "blocker");
}
