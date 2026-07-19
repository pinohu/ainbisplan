# Authority, SEO, and Indexability Quality Gates

**Status:** Mandatory  
**Principle:** deployment does not imply publication, and publication does not imply indexability

## Gate model

Quality is enforced through:

1. hard blockers that cannot be traded away;
2. scored quality dimensions used for prioritization and continuous improvement;
3. evidence requirements;
4. accountable human approval;
5. automated CI and production monitoring.

A business can pass technical build checks while failing authority, safety, or indexability review.

## Gate A — Inventory and identity

Required evidence:

- normalized slug and title are unique;
- inventory record exists and matches the blueprint;
- blueprint path and hash are recorded;
- plan record exists and validates against the schema;
- organization, product, service, and ownership identity are clear;
- developed, launched, plan, catalog, build, and runtime states reconcile.

Hard blockers:

- duplicate or conflicting identity;
- missing blueprint or plan;
- unexplained count mismatch;
- misleading ownership or official-status representation.

## Gate B — Independent purpose and differentiation

Required evidence:

- intended audience and problem are specific;
- business purpose exists independently of search traffic;
- offer, workflow, utility, expertise, data, or service is materially distinct;
- sibling businesses and query collisions were reviewed;
- separate-site rationale is documented;
- consolidation or repositioning decision is resolved.

Hard blockers:

- doorway or funnel-only purpose;
- substantially similar business without defensible distinction;
- token-swapped site or location pages;
- site created primarily to capture queries rather than help a defined audience.

## Gate C — Research and source integrity

Required evidence:

- research packet is complete for launch scope;
- primary and authoritative sources are identified;
- source dates, effective dates, and access dates are recorded;
- claims map to evidence;
- unresolved questions and limitations are visible;
- qualified domain review is complete when required.

Hard blockers:

- unsupported consequential claims;
- stale or superseded regulatory basis;
- missing required reviewer;
- copied or rewritten material without substantial added value;
- fabricated sources or citations.

## Gate D — Authority and editorial trust

Required evidence:

- accurate author and reviewer attribution;
- credentials and experience are verifiable;
- About, contact, ownership, editorial, sourcing, corrections, AI, privacy, terms, and accessibility information are present as applicable;
- methodology and content-production process are explained where expected;
- conflicts, advertising, sponsorship, affiliate, and funding disclosures are complete;
- corrections and change history are operational;
- content owner and next review date exist.

Hard blockers:

- fictitious experts or credentials;
- hidden commercial relationships;
- no accountable publisher or contact route;
- no correction path for consequential content;
- deceptive freshness dates.

## Gate E — Original value and content completeness

Required evidence:

- launch pages satisfy defined user tasks;
- content is substantial, accurate, well produced, and internally coherent;
- at least one original utility or evidence path is implemented;
- pages add value beyond source summaries and competing results;
- prohibited thin or duplicative pages are excluded;
- content graph includes clear hubs, supporting resources, trust pages, and conversion paths;
- content has maintenance and retirement rules.

Hard blockers:

- mass-produced or nonsensical copy;
- generic content that could belong to any sibling site;
- empty resource centers or fake functionality;
- content promising answers, products, or services that do not exist;
- unsupported word-count or keyword-stuffing production.

## Gate F — Product, service, and conversion truthfulness

Required evidence:

- offer, deliverables, process, scope, pricing posture, eligibility, and limitations are understandable;
- calls to action match actual capabilities;
- forms and intake flows work;
- proof is genuine, permissioned, or clearly labeled illustrative/placeholder;
- guarantees and outcome claims are substantiated and reviewed;
- high-consequence actions include appropriate confirmations and escalation.

Hard blockers:

- fake product functionality;
- fabricated clients, reviews, results, statistics, or certifications;
- deceptive scarcity or urgency;
- hidden fees or forced continuity;
- lead forms that collect unnecessary sensitive data;
- claims of professional advice or official affiliation without basis.

## Gate G — Information architecture and internal linking

Required evidence:

