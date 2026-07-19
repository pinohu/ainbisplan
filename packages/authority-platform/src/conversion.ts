import type { QualityFinding } from "./types.js";

export interface FormFieldPolicy {
  name: string;
  purpose: string;
  required: boolean;
  sensitivity: "public" | "personal" | "sensitive" | "regulated";
  retentionDays: number;
}

export interface ConversionFlow {
  id: string;
  action: string;
  fields: FormFieldPolicy[];
  consentMode: "none_required" | "explicit" | "double_opt_in";
  consentText?: string;
  confirmation: string;
  fulfillment: string;
  owner: string | null;
  hiddenFees: boolean;
  fakeUrgency: boolean;
  preselectedConsent: boolean;
}

export function auditConversionFlow(flow: ConversionFlow): QualityFinding[] {
  const findings: QualityFinding[] = [];
  if (!flow.owner) findings.push({ code: "conversion.owner", severity: "blocker", message: "Conversion flow has no accountable owner.", evidence: [flow.id] });
  if (!flow.confirmation.trim()) findings.push({ code: "conversion.confirmation", severity: "error", message: "Conversion flow lacks a clear confirmation state.", evidence: [flow.id] });
  if (!flow.fulfillment.trim()) findings.push({ code: "conversion.fulfillment", severity: "blocker", message: "The promised fulfillment process is undefined.", evidence: [flow.id] });
  if (flow.hiddenFees) findings.push({ code: "conversion.hidden_fees", severity: "blocker", message: "Hidden fees are prohibited.", evidence: [flow.id] });
  if (flow.fakeUrgency) findings.push({ code: "conversion.fake_urgency", severity: "blocker", message: "Fake urgency is prohibited.", evidence: [flow.id] });
  if (flow.preselectedConsent) findings.push({ code: "conversion.preselected_consent", severity: "blocker", message: "Consent cannot be preselected.", evidence: [flow.id] });
  if (flow.consentMode !== "none_required" && !flow.consentText?.trim()) findings.push({ code: "conversion.consent_text", severity: "blocker", message: "Consent language is required for this flow.", evidence: [flow.id] });

  for (const field of flow.fields) {
    if (!field.purpose.trim()) findings.push({ code: "conversion.field_purpose", severity: "error", message: `Field ${field.name} lacks a documented purpose.`, evidence: [flow.id] });
    if (["sensitive", "regulated"].includes(field.sensitivity) && field.retentionDays > 365) findings.push({ code: "conversion.retention", severity: "blocker", message: `Sensitive field ${field.name} has excessive retention.`, evidence: [String(field.retentionDays)] });
  }
  return findings;
}

export interface NewsletterPolicy {
  name: string;
  scope: "dedicated" | "shared_vertical";
  doubleOptIn: boolean;
  preferenceCenter: boolean;
  unsubscribeOneClick: boolean;
  senderIdentityVerified: boolean;
  segments: string[];
  editorialPillars: string[];
}

export function auditNewsletter(policy: NewsletterPolicy): QualityFinding[] {
  const findings: QualityFinding[] = [];
  if (!policy.doubleOptIn) findings.push({ code: "newsletter.double_opt_in", severity: "warning", message: "Double opt-in is recommended for consent quality and deliverability.", evidence: [policy.name] });
  if (!policy.preferenceCenter) findings.push({ code: "newsletter.preferences", severity: "error", message: "Newsletter needs a preference center.", evidence: [policy.name] });
  if (!policy.unsubscribeOneClick) findings.push({ code: "newsletter.unsubscribe", severity: "blocker", message: "One-click unsubscribe is required.", evidence: [policy.name] });
  if (!policy.senderIdentityVerified) findings.push({ code: "newsletter.sender", severity: "blocker", message: "Sender identity and domain authentication are not verified.", evidence: [policy.name] });
  if (policy.editorialPillars.length === 0) findings.push({ code: "newsletter.pillars", severity: "error", message: "Newsletter has no defined editorial pillars.", evidence: [policy.name] });
  return findings;
}
