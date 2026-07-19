# Portfolio Design-System Plan

**Status:** Accepted  
**Last updated:** 2026-07-19  
**Implementation:** `packages/tokens`, `packages/core`, `packages/archetypes`, `packages/brand-engine`

## Executive decision

The AINBIS portfolio must not use one universal visual template. It requires a **federated design-system ecosystem**:

1. one shared universal foundation;
2. multiple specialized experience archetypes;
3. a controlled brand-expression generator;
4. business-specific extensions only where necessary;
5. governance and automated validation to prevent drift.

The operating maxim is:

> **One foundation, multiple experience systems, hundreds of distinct but governed brands.**

This approach preserves accessibility, maintainability, performance, content integrity, SEO, analytics, and component quality while allowing each product or authority site to feel native to its audience, niche, risk level, buying cycle, and purpose.

## 1. Universal foundation

The shared foundation owns behavior and quality that should not be reinvented for each business.

### Accessibility

WCAG 2.2 AA is the minimum target. Accessibility is structural rather than decorative and includes:

- semantic HTML and predictable heading order;
- complete keyboard access and visible focus;
- sufficient contrast in every state;
- touch targets sized for mobile use;
- reduced-motion support;
- accessible names, descriptions, errors, and status announcements;
- captions and transcripts for media;
- plain-language alternatives where domain complexity is high;
- automated and manual accessibility testing.

### Responsive behavior

The system uses fluid scales, container-aware layouts, intrinsic sizing, and content-driven breakpoints. Components must work in narrow sidebars, embedded tools, mobile views, dashboards, and wide editorial layouts without requiring page-specific forks.

### Interaction and state

Shared contracts cover hover, focus, active, selected, loading, progress, success, warning, error, empty, disabled, offline, stale, partial, draft, verified, committed, deployed, and published states. The meaning of status is semantic and must not rely on color alone.

### Forms and validation

Forms must support persistent labels, guidance before errors, inline and summary validation, resumable progress where appropriate, safe defaults, explicit confirmation for consequential actions, and clear distinction between saved, submitted, approved, and completed.

### Performance

The foundation requires:

- strict JavaScript budgets for publishing and lead-generation sites;
- server-rendered, indexable primary content;
- optimized responsive images and media;
- stable layout and low cumulative layout shift;
- progressive enhancement;
- lazy loading only where it improves rather than delays comprehension;
- no unnecessary carousels, animation libraries, or client-side rendering.

### Privacy, analytics, and consent

Analytics events, consent states, form attribution, lead-source metadata, experimentation, and privacy controls use documented schemas. Sensitive clinical, legal, financial, or identity data must never be introduced into general marketing analytics.

### SEO and structured content

The foundation provides canonical metadata, social metadata, breadcrumbs, authorship, review dates, entity relationships, internal-linking primitives, schema helpers, crawl controls, and content models for topics, locations, services, resources, tools, questions, and experts.

## 2. Token architecture

Tokens are layered so brands can vary without breaking semantics.

### Primitive tokens

Raw scales and reusable values:

- color ramps;
- spacing;
- typography sizes and line heights;
- radii;
- borders;
- shadows;
- motion durations and easing;
- elevation and z-index;
- container and measure sizes.

### Semantic tokens

Meaning-based decisions:

- surfaces, text, borders, overlays, links, focus, selections;
- success, warning, danger, information, and neutral states;
- interactive, disabled, pending, verified, and published states;
- content widths and density modes.

### Component tokens

Local component contracts such as button height, input border, card padding, navigation gap, table row size, callout treatment, and dialog width.

### Brand tokens

Controlled expressions such as brand accent, typography families, editorial contrast, shape character, image treatment, decorative motifs, and motion personality. Brand tokens cannot redefine semantic error, warning, focus, or accessibility behavior.

## 3. Controlled uniqueness and brand DNA

