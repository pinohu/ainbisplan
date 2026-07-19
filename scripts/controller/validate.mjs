#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import { parseArgs, readJson } from "./io.mjs";

const args = parseArgs(process.argv.slice(2));
const statePath = path.resolve(args.state ?? "controller/state/controller-state.json");
const state = await readJson(statePath);
const errors = [];

if (state.schema_version !== "1.0.0") errors.push("Unsupported controller state schema version.");
if (!Array.isArray(state.businesses) || state.businesses.length === 0) errors.push("Controller state contains no businesses.");
if (!Array.isArray(state.exceptions)) errors.push("Controller exceptions are missing.");
if (!state.reconciliation) errors.push("Reconciliation summary is missing.");

if (state.reconciliation) {
  if (state.reconciliation.source_count !== state.businesses.length) {
    errors.push(`Source count ${state.reconciliation.source_count} does not match business action count ${state.businesses.length}.`);
  }
  if (state.reconciliation.exact_source_plan_parity && state.reconciliation.source_count !== state.reconciliation.plan_count) {
    errors.push("Source-plan parity is marked exact while counts differ.");
  }
  if (state.reconciliation.exact_source_launchpad_parity && state.reconciliation.source_count !== state.reconciliation.launchpad_count) {
    errors.push("Source-launchpad parity is marked exact while counts differ.");
  }
}

const seenSlugs = new Set();
for (const business of state.businesses ?? []) {
  if (!business.slug) errors.push("Business action is missing a slug.");
  if (seenSlugs.has(business.slug)) errors.push(`Duplicate business action for ${business.slug}.`);
  seenSlugs.add(business.slug);
  if (!business.desired_stage) errors.push(`${business.slug}: missing desired stage.`);
  if (!Array.isArray(business.automated_actions)) errors.push(`${business.slug}: automated actions missing.`);
  if (!Array.isArray(business.delegated_actions)) errors.push(`${business.slug}: delegated actions missing.`);
  if (business.indexability === "indexable" && business.gate_summary?.blocking_open > 0) {
    errors.push(`${business.slug}: indexable while blocking gates remain open.`);
  }
}

const fingerprints = new Set();
for (const item of state.exceptions ?? []) {
  if (!item.fingerprint) errors.push(`Exception ${item.kind ?? "unknown"} has no fingerprint.`);
  if (fingerprints.has(item.fingerprint)) errors.push(`Duplicate exception fingerprint ${item.fingerprint}.`);
  fingerprints.add(item.fingerprint);
  if (!item.kind || !item.severity || !item.title) errors.push(`Incomplete exception ${item.fingerprint ?? "unknown"}.`);
}

if (!state.release_zero?.slug) errors.push("Release Zero is not configured.");
if (!seenSlugs.has(state.release_zero?.slug)) errors.push(`Release Zero ${state.release_zero?.slug} is not in the authoritative inventory.`);

if (state.safe_for_exception_only_operation) {
  const infrastructureKinds = new Set([
    "source_plan_drift",
    "source_launchpad_drift",
    "launchpad_catalog_unavailable",
    "duplicate_plan",
    "stale_plan_blueprint_hash",
    "portfolio_operator_unassigned",
    "reviewer_network_unassigned"
  ]);
  const blocking = (state.exceptions ?? []).filter((item) => item.status === "open" && infrastructureKinds.has(item.kind));
  if (blocking.length > 0) errors.push("Controller claims exception-only readiness while infrastructure or operating-model blockers remain.");
}

if (errors.length > 0) {
  console.error("Autonomous portfolio controller validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Autonomous portfolio controller validation passed for ${state.businesses.length} businesses and ${state.exceptions.length} exceptions.`);
