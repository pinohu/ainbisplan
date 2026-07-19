# Planning Archive

This directory is the canonical archive for AINBIS portfolio planning and generated implementation artifacts.

## Required storage rule

Every substantial plan, audit, architecture decision, implementation handoff, prompt, generated specification, research synthesis, migration plan, or portfolio map created for this initiative must be committed in this directory or referenced from `artifact-index.md`.

## Directory conventions

```text
docs/planning/
├── README.md
├── artifact-index.md
├── portfolio-design-system-plan.md
├── project-system-map.md
├── implementation-roadmap.md
├── decisions/
│   └── ADR-001-federated-design-system.md
└── generated/
    └── README.md
```

## File naming

Use lowercase kebab-case. Prefix time-sensitive generated material with an ISO date when useful, for example:

```text
2026-07-19-authority-site-audit.md
2026-07-19-codex-handoff.md
```

## Artifact status

Each planning artifact should identify its status near the top:

- **Draft** — under active development.
- **Accepted** — approved as the current direction.
- **Superseded** — retained for history but replaced.
- **Implemented** — reflected in code and validation.

## Traceability

Implementation pull requests should link the planning file or architecture decision that justifies the change. Planning files should link the packages, applications, workflows, or issues that implement them.
