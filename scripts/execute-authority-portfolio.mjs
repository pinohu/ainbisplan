#!/usr/bin/env node

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  assessPriority,
  cohortSummary,
  defaultTechnicalPolicies,
  detectPortfolioCollisions,
  evaluatePlanReadiness,
  selectReferenceBusinesses
} from "../packages/authority-platform/dist/index.js";

const root = process.cwd();
const plansRoot = path.join(root, "plans/businesses");
const reportsRoot = path.join(root, "reports/portfolio");
const consoleRoot = path.join(root, "apps/portfolio-console");
const executionVersion = "ainbis-authority-execution@0.1.0";

const EPIC_DEFAULTS = {
  "epic-01": ["Complete primary-source, market, search, and portfolio-overlap research.", "Approve independent purpose, boundaries, and differentiation."],
  "epic-02": ["Validate audience, jobs, offer, commercial model, scope, and ethical conversion.", "Document assumptions requiring market validation."],
  "epic-03": ["Generate and review governed brand profile.", "Apply accessible tokens and archetype-specific layout rules."],
  "epic-04": ["Define topics, entities, regulations, jurisdictions, content types, and ownership.", "Create versioned content and entity models."],
  "epic-05": ["Define navigation, URLs, page purposes, indexability, and internal-linking model.", "Block doorway, duplicate, and unsupported page patterns."],
  "epic-06": ["Produce authority launch portfolio and trust-policy pages.", "Assign authors, reviewers, sources, review dates, and corrections paths."],
  "epic-07": ["Implement truthful product, service, workflow, pricing posture, and boundaries.", "Validate all consequential states and recovery paths."],
  "epic-08": ["Specify and build at least one original utility or evidence asset.", "Validate source basis, risks, outputs, and conversion role."],
  "epic-09": ["Implement research, drafting, fact-check, domain-review, approval, refresh, and retirement workflow.", "Record accountability and change history."],
  "epic-10": ["Implement metadata, canonicals, robots, sitemaps, redirects, schema, and link-graph controls.", "Pass crawl, rendering, duplication, and structured-data checks."],
  "epic-11": ["Implement consent-aware forms, lead magnets, newsletter, CRM stages, and nurture.", "Validate deliverability, preferences, data minimization, and ethical constraints."],
  "epic-12": ["Implement event taxonomy, attribution, dashboards, experimentation, and decision logs.", "Separate business, search, quality, and safety metrics."],
  "epic-13": ["Pass accessibility, Core Web Vitals, security, privacy, and legal review.", "Document evidence, exceptions, owners, and remediation."],
  "epic-14": ["Establish original research, expert outreach, partnerships, reviews, digital PR, and reputation monitoring.", "Prohibit paid or manipulative authority signals."],
  "epic-15": ["Create migration, redirect, rollout, indexation, monitoring, rollback, and incident plans.", "Preserve valid URLs, analytics, leads, and search equity."],
  "epic-16": ["Establish editorial, regulatory, product, technical, accessibility, performance, security, and reputation operations.", "Define recurring review cadence and retirement triggers."]
};

const SHARED_DEPENDENCIES = [
  "@ainbis/tokens",
  "@ainbis/core",
  "@ainbis/archetypes",
  "@ainbis/brand-engine",
  "@ainbis/authority-platform",
  "authority content models",
  "editorial and domain-review workflow",
  "SEO, schema, internal-linking, and quality services",
  "consent, analytics, performance, accessibility, privacy, and security services"
];

const OPERATIONS = [
  "Monthly inventory-plan-catalog-runtime reconciliation",
  "Risk-based source, regulation, deadline, and claim freshness review",
  "Broken-link, canonical, robots, sitemap, schema, status, and crawl monitoring",
  "Search performance, indexation, lead quality, conversion, and newsletter review",
  "Accessibility, Core Web Vitals, dependency, privacy, and security regression review",
  "Backlink, mention, review, reputation, overlap, consolidation, and retirement review"
];

async function walkPlans(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkPlans(full));
    else if (entry.name === "plan.json") files.push(full);
  }
  return files;
}

function mergeUnique(existing = [], additions = []) {
  return [...new Set([...existing, ...additions])];
}

