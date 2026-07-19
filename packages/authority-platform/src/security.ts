import type { QualityFinding } from "./types.js";

export type DataClass = "public" | "internal" | "personal" | "sensitive" | "regulated";

export interface DataHandlingRule {
  field: string;
  dataClass: DataClass;
  purpose: string;
  lawfulBasis?: string;
  encryptedInTransit: boolean;
  encryptedAtRest: boolean;
  retentionDays: number;
  accessRoles: string[];
  deletionSupported: boolean;
  exportedToAnalytics: boolean;
}

export interface UploadPolicy {
  allowedExtensions: string[];
  maxBytes: number;
  malwareScanning: boolean;
  contentTypeVerification: boolean;
  randomizeStorageNames: boolean;
  privateByDefault: boolean;
  signedAccessUrls: boolean;
  retentionDays: number;
}

export function auditDataHandling(rule: DataHandlingRule): QualityFinding[] {
  const findings: QualityFinding[] = [];
  if (!rule.purpose.trim()) findings.push({ code: "security.purpose", severity: "blocker", message: "Data collection lacks a documented purpose.", evidence: [rule.field] });
  if (["personal", "sensitive", "regulated"].includes(rule.dataClass) && !rule.lawfulBasis?.trim()) findings.push({ code: "security.lawful_basis", severity: "blocker", message: "Personal or regulated data lacks a documented lawful basis.", evidence: [rule.field] });
  if (!rule.encryptedInTransit) findings.push({ code: "security.transit", severity: "blocker", message: "Data is not encrypted in transit.", evidence: [rule.field] });
  if (["sensitive", "regulated"].includes(rule.dataClass) && !rule.encryptedAtRest) findings.push({ code: "security.at_rest", severity: "blocker", message: "Sensitive or regulated data is not encrypted at rest.", evidence: [rule.field] });
  if (rule.accessRoles.length === 0) findings.push({ code: "security.access", severity: "blocker", message: "No authorized access roles are defined.", evidence: [rule.field] });
  if (rule.retentionDays <= 0) findings.push({ code: "security.retention", severity: "error", message: "Retention period is invalid.", evidence: [rule.field] });
  if (["sensitive", "regulated"].includes(rule.dataClass) && rule.retentionDays > 3650) findings.push({ code: "security.excessive_retention", severity: "warning", message: "Sensitive-data retention exceeds ten years and requires explicit legal justification.", evidence: [rule.field, String(rule.retentionDays)] });
  if (["personal", "sensitive", "regulated"].includes(rule.dataClass) && !rule.deletionSupported) findings.push({ code: "security.deletion", severity: "error", message: "Deletion or documented retention exception is missing.", evidence: [rule.field] });
  if (["personal", "sensitive", "regulated"].includes(rule.dataClass) && rule.exportedToAnalytics) findings.push({ code: "security.analytics_export", severity: "blocker", message: "Personal, sensitive, or regulated values must not be exported to general analytics.", evidence: [rule.field] });
  return findings;
}

export function auditUploadPolicy(policy: UploadPolicy): QualityFinding[] {
  const findings: QualityFinding[] = [];
  if (policy.allowedExtensions.length === 0) findings.push({ code: "upload.allowlist", severity: "blocker", message: "Upload extension allowlist is empty.", evidence: [] });
  if (policy.maxBytes <= 0 || policy.maxBytes > 100 * 1024 * 1024) findings.push({ code: "upload.size", severity: "error", message: "Upload-size limit is missing or excessive.", evidence: [String(policy.maxBytes)] });
  if (!policy.malwareScanning) findings.push({ code: "upload.malware", severity: "blocker", message: "Uploads are not malware scanned.", evidence: [] });
  if (!policy.contentTypeVerification) findings.push({ code: "upload.content_type", severity: "blocker", message: "Upload content type is not verified independently of the filename.", evidence: [] });
  if (!policy.randomizeStorageNames) findings.push({ code: "upload.storage_name", severity: "error", message: "Uploaded object names are predictable.", evidence: [] });
  if (!policy.privateByDefault) findings.push({ code: "upload.private", severity: "blocker", message: "Uploads are not private by default.", evidence: [] });
  if (!policy.signedAccessUrls) findings.push({ code: "upload.signed_access", severity: "blocker", message: "Private uploads lack expiring signed access.", evidence: [] });
  return findings;
}
