import { sha256 } from "./io.mjs";

export function ownerAssigned(owner) {
  return Boolean(owner && ["assigned", "confirmed"].includes(owner.status));
}

export function approvedDecision(value) {
  return value?.status === "approved" && String(value?.text ?? "").trim().length >= 20;
}

export function planGateSummary(plan) {
  const gates = plan?.gates ?? [];
  return {
    total: gates.length,
    passed: gates.filter((gate) => ["passed", "not_applicable"].includes(gate.status)).length,
    blocking_open: gates.filter((gate) => gate.blocking && !["passed", "not_applicable"].includes(gate.status)).length
  };
}

export function createException(kind, severity, details = {}) {
  const slug = details.slug ?? null;
  return {
    fingerprint: sha256(`${kind}:${slug ?? "portfolio"}`).slice(0, 20),
    kind,
    severity,
    blocking: details.blocking ?? ["critical", "high"].includes(severity),
    slug,
    title: details.title ?? kind.replaceAll("_", " "),
    summary: details.summary ?? "",
    automated_action: details.automated_action ?? null,
    delegated_action: details.delegated_action ?? null,
    evidence: details.evidence ?? [],
    status: details.status ?? "open"
  };
}

export function evaluateBusinessAction({ source, planRecord, launchpadPresent, buildRecord, blueprintHashMatches, config }) {
  const plan = planRecord?.plan ?? null;
  const automated = [];
  const delegated = [];
  let desiredStage = "plan_refresh";

  if (!plan) {
    automated.push("generate_plan");
    return { desired_stage: desiredStage, automated_actions: automated, delegated_actions: delegated };
  }
  if (!blueprintHashMatches) automated.push("refresh_plan_provenance");
  if (launchpadPresent === false) automated.push("synchronize_launchpad_catalog");

  const gateSummary = planGateSummary(plan);
  const requiresReviewer = plan.classification?.review_intensity !== "standard";
  const owners = plan.owners ?? {};
  const requiredOwnersAssigned = [owners.business, owners.editorial, owners.technical, owners.approver].every(ownerAssigned);
  const domainReviewerAssigned = !requiresReviewer || ownerAssigned(owners.domain_reviewer);
  const strategyApproved = approvedDecision(plan.strategy?.independent_purpose) && approvedDecision(plan.strategy?.differentiation);
  const authorityApproved = approvedDecision(plan.authority?.thesis);
  const profilesPassed = [plan.accessibility, plan.performance, plan.privacy_security, plan.analytics].every(
    (profile) => profile?.status === "passed"
  );
  const contentReady = (plan.site_architecture?.pages ?? []).length > 0 && (plan.content?.launch_portfolio ?? []).length > 0;
  const utilityReady = (plan.utilities ?? []).some((utility) => ["approved", "implemented", "published"].includes(utility.status));

  if (!requiredOwnersAssigned) delegated.push("assign_accountable_operators");
  if (!domainReviewerAssigned) delegated.push("assign_qualified_domain_reviewer");
  if (!strategyApproved) delegated.push("approve_independent_purpose_and_differentiation");
  if (!authorityApproved) delegated.push("approve_authority_thesis_and_sources");
  if (!contentReady) delegated.push("produce_business_specific_architecture_and_content");
  if (!utilityReady) delegated.push("approve_and_build_original_utility");
  if (!profilesPassed) automated.push("run_technical_quality_program");

  if (delegated.length > 0 || gateSummary.blocking_open > 0) {
    desiredStage = requiresReviewer ? "domain_review" : "research_and_approval";
  } else if (!source.developed || !buildRecord) {
    desiredStage = "private_build";
    automated.push("build_private_application");
  } else if (!source.launched) {
    desiredStage = "public_noindex";
    if (config.automation.auto_deploy_public_noindex) automated.push("deploy_public_noindex");
  } else if (plan.state?.indexability === "indexable") {
    desiredStage = "operating";
    automated.push("monitor_and_maintain");
  } else {
    desiredStage = "live_audit_and_indexability_review";
    automated.push("audit_live_property");
  }

  return {
    desired_stage: desiredStage,
    automated_actions: [...new Set(automated)],
    delegated_actions: [...new Set(delegated)]
  };
}

export function renderOwnerSummary(state) {
  const unresolved = state.exceptions.filter((item) => item.status === "open");
  const critical = unresolved.filter((item) => item.severity === "critical");
  const high = unresolved.filter((item) => item.severity === "high");
  const release = state.release_zero;
  const blockerLines = release.blockers.length
    ? release.blockers.map((item) => `  - ${item}`).join("\n")
    : "  - None";

  return `# AINBIS Autonomous Portfolio Owner Summary\n\n` +
    `**Generated:** ${state.generated_at}  \n` +
    `**Safe for exception-only operation:** ${state.safe_for_exception_only_operation ? "YES" : "NO"}  \n` +
    `**Source businesses:** ${state.reconciliation.source_count}  \n` +
    `**Plans:** ${state.reconciliation.plan_count}  \n` +
    `**Launchpad catalog:** ${state.reconciliation.launchpad_count ?? "unavailable"}  \n` +
    `**Open exceptions:** ${unresolved.length} (${critical.length} critical, ${high.length} high)\n\n` +
    `## Release Zero\n\n` +
    `- **Business:** ${release.title ?? release.slug}\n` +
    `- **Stage:** ${release.stage}\n` +
    `- **Blocking items:** ${release.blockers.length}\n` +
    `${blockerLines}\n\n` +
    `## Owner escalation policy\n\n` +
    `Routine success is suppressed. Escalate only controller credential failure, unrepaired repository drift, failed deployment without rollback, critical security/privacy findings, reviewer rejection, domain/payment/email failure, budget overrun, material regulatory change, or retirement recommendation.\n`;
}
