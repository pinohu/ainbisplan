# Generated Planning Artifacts

This folder stores generated prompts, implementation handoffs, audits, research syntheses, migration plans, inventories, reports, and supporting text artifacts created for the AINBIS portfolio.

## Preservation requirement

A generated artifact is preserved only when it is committed here, assigned a status and date, and listed in `../artifact-index.md`.

## Required header

Use the following header for Markdown artifacts:

```markdown
# Artifact title

**Status:** Draft | Accepted | Superseded | Implemented
**Generated:** YYYY-MM-DD
**Source:** Conversation, repository audit, tool output, or named workflow
**Related implementation:** Package, application, issue, pull request, or `Not started`
```

## Supported artifacts

- Codex, Claude, Lovable, Cursor, and agent handoffs;
- design-system and architecture prompts;
- authority-site specifications;
- homepage and landing-page audits;
- business inventories and blueprint summaries;
- deployment and verification reports;
- content, SEO, accessibility, and conversion plans;
- research notes and decision support;
- migration and release plans.

## Binary and external artifacts

For files that should not be committed directly, add a Markdown manifest containing:

- artifact name and format;
- source location;
- version or date;
- checksum when available;
- access requirements;
- regeneration instructions;
- related implementation;
- retention rationale.

Do not store secrets, credentials, private health information, or private customer documents in this repository.