function enrichEpic(epic) {
  const defaults = EPIC_DEFAULTS[epic.id] ?? ["Complete the documented epic outcomes and provide auditable evidence."];
  return {
    ...epic,
    status: epic.status === "planned" ? "planned" : epic.status,
    deliverables: mergeUnique(epic.deliverables, defaults),
    dependencies: mergeUnique(epic.dependencies, SHARED_DEPENDENCIES),
    acceptance_criteria: mergeUnique(epic.acceptance_criteria, [
      "Deliverables are business-specific rather than token-swapped from another property.",
      "Required owners and qualified reviewers are assigned.",
      "Automated and manual evidence is recorded before completion."
    ])
  };
}

function enrichPlan(plan, assessment) {
  const technical = defaultTechnicalPolicies(plan.classification.primary_archetype, plan.state.indexability);
  const now = new Date().toISOString();
  const launchedMigration = plan.business.launched ? [
    "Complete preservation-first crawl, URL, content, metadata, schema, backlink, analytics, lead, and conversion inventory.",
    "Assign keep, improve, consolidate, redirect, noindex, or retire disposition per existing URL.",
    "Create staged redirect, release, rollback, and post-launch monitoring plans."
  ] : [];

  plan.classification.cohort = assessment.cohort;
  plan.classification.priority = assessment.priority;
  if (plan.state.planning === "scaffolded" || plan.state.planning === "unassessed") plan.state.planning = "research_required";
  plan.state.blockers = mergeUnique(plan.state.blockers, [
    "Complete current business-specific research and source verification.",
    "Approve independent purpose, portfolio differentiation, and query/entity ownership.",
    ...(assessment.reviewerRequired ? ["Assign and obtain required qualified domain review."] : []),
    "Complete original utility, content graph, conversion, operating model, and all mandatory gates."
  ]);
  if (plan.implementation.stage === "scaffolded" || plan.implementation.stage === "inventoried") plan.implementation.stage = "researching";
  plan.implementation.epics = plan.implementation.epics.map(enrichEpic);
  plan.implementation.dependencies = mergeUnique(plan.implementation.dependencies, SHARED_DEPENDENCIES);
  plan.implementation.migration = mergeUnique(plan.implementation.migration, launchedMigration);
  plan.implementation.launch = mergeUnique(plan.implementation.launch, [
    "Default to private_build or public_noindex until every blocking gate passes.",
    "Require approved indexability evidence before sitemap inclusion."
  ]);
  plan.implementation.operations = mergeUnique(plan.implementation.operations, OPERATIONS);

  plan.technical.rendering = plan.technical.rendering === "undecided" ? technical.rendering : plan.technical.rendering;
  plan.technical.canonical_policy = mergeUnique(plan.technical.canonical_policy, technical.canonicalPolicy);
  plan.technical.robots_policy = mergeUnique(plan.technical.robots_policy, technical.robotsPolicy);
  plan.technical.sitemap_profiles = mergeUnique(plan.technical.sitemap_profiles, technical.sitemapProfiles);
  plan.technical.redirect_policy = mergeUnique(plan.technical.redirect_policy, technical.redirectPolicy);
  plan.technical.structured_data = mergeUnique(plan.technical.structured_data, technical.structuredData);
  plan.technical.monitoring = mergeUnique(plan.technical.monitoring, technical.monitoring);

  for (const profileName of ["accessibility", "performance", "privacy_security", "analytics", "offsite_authority"]) {
    const profile = plan[profileName];
    if (profile.status === "not_started") profile.status = "planned";
  }

  plan.provenance.generator = executionVersion;
  plan.provenance.change_log = mergeUnique(plan.provenance.change_log, [
    `Automated portfolio triage assigned cohort ${assessment.cohort} and priority ${assessment.priority}.`,
    "Execution dependencies, epic acceptance criteria, technical defaults, migration requirements, and operating cadence were populated."
  ]);
  plan.provenance.generated_at = now;
  return plan;
}

