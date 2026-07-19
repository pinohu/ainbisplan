import type { QualityFinding } from "./types.js";

export interface ReputationSignal {
  id: string;
  type: "backlink" | "mention" | "review" | "citation" | "association" | "partnership" | "media";
  source: string;
  sourceUrl?: string;
  observedAt: string;
  verified: boolean;
  paid: boolean;
  disclosed: boolean;
  sentiment?: "positive" | "neutral" | "negative" | "mixed";
  owner: string | null;
  responseRequired: boolean;
  responseStatus?: "not_started" | "draft" | "approved" | "published" | "closed";
}

export function auditReputationSignal(signal: ReputationSignal): QualityFinding[] {
  const findings: QualityFinding[] = [];
  if (!signal.owner) findings.push({ code: "reputation.owner", severity: "error", message: "Reputation signal lacks an accountable owner.", evidence: [signal.id] });
  if (!signal.verified) findings.push({ code: "reputation.unverified", severity: "warning", message: "Reputation signal is not verified.", evidence: [signal.id, signal.source] });
  if (signal.paid && !signal.disclosed) findings.push({ code: "reputation.paid_disclosure", severity: "blocker", message: "Paid authority or reputation relationship is not disclosed.", evidence: [signal.id, signal.source] });
  if (signal.responseRequired && !["approved", "published", "closed"].includes(signal.responseStatus ?? "not_started")) {
    findings.push({ code: "reputation.response", severity: signal.sentiment === "negative" ? "error" : "warning", message: "Required reputation response is incomplete.", evidence: [signal.id, signal.responseStatus ?? "not_started"] });
  }
  return findings;
}

export function reputationSummary(signals: ReputationSignal[]): {
  total: number;
  verified: number;
  negative: number;
  responsesOpen: number;
  paidUndisclosed: number;
} {
  return {
    total: signals.length,
    verified: signals.filter((signal) => signal.verified).length,
    negative: signals.filter((signal) => signal.sentiment === "negative").length,
    responsesOpen: signals.filter((signal) => signal.responseRequired && !["approved", "published", "closed"].includes(signal.responseStatus ?? "not_started")).length,
    paidUndisclosed: signals.filter((signal) => signal.paid && !signal.disclosed).length
  };
}
