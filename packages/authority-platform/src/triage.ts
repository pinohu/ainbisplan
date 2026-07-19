import type { BusinessPlan, Priority, PriorityAssessment, ReferenceSelection } from "./types.js";

const textOf = (plan: BusinessPlan): string => `${plan.business.slug} ${plan.business.title}`.toLowerCase();

export function inferCohort(plan: BusinessPlan): string {
  const sensitivities = new Set(plan.classification.sensitivity);
  const text = textOf(plan);
  if (sensitivities.has("clinical") || /health|medical|patient|medicare|medicaid|340b|pharmacy|reimbursement/.test(text)) return "healthcare-compliance-and-reimbursement";
  if (sensitivities.has("employment") || /employee|labor|wage|payroll|benefit|workers-comp|ada|pwfa/.test(text)) return "employment-and-benefits";
  if (sensitivities.has("environmental") || sensitivities.has("safety") || /epa|osha|emission|asbestos|refrigerant|hazard|fire|waste|water/.test(text)) return "environmental-and-safety";
  if (sensitivities.has("financial") || /tax|bank|loan|mortgage|audit|account|billing|bond|insurance|revenue/.test(text)) return "financial-tax-audit-and-reporting";
  if (sensitivities.has("government") || /federal|government|fema|grant|procurement|contractor/.test(text)) return "government-contracting-and-grants";
  if (sensitivities.has("housing") || /property|real-estate|tenant|landlord|construction|facility|appraisal/.test(text)) return "real-estate-housing-construction-and-facilities";
  if (/transport|logistics|fleet|shipping|import|export|customs|trade|carrier/.test(text)) return "transportation-logistics-trade-and-import-export";
  if (/insurance|claim|recovery|commission|chargeback|denial/.test(text)) return "insurance-claims-and-revenue-recovery";
  if (sensitivities.has("privacy") || /cyber|privacy|security|data|identity|ai-|algorithm|communications|a2p/.test(text)) return "privacy-cybersecurity-ai-data-and-communications";
  if (/amazon|seller|marketplace|vendor|platform|merchant/.test(text)) return "marketplaces-seller-platforms-and-vendor-disputes";
  return "professional-documentation-and-evidence-workflows";
}

export function assessPriority(plan: BusinessPlan): PriorityAssessment {
  let score = 0;
  const reasons: string[] = [];
  if (plan.business.launched) { score += 30; reasons.push("Existing launched property requires preservation-first audit."); }
  else if (plan.business.developed) { score += 18; reasons.push("Developed asset should be reviewed before further investment."); }
  if (plan.classification.ymyl_level === "high") { score += 22; reasons.push("High-YMYL consequences require early governance."); }
  else if (plan.classification.ymyl_level === "moderate") { score += 10; reasons.push("Moderate-YMYL review burden."); }
  if (["qualified_domain_review", "multi_disciplinary_review"].includes(plan.classification.review_intensity)) { score += 15; reasons.push("Qualified reviewer assignment is required."); }
  else if (plan.classification.review_intensity === "enhanced") { score += 7; reasons.push("Enhanced review is required."); }
  score += Math.min(10, Math.max(0, plan.classification.sensitivity.filter((item) => item !== "none").length * 2));
  if (plan.utilities.length > 0) { score += 5; reasons.push("Original utility opportunity is already represented in the scaffold."); }
  if (["saas", "professional", "directory", "clinical", "authority"].includes(plan.classification.primary_archetype)) score += 4;

  const priority: Priority = score >= 60 ? "critical" : score >= 42 ? "high" : score >= 25 ? "medium" : "low";
  return {
    slug: plan.business.slug,
    score,
    priority,
    cohort: inferCohort(plan),
    reasons,
    reviewerRequired: plan.classification.review_intensity !== "standard",
    launchedAuditRequired: plan.business.launched
  };
}

function pick(plans: BusinessPlan[], predicate: (plan: BusinessPlan) => boolean, excluded: Set<string>): BusinessPlan | undefined {
  return plans
    .filter((plan) => predicate(plan) && !excluded.has(plan.business.slug))
    .sort((left, right) => assessPriority(right).score - assessPriority(left).score || left.business.slug.localeCompare(right.business.slug))[0];
}

export function selectReferenceBusinesses(plans: BusinessPlan[]): ReferenceSelection[] {
  const selected = new Set<string>();
  const definitions: Array<{ category: ReferenceSelection["category"]; predicate: (plan: BusinessPlan) => boolean; rationale: string }> = [
    { category: "launched_regulated", predicate: (plan) => plan.business.launched && plan.classification.sensitivity.some((item) => item !== "none"), rationale: "Proves preservation-first migration for an existing regulated site." },
    { category: "high_risk", predicate: (plan) => !plan.business.launched && plan.classification.ymyl_level === "high", rationale: "Proves qualified review and high-consequence content controls." },
    { category: "professional_service", predicate: (plan) => plan.classification.primary_archetype === "professional" || plan.classification.business_model.includes("professional_service"), rationale: "Proves trust, scope, pricing posture, intake, and service conversion." },
    { category: "saas_workflow", predicate: (plan) => plan.classification.primary_archetype === "saas" || plan.classification.business_model.some((item) => ["software", "workflow", "document_generation"].includes(item)), rationale: "Proves guided workflow, progress, output, review, and auditability." },
    { category: "local_jurisdiction", predicate: (plan) => ["local", "regional", "state_province", "service_area", "multi_location"].includes(plan.classification.geographic_model), rationale: "Proves jurisdiction and location architecture without doorway pages." },
    { category: "tool_intensive", predicate: (plan) => plan.utilities.some((utility) => ["calculator", "assessment", "quiz", "tracker", "decision_tree", "dataset", "map"].includes(utility.type)), rationale: "Proves original utility, source basis, risk review, and measurable engagement." }
  ];

  const results: ReferenceSelection[] = [];
  for (const definition of definitions) {
    const candidate = pick(plans, definition.predicate, selected) ?? pick(plans, () => true, selected);
    if (!candidate) continue;
    selected.add(candidate.business.slug);
    results.push({ category: definition.category, slug: candidate.business.slug, title: candidate.business.title, rationale: [definition.rationale, ...assessPriority(candidate).reasons] });
  }
  return results;
}

export function cohortSummary(assessments: PriorityAssessment[]): Record<string, { total: number; critical: number; high: number; medium: number; low: number; reviewer_required: number; launched: number }> {
  const result: Record<string, { total: number; critical: number; high: number; medium: number; low: number; reviewer_required: number; launched: number }> = {};
  for (const item of assessments) {
    const row = result[item.cohort] ?? { total: 0, critical: 0, high: 0, medium: 0, low: 0, reviewer_required: 0, launched: 0 };
    row.total += 1;
    switch (item.priority) {
      case "critical": row.critical += 1; break;
      case "high": row.high += 1; break;
      case "medium": row.medium += 1; break;
      case "low": row.low += 1; break;
      case "unscored": break;
    }
    if (item.reviewerRequired) row.reviewer_required += 1;
    if (item.launchedAuditRequired) row.launched += 1;
    result[item.cohort] = row;
  }
  return result;
}
