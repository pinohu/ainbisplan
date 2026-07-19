# Business Authority Plans

This directory stores one individualized authority implementation plan per normalized AINBIS inventory slug.

Generated structure:

```text
plans/businesses/<first-character>/<slug>/
├── plan.json
├── plan.md
├── research-manifest.json
├── content-map.json
├── entity-graph.json
├── implementation-backlog.json
└── evidence/
```

`plan.json` is the authoritative machine-readable record and must validate against `schemas/business-authority-plan.schema.json`.

## Generate

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --blueprints-root ../ainbis \
  --output plans/businesses \
  --mode scaffold
```

## Refresh

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --blueprints-root ../ainbis \
  --output plans/businesses \
  --mode refresh
```

## Validate exact parity

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --output plans/businesses \
  --mode validate
```

A generated scaffold is not an approved plan, a completed implementation, or permission to index a site. It must be populated and reviewed under `docs/planning/authority-platform/per-business-plan-contract.md` and pass `docs/planning/authority-platform/quality-gates.md`.

The current corpus-generation and review work is tracked in GitHub issue #2.