- every indexable URL has a unique purpose;
- navigation and breadcrumbs are coherent;
- hubs and supporting pages form a useful hierarchy;
- crawl depth is within approved targets;
- no orphan or dead-end indexable pages;
- anchor text is descriptive and varied naturally;
- cross-site links are editorially justified;
- filters, facets, search, pagination, and parameters have explicit indexability rules.

Hard blockers:

- doorway clusters;
- location or audience substitutions without unique value;
- artificial cross-site link network;
- significant orphaned or duplicate page inventory;
- internal links inaccessible to crawlers or keyboard users.

## Gate H — On-page and technical SEO

Required evidence:

- pages return correct HTTP statuses;
- Googlebot and other intended crawlers can access indexable content;
- primary content is server-rendered or otherwise reliably indexable;
- titles, headings, descriptions, URLs, canonicals, robots directives, language, and social metadata validate;
- XML sitemap and sitemap index contain only canonical, indexable, successful URLs;
- redirects are correct and free of loops or unnecessary chains;
- 404, soft-404, 410, and removed-content behavior is correct;
- URL normalization and parameter policies are enforced;
- hreflang is reciprocal and correct when used;
- preview, staging, and test environments cannot leak into indexation;
- technical crawl and release tests pass.

Hard blockers:

- accidental noindex or robots blocking of intended pages;
- indexable preview or duplicate hosts;
- canonical conflicts;
- broken primary navigation;
- invalid status behavior;
- sitemap pollution;
- critical render or DOM-content failure.

## Gate I — Structured data

Required evidence:

- schema types accurately describe visible content;
- entity IDs are stable;
- required properties are valid;
- structured data matches business and page reality;
- deprecated, unsupported, or ineligible markup is omitted;
- validation tools pass within documented expectations;
- errors and manual actions are monitored.

Hard blockers:

- hidden or misleading structured data;
- fake reviews, ratings, offers, locations, events, jobs, experts, or organizations;
- schema claiming functionality or content not visible on the page;
- prohibited self-serving or policy-ineligible markup.

## Gate J — Accessibility

Required evidence:

- WCAG 2.2 AA review completed;
- automated checks pass within approved exception policy;
- keyboard and focus behavior work;
- screen-reader and assistive-technology matrix completed for critical flows;
- contrast, reflow, target size, forms, errors, authentication, media, documents, charts, and motion meet requirements;
- accessibility statement and feedback route are active;
- critical issues have owners and remediation plans.

Hard blockers:

- inaccessible primary navigation or conversion;
- keyboard traps;
- critical unlabeled controls;
- obscured focus in consequential flows;
- inaccessible authentication;
- media or documents that prevent access to essential information;
- unresolved critical or high-severity accessibility defects.

## Gate K — Performance and page experience

Required evidence:

- template budgets pass;
- lab testing and real-user monitoring are configured;
- LCP, INP, CLS, TTFB, resource weight, and third-party impact are measured;
- primary content and actions remain usable on constrained mobile conditions;
- image, font, CSS, JavaScript, caching, and CDN rules are implemented;
- regressions block release according to policy.

Hard blockers:

- severe layout instability;
- primary content or CTA delayed by unnecessary JavaScript;
- critical interaction unresponsive;
- uncontrolled third-party scripts;
- performance regression without approved mitigation.

The platform target for good Core Web Vitals at the 75th percentile is LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1, with stricter template budgets where feasible.

## Gate L — Privacy, security, and legal

Required evidence:

- data inventory and classification complete;
- collection is minimized and purpose-limited;
- consent and communication preferences work;
- retention, deletion, access, correction, and suppression processes exist;
- forms, uploads, transport, storage, headers, dependencies, secrets, and access controls pass review;
- privacy, terms, disclaimers, and domain-specific legal requirements are approved;
- incident response, rollback, and contact routes exist.

Hard blockers:

- exposed secrets or sensitive data;
- insecure forms or uploads;
- collection without a defined purpose or appropriate consent basis;
- unsupported professional, regulatory, or official claims;
- missing required children’s, clinical, financial, employment, housing, identity, or jurisdictional controls;
- unresolved critical security issue.

## Gate M — Analytics, consent, and measurement

Required evidence:

