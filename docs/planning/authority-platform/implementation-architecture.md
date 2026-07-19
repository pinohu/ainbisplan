# Authority Platform Implementation Architecture

**Status:** Planned architecture  
**Goal:** implement the full authority, SEO, content, conversion, measurement, and governance system once and configure it correctly for each business

## Architectural principle

The portfolio should share infrastructure without sharing superficial identity. Applications consume semantic capabilities and typed business plans. They do not copy a universal landing-page template or import raw design primitives.

The implementation is organized into:

1. source and planning data;
2. shared domain-neutral packages;
3. authority and experience-archetype packages;
4. content, search, and growth services;
5. site applications;
6. portfolio operations and monitoring.

## Repository boundaries

### `pinohu/ainbis`

Remains the authoritative blueprint, source inventory, build, and launch-artifact repository.

### `pinohu/ainbisplan`

Becomes the canonical architecture, planning, schemas, generated per-business plans, shared package specifications, and reference implementation repository.

### Launch-network application repository

Consumes synchronized plan summaries and runtime metadata for catalog, progress, evidence, and operations.

No repository may independently invent business counts, titles, slugs, or completion states. Inventory and planning records reconcile through stable identifiers and hashes.

## Proposed workspace

```text
ainbisplan/
├── apps/
│   ├── authority-reference/
│   ├── authority-preview/
│   ├── portfolio-console/
│   └── plan-review/
├── packages/
│   ├── tokens/
│   ├── core/
│   ├── archetypes/
│   ├── brand-engine/
│   ├── authority-ui/
│   ├── content-models/
│   ├── editorial-workflow/
│   ├── seo-core/
│   ├── structured-data/
│   ├── internal-linking/
│   ├── content-intelligence/
│   ├── entity-graph/
│   ├── programmatic-quality/
│   ├── local-seo/
│   ├── international-seo/
│   ├── media-seo/
│   ├── lead-generation/
│   ├── newsletters/
│   ├── consent/
│   ├── analytics/
│   ├── experimentation/
│   ├── accessibility/
│   ├── performance/
│   ├── security-privacy/
│   ├── reputation/
│   ├── search-monitoring/
│   ├── migration/
│   ├── portfolio-governance/
│   └── testing/
├── plans/businesses/
├── schemas/
├── templates/
├── scripts/
└── docs/planning/
```

## Package responsibilities

### `@ainbis/authority-ui`

Provides accessible, performant compositions rather than a single visual theme:

- editorial shell and reading layout;
- topic hub, resource collection, glossary, Q&A, author, reviewer, methodology, source, and update-history patterns;
- evidence, citation, disclosure, key-takeaway, comparison, process, checklist, calculator, quiz, download, newsletter, and CTA compositions;
- trust, pricing, process, eligibility, security, and service-boundary blocks;
- responsive navigation, search, breadcrumbs, related content, and footer patterns;
- documented analytics and accessibility contracts;
- brand-engine integration through semantic tokens.

### `@ainbis/content-models`

Defines typed, versioned content entities:

- business and organization;
- product, service, offer, workflow, deliverable, and eligibility;
- audience, role, industry, problem, and use case;
- topic, article, guide, question, definition, comparison, and resource;
- regulation, standard, authority, requirement, deadline, form, and jurisdiction;
- author, reviewer, expert, credential, affiliation, and disclosure;
- citation, source, claim, evidence, methodology, correction, and revision;
- tool, input, assumption, formula, result, disclaimer, and export;
- location, service area, language, and locale;
- newsletter, segment, campaign, lead magnet, and preference;
- URL, page type, indexability, canonical, schema profile, and review policy.

### `@ainbis/editorial-workflow`

Implements:

- research packet intake;
- source and claim verification;
- editorial state machine;
- domain-review routing;
- conflicts and disclosure checks;
- corrections and retractions;
- review dates and stale-content queues;
- translation and localization review;
- author, reviewer, and approver audit trail;
- AI-assistance provenance;
- policy-based publication and indexability approval.

### `@ainbis/seo-core`

Owns:

- metadata and title rules;
- canonical and host validation;
- robots and indexability policies;
- sitemap generation and partitioning;
- redirects, status codes, error handling, and migration maps;
- URL normalization and parameter governance;
- hreflang and alternate URLs;
- crawlable navigation and link validation;
- search-engine verification and environment safety;
- release-time technical SEO tests.