AINBIS businesses must not appear to be cloned sites with substituted logos and colors. Uniqueness is generated from meaningful business attributes rather than random styling.

### Brand inputs

The brand engine considers:

- category and niche;
- audience and user sophistication;
- geographic scope;
- urgency and problem severity;
- buying cycle and decision complexity;
- trust threshold;
- regulatory or clinical sensitivity;
- content depth and publishing frequency;
- transaction type;
- primary conversion;
- emotional posture.

### Expression dimensions

Each brand receives governed values for:

- typography character;
- palette temperature and contrast;
- density;
- shape language;
- editorial versus application emphasis;
- imagery direction;
- icon character;
- layout rhythm;
- motion restraint;
- CTA emphasis;
- evidence and trust prominence.

Deterministic generation is preferred so the same profile produces the same baseline brand expression. Human review may override within documented safe ranges.

## 4. Experience archetypes

### A. Authority and publishing

Use for Your Deputy, AINBIS authority businesses, resource hubs, newsletters, and knowledge products.

Characteristics:

- strong editorial hierarchy and readable long-form measure;
- topic clusters, hubs, glossaries, FAQs, and related-content pathways;
- visible authorship, expertise, citations, review dates, and update history;
- tools, calculators, quizzes, checklists, templates, ebooks, and downloads;
- table of contents, key takeaways, evidence blocks, examples, and next steps;
- contextual newsletter and lead-magnet offers rather than generic popups;
- lightweight pages with indexable content and strong internal linking.

### B. Professional services and trust

Use for Notroom, notary and RON services, local professional services, and legal-adjacent offerings.

Characteristics:

- credentials, service boundaries, pricing, availability, and service area made explicit;
- scheduling, quote, eligibility, and preparation flows;
- security, privacy, identity, and document-handling explanations;
- testimonials and proof without exaggerated claims;
- clear emergency versus non-emergency expectations;
- trust signals close to the decision point.

### C. SaaS and workflow applications

Use for compliance packs, guided document generation, business tools, and structured multi-step tasks.

Characteristics:

- task-first navigation;
- progressive disclosure;
- persistent progress and resumable sessions;
- previews, diffs, versions, audit trails, approvals, and exports;
- clear distinction between input, generated output, verified output, and final submission;
- safe handling of irreversible or consequential actions;
- explainable automation and visible assumptions.

### D. Data-intensive operations

Use for AINBIS Launch Network, source inventory, deployment monitoring, regeneration, and portfolio operations.

Characteristics:

- dense but legible tables;
- filters, saved views, bulk actions, and column controls;
- dependency graphs and pipeline visualization;
- reconciliation and exception queues;
- run histories, logs, counts, checksums, owners, timestamps, and status provenance;
- operational states that distinguish queued, running, blocked, failed, reconciled, verified, and complete.

For every new blueprint or business, completion requires this chain:

1. blueprint creation;
2. slug and title deduplication;
3. source inventory regeneration;
4. launch-network catalog regeneration;
5. updated counts and reconciliation;
6. generated artifacts committed;
7. runtime verification;
8. catalog verification;
9. completion status recorded.

Business creation is not complete before all nine conditions are satisfied.

### E. Healthcare and clinical documentation

Use for pediatric clinical notes, referral workflows, preventive-care guidance, and clinical decision support.

Characteristics:

- safety and clinical clarity above visual novelty;
- structured vitals, growth, medications, dose calculations, allergies, red flags, diagnoses, plans, and follow-up;
- unit-aware inputs and explicit calculation provenance;
- guideline versioning and age-specific recommendations;
- prominent uncertainty, contraindications, escalation criteria, and clinician verification;
- auditability and privacy boundaries;
- dense information organized by clinical task rather than ornamental cards.

### F. Academic and institutional

Use for Gannon programs, engineering management, ABET evidence, laboratories, research, grants, faculty, and recruitment.

Characteristics:

