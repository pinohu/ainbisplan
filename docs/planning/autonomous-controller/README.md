# AINBIS Autonomous Portfolio Controller

**Status:** Implemented technical control layer; delegated operations still require accountable people and organization-owned credentials.  
**Owner:** Obuke LLC  
**Operating mode:** Exception-only

## Purpose

The Autonomous Portfolio Controller closes the operational loop across:

- `pinohu/ainbis` — authoritative blueprints, inventory, builds, runtime and deployment evidence;
- `pinohu/ainbisplan` — authority plans, quality gates, controller state, exceptions and portfolio decisions;
- `pinohu/ainbis-launchpad` — Lovable-backed control plane, generated catalog and operator dashboards.

The controller automatically repairs deterministic drift and refuses to fabricate research, credentials, approvals, expert review, customer proof or live-production evidence.

## Required lifecycle

Every new or changed business must complete this chain:

1. Validate the blueprint.
2. Deduplicate normalized slug and title.
3. Regenerate `docs/INVENTORY.json`.
4. Regenerate source-side launch catalog artifacts.
5. Generate or refresh the matching authority plan with the current blueprint hash.
6. Execute portfolio triage, dependencies, epics, technical policies and readiness checks.
7. Reconcile source inventory, plan corpus, launch catalog, build manifest and runtime state.
8. Assign automated and delegated actions.
9. Build privately when the plan is implementation-ready.
10. Deploy publicly as `noindex` only when the public-noindex gates pass.
11. Permit indexation only after every blocking authority, editorial, expert, accessibility, performance, privacy, security, analytics and migration gate passes.
12. Monitor, refresh, consolidate, restrict or retire the business through the same controller.

A business creation or update is not complete until the controller has recorded evidence for every deterministic step and an explicit exception for every non-automatable step.

## Fail-safe rules

- Missing credentials produce a controller exception; they never downgrade the checks.
- Missing plans or catalog rows are regenerated automatically.
- A blueprint hash change marks the plan stale and triggers refresh while preserving reviewed fields.
- Automated processes may advance a business to `private_build` or `public_noindex` only when configured.
- Automated processes may never set `indexable`.
- Qualified review cannot be simulated by AI or replaced by a generic disclaimer.
- A failed deployment must roll back or open a critical exception.
- Routine success is silent. Only configured exceptions notify the Portfolio Operator.

## State outputs

The controller writes reproducible artifacts under:

```text
controller/
├── config.json
├── state/
│   ├── controller-state.json
│   ├── business-actions.json
│   └── dispatch-plan.json
├── exceptions/
│   ├── open-exceptions.json
│   └── owner-exceptions.md
└── reports/
    ├── release-zero.json
    └── owner-summary.md
```

`controller-state.json` is the canonical cross-repository operating snapshot. It records counts, drift, business stages, automated actions, delegated actions, open exceptions and Release Zero readiness.

## Delegated organization

### Owner

Obuke LLC owns policy, capital allocation and exceptional strategic decisions. The owner should not be part of routine execution.

### Portfolio Operator

The Portfolio Operator or managed service must have written authority to:

- assign business, editorial, technical and approval owners;
- coordinate qualified reviewers;
- configure domains, email, analytics, CRM and newsletters;
- approve ordinary spending within a defined limit;
- handle support, refunds and routine incidents;
- approve non-sensitive publishing;
- pause, consolidate or recommend retirement;
- escalate only the exception types in `controller/config.json`.

### Reviewer network

The reviewer network must cover legal/regulatory, clinical/healthcare, tax/financial, employment/benefits, housing/real-estate, environmental/safety, privacy/cybersecurity and children/education work. Reviews must identify the reviewer, qualifications, scope, date, sources, decision and limitations.

### Technical Operator

The Technical Operator owns controller health, CI, deployments, rollback, secrets, dependency updates, monitoring and recovery. Automation may perform this role only inside its documented permissions.

## Authentication model

The preferred credential is an organization-owned GitHub App installed on all three repositories.

Required repository or organization configuration:

- Variable: `AINBIS_CONTROLLER_APP_ID`
- Secret: `AINBIS_CONTROLLER_PRIVATE_KEY`
- Optional fallback secret: `AINBIS_CONTROLLER_TOKEN`
- Optional launchpad ingest secret: `CONTROLLER_INGEST_TOKEN`

The GitHub App should have the narrowest permissions that support repository contents, pull requests, issues and actions. Do not embed tokens in prompts, source files, generated reports or issue bodies.

## Workflow model

### Source repository

The source trigger runs when inventory, blueprints, builds or deployment evidence change. It dispatches a controller event containing the source commit and inventory count.

### Planning repository

The controller workflow checks out all three repositories, refreshes plans, executes the authority program, reconciles state, validates the result, updates the exception issue, commits generated state and dispatches the consumer event.

### Launchpad repository

The consumer validates catalog parity, publishes controller state to the control plane, builds the application and routes only approved deployment candidates into the existing deploy pipeline.

## Release Zero

Release Zero is configured as CampaignClear:

`a2p-10dlc-brand-campaign-approval-completeness-pack-engine`

The controller launches it by gates rather than a promised date. Its release packet must include current source research, approved scope and differentiation, original readiness utility, reviewed content, accountable owners, production integrations, verified accessibility/performance/privacy/security, deployment evidence and an explicit indexability decision.

## Commands

Fixture validation:

```bash
pnpm controller:fixture
```

Full reconciliation with authenticated sibling checkouts:

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --blueprints-root ../ainbis \
  --output plans/businesses \
  --mode refresh

pnpm execute:portfolio

node scripts/controller/reconcile.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --source-root ../ainbis \
  --launchpad-root ../ainbis-launchpad \
  --build-manifest ../ainbis/builds/manifest.json \
  --mode apply

pnpm controller:validate
```

## Owner handoff test

The owner can leave routine operations only when `safe_for_exception_only_operation` is true. That requires exact source-plan and source-launchpad parity, no duplicate or stale plan artifacts, working organization-owned credentials, an active Portfolio Operator, an active reviewer network, and tested alert, rollback and recovery paths.

Even after this flag becomes true, the owner remains the legal owner unless ownership and authority are formally transferred.