### `@ainbis/structured-data`

Provides:

- typed schema registry;
- entity IDs and graph relationships;
- JSON-LD generation;
- visible-content parity validation;
- page-type eligibility rules;
- deprecated or unsupported feature controls;
- Rich Results and schema validation adapters;
- production monitoring and issue reporting.

### `@ainbis/internal-linking`

Provides:

- hub, spoke, sibling, entity, regulation, glossary, service, resource, and conversion relationships;
- descriptive anchor recommendations;
- orphan, depth, dead-end, repetitive-anchor, and broken-link checks;
- cross-site editorial relationship controls;
- link-change diffs and release validation.

### `@ainbis/content-intelligence`

Stores and evaluates:

- user language, queries, intents, entities, topics, questions, and relationships;
- query-to-page assignments;
- content gaps and utility gaps;
- competitor and search-result observations;
- topic completeness and maintenance needs;
- cannibalization and consolidation signals;
- content prioritization;
- source-backed briefs and update recommendations.

It must not scrape search engines through prohibited automated traffic. Data adapters use approved APIs, licensed providers, manually imported research, or user-supplied datasets.

### `@ainbis/programmatic-quality`

Runs portfolio-wide safeguards:

- duplicate and near-duplicate content detection;
- title, description, heading, layout, and brand similarity checks;
- query and topic collision detection;
- independent-purpose and original-value evidence checks;
- doorway, thin-page, location-substitution, unsupported-claim, fabricated-proof, and scaled-content risk flags;
- required-review and citation coverage;
- pre-indexation blocker evaluation;
- consolidation and noindex recommendations.

### `@ainbis/local-seo`

Supports eligible businesses with:

- location and service-area models;
- NAP consistency;
- location-specific content evidence;
- listing and review workflows;
- map and directions contracts;
- local schema;
- local citation and community-partnership tracking;
- fake-location and doorway prevention.

### `@ainbis/international-seo`

Supports:

- locale and regional variants;
- hreflang;
- translated and localized content states;
- currencies, units, dates, terms, legal text, and jurisdiction;
- locale-specific source and reviewer requirements;
- fallback and x-default rules.

### `@ainbis/media-seo`

Supports image, video, audio, podcast, transcript, caption, thumbnail, chapter, and media-sitemap workflows.

### `@ainbis/lead-generation`

Provides:

- contextual forms and CTAs;
- assessments, downloads, scheduling, quote, demo, and intake flows;
- save and resume;
- validation, confirmation, routing, deduplication, and qualification;
- CRM and portal adapters;
- ethical conversion safeguards;
- conversion event contracts.

### `@ainbis/newsletters`

Provides:

- newsletter definitions and shared vertical options;
- subscription and preference management;
- segmentation and attribution;
- sequence definitions;
- archives and indexability decisions;
- deliverability and list-health adapters;
- suppression, unsubscribe, and consent enforcement.

### `@ainbis/consent`

Centralizes privacy signals, lawful-basis metadata, cookie and tracker consent, communication preferences, revocation, deletion, and audit history.

### `@ainbis/analytics`

Defines:

- event taxonomy;
- content, tool, form, lead, email, conversion, retention, and revenue events;
- consent-aware collection;
- first-party identity boundaries;
- attribution models;
- portfolio and business dashboards;
- data-quality tests.

### `@ainbis/experimentation`

Provides hypothesis, audience, variants, guardrails, duration or evidence requirements, rollout, stopping, analysis, and decision records. Accessibility, privacy, trust, and factual integrity are non-negotiable guardrails.

### `@ainbis/accessibility`

Provides component rules, automated tests, manual checklists, assistive-technology matrices, document and media checks, issue severity, remediation workflow, and accessibility-statement support.

### `@ainbis/performance`

Provides template budgets, build checks, lab tests, real-user monitoring, Core Web Vitals, resource inventories, third-party governance, regression alerts, and release blockers.

### `@ainbis/security-privacy`

Provides secure headers, form and upload policies, data classification, retention, access control, logging, dependency and secret checks, incident response, and sensitive-domain extensions.