function markdownSummary(data) {
  return `# AINBIS Portfolio Execution Dashboard\n\n` +
    `**Generated:** ${data.generated_at}  \n` +
    `**Plans:** ${data.total_plans}  \n` +
    `**Launched audits:** ${data.launched_audit_count}  \n` +
    `**Qualified-review queue:** ${data.reviewer_queue_count}  \n` +
    `**Potential overlap pairs:** ${data.collision_count}\n\n` +
    `## Priority distribution\n\n` + Object.entries(data.priority_counts).map(([key, value]) => `- ${key}: ${value}`).join("\n") +
    `\n\n## Reference implementations\n\n` + data.references.map((item) => `- **${item.category}:** ${item.title} (\`${item.slug}\`)`).join("\n") +
    `\n\n> Automated triage is not business approval, expert review, source verification, or permission to index.\n`;
}

async function main() {
  const planFiles = await walkPlans(plansRoot);
  const plans = [];
  const assessments = [];

  for (const file of planFiles) {
    const plan = JSON.parse(await readFile(file, "utf8"));
    const assessment = assessPriority(plan);
    const enriched = enrichPlan(plan, assessment);
    await writeFile(file, `${JSON.stringify(enriched, null, 2)}\n`, "utf8");
    plans.push(enriched);
    assessments.push(assessment);
  }

  const references = selectReferenceBusinesses(plans);
  const collisions = detectPortfolioCollisions(plans).slice(0, 1000);
  const launchedAuditQueue = assessments.filter((item) => item.launchedAuditRequired).sort((a, b) => b.score - a.score);
  const reviewerQueue = assessments.filter((item) => item.reviewerRequired).sort((a, b) => b.score - a.score);
  const readiness = plans.map((plan) => {
    const findings = evaluatePlanReadiness(plan);
    return {
      slug: plan.business.slug,
      indexability: plan.state.indexability,
      blockers: findings.filter((finding) => finding.severity === "blocker").length,
      errors: findings.filter((finding) => finding.severity === "error").length,
      warnings: findings.filter((finding) => finding.severity === "warning").length,
      finding_codes: findings.map((finding) => finding.code)
    };
  });
  const priorityCounts = assessments.reduce((result, item) => {
    result[item.priority] = (result[item.priority] ?? 0) + 1;
    return result;
  }, {});

  const dashboard = {
    schema_version: "1.0.0",
    generated_at: new Date().toISOString(),
    execution_version: executionVersion,
    total_plans: plans.length,
    priority_counts: priorityCounts,
    launched_audit_count: launchedAuditQueue.length,
    reviewer_queue_count: reviewerQueue.length,
    collision_count: collisions.length,
    references,
    cohorts: cohortSummary(assessments),
    assessments,
    launched_audit_queue: launchedAuditQueue,
    reviewer_queue: reviewerQueue,
    collisions,
    readiness
  };

  await mkdir(reportsRoot, { recursive: true });
  await mkdir(consoleRoot, { recursive: true });
  await writeFile(path.join(reportsRoot, "execution-dashboard.json"), `${JSON.stringify(dashboard, null, 2)}\n`, "utf8");
  await writeFile(path.join(reportsRoot, "execution-dashboard.md"), markdownSummary(dashboard), "utf8");
  await writeFile(path.join(reportsRoot, "reference-businesses.json"), `${JSON.stringify(references, null, 2)}\n`, "utf8");
  await writeFile(path.join(reportsRoot, "launched-audit-queue.json"), `${JSON.stringify(launchedAuditQueue, null, 2)}\n`, "utf8");
  await writeFile(path.join(reportsRoot, "qualified-review-queue.json"), `${JSON.stringify(reviewerQueue, null, 2)}\n`, "utf8");
  await writeFile(path.join(reportsRoot, "portfolio-collisions.json"), `${JSON.stringify(collisions, null, 2)}\n`, "utf8");
  await writeFile(path.join(consoleRoot, "data.json"), `${JSON.stringify({ generated_at: dashboard.generated_at, total_plans: dashboard.total_plans, priority_counts: dashboard.priority_counts, cohorts: dashboard.cohorts, references, assessments, readiness }, null, 2)}\n`, "utf8");

  console.log(`Enriched ${plans.length} plans; queued ${launchedAuditQueue.length} launched audits and ${reviewerQueue.length} qualified reviews.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
