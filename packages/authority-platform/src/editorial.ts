import type { QualityFinding } from "./types.js";

export type ReviewRole = "author" | "source_reviewer" | "domain_reviewer" | "editor" | "legal_privacy" | "approver";
export type ReviewDecision = "pending" | "approved" | "changes_requested" | "rejected" | "not_applicable";

export interface ReviewerAssignment {
  role: ReviewRole;
  name: string | null;
  credential?: string | null;
  decision: ReviewDecision;
  decidedAt?: string | null;
  notes?: string;
}

export interface EditorialReviewRecord {
  itemId: string;
  consequential: boolean;
  ymylLevel: "none" | "moderate" | "high";
  sensitivity: string[];
  assignments: ReviewerAssignment[];
  conflicts: string[];
  aiAssistanceDisclosed: boolean;
  sourceManifestComplete: boolean;
  correctionRouteActive: boolean;
}

export function requiredReviewRoles(record: EditorialReviewRecord): ReviewRole[] {
  const required = new Set<ReviewRole>(["author", "source_reviewer", "editor", "approver"]);
  if (record.consequential || record.ymylLevel !== "none" || record.sensitivity.some((item) => item !== "none")) required.add("domain_reviewer");
  if (record.sensitivity.some((item) => ["privacy", "identity", "clinical", "legal", "financial", "children"].includes(item))) required.add("legal_privacy");
  return [...required];
}

export function auditEditorialReview(record: EditorialReviewRecord): QualityFinding[] {
  const findings: QualityFinding[] = [];
  const assignments = new Map(record.assignments.map((assignment) => [assignment.role, assignment]));
  for (const role of requiredReviewRoles(record)) {
    const assignment = assignments.get(role);
    if (!assignment?.name) findings.push({ code: `editorial.assignment.${role}`, severity: "blocker", message: `Required ${role} is not assigned.`, evidence: [record.itemId] });
    else if (assignment.decision !== "approved" && assignment.decision !== "not_applicable") findings.push({ code: `editorial.decision.${role}`, severity: "blocker", message: `${role} has not approved the item.`, evidence: [assignment.decision] });
  }
  if (!record.sourceManifestComplete) findings.push({ code: "editorial.sources", severity: "blocker", message: "Source manifest is incomplete.", evidence: [record.itemId] });
  if (!record.correctionRouteActive) findings.push({ code: "editorial.corrections", severity: "blocker", message: "Correction route is not operational.", evidence: [record.itemId] });
  if (!record.aiAssistanceDisclosed) findings.push({ code: "editorial.ai_disclosure", severity: "warning", message: "AI assistance disclosure decision is not recorded.", evidence: [record.itemId] });
  if (record.conflicts.length > 0) findings.push({ code: "editorial.conflicts", severity: "warning", message: "Conflicts of interest require visible disposition.", evidence: record.conflicts });
  return findings;
}

export function reviewComplete(record: EditorialReviewRecord): boolean {
  return auditEditorialReview(record).every((finding) => finding.severity !== "blocker");
}
