import type { QualityFinding } from "./types.js";

export type EventCategory = "navigation" | "content" | "search" | "utility" | "lead" | "newsletter" | "conversion" | "quality" | "error" | "consent";

export interface AnalyticsEvent {
  name: string;
  category: EventCategory;
  purpose: string;
  properties: Record<string, "string" | "number" | "boolean" | "date" | "enum">;
  containsPersonalData: boolean;
  containsSensitiveData: boolean;
  requiresConsent: boolean;
  retentionDays: number;
  owner: string | null;
}

const EVENT_NAME = /^[a-z][a-z0-9_]{2,63}$/;

export function auditAnalyticsEvent(event: AnalyticsEvent): QualityFinding[] {
  const findings: QualityFinding[] = [];
  if (!EVENT_NAME.test(event.name)) findings.push({ code: "analytics.event_name", severity: "error", message: "Event name must use stable lowercase snake_case.", evidence: [event.name] });
  if (!event.purpose.trim()) findings.push({ code: "analytics.purpose", severity: "blocker", message: "Analytics event lacks a documented purpose.", evidence: [event.name] });
  if (!event.owner) findings.push({ code: "analytics.owner", severity: "error", message: "Analytics event has no accountable owner.", evidence: [event.name] });
  if (event.containsSensitiveData) findings.push({ code: "analytics.sensitive_data", severity: "blocker", message: "General analytics must not collect sensitive data.", evidence: [event.name] });
  if (event.containsPersonalData && !event.requiresConsent) findings.push({ code: "analytics.personal_consent", severity: "blocker", message: "Personal-data event must require appropriate consent or another documented lawful basis.", evidence: [event.name] });
  if (event.retentionDays > 760) findings.push({ code: "analytics.retention", severity: "warning", message: "Analytics retention exceeds two years and requires explicit justification.", evidence: [event.name, String(event.retentionDays)] });
  return findings;
}

export const STANDARD_EVENTS: AnalyticsEvent[] = [
  { name: "page_view", category: "navigation", purpose: "Measure approved public page usage.", properties: { page_id: "string", page_type: "enum", plan_id: "string" }, containsPersonalData: false, containsSensitiveData: false, requiresConsent: true, retentionDays: 395, owner: "portfolio analytics" },
  { name: "content_engaged", category: "content", purpose: "Measure meaningful engagement with an authority resource.", properties: { content_id: "string", depth_percent: "number" }, containsPersonalData: false, containsSensitiveData: false, requiresConsent: true, retentionDays: 395, owner: "portfolio analytics" },
  { name: "utility_completed", category: "utility", purpose: "Measure completion of a calculator, assessment, checklist, or workflow without storing sensitive inputs.", properties: { utility_id: "string", result_class: "enum" }, containsPersonalData: false, containsSensitiveData: false, requiresConsent: true, retentionDays: 395, owner: "portfolio analytics" },
  { name: "lead_submitted", category: "lead", purpose: "Record that a lead was submitted while keeping submitted data in the CRM rather than analytics.", properties: { form_id: "string", lead_source: "enum" }, containsPersonalData: false, containsSensitiveData: false, requiresConsent: true, retentionDays: 395, owner: "portfolio analytics" },
  { name: "consent_updated", category: "consent", purpose: "Record consent-state changes.", properties: { consent_category: "enum", consent_state: "enum" }, containsPersonalData: false, containsSensitiveData: false, requiresConsent: false, retentionDays: 395, owner: "privacy operations" },
  { name: "quality_gate_failed", category: "quality", purpose: "Measure operational gate failures without user data.", properties: { gate_id: "string", severity: "enum" }, containsPersonalData: false, containsSensitiveData: false, requiresConsent: false, retentionDays: 760, owner: "portfolio governance" }
];

export function validateEventRegistry(events: AnalyticsEvent[]): QualityFinding[] {
  const findings = events.flatMap(auditAnalyticsEvent);
  const seen = new Set<string>();
  for (const event of events) {
    if (seen.has(event.name)) findings.push({ code: "analytics.duplicate_event", severity: "blocker", message: "Duplicate analytics event name.", evidence: [event.name] });
    seen.add(event.name);
  }
  return findings;
}
