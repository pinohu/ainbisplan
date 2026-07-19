# AINBIS Plan

The canonical planning, architecture, governance, and implementation repository for the AINBIS portfolio-wide design-system ecosystem.

## Vision

AINBIS Plan implements **one shared foundation, multiple specialized experience systems, and many distinct but governed brands**. It is designed to support authority websites, professional-service businesses, SaaS workflows, operations dashboards, clinical tools, academic properties, local directories, children’s learning products, real-estate analysis, and AI-native interfaces without forcing them into one generic visual template.

## Repository structure

```text
.
├── docs/
│   ├── planning/                 Consolidated plans, maps, roadmaps, handoffs
│   └── governance/               Contribution and lifecycle rules
├── packages/
│   ├── tokens/                   Primitive and semantic design tokens
│   ├── core/                     Shared accessible UI foundation
│   ├── archetypes/               Experience-system registry
│   └── brand-engine/             Controlled brand-expression generator
├── scripts/                      Repository validation and automation
└── .github/workflows/            Continuous validation
```

## Core architecture

1. **Foundation:** accessibility, typography mechanics, responsive behavior, forms, navigation, states, validation, performance, SEO, analytics, privacy, content structure, and component contracts.
2. **Experience archetypes:** specialized rules for authority publishing, professional trust, SaaS, operations, healthcare, academic, directory, children’s learning, real estate, premium consumer, AI-native, and administrative systems.
3. **Brand engine:** controlled variation in typography, color, density, shape, editorial character, motion, and interaction style.
4. **Business extensions:** only the domain-specific components and patterns that cannot be expressed safely in the shared layers.
5. **Governance:** maturity states, accessibility and visual regression, versioning, change control, and documentation requirements.

## Planning archive

`docs/planning/` is the required home for consolidated planning. Any substantial plan, generated handoff, architecture proposal, audit, or implementation specification created for this initiative must be committed there or linked from its artifact index.

## Initial commands

```bash
corepack enable
pnpm install
pnpm validate
pnpm typecheck
```

## Status

The repository currently contains the initial design-system foundation, the first planning archive, the experience-archetype registry, and a deterministic brand-profile generator. Component libraries and application-specific adapters will be added incrementally behind documented contracts.