- institutional credibility and structured evidence;
- program outcomes, curriculum maps, accreditation, faculty, facilities, and careers;
- clear audience pathways for prospective students, current students, faculty, partners, and reviewers;
- downloadable plans, reports, syllabi, evidence, and contact pathways;
- recruitment conversion without reducing academic content to generic marketing.

### G. Local directory and marketplace

Use for Erie.pro and provider or niche directories.

Characteristics:

- location-first search and navigation;
- map and list views with accessible alternatives;
- filters, verification, comparison, service areas, availability, and contact routes;
- city, neighborhood, and category pages with unique local content;
- provider profiles with evidence, freshness, and correction mechanisms;
- quote or lead flows that disclose how information will be used.

### H. Children’s learning and entertainment

Use for Lumi & Pip, moral storytelling, videos, printables, activities, and parent resources.

Characteristics:

- joyful, character-centered, age-appropriate interaction;
- separate child and parent/educator pathways;
- calm navigation and limited choice per screen;
- captions, read-aloud support, large targets, and reduced-motion options;
- no manipulative autoplay, streak pressure, shame, disguised ads, or dark patterns;
- clear learning objective, moral reflection, discussion prompts, and printable activities;
- parent controls and transparent media duration.

### I. Real-estate investment analysis

Use for Erie property scanning, acquisitions, rehab analysis, rental potential, and go/no-go decisions.

Characteristics:

- evidence, assumptions, comparable properties, rehab items, zoning, parking, taxes, rent, subsidy potential, and risk;
- scenario comparison rather than a single false-precision answer;
- confidence and data freshness;
- map, property summary, financial model, inspection concerns, and decision rationale;
- clear separation of facts, estimates, unknowns, and recommended due diligence.

### J. AI-native interfaces

Use for Flint, Claude workflows, generators, agents, and automated implementation systems.

Characteristics:

- visible tool activity, source use, permissions, and approvals;
- context and memory controls;
- editable generated output;
- reversible actions and confirmation before writes;
- progress and partial-result handling;
- distinction among generated, reviewed, verified, committed, deployed, and published;
- transparent errors, retries, and fallback routes.

### K. Premium consumer and lifestyle

Use where visual aspiration, product storytelling, or premium positioning is central.

Characteristics:

- high-quality imagery with disciplined loading;
- restrained typography and spacing;
- immersive storytelling without hiding price, terms, or conversion routes;
- accessible motion and galleries;
- trustworthy product evidence and comparison.

### L. Internal administration

Use for settings, user management, permissions, content review, billing, and system configuration.

Characteristics:

- predictability and speed;
- role and permission clarity;
- safe destructive actions;
- audit history;
- high information density with strong defaults;
- minimal decorative variation.

## 5. Typography strategy

Typography is assigned by archetype and brand posture rather than trend.

- authority systems favor highly readable editorial text with strong heading contrast;
- professional-service systems favor calm, familiar, confidence-building typography;
- SaaS and operations systems favor compact, neutral, high-legibility interfaces and tabular numerals;
- clinical systems prioritize clarity, differentiation of values and units, and dense scanning;
- academic systems support long-form evidence, tables, citations, and institutional hierarchy;
- children’s systems use friendly forms while preserving letter recognition and readability.

Font loading must be performance-budgeted. System fallbacks are required. Typography changes cannot compromise language support or accessibility.

## 6. Color and status strategy

Brand accent is separate from semantic state colors. No business may redefine danger as its brand color or create inaccessible status combinations. Every status includes text, iconography, or structure in addition to color.

The foundation supports light, dark, and high-contrast-ready semantic mappings. Individual products adopt modes only where user context and content make them beneficial.

## 7. Motion strategy

Motion communicates relationship, progress, hierarchy, and change. It must not exist only to decorate.

