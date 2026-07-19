# Portfolio Delivery Program

**Status:** Planned  
**Scope:** all current and future AINBIS businesses

## Delivery strategy

The portfolio will be implemented through evidence-based cohorts, not a single mass-generation event. Shared platform capabilities are built once, proven on diverse reference businesses, then adopted in waves. Every wave preserves the same quality gates and individualized planning contract.

## Workstream 0 — Inventory, plan registry, and reconciliation

Deliverables:

- import the authoritative AINBIS inventory;
- create one plan record for every normalized business slug;
- record blueprint path, hash, source, developed status, launched status, and plan status;
- create the portfolio query, topic, entity, and overlap registry;
- add automatic plan scaffolding to the same-run business-creation workflow;
- reconcile inventory, plan, catalog, build, microsite, and runtime counts;
- fail CI when a business is missing a plan or a plan lacks an inventory record;
- expose stale blueprint and stale plan states.

Exit criteria:

- 1:1 inventory-to-plan mapping;
- no unexplained duplicate slug or title;
- every business assigned an initial archetype, sensitivity class, and planning state;
- no business marked complete without planning-registry evidence.

## Workstream 1 — Research and classification

Each business receives an initial triage that determines:

- independent purpose and likely consolidation risk;
- intended audience and workflow;
- geographic and jurisdiction model;
- YMYL and domain sensitivity;
- source and reviewer requirements;
- primary and secondary archetypes;
- product, service, content, tool, directory, data, or hybrid model;
- likely query and entity ownership;
- original utility opportunity;
- indexability recommendation;
- implementation priority and dependencies.

Businesses that fail independent-purpose review move to repositioning or consolidation before implementation.

## Workstream 2 — Shared platform foundation

Build and stabilize:

- expanded tokens and design foundations;
- authority content models;
- editorial workflow;
- authority UI compositions;
- SEO core;
- structured data;
- content intelligence and entity graph;
- internal linking;
- programmatic quality;
- lead generation and newsletters;
- consent, analytics, and experimentation;
- accessibility and performance harnesses;
- security, privacy, reputation, search monitoring, migration, and governance packages;
- portfolio console and plan-review application.

Exit criteria:

- shared contracts are documented, typed, tested, and reference-implemented;
- no application depends on raw primitive tokens or ad hoc SEO logic;
- indexability is controlled by evidence, not deployment status.

## Workstream 3 — Reference implementations

Select a representative reference set from the inventory covering:

- an existing launched regulatory-compliance site;
- an undeveloped high-risk or YMYL business;
- a professional-service business;
- a guided SaaS or document-workflow business;
- a local or jurisdiction-sensitive business;
- a data, assessment, calculator, or tool-intensive business.

For each reference:

1. complete the individualized plan;
2. conduct source and search research;
3. validate independent purpose and portfolio differentiation;
4. implement distinct brand expression;
5. build the launch content graph and original utility;
6. implement conversion and lifecycle systems;
7. pass technical, accessibility, performance, privacy, security, content, and authority gates;
8. launch or migrate with monitoring;
9. capture reusable patterns and promote only domain-neutral patterns into shared packages.

## Workstream 4 — Existing launched properties

The 38 currently launched properties require preservation-first migration.

For every launched property:

- inventory current URLs, content, metadata, schema, backlinks, search performance, analytics, leads, and conversions;
- crawl the existing property and record status, canonical, robots, sitemap, internal links, performance, accessibility, and errors;
- compare current content and claims with its blueprint and new plan;
- determine keep, improve, consolidate, redirect, noindex, or retire decisions per URL;
- preserve valuable URLs and search equity;
- avoid simultaneous domain, framework, brand, information-architecture, and content changes unless necessary;
- create redirect and rollback plans;
- validate analytics and consent parity;
- monitor crawl, indexation, rankings, conversions, errors, and Core Web Vitals after release.

A launched site is not rebuilt merely to conform visually. Migration must improve authority and user value without unnecessary loss.

## Workstream 5 — High-risk and sensitive businesses

Clinical, legal, financial, employment, housing, safety, environmental, identity, children’s, and other consequential businesses require:

- qualified domain-review assignment before indexable content production;
- explicit claim, source, disclaimer, and escalation models;
- tool logic and calculation review;
- stricter freshness and effective-date tracking;
- conservative conversion and outcome claims;
- sensitive-data minimization and secure handling;
- documented professional-advice boundaries;
- indexation blocked until reviewer and evidence requirements are met.

These businesses may be technically implemented early but remain non-indexable until authority and safety operations exist.

## Workstream 6 — High-value undeveloped businesses

Prioritize undeveloped businesses using a transparent scorecard:

- user pain and consequence;
- evidence of market demand;
- business value and monetization path;
- availability of credible sources and reviewers;
- ability to provide original utility;
- differentiation from the portfolio;
- implementation reuse;
- search opportunity without dependence on thin scaled content;
- maintenance burden;
- legal, privacy, safety, and reputation risk.

The score recommends sequencing but never bypasses mandatory gates.

## Workstream 7 — Remaining portfolio cohorts

