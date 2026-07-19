#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import { loadLaunchpadCatalog, loadPlans, flattenBuildManifest } from "./catalog.mjs";
import { createException, evaluateBusinessAction, planGateSummary, renderOwnerSummary } from "./policy.mjs";
import { exists, parseArgs, readJson, sha256File, writeJson, writeText } from "./io.mjs";

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const inventoryPath = path.resolve(args.inventory ?? "../ainbis/docs/INVENTORY.json");
const plansRoot = path.resolve(args["plans-root"] ?? "plans/businesses");
const sourceRoot = path.resolve(args["source-root"] ?? path.dirname(path.dirname(inventoryPath)));
const launchpadRoot = args["launchpad-root"] ? path.resolve(args["launchpad-root"]) : null;
const buildManifestPath = args["build-manifest"]
  ? path.resolve(args["build-manifest"])
  : path.join(sourceRoot, "builds/manifest.json");
const configPath = path.resolve(args.config ?? "controller/config.json");
const outputRoot = path.resolve(args.output ?? "controller/state");
const reportsRoot = path.resolve(args.reports ?? "controller/reports");
const exceptionsRoot = path.resolve(args.exceptions ?? "controller/exceptions");
const mode = args.mode ?? "inspect";

function sortExceptions(items) {
  const weight = { critical: 4, high: 3, medium: 2, low: 1 };
  return items.sort((left, right) =>
    (weight[right.severity] ?? 0) - (weight[left.severity] ?? 0) ||
    String(left.slug ?? "").localeCompare(String(right.slug ?? ""))
  );
}

