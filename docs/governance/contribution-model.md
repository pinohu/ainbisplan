# Contribution and Lifecycle Model

## Principles

Contributions must improve reuse without erasing domain fit. Shared packages own semantics and safe behavior; archetypes own recurring experience patterns; business applications own composition and truly unique domain needs.

## Placement test

Before adding code, determine the narrowest correct layer:

1. **Token:** a reusable design decision with no component behavior.
2. **Core:** universal behavior required across most experiences.
3. **Archetype:** a recurring pattern tied to a class of user tasks.
4. **Business extension:** a domain-specific need that cannot be composed safely from shared layers.
5. **Application:** page composition, business data, routing, and deployment.

Do not place a business-specific visual preference in core. Do not duplicate universal accessibility behavior in applications.

## Component maturity

### Experimental

May change without migration support. Must identify the problem being explored and the intended consumer.

### Candidate

Has at least one real implementation, documentation, accessibility review, and a stable-enough API for broader testing.

### Stable

Has multiple consumers or a strong platform requirement, tests, documentation, accessibility and responsive validation, ownership, and a release strategy.

### Deprecated

Still available but has a documented replacement, migration path, and removal target.

### Retired

Removed after migration evidence confirms that supported consumers no longer depend on it.

## Pull-request requirements

A shared-system pull request should document:

- user problem and affected archetypes;
- why the chosen layer is correct;
- accessibility behavior;
- responsive behavior;
- loading, empty, partial, error, success, and recovery states;
- content requirements;
- analytics, consent, privacy, and security implications;
- performance implications;
- tests and validation;
- migration impact;
- related planning file or architecture decision.

## Domain review

Clinical, legal, financial, identity, children’s, and other sensitive capabilities require a qualified domain review before being described as stable. Design-system validation does not replace clinical judgment, legal review, financial due diligence, or child-safety review.

## Brand overrides

Brand overrides may adjust approved brand tokens and compositions. They may not:

- reduce contrast below the supported threshold;
- remove focus visibility;
- redefine semantic states deceptively;
- hide material terms or disclosures;
- introduce dark patterns;
- bypass consent or privacy requirements;
- claim verification, deployment, publication, or completion without evidence.

## Documentation and artifact preservation

Substantial design rationale, generated implementation plans, audits, and handoffs must be stored under `docs/planning/` and linked from `docs/planning/artifact-index.md`.

## Release validation

Stable package releases require the repository validation script, TypeScript checks, package builds, relevant tests, and any domain-specific checks. The CI workflow must remain green before merge unless the pull request documents and obtains approval for a temporary exception.