- event taxonomy implemented;
- consent-aware collection verified;
- critical page, tool, form, lead, newsletter, conversion, and error events work;
- attribution fields are present and documented;
- data quality tests pass;
- dashboards and owners exist;
- experiments have hypotheses and guardrails;
- analytics do not collect prohibited sensitive information.

Hard blockers:

- broken primary conversion measurement;
- non-consensual tracking where consent is required;
- sensitive data in URLs, logs, or general analytics;
- experiments that compromise accessibility, privacy, safety, or truthfulness.

## Gate N — Newsletter and lifecycle operations

Required evidence when email is used:

- audience promise and sender identity are clear;
- opt-in, preferences, unsubscribe, suppression, and deletion work;
- authentication and deliverability controls are configured;
- sequences and segmentation are documented;
- lead-source and consent provenance are retained;
- list health and complaint monitoring have owners.

Hard blockers:

- purchased or unauthorized lists;
- deceptive opt-in;
- broken unsubscribe;
- sending without appropriate consent or identity;
- sensitive profiling outside approved purpose.

## Gate O — Off-site authority and reputation

Required evidence:

- authority-building strategy is legitimate and business-specific;
- claims, case studies, references, reviews, and endorsements have permission and verification;
- backlinks, mentions, and reviews are monitored;
- reputation and misinformation incidents have escalation routes;
- partnerships and affiliations are accurately disclosed.

Hard blockers:

- paid-link or private-network schemes;
- fake reviews or endorsements;
- undisclosed sponsorships;
- false partnerships, affiliations, or media claims.

## Gate P — Launch, migration, and operations

Required evidence:

- release plan, migration map, backups, rollback, and owners exist;
- production smoke, crawl, form, analytics, security, accessibility, performance, schema, sitemap, and monitoring checks pass;
- Search Console and other monitoring are configured;
- post-launch review and content operating cadence are scheduled;
- plan, inventory, catalog, build, deployment, runtime, and sitemap states reconcile;
- indexation approval is explicit.

Hard blockers:

- no rollback for consequential migration;
- unresolved redirect or canonical loss;
- missing monitoring;
- count or identity mismatch;
- deployment labeled complete without runtime, catalog, and planning verification.

## Scored quality dimensions

After hard blockers pass, each business is assessed from 0 to 5 on:

- audience clarity;
- business differentiation;
- original value;
- source and evidence strength;
- expert accountability;
- topical completeness;
- utility and product usefulness;
- information architecture;
- internal linking;
- technical SEO;
- structured data;
- accessibility;
- performance;
- conversion ethics and clarity;
- privacy and security;
- measurement readiness;
- off-site authority readiness;
- maintainability and operating ownership.

Scores do not override blockers. They guide improvement priorities and portfolio sequencing.

## Indexability decision

`indexable_candidate` requires all mandatory gates to pass and documented owners for remaining non-blocking improvements.

`indexable` additionally requires:

- production deployment and runtime verification;
- approved canonical host and sitemap inclusion;
- production crawl and indexability checks;
- analytics, monitoring, and incident routes active;
- accountable release approval;
- no unresolved critical or high-severity domain, content, technical, accessibility, performance, privacy, security, or reputation issue.

## Continuous enforcement

A passed gate can revert when evidence changes. Automated monitoring or human review may move a business to `restricted` or `public_noindex` after:

- source or regulation change;
- stale expert review;
- security or privacy incident;
- misleading or unsupported claim;
- significant duplicate or doorway risk;
- accessibility or performance regression;
- manual action, structured-data issue, or indexation anomaly;
- business, ownership, offer, or service change;
- unresolved customer or reputation issue.

## Definition of done

A business is operationally complete only when:

1. individualized plan is approved and current;
2. all applicable hard gates pass;
3. shared and business-specific functionality is implemented;
4. evidence is linked and auditable;
5. production is verified;
6. indexability state is intentional;
7. monitoring and ongoing owners are active;
8. inventory, plan, catalog, build, runtime, and sitemap records reconcile;
9. no critical unresolved review remains;
10. continuous maintenance and retirement rules exist.