After shared packages and reference sites are stable, remaining businesses move through cohorts grouped by reusable domain patterns, for example:

- healthcare compliance and reimbursement;
- employment and benefits;
- environmental and safety;
- financial services, tax, audit, and reporting;
- government contracting and grants;
- real estate, housing, construction, and facilities;
- transportation, logistics, trade, and import/export;
- insurance, claims, and revenue recovery;
- privacy, cybersecurity, AI, data, and communications;
- marketplaces, seller platforms, and vendor disputes;
- professional documentation and evidence-pack workflows.

Each cohort shares research adapters, content primitives, and domain-neutral workflow components while retaining distinct plans, brands, offers, and authority graphs.

## Workstream 8 — Content and authority operations

For every indexable business, establish:

- editorial calendar;
- update and regulatory-change calendar;
- author, reviewer, and expert pipeline;
- source and citation monitoring;
- original research and utility roadmap;
- newsletter and audience-development program;
- digital PR, partnership, review, and reputation program;
- content refresh, consolidation, pruning, and retirement queues;
- search, crawl, indexation, conversion, accessibility, and performance dashboards;
- quarterly or risk-based authority review.

A site without an operating model is not complete.

## Workstream 9 — Portfolio governance and continuous regeneration

Every new or changed business triggers:

1. blueprint validation;
2. slug/title deduplication;
3. source inventory regeneration;
4. plan scaffold generation or refresh;
5. overlap and collision analysis;
6. launch-network catalog regeneration;
7. count reconciliation;
8. generated artifact commits;
9. runtime, catalog, and planning-registry verification;
10. completion evidence.

Changes to shared packages trigger affected-business analysis, migration notes, tests, and controlled rollout.

## Business implementation stages

Each business progresses through:

```text
INVENTORIED
  -> SCAFFOLDED
  -> RESEARCHING
  -> DIFFERENTIATED
  -> PLAN_REVIEW
  -> IMPLEMENTATION_READY
  -> PRIVATE_BUILD
  -> QUALITY_REVIEW
  -> PUBLIC_NOINDEX
  -> INDEXABLE_CANDIDATE
  -> INDEXABLE
  -> OPERATING
```

Alternate outcomes:

```text
REPOSITION_REQUIRED
CONSOLIDATION_REQUIRED
RESTRICTED
RETIRED
BLOCKED
FAILED
```

Transitions require evidence and owners. `INDEXABLE` and `OPERATING` cannot be manually asserted without mandatory gate results.

## Implementation epics per business

Every business receives epics for:

1. discovery, source research, and differentiation;
2. offer, audience, and commercial validation;
3. brand and design-system configuration;
4. content and entity modeling;
5. information architecture and URL plan;
6. authority content and trust pages;
7. product, service, or workflow experience;
8. original utility and lead magnets;
9. editorial and domain-review operations;
10. technical SEO, structured data, and internal linking;
11. lead capture, newsletter, CRM, and lifecycle;
12. analytics, attribution, experimentation, and dashboards;
13. accessibility, performance, security, privacy, and legal review;
14. off-site authority, partnerships, reviews, and reputation;
15. migration, launch, indexation, monitoring, and rollback;
16. continuous content, regulatory, product, and technical maintenance.

## Portfolio prioritization views

The portfolio console should support views by:

- launched versus undeveloped;
- indexability state;
- independent-purpose risk;
- YMYL and reviewer requirement;
- domain or cohort;
- business value;
- search and content opportunity;
- plan completeness;
- blueprint freshness;
- shared-package dependencies;
- accessibility, performance, technical SEO, content, and reputation risk;
- consolidation candidate;
- owner and blocker.

## Migration rules

- preserve useful existing URLs whenever practical;
- redirect only to genuinely equivalent destinations;
- do not redirect unrelated retired content to the homepage;
- update internal links, canonical URLs, sitemaps, structured data, analytics, and external references;
- retain migration maps and evidence;
- use staged release and rollback for consequential migrations;
- monitor beyond launch until crawl, indexation, user, and business signals stabilize.

## Operating cadence

The program requires recurring:

- inventory-plan-catalog-runtime reconciliation;
- source, regulation, standard, and deadline monitoring;
- content freshness and citation checks;
- broken-link, canonical, robots, sitemap, schema, and status checks;
- search performance and indexation reviews;
- accessibility and performance regression reviews;
- security and dependency reviews;
- lead quality, conversion, deliverability, and consent audits;
- backlink, mention, review, and reputation monitoring;
- business overlap, consolidation, and retirement reviews.

## Definition of portfolio completion

The portfolio program is not complete when all businesses have generated websites. It is successful when:

- every inventory business has an individualized, current plan;
- every public site has an independent purpose and passed indexability gates;
- all sensitive sites have accountable qualified review;
- every site supplies original value and useful utility;
- shared quality is inherited and continuously tested;
- content and products remain current and operated;
- incomplete, duplicative, unsupported, or unsafe businesses remain non-indexable, are repositioned, or are consolidated;
- inventory, plans, catalogs, builds, deployments, and runtime remain reconciled.