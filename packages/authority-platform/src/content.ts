import type { QualityFinding } from "./types.js";

export type ContentStatus = "idea" | "research" | "brief" | "draft" | "source_review" | "domain_review" | "editorial_review" | "approved" | "published" | "refresh" | "retired";

export interface AuthoritySource {
  id: string;
  title: string;
  url: string;
  authorityType: "primary" | "official" | "peer_reviewed" | "professional" | "first_hand" | "secondary";
  effectiveAt?: string | null;
  accessedAt: string;
  supportsClaims: string[];
}

export interface AuthorityContentItem {
  id: string;
  title: string;
  purpose: string;
  audience: string[];
  status: ContentStatus;
  consequential: boolean;
  owner?: string | null;
  reviewer?: string | null;
  sources: AuthoritySource[];
  claims: string[];
  lastReviewedAt?: string | null;
  nextReviewAt?: string | null;
  updateHistory: Array<{ at: string; summary: string; actor: string }>;
}

const TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  idea: ["research", "retired"],
  research: ["brief", "retired"],
  brief: ["draft", "research", "retired"],
  draft: ["source_review", "brief", "retired"],
  source_review: ["domain_review", "editorial_review", "draft", "retired"],
  domain_review: ["editorial_review", "draft", "retired"],
  editorial_review: ["approved", "draft", "retired"],
  approved: ["published", "draft", "retired"],
  published: ["refresh", "retired"],
  refresh: ["source_review", "retired"],
  retired: []
};

export function canTransitionContent(from: ContentStatus, to: ContentStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function transitionContent(item: AuthorityContentItem, to: ContentStatus, actor: string, summary: string, at = new Date().toISOString()): AuthorityContentItem {
  if (!canTransitionContent(item.status, to)) throw new Error(`Invalid content transition ${item.status} -> ${to}`);
  return {
    ...item,
    status: to,
    updateHistory: [...item.updateHistory, { at, summary, actor }]
  };
}

export function auditContentItem(item: AuthorityContentItem, today = new Date()): QualityFinding[] {
  const findings: QualityFinding[] = [];
  if (!item.owner) findings.push({ code: "content.owner", severity: "blocker", message: "Content owner is not assigned.", evidence: [item.id] });
  if (item.consequential && !item.reviewer) findings.push({ code: "content.reviewer", severity: "blocker", message: "Consequential content requires an accountable reviewer.", evidence: [item.id] });
  if (item.claims.length > 0 && item.sources.length === 0) findings.push({ code: "content.unsourced_claims", severity: "blocker", message: "Claims exist without supporting sources.", evidence: item.claims });

  const supported = new Set(item.sources.flatMap((source) => source.supportsClaims));
  const unsupported = item.claims.filter((claim) => !supported.has(claim));
  if (unsupported.length > 0) findings.push({ code: "content.claim_mapping", severity: "blocker", message: "Some claims are not mapped to evidence.", evidence: unsupported });

  if (["approved", "published"].includes(item.status)) {
    if (!item.lastReviewedAt) findings.push({ code: "content.review_date", severity: "error", message: "Approved or published content is missing a review date.", evidence: [item.id] });
    if (!item.nextReviewAt) findings.push({ code: "content.next_review", severity: "error", message: "Approved or published content is missing a next-review date.", evidence: [item.id] });
  }
  if (item.nextReviewAt && new Date(item.nextReviewAt).getTime() < today.getTime()) {
    findings.push({ code: "content.review_due", severity: item.consequential ? "blocker" : "warning", message: "Content review date has passed.", evidence: [item.nextReviewAt] });
  }
  return findings;
}

export function reviewIntervalDays(consequential: boolean, regulatoryVolatility: "low" | "medium" | "high"): number {
  if (consequential && regulatoryVolatility === "high") return 30;
  if (consequential || regulatoryVolatility === "high") return 90;
  if (regulatoryVolatility === "medium") return 180;
  return 365;
}
