#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const plansRoot = path.join(root, "plans/businesses");
const dashboardPath = path.join(root, "reports/portfolio/execution-dashboard.json");
const errors = [];

async function walkPlans(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkPlans(full));
    else if (entry.name === "plan.json") files.push(full);
  }
  return files;
}

const files = await walkPlans(plansRoot);
const plans = [];
for (const file of files) {
  const plan = JSON.parse(await readFile(file, "utf8"));
  plans.push(plan);
  if (!plan.classification?.cohort) errors.push(`${plan.business?.slug}: missing cohort`);
  if (!plan.classification?.priority || plan.classification.priority === "unscored") errors.push(`${plan.business?.slug}: missing priority`);
  if (["unassessed", "scaffolded"].includes(plan.state?.planning)) errors.push(`${plan.business?.slug}: execution triage did not advance planning state`);
  if (["inventoried", "scaffolded"].includes(plan.implementation?.stage)) errors.push(`${plan.business?.slug}: implementation stage was not advanced`);
  if ((plan.implementation?.dependencies ?? []).length < 5) errors.push(`${plan.business?.slug}: shared dependencies are incomplete`);
  if ((plan.implementation?.operations ?? []).length < 4) errors.push(`${plan.business?.slug}: operating cadence is incomplete`);
  if ((plan.implementation?.epics ?? []).length !== 16) errors.push(`${plan.business?.slug}: expected 16 epics`);
  for (const epic of plan.implementation?.epics ?? []) {
    if ((epic.deliverables ?? []).length === 0) errors.push(`${plan.business?.slug}/${epic.id}: missing deliverables`);
    if ((epic.acceptance_criteria ?? []).length === 0) errors.push(`${plan.business?.slug}/${epic.id}: missing acceptance criteria`);
  }
  if (plan.state?.indexability === "indexable") errors.push(`${plan.business?.slug}: automated execution may not promote a scaffold directly to indexable`);
}

let dashboard;
try {
  dashboard = JSON.parse(await readFile(dashboardPath, "utf8"));
} catch (error) {
  errors.push(`Unable to read execution dashboard: ${error.message}`);
}

if (dashboard) {
  if (dashboard.total_plans !== plans.length) errors.push(`Dashboard plan count ${dashboard.total_plans} does not match ${plans.length}`);
  if (!Array.isArray(dashboard.references) || dashboard.references.length !== 6) errors.push("Exactly six reference businesses are required");
  const uniqueReferences = new Set((dashboard.references ?? []).map((item) => item.slug));
  if (uniqueReferences.size !== 6) errors.push("Reference businesses must be unique");
  const launched = plans.filter((plan) => plan.business?.launched).length;
  if (dashboard.launched_audit_count !== launched) errors.push(`Launched audit count ${dashboard.launched_audit_count} does not match ${launched}`);
  const reviewerRequired = plans.filter((plan) => plan.classification?.review_intensity !== "standard").length;
  if (dashboard.reviewer_queue_count !== reviewerRequired) errors.push(`Reviewer queue count ${dashboard.reviewer_queue_count} does not match ${reviewerRequired}`);
  if ((dashboard.readiness ?? []).length !== plans.length) errors.push("Readiness dashboard must contain every plan");
}

if (errors.length > 0) {
  console.error("Authority execution validation failed:\n");
  for (const error of errors.slice(0, 200)) console.error(`- ${error}`);
  if (errors.length > 200) console.error(`- ...and ${errors.length - 200} more`);
  process.exit(1);
}

console.log(`Authority execution validation passed for ${plans.length} business plans.`);
