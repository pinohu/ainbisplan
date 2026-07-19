# Planning Artifact Index

**Status:** Accepted  
**Last updated:** 2026-07-19

This index records the planning material consolidated in the repository and provides the required landing place for future generated files.

## Core design-system and portfolio artifacts

| Artifact | Purpose | Status |
|---|---|---|
| `portfolio-design-system-plan.md` | Portfolio-wide design-system strategy, principles, archetypes, content, conversion, accessibility, SEO, and governance | Accepted |
| `project-system-map.md` | Maps known businesses, platforms, tools, and initiatives to their primary and secondary experience systems | Accepted |
| `implementation-roadmap.md` | Phased implementation sequence, quality gates, and completion criteria | Accepted |
| `decisions/ADR-001-federated-design-system.md` | Records the decision to use one foundation with multiple experience archetypes and governed brand variation | Accepted |
| `generated/README.md` | Intake rules and manifest for future generated plans, prompts, handoffs, audits, exports, and supporting files | Accepted |

## Complete authority-platform program

| Artifact | Purpose | Status |
|---|---|---|
| `authority-platform/README.md` | Portfolio-wide authority implementation decision, outcomes, planning levels, indexability states, and synchronization rules | Accepted |
| `authority-platform/feature-catalog.md` | Exhaustive catalog of authority, content, SEO, accessibility, performance, conversion, newsletter, analytics, privacy, security, reputation, and operational requirements | Required |
| `authority-platform/per-business-plan-contract.md` | Mandatory individualized plan fields, research, authority thesis, content graph, utility, conversion, technical, off-site, and implementation requirements for every business | Required |
| `authority-platform/implementation-architecture.md` | Applications, packages, services, repository boundaries, synchronization, testing, and observability architecture | Implemented in stages |
| `authority-platform/programmatic-seo-network-safety.md` | Anti-doorway, anti-scaled-content, differentiation, originality, claim-integrity, cross-linking, collision, consolidation, and indexation policy | Required |
| `authority-platform/delivery-program.md` | Portfolio workstreams, cohorts, reference implementations, launched-site migration, high-risk review, continuous operations, and business stages | Active |
| `authority-platform/quality-gates.md` | Hard blockers, scored dimensions, evidence requirements, indexability decision, continuous enforcement, and definition of done | Required |
| `authority-platform/source-standards.md` | Official search, structured data, Core Web Vitals, WCAG, security, privacy, and domain-source baseline | Required |

## Autonomous portfolio operations

| Artifact | Purpose | Status |
|---|---|---|
| `autonomous-controller/README.md` | Cross-repository controller architecture, delegated operating model, exception policy, release flow, credentials, and recovery procedures | Implemented |
| `controller/config.json` | Machine-readable automation, gating, operating-model, Release Zero, and escalation policy | Implemented |
| `scripts/controller/reconcile.mjs` | Reconciles source inventory, blueprint hashes, plans, launch catalog, build manifest, operators, reviewers, gates, and desired actions | Implemented |
| `scripts/controller/validate.mjs` | Validates controller state and prevents unsafe indexability or false exception-only readiness | Implemented |

## Machine-readable planning assets

| Artifact | Purpose | Status |
|---|---|---|
| `schemas/business-authority-plan.schema.json` | JSON Schema defining the authoritative per-business planning contract | Required |
| `templates/business-authority-plan.template.json` | Human-reviewable complete plan scaffold | Accepted |
| `scripts/generate-business-authority-plans.mjs` | Generates or refreshes one plan directory per inventory slug and validates exact inventory-plan parity | Implemented |
| `fixtures/inventory.sample.json` | CI fixture proving deterministic generation and parity validation | Implemented |
| `fixtures/controller.config.sample.json` | CI fixture proving deterministic controller operation without cross-repository credentials | Implemented |

## Current authoritative inventory baseline

The source inventory in `pinohu/ainbis` currently records:

- 693 normalized businesses;
- 535 factory/main blueprints;
- 158 imported blueprints;
- 38 developed builds;
- 38 launched microsites;
- 699 raw blueprint artifacts before slug deduplication.

The controller is designed to regenerate the plan corpus and launch catalog whenever the authoritative inventory changes. A generated plan is not an approved implementation or indexability decision; current research, accountable owners, qualified review where required, original utility, business-specific content, and every blocking gate remain mandatory.

## Historical planning represented in the consolidation

The planning archive incorporates conclusions developed across the user’s portfolio, including:

- the AINBIS and Your Deputy authority-site network;
- AINBIS Launch Network inventory and deployment operations;
- immediate inventory, plan, and catalog regeneration after every business creation;
- unique, high-authority business sites with newsletters, ebooks, downloads, quizzes, tools, data, templates, and other lead magnets;
- Erie.pro local directory and authority-site requirements;
- Notroom professional-service, notary, RON, and scheduling requirements;
- compliance and workflow products such as SlipLienClear;
- pediatric clinical documentation and referral-improvement workflows;
- Gannon academic, engineering-management, ABET, grant, and institutional experiences;
- real-estate investment scanning and analysis;
- children’s educational media and the Lumi & Pip concept;
- Kwode, Dynasty Site Factory, agent operations, and AI-native tooling;
- portfolio-wide accessibility, SEO, performance, content, analytics, trust, security, privacy, reputation, and governance requirements.

## Future artifact policy

A generated file is not considered preserved until it is:

1. committed under `docs/planning/generated/`, `plans/businesses/`, or another documented planning subfolder;
2. linked in this index or a generated registry indexed here;
3. assigned a status and date;
4. associated with an issue, pull request, package, application, source blueprint, or business plan when implementation work exists;
5. reproducible from documented inputs when generated.

Large binary exports should be stored using an appropriate GitHub-compatible strategy and represented here by a manifest entry, checksum, source, and regeneration instructions.