- authority and professional-service sites use restrained transitions;
- SaaS and operations systems use motion to clarify state changes and spatial relationships;
- clinical systems minimize motion and preserve immediate readability;
- children’s systems may use richer animation but must offer pause, reduced motion, and no attention traps;
- AI-native systems use progress motion carefully and never imply completion before a tool or deployment has actually finished.

## 8. Content system

Content is a first-class design-system layer.

Shared content contracts define:

- page purpose and audience;
- primary question answered;
- evidence and trust requirements;
- terminology and reading level;
- CTA hierarchy;
- disclaimers and review requirements;
- metadata and structured-data relationships;
- empty, error, confirmation, and recovery language.

Brand voice is generated across controlled dimensions such as authoritative versus conversational, concise versus explanatory, urgent versus calm, technical versus plain-language, and playful versus serious.

## 9. Conversion system

Conversion patterns depend on the business model.

- authority publishing: subscribe, download, assess, use a tool, or continue to a service;
- professional services: schedule, request a quote, check eligibility, or call;
- SaaS: start, resume, preview, verify, export, or upgrade;
- directories: compare, contact, request quotes, or save;
- academic: request information, visit, apply, meet faculty, or download a program guide;
- children’s learning: watch, read, discuss, print, or join a parent list;
- real estate: save, investigate, schedule inspection, revise assumptions, or issue a go/no-go decision.

Dark patterns, fake urgency, deceptive scarcity, preselected consent, and inaccessible overlays are prohibited.

## 10. Authority and SEO components

The system should make high-authority publishing repeatable through:

- topic and location hubs;
- expert and author profiles;
- citations and source notes;
- review and update histories;
- glossaries and definitions;
- question-and-answer collections;
- calculators, quizzes, checklists, and comparison tools;
- original data and methodology pages;
- templates and downloadable resources;
- internal-link recommendations;
- entity, article, service, local, FAQ, breadcrumb, and other truthful structured-data helpers.

Structured data must describe visible content accurately. It cannot be added merely to pursue rich results.

## 11. Governance

### Ownership

Each package and archetype has a documented owner. Domain extensions require a domain reviewer for clinical, legal, financial, educational, or other sensitive contexts.

### Maturity states

Components and patterns move through:

1. experimental;
2. candidate;
3. stable;
4. deprecated;
5. retired.

### Required validation

Stable releases require:

- type checks;
- unit and integration tests where applicable;
- accessibility review;
- visual regression coverage;
- responsive review;
- content and localization review;
- performance review;
- documentation and migration notes.

### Change control

Breaking token or component changes require an architecture decision or migration record. Brand-specific overrides may not silently bypass shared accessibility, security, privacy, or semantic contracts.

## 12. Technical implementation

The initial package structure is:

```text
packages/
├── tokens/          Primitive and semantic tokens
├── core/            Shared foundation styles and contracts
├── archetypes/      Experience-system definitions and requirements
└── brand-engine/    Deterministic brand-profile generation
```

Planned packages include:

```text
packages/
├── ui-authority/
├── ui-professional/
├── ui-saas/
├── ui-operations/
├── ui-clinical/
├── ui-academic/
├── ui-directory/
├── ui-kids/
├── ui-real-estate/
├── ui-ai/
├── content-models/
├── seo/
├── analytics/
├── accessibility/
└── testing/
```

Applications should consume semantic APIs and archetype profiles rather than importing raw primitive values. Framework-specific adapters may be created after the framework and deployment requirements of the first implementation targets are confirmed.

## 13. Definition of success

The design-system ecosystem is successful when:

- portfolio experiences are recognizably distinct without becoming inconsistent;
- accessibility and performance are inherited rather than recreated;
- content teams can build authority resources without custom engineering for every page;
- applications clearly communicate state, risk, provenance, and completion;
- a new business can be generated, validated, cataloged, deployed, and verified through a traceable process;
- shared improvements propagate safely;
- business-specific needs can be expressed without forking the entire system;
- planning and generated artifacts remain versioned and discoverable in this repository.
