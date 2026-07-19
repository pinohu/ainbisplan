import type { QualityFinding } from "./types.js";

export interface RedirectRule {
  from: string;
  to: string;
  status: 301 | 302 | 307 | 308 | 410;
  equivalent: boolean;
  reason: string;
}

export interface MigrationRecord {
  slug: string;
  currentUrls: string[];
  targetUrls: string[];
  redirects: RedirectRule[];
  canonicalMap: Record<string, string>;
  analyticsParityVerified: boolean;
  consentParityVerified: boolean;
  rollbackDocumented: boolean;
  prelaunchCrawlSaved: boolean;
  postlaunchMonitoringDays: number;
}

export function auditRedirects(rules: RedirectRule[]): QualityFinding[] {
  const findings: QualityFinding[] = [];
  const targets = new Map(rules.map((rule) => [rule.from, rule.to]));
  for (const rule of rules) {
    if (!rule.reason.trim()) findings.push({ code: "migration.redirect_reason", severity: "error", message: "Redirect lacks a documented reason.", evidence: [rule.from] });
    if ([301, 308].includes(rule.status) && !rule.equivalent) findings.push({ code: "migration.non_equivalent_redirect", severity: "blocker", message: "Permanent redirect target is not genuinely equivalent.", evidence: [rule.from, rule.to] });
    if (rule.from === rule.to) findings.push({ code: "migration.redirect_loop", severity: "blocker", message: "Redirect points to itself.", evidence: [rule.from] });
    let cursor = rule.to;
    const seen = new Set([rule.from]);
    while (targets.has(cursor)) {
      if (seen.has(cursor)) {
        findings.push({ code: "migration.redirect_cycle", severity: "blocker", message: "Redirect cycle detected.", evidence: [...seen, cursor] });
        break;
      }
      seen.add(cursor);
      cursor = targets.get(cursor) ?? cursor;
      if (seen.size > 5) {
        findings.push({ code: "migration.redirect_chain", severity: "error", message: "Redirect chain exceeds one hop.", evidence: [...seen] });
        break;
      }
    }
  }
  return findings;
}

export function auditMigration(record: MigrationRecord): QualityFinding[] {
  const findings = auditRedirects(record.redirects);
  if (!record.prelaunchCrawlSaved) findings.push({ code: "migration.prelaunch_crawl", severity: "blocker", message: "Prelaunch crawl and URL inventory are not preserved.", evidence: [record.slug] });
  if (!record.analyticsParityVerified) findings.push({ code: "migration.analytics", severity: "blocker", message: "Analytics parity is not verified.", evidence: [record.slug] });
  if (!record.consentParityVerified) findings.push({ code: "migration.consent", severity: "blocker", message: "Consent behavior parity is not verified.", evidence: [record.slug] });
  if (!record.rollbackDocumented) findings.push({ code: "migration.rollback", severity: "blocker", message: "Rollback procedure is not documented.", evidence: [record.slug] });
  if (record.postlaunchMonitoringDays < 28) findings.push({ code: "migration.monitoring", severity: "warning", message: "Postlaunch monitoring should continue for at least 28 days and longer for consequential migrations.", evidence: [record.slug, String(record.postlaunchMonitoringDays)] });
  for (const current of record.currentUrls) {
    if (!record.targetUrls.includes(current) && !record.redirects.some((rule) => rule.from === current) && !record.redirects.some((rule) => rule.from === current && rule.status === 410)) {
      findings.push({ code: "migration.unmapped_url", severity: "blocker", message: "Existing URL has no keep, redirect, or removal disposition.", evidence: [current] });
    }
  }
  return findings;
}
