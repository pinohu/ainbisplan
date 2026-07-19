# Business Authority Plans

This directory stores one individualized authority implementation plan per normalized AINBIS inventory slug.

## Current corpus

**Generated:** 2026-07-19  
**Authoritative source:** `pinohu/ainbis`  
**Current inventory:** 691 businesses  
**Generated plans:** 691  
**Blueprint SHA-256 hashes:** 691  
**Developed and launched businesses:** 38

The corpus was generated inside the private authoritative repository so every inventory record could be matched to its real blueprint file and hash. Exact inventory-to-plan parity and unique normalized slugs were validated before import.

Generated structure:

```text
plans/
├── README.md
├── authority-plan-corpus-summary.json
├── authority-plan-corpus.tar.gz.sha256
└── businesses/
    ├── index.json
    ├── summary.json
    └── <first-character>/<slug>/
        ├── plan.json
        └── plan.md
```

`plan.json` is the authoritative machine-readable record and must validate against `schemas/business-authority-plan.schema.json`.

A generated scaffold is not an approved plan, a completed implementation, or permission to index a site. Each business must be populated and reviewed under `docs/planning/authority-platform/per-business-plan-contract.md` and pass `docs/planning/authority-platform/quality-gates.md`.

The 38 existing launched properties are initially recorded as `public_noindex` planning scaffolds until individualized review is complete. The remaining 653 businesses begin in `planning`.

## Generate

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --blueprints-root ../ainbis \
  --output plans/businesses \
  --mode scaffold \
  --source-repository pinohu/ainbis
```

## Refresh

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --blueprints-root ../ainbis \
  --output plans/businesses \
  --mode refresh \
  --source-repository pinohu/ainbis
```

## Validate exact parity

```bash
node scripts/generate-business-authority-plans.mjs \
  --inventory ../ainbis/docs/INVENTORY.json \
  --output plans/businesses \
  --mode validate
```

Individualized research, review, and implementation work remains tracked in GitHub issue #2.
