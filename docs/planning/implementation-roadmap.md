# Implementation Roadmap

**Status:** Accepted  
**Last updated:** 2026-07-19

## Objective

Build the portfolio design-system ecosystem in layers so shared quality is established before business-specific scale. Each phase must leave a usable, documented, testable increment.

## Phase 0 — Repository and planning foundation

**Outcome:** canonical repository, planning archive, architecture decision, workspace, validation, and ownership conventions.

Deliverables:

- workspace configuration;
- planning and generated-artifact directories;
- portfolio map and accepted design-system strategy;
- initial tokens, core styles, archetype registry, and brand engine;
- continuous validation workflow;
- contribution and lifecycle governance.

Exit criteria:

- repository validation passes;
- packages type-check and build;
- the planning index links all accepted artifacts;
- a draft pull request records the implementation.

## Phase 1 — Foundation hardening

**Outcome:** production-ready token, accessibility, responsive, state, and content contracts.

Deliverables:

- expanded primitive and semantic token sets;
- light, dark, and high-contrast-ready mappings;
- focus, motion, typography, spacing, grid, and elevation standards;
- framework-agnostic component behavior specifications;
- accessibility test harness;
- visual-regression baseline;
- performance budgets;
- analytics and consent event schemas;
- SEO metadata and structured-data helpers.

Exit criteria:

- WCAG 2.2 AA component checks;
- documented browser and assistive-technology matrix;
- no raw primitive imports from application code;
- automated token and contract validation.

## Phase 2 — Reference applications

**Outcome:** prove the foundation against distinct real-world experiences rather than synthetic demos.

Recommended reference implementations:

1. an AINBIS authority business;
2. AINBIS Launch Network operations;
3. Notroom professional-service scheduling;
4. Erie.pro directory;
5. pediatric clinical documentation;
6. Lumi & Pip children’s learning.

These six cover public content, lead generation, workflow, operational density, sensitive information, local discovery, and child-safe interaction.

Exit criteria:

- each reference uses the same foundation without visual cloning;
- accessibility, performance, content, analytics, and SEO are measurable;
- extension points are documented;
- duplicated patterns are promoted into shared packages.

## Phase 3 — Archetype packages

**Outcome:** stable domain-neutral packages for recurring experience patterns.

Planned packages:

- `ui-authority`;
- `ui-professional`;
- `ui-saas`;
- `ui-operations`;
- `ui-clinical`;
- `ui-academic`;
- `ui-directory`;
- `ui-kids`;
- `ui-real-estate`;
- `ui-ai`;
- `ui-admin`.

Each package should include:

- component compositions;
- page templates;
- content requirements;
- interaction and state rules;
- accessibility notes;
- analytics events;
- quality checks;
- examples and prohibited patterns.

## Phase 4 — Brand-expression generator

**Outcome:** deterministic, governed visual and content differentiation across businesses.

Deliverables:

- validated business-intake schema;
- archetype recommendation rules;
- brand DNA profile generation;
- token derivation within safe ranges;
- typography and imagery direction;
- content voice profile;
- CTA and evidence strategy;
- uniqueness checks across the portfolio;
- human-review and override workflow;
- generated implementation manifest.

Exit criteria:

- repeated inputs produce reproducible profiles;
- generated contrast and status semantics pass validation;
- similarity detection flags overly cloned profiles;
- every output records inputs, generator version, and overrides.

## Phase 5 — AINBIS authority-site platform

**Outcome:** transform individual businesses into durable niche authority properties.

Capabilities:

- topic and location hubs;
- article and resource templates;
- newsletter and segmentation;
- ebooks, downloads, checklists, and templates;
- quizzes, calculators, and assessment tools;
- expert profiles, citations, review dates, and update history;
- internal-link recommendations;
- lead attribution and consent;
- truthful schema generation;
- authority and content-gap dashboards.

Exit criteria:

- each site has a unique brand and content profile;
- lead magnets are tied to user intent;
- pages meet performance and accessibility budgets;
- content models support ongoing publishing rather than static launch pages.

## Phase 6 — Launch Network completion pipeline

**Outcome:** make business creation operationally complete and verifiable.

Required state machine:

```text
DRAFT
  -> BLUEPRINT_CREATED
  -> DEDUPLICATED
  -> SOURCE_INVENTORY_REGENERATED
  -> CATALOG_REGENERATED
  -> COUNTS_RECONCILED
  -> ARTIFACTS_COMMITTED
  -> RUNTIME_VERIFIED
  -> CATALOG_VERIFIED
  -> COMPLETE
```

Any failure moves the run to `BLOCKED` or `FAILED` with an owner, reason, retry path, and retained logs. `COMPLETE` cannot be set manually unless all evidence is present.

Exit criteria:

- every new business automatically triggers both regeneration processes;
- slug and title conflicts block completion;
- generated artifacts are committed;
- source, catalog, and runtime counts reconcile;
- runtime and catalog verification are independently recorded;
- dashboard status reflects evidence rather than optimistic progress.

## Phase 7 — Portfolio migration

**Outcome:** migrate existing businesses and applications without a big-bang rewrite.

Sequence:

1. inventory current UI, content, analytics, SEO, and accessibility debt;
2. classify each property by archetype;
3. generate or approve a brand profile;
4. adopt tokens and foundation;
5. migrate highest-value templates and workflows;
6. validate redirects, metadata, analytics, and structured data;
7. release behind measurable checkpoints;
8. remove legacy patterns after parity and verification.

Prioritize by business value, user risk, traffic, conversion opportunity, maintenance burden, and reusability.

## Phase 8 — Governance at scale

**Outcome:** keep hundreds of sites and applications coherent without central bottlenecks.

Deliverables:

- package owners and domain reviewers;
- component maturity registry;
- automated deprecation warnings;
- changesets and release notes;
- migration codemods where practical;
- design and code contribution templates;
- portfolio compliance dashboard;
- periodic accessibility, performance, SEO, and similarity audits.

## Cross-phase quality gates

Every release should address:

- accessibility;
- responsive behavior;
- performance;
- security and privacy;
- analytics and consent;
- SEO and structured content;
- localization readiness;
- error and recovery states;
- test coverage;
- documentation;
- provenance and change history.

## Definition of done for a feature

A feature is complete when:

1. behavior and user outcome are documented;
2. accessible states are implemented;
3. responsive behavior is verified;
4. loading, empty, partial, error, success, and recovery states exist;
5. analytics and privacy implications are addressed;
6. content requirements are documented;
7. tests and validation pass;
8. implementation and planning artifacts are linked;
9. deployment or package publication is verified;
10. no unresolved critical review or domain-safety issue remains.