async function main() {
  const generatedAt = new Date().toISOString();
  const config = await readJson(configPath);
  const inventory = await readJson(inventoryPath);
  const sourceBusinesses = inventory.businesses ?? [];
  const sourceMap = new Map(sourceBusinesses.map((business) => [business.slug, business]));
  const { plans, duplicates: duplicatePlans } = await loadPlans(plansRoot);
  const launchpad = await loadLaunchpadCatalog(launchpadRoot);
  const buildManifest = flattenBuildManifest(await readJson(buildManifestPath, {}));
  const exceptions = [];
  const businesses = [];

  const sourceSlugs = new Set(sourceMap.keys());
  const planSlugs = new Set(plans.keys());
  const missingPlans = [...sourceSlugs].filter((slug) => !planSlugs.has(slug)).sort();
  const orphanPlans = [...planSlugs].filter((slug) => !sourceSlugs.has(slug)).sort();
  const missingLaunchpad = launchpad.available
    ? [...sourceSlugs].filter((slug) => !launchpad.slugs.has(slug)).sort()
    : [];
  const extraLaunchpad = launchpad.available
    ? [...launchpad.slugs].filter((slug) => !sourceSlugs.has(slug)).sort()
    : [];

  if (missingPlans.length) exceptions.push(createException("source_plan_drift", "critical", {
    title: "Source businesses are missing authority plans",
    summary: `${missingPlans.length} source businesses have no plan.`,
    automated_action: "Run the authority plan generator in refresh mode and re-execute the portfolio.",
    evidence: missingPlans.slice(0, 50)
  }));
  if (orphanPlans.length) exceptions.push(createException("orphan_plans", "high", {
    title: "Authority plans have no source business",
    summary: `${orphanPlans.length} plans are orphaned and require disposition.`,
    delegated_action: "Confirm retirement, consolidation, or source restoration.",
    evidence: orphanPlans.slice(0, 50)
  }));
  if (!launchpad.available) exceptions.push(createException("launchpad_catalog_unavailable", "high", {
    title: "Launchpad catalog could not be inspected",
    summary: "The controller did not receive a launchpad checkout or generated catalog.",
    automated_action: "Provide an authenticated launchpad checkout to the controller workflow."
  }));
  if (missingLaunchpad.length) exceptions.push(createException("source_launchpad_drift", "critical", {
    title: "Source businesses are missing from the launchpad catalog",
    summary: `${missingLaunchpad.length} source businesses are absent from the launchpad catalog.`,
    automated_action: "Regenerate and synchronize the launchpad catalog.",
    evidence: missingLaunchpad.slice(0, 50)
  }));
  if (extraLaunchpad.length) exceptions.push(createException("launchpad_orphans", "high", {
    title: "Launchpad catalog contains businesses absent from source inventory",
    summary: `${extraLaunchpad.length} launchpad entries require reconciliation.`,
    delegated_action: "Confirm restore, redirect, consolidate, or remove decisions.",
    evidence: extraLaunchpad.slice(0, 50)
  }));
  for (const duplicate of duplicatePlans) exceptions.push(createException("duplicate_plan", "critical", {
    slug: duplicate.slug,
    title: "Duplicate authority plan",
    summary: `Multiple plan files resolve to ${duplicate.slug}.`,
    automated_action: "Keep one canonical plan and quarantine duplicate generated artifacts.",
    evidence: duplicate.paths
  }));

  for (const source of sourceBusinesses) {
    const planRecord = plans.get(source.slug) ?? null;
    const plan = planRecord?.plan ?? null;
    const blueprintPath = path.join(sourceRoot, source.blueprint_html ?? "");
    let currentBlueprintHash = null;
    let blueprintHashMatches = false;
    if (source.blueprint_html && await exists(blueprintPath)) {
      currentBlueprintHash = await sha256File(blueprintPath);
      blueprintHashMatches = currentBlueprintHash === plan?.business?.blueprint_sha256;
    }

    if (plan && currentBlueprintHash && !blueprintHashMatches) {
      exceptions.push(createException("stale_plan_blueprint_hash", "high", {
        slug: source.slug,
        title: "Plan provenance is stale",
        summary: "The plan blueprint hash does not match the current source blueprint.",
        automated_action: "Refresh the plan while preserving reviewed decisions.",
        evidence: [plan.business?.blueprint_sha256 ?? "missing", currentBlueprintHash]
      }));
    }

    const action = evaluateBusinessAction({
      source,
      planRecord,
      launchpadPresent: !launchpad.available ? null : launchpad.slugs.has(source.slug),
      buildRecord: buildManifest.get(source.slug),
      blueprintHashMatches,
      config
    });

    if (action.delegated_actions.includes("assign_accountable_operators")) {
      exceptions.push(createException("operator_assignment_required", "high", {
        slug: source.slug,
        title: "Accountable operators are not assigned",
        summary: "Business, editorial, technical, or approval ownership is incomplete.",
        delegated_action: "Portfolio Operator assigns accountable owners and confirms acceptance."
      }));
    }
    if (action.delegated_actions.includes("assign_qualified_domain_reviewer")) {
      exceptions.push(createException("qualified_reviewer_required", "high", {
        slug: source.slug,
        title: "Qualified domain reviewer is required",
        summary: `Review intensity is ${plan?.classification?.review_intensity ?? "unknown"}.`,
        delegated_action: "Reviewer network assigns a qualified reviewer and records signed evidence."
      }));
    }

    businesses.push({
      slug: source.slug,
      title: source.title,
      source: source.source,
      blueprint_path: source.blueprint_html,
      blueprint_sha256: currentBlueprintHash,
      developed: Boolean(source.developed),
      launched: Boolean(source.launched),
      plan_present: Boolean(plan),
      plan_path: planRecord ? path.relative(root, planRecord.file) : null,
      plan_version: plan?.plan_version ?? null,
      planning_state: plan?.state?.planning ?? "missing",
      implementation_stage: plan?.implementation?.stage ?? "missing",
      indexability: plan?.state?.indexability ?? "planning",
      cohort: plan?.classification?.cohort ?? null,
      priority: plan?.classification?.priority ?? "unscored",
      reviewer_required: Boolean(plan && plan.classification?.review_intensity !== "standard"),
      gate_summary: planGateSummary(plan),
      launchpad_present: !launchpad.available ? null : launchpad.slugs.has(source.slug),
      build_manifest_present: buildManifest.has(source.slug),
      desired_stage: action.desired_stage,
      automated_actions: action.automated_actions,
      delegated_actions: action.delegated_actions
    });
  }

  if (config.operating_model?.portfolio_operator?.status !== "active") {
    exceptions.push(createException("portfolio_operator_unassigned", "critical", {
      title: "Portfolio Operator is not active",
      summary: "No accountable person or managed service is assigned to resolve non-automatable exceptions.",
      delegated_action: "Appoint a Portfolio Operator with documented authority and spending limits."
    }));
  }
  if (config.operating_model?.reviewer_network?.status !== "active") {
    exceptions.push(createException("reviewer_network_unassigned", "critical", {
      title: "Qualified reviewer network is not active",
      summary: "Consequential businesses cannot complete required expert review.",
      delegated_action: "Contract and onboard reviewers for every configured discipline."
    }));
  }

  const releaseBusiness = businesses.find((business) => business.slug === config.release_zero.slug) ?? null;
  const releaseExceptions = exceptions.filter((item) => item.slug === config.release_zero.slug && item.blocking);
  const releaseZero = {
    slug: config.release_zero.slug,
    title: releaseBusiness?.title ?? config.release_zero.public_name,
    stage: releaseBusiness?.desired_stage ?? "missing",
    target_state: config.release_zero.target_state,
    blockers: releaseExceptions.map((item) => item.title),
    automated_actions: releaseBusiness?.automated_actions ?? [],
    delegated_actions: releaseBusiness?.delegated_actions ?? []
  };

  const infrastructureKinds = new Set([
    "source_plan_drift",
    "source_launchpad_drift",
    "launchpad_catalog_unavailable",
    "duplicate_plan",
    "stale_plan_blueprint_hash"
  ]);
  const openInfrastructure = exceptions.filter((item) => item.status === "open" && infrastructureKinds.has(item.kind));
  const operatingModelReady = config.operating_model?.portfolio_operator?.status === "active" &&
    config.operating_model?.reviewer_network?.status === "active";

  const state = {
    schema_version: "1.0.0",
    generated_at: generatedAt,
    mode,
    controller: config.controller,
    source: {
      repository: config.controller.source_repository,
      inventory_path: path.relative(root, inventoryPath),
      inventory_generated_at: inventory.generated_at ?? null,
      counts: inventory.counts,
      source_commit: launchpad.meta?.sourceCommit ?? null
    },
    reconciliation: {
      source_count: sourceBusinesses.length,
      plan_count: plans.size,
      launchpad_count: launchpad.count,
      build_manifest_count: buildManifest.size,
      missing_plans: missingPlans,
      orphan_plans: orphanPlans,
      missing_launchpad: missingLaunchpad,
      extra_launchpad: extraLaunchpad,
      exact_source_plan_parity: missingPlans.length === 0 && orphanPlans.length === 0,
      exact_source_launchpad_parity: launchpad.available && missingLaunchpad.length === 0 && extraLaunchpad.length === 0 && launchpad.count === sourceBusinesses.length
    },
    safe_for_exception_only_operation: openInfrastructure.length === 0 && operatingModelReady,
    release_zero: releaseZero,
    exception_counts: exceptions.reduce((result, item) => {
      result[item.severity] = (result[item.severity] ?? 0) + 1;
      return result;
    }, {}),
    exceptions: sortExceptions(exceptions),
    businesses: businesses.sort((left, right) => left.slug.localeCompare(right.slug)),
    dispatch_plan: {
      planning_repository: missingPlans.length || orphanPlans.length ? ["refresh_plans", "reexecute_portfolio"] : [],
      launchpad_repository: missingLaunchpad.length || extraLaunchpad.length
        ? ["regenerate_catalog", "verify_build", "publish_controller_state"]
        : ["publish_controller_state"],
      source_repository: ["record_controller_run", "verify_inventory_catalog_plan_runtime_counts"]
    }
  };

  await writeJson(path.join(outputRoot, "controller-state.json"), state);
  await writeJson(path.join(outputRoot, "business-actions.json"), state.businesses);
  await writeJson(path.join(outputRoot, "dispatch-plan.json"), state.dispatch_plan);
  await writeJson(path.join(exceptionsRoot, "open-exceptions.json"), state.exceptions);
  await writeText(path.join(exceptionsRoot, "owner-exceptions.md"), renderOwnerSummary(state));
  await writeJson(path.join(reportsRoot, "release-zero.json"), releaseZero);
  await writeText(path.join(reportsRoot, "owner-summary.md"), renderOwnerSummary(state));

  console.log(JSON.stringify({
    source: sourceBusinesses.length,
    plans: plans.size,
    launchpad: launchpad.count,
    missing_plans: missingPlans.length,
    missing_launchpad: missingLaunchpad.length,
    exceptions: state.exceptions.length,
    safe_for_exception_only_operation: state.safe_for_exception_only_operation,
    release_zero_stage: releaseZero.stage
  }, null, 2));

  if (args.enforce && openInfrastructure.length > 0) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
