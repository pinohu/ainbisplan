# ADR-001: Adopt a Federated Design-System Ecosystem

**Status:** Accepted  
**Date:** 2026-07-19

## Context

The portfolio includes hundreds of niche authority businesses as well as professional services, SaaS workflows, operations dashboards, clinical documentation, academic properties, local directories, children’s media, real-estate analysis, AI-native tools, and internal administration.

A single visual template would reduce maintenance in the short term but would create cloned experiences, weak domain fit, inappropriate interaction patterns, and limited brand authority. Fully independent design systems would create accessibility drift, duplicated engineering, inconsistent state semantics, fragmented analytics, and prohibitive maintenance.

## Decision

Adopt a federated ecosystem with four implementation layers:

1. **Universal foundation** — tokens, accessibility, responsive behavior, state semantics, form behavior, performance, privacy, analytics, SEO, content contracts, and component APIs.
2. **Experience archetypes** — reusable patterns for distinct user tasks and risk contexts.
3. **Controlled brand expression** — deterministic variation within validated ranges.
4. **Business extensions** — narrowly scoped domain components only when the first three layers cannot express the requirement safely.

Planning, architecture decisions, generated specifications, and implementation handoffs are stored in `docs/planning/`.

## Consequences

### Positive

- shared quality improvements propagate across the portfolio;
- businesses remain visually and experientially distinct;
- domain-specific risk is handled explicitly;
- accessibility, performance, SEO, and analytics become inherited capabilities;
- new businesses can be generated from governed inputs;
- migration can happen incrementally;
- operational states and completion evidence can be standardized.

### Costs

- archetype selection and brand generation require governance;
- token and component APIs must remain disciplined;
- reference applications are needed to prove abstractions;
- teams must resist bypassing semantic layers with raw values;
- domain reviewers are required for sensitive contexts.

## Rejected alternatives

### One universal visual system

Rejected because it would make authority sites and applications feel cloned and would force incompatible user tasks into the same page and component patterns.

### Independent system for every business

Rejected because it would duplicate accessibility, responsive, testing, analytics, SEO, and maintenance work across hundreds of properties.

### Theme-only architecture

Rejected because changing colors and typography does not address information architecture, workflow states, content requirements, risk, conversion, or domain-specific interaction patterns.

## Validation

This decision is validated when reference implementations across at least six materially different archetypes can share the foundation while remaining appropriate, distinct, accessible, performant, and maintainable.
