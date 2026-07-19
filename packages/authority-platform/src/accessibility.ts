import type { QualityFinding } from "./types.js";

export interface AccessibilityAuditInput {
  pageId: string;
  hasMainLandmark: boolean;
  hasSingleH1: boolean;
  headingOrderValid: boolean;
  keyboardComplete: boolean;
  focusVisible: boolean;
  skipLinkAvailable: boolean;
  formLabelsComplete: boolean;
  errorsProgrammaticallyAssociated: boolean;
  statusAnnouncementsAvailable: boolean;
  touchTargetsAdequate: boolean;
  colorOnlyMeaning: boolean;
  reducedMotionSupported: boolean;
  captionsComplete: boolean;
  languageDeclared: boolean;
  zoomReflowSupported: boolean;
  automatedCriticalViolations: number;
  manualReviewCompleted: boolean;
  assistiveTechnologyReviewCompleted: boolean;
}

export function auditAccessibility(input: AccessibilityAuditInput): QualityFinding[] {
  const findings: QualityFinding[] = [];
  const blocker = (condition: boolean, code: string, message: string): void => {
    if (!condition) findings.push({ code, severity: "blocker", message, evidence: [input.pageId] });
  };
  blocker(input.hasMainLandmark, "a11y.main", "Page lacks a main landmark.");
  blocker(input.hasSingleH1, "a11y.h1", "Page must have one clear H1.");
  blocker(input.headingOrderValid, "a11y.headings", "Heading order is invalid.");
  blocker(input.keyboardComplete, "a11y.keyboard", "Critical functionality is not fully keyboard operable.");
  blocker(input.focusVisible, "a11y.focus", "Visible focus is missing.");
  blocker(input.formLabelsComplete, "a11y.labels", "Form controls lack persistent programmatic labels.");
  blocker(input.errorsProgrammaticallyAssociated, "a11y.errors", "Validation errors are not associated with affected controls.");
  blocker(input.statusAnnouncementsAvailable, "a11y.status", "Dynamic status changes are not announced.");
  blocker(input.touchTargetsAdequate, "a11y.targets", "Touch targets are inadequate.");
  blocker(!input.colorOnlyMeaning, "a11y.color", "Meaning relies on color alone.");
  blocker(input.reducedMotionSupported, "a11y.motion", "Reduced motion is not supported.");
  blocker(input.captionsComplete, "a11y.captions", "Required captions or transcripts are incomplete.");
  blocker(input.languageDeclared, "a11y.language", "Document language is not declared.");
  blocker(input.zoomReflowSupported, "a11y.reflow", "Content does not reflow at supported zoom levels.");
  if (!input.skipLinkAvailable) findings.push({ code: "a11y.skip_link", severity: "error", message: "Skip navigation is missing.", evidence: [input.pageId] });
  if (input.automatedCriticalViolations > 0) findings.push({ code: "a11y.automated", severity: "blocker", message: "Automated testing found critical accessibility violations.", evidence: [String(input.automatedCriticalViolations)] });
  if (!input.manualReviewCompleted) findings.push({ code: "a11y.manual", severity: "blocker", message: "Manual accessibility review is incomplete.", evidence: [input.pageId] });
  if (!input.assistiveTechnologyReviewCompleted) findings.push({ code: "a11y.at", severity: "blocker", message: "Assistive-technology review is incomplete.", evidence: [input.pageId] });
  return findings;
}

export function accessibilityPassed(input: AccessibilityAuditInput): boolean {
  return auditAccessibility(input).every((finding) => finding.severity !== "blocker");
}