### `@ainbis/reputation`

Tracks experts, associations, media, partnerships, reviews, references, citations, backlinks, unlinked mentions, reputation incidents, permissions, and prohibited authority-acquisition tactics.

### `@ainbis/search-monitoring`

Integrates Search Console, Bing Webmaster Tools, sitemap submission, indexing, crawl stats, URL inspection workflows, enhancements, manual actions, security issues, server logs, search performance, content decay, and technical incidents.

### `@ainbis/migration`

Provides inventories, URL maps, redirects, canonical transitions, content reconciliation, release checklists, rollback, post-launch monitoring, and retirement workflows.

### `@ainbis/portfolio-governance`

Maintains:

- inventory-plan-catalog-runtime reconciliation;
- plan status and evidence;
- owners and reviewers;
- business overlap and similarity;
- indexability approvals;
- package adoption;
- policy exceptions;
- launch, monitoring, and audit state;
- complete business-creation gate enforcement.

## Planning and source synchronization

The plan generator accepts:

```text
--inventory <path-to-INVENTORY.json>
--blueprints-root <path-to-ainbis-checkout>
--output plans/businesses
--mode scaffold|refresh|validate
```

It produces deterministic scaffolds keyed by slug and blueprint hash. It preserves reviewed fields during refresh and flags conflicts rather than overwriting human decisions.

The intended cross-repository workflow is:

1. check out `pinohu/ainbis` and `pinohu/ainbisplan` in an authenticated automation environment;
2. regenerate `docs/INVENTORY.json` in the source repository;
3. invoke the plan generator with the inventory and blueprint root;
4. validate the complete 1:1 mapping between inventory businesses and plans;
5. commit changed plans and registry summaries;
6. regenerate the launch-network catalog;
7. reconcile inventory, plan, catalog, build, and runtime counts;
8. fail completion if any record is missing or inconsistent.

## Application architecture

Authority sites should default to static generation or server rendering for public content. Client JavaScript is reserved for interactions that require it. The precise framework may be selected during reference implementation, but the platform requires:

- semantic HTML output;
- deterministic URLs and metadata;
- framework-independent content models;
- typed adapters rather than package internals leaking into applications;
- preview and production environment separation;
- content and plan version display in administrative views;
- page-level indexability and review state;
- portable build output and documented migration path.

## Data and content storage

The architecture supports Git-backed planning and code plus a content system appropriate to scale. The selected content store must provide:

- typed schemas and validation;
- version history and editorial workflow;
- granular permissions;
- references among content, entities, sources, authors, reviewers, and tools;
- localization;
- preview;
- export and backup;
- webhook or event support;
- no vendor-only representation of canonical business identity or planning state.

## Testing layers

Every shared package and application must support:

- schema and type validation;
- unit tests for deterministic logic;
- integration tests for package composition;
- content and source validation;
- technical SEO tests;
- structured-data tests;
- accessibility automation and manual review;
- visual regression;
- responsive and browser matrices;
- performance budgets;
- privacy and security checks;
- end-to-end conversion and lifecycle flows;
- production smoke, crawl, form, analytics, and monitoring checks.

## Observability

A portfolio console should expose:

- authoritative inventory and plan parity;
- blueprint hash and stale-plan state;
- build and deployment status;
- indexability and sitemap state;
- content, reviewer, citation, and freshness gaps;
- duplicate, overlap, and policy risk;
- accessibility and performance results;
- crawl, indexing, structured-data, and search incidents;
- lead, email, conversion, and downstream quality;
- backlinks, mentions, reviews, and reputation;
- complete evidence for every business-creation and release gate.

## Reference implementations

Before portfolio-wide migration, the platform should be proven through diverse reference sites:

1. a launched regulatory-compliance business;
2. an undeveloped high-risk or YMYL business;
3. a professional-service business;
4. a software or workflow business;
5. a local or location-sensitive business;
6. a data- or tool-intensive business.

Each reference must demonstrate distinct brand expression and business-specific authority while using the same shared contracts.

## Implementation rule

Packages are promoted only after repeated, validated use. Business-specific needs begin as plan extensions. A pattern becomes shared when it is domain-neutral, reusable, accessible, tested, and does not force unrelated businesses into the same presentation or operating model.