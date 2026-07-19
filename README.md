# AINBIS Plan

The canonical planning, architecture, governance, and implementation repository for the AINBIS portfolio-wide design-system and authority-site ecosystem.

## Vision

AINBIS Plan implements **one shared foundation, multiple specialized experience systems, and many distinct but governed brands**. It supports authority websites, professional-service businesses, SaaS workflows, operations dashboards, clinical tools, academic properties, local directories, children’s learning products, real-estate analysis, and AI-native interfaces without forcing them into one generic visual template.

Every AINBIS business receives an individualized, versioned authority implementation plan. Shared packages provide reusable accessibility, performance, SEO, content, analytics, privacy, security, and conversion capabilities; the individual plan defines the business-specific audience, purpose, offer, authority thesis, sources, entities, queries, content graph, tools, lead magnets, newsletter, evidence, reviewers, brand, technical profile, off-site authority, implementation backlog, and indexability decision.

## Repository structure

```text
.
├── docs/
│   ├── planning/
│   │   └── authority-platform/      Complete authority and SEO program
│   └── governance/                  Contribution and lifecycle rules
├── packages/
│   ├── tokens/                      Primitive and semantic design tokens
│   ├── core/                        Shared accessible UI foundation
│   ├── archetypes/                  Experience-system registry
│   └── brand-engine/                Controlled brand-expression generator
├── plans/businesses/                Generated and reviewed plans by business slug
├── schemas/                         Machine-readable planning contracts
├── templates/                       Human-reviewable planning templates
├── fixtures/                        Validation fixtures
├── scripts/                         Validation and plan-generation automation
└── .github/workflows/               Continuous validation
```

## Core architecture

1. **Foundation:** accessibility, typography mechanics, responsive behavior, forms, navigation, states, validation, performance, SEO, analytics, privacy, security, content structure, and component contracts.
2. **Experience archetypes:** specialized rules for authority publishing, professional trust, SaaS, operations, healthcare, academic, directory, children’s learning, real estate, premium consumer, AI-native, and administrative systems.
3. **Brand engine:** controlled variation in typography, color, density, shape, editorial character, motion, evidence, and interaction style.
4. **Authority platform:** content models, editorial workflows, SEO core, structured data, internal linking, content intelligence, programmatic-quality safeguards, tools, lead generation, newsletters, analytics, reputation, monitoring, and governance.
5. **Business plans:** one machine-readable plan per normalized inventory slug, with explicit research, differentiation, implementation, quality, and indexability decisions.
6. **Business extensions:** only the domain-specific components and patterns that cannot be expressed safely in shared layers.
7. **Governance:** maturity states, domain review, accessibility, performance, security, privacy, content integrity, visual regression, versioning, change control, evidence, and documentation.

## Complete authority implementation program

Start with:

- `docs/planning/authority-platform/README.md`;
- `docs/planning/authority-platform/feature-catalog.md`;
- `docs/planning/authority-platform/per-business-plan-contract.md`;
- `docs/planning/authority-platform/implementation-architecture.md`;
- `docs/planning/authority-platform/programmatic-seo-network-safety.md`;
- `docs/planning/authority-platform/delivery-program.md`;
- `docs/planning/authority-platform/quality-gates.md`.

The program covers every current and future business. A generated website is not automatically approved for indexation. Indexability is a controlled state earned through evidence.

## Generate individualized plans

With authenticated local checkouts of both repositories:

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --blueprints-root ../ainbis \
  --output plans/businesses \
  --mode scaffold
```

Refresh inventory and blueprint provenance while preserving reviewed decisions:

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --blueprints-root ../ainbis \
  --output plans/businesses \
  --mode refresh
```

Validate exact inventory-to-plan parity:

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --output plans/businesses \
  --mode validate
```

A scaffold is not a completed plan. Current research, independent-purpose review, portfolio differentiation, qualified domain review where applicable, owners, evidence, content and utility decisions, technical configuration, and all indexability gates must be completed.

## Planning archive

`docs/planning/` is the required home for consolidated planning. Any substantial plan, generated handoff, architecture proposal, audit, implementation specification, or business plan created for this initiative must be committed there, under `plans/businesses/`, or linked from the artifact index.

## Development commands

```bash
corepack enable
pnpm install
pnpm validate
pnpm plan:sample
pnpm build
pnpm typecheck
pnpm check
```

## Current source baseline

The authoritative `pinohu/ainbis` inventory currently records 691 businesses, of which 38 are developed and launched. The plan generator is designed to create a 1:1 planning registry for all 691 and to include future businesses in the same-run regeneration workflow.

## Status

The repository contains the initial design-system foundation, the experience-archetype registry, the deterministic brand-profile generator, the complete authority implementation program, the per-business JSON Schema and template, and a deterministic portfolio plan generator with CI coverage. Shared authority packages and reference applications remain planned implementation work governed by these contracts.