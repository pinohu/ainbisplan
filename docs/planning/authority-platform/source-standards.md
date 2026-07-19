# External Standards and Source Baseline

**Status:** Required reference baseline  
**Last reviewed:** 2026-07-19

This document records the primary external standards that inform the program. It does not replace business-specific legal, regulatory, clinical, financial, safety, or industry research.

## Google Search Essentials

Source: https://developers.google.com/search/docs/essentials

Program implications:

- public pages must meet minimum technical eligibility requirements;
- content should be helpful, reliable, and created for people;
- important words should appear naturally in titles, headings, alt text, and link text;
- links must be crawlable;
- image, video, structured data, and JavaScript follow their applicable guidance;
- meeting requirements does not guarantee crawling, indexing, ranking, or search appearance.

## Google technical requirements

Source: https://developers.google.com/search/docs/essentials/technical

Program implications:

- intended public pages cannot block the applicable crawler;
- indexable pages must return a successful status;
- pages require indexable content;
- `noindex`, robots controls, status codes, rendering, and environment separation must be tested rather than assumed.

## Helpful, reliable, people-first content

Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Program implications:

- every business requires an intended audience and primary purpose;
- content must provide original information, research, analysis, experience, or substantial added value;
- mass production across a network is a risk when pages or sites do not receive sufficient care;
- authorship, expertise, sourcing, and trust should be visible;
- consequential YMYL topics require particularly strong trust signals;
- plans explicitly record who created content, how it was created, and why it exists;
- automation and AI may assist useful work but cannot be used primarily to manipulate search rankings;
- arbitrary word-count rules and cosmetic date changes are prohibited.

## Google spam policies

Source: https://developers.google.com/search/docs/essentials/spam-policies

Program implications:

- cloaking, doorway abuse, keyword stuffing, link spam, scaled content abuse, thin affiliation, fake functionality, scam behavior, and policy circumvention are prohibited;
- multiple sites or pages with slight variations created to maximize query reach are a portfolio-level risk;
- generated content requires original value regardless of whether humans or automation produced it;
- private cross-linking or other ranking-manipulation systems are prohibited;
- incomplete or low-value generated pages remain excluded from Search.

## Structured data guidelines

Source: https://developers.google.com/search/docs/appearance/structured-data/sd-policies

Program implications:

- structured data must accurately represent visible page content;
- markup must comply with general and feature-specific policies;
- supported formats and access requirements must be respected;
- misleading, hidden, unsupported, or ineligible markup is blocked;
- valid markup creates eligibility, not a guarantee of rich-result appearance;
- structured-data feature support is monitored because it changes over time.

## Google Search documentation updates

Source: https://developers.google.com/search/updates

Program implications:

- the platform maintains a monitored standards registry;
- deprecated or restricted search features must be removed from generators and templates;
- schema eligibility and search-appearance assumptions are versioned;
- each business plan records the standards version used at approval.

## Core Web Vitals

Source: https://web.dev/articles/vitals and https://web.dev/articles/defining-core-web-vitals-thresholds

Program target for a good experience at the 75th percentile:

- Largest Contentful Paint at or below 2.5 seconds;
- Interaction to Next Paint at or below 200 milliseconds;
- Cumulative Layout Shift at or below 0.1.

Program implications:

- targets are evaluated in real-user data where available and supplemented by lab testing;
- template-specific budgets may be stricter;
- page experience is broader than three metrics, so accessibility, stability, responsiveness, security, and usability remain separate requirements;
- regressions are monitored and can block release.

## WCAG 2.2

Sources:

- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/standards-guidelines/wcag/
- https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

Program implications:

- WCAG 2.2 AA is the minimum platform target;
- implementation includes focus not obscured, dragging alternatives, minimum target size, consistent help, redundant-entry reduction, and accessible authentication requirements introduced in WCAG 2.2;
- automated tests are insufficient without manual and assistive-technology review;
- accessibility applies to content, code, media, documents, tools, workflows, and authentication.

## Schema.org

Source: https://schema.org/

Program implications:

- content and entity models may use Schema.org vocabulary where accurate;
- Google or another consumer’s rich-result support is distinct from Schema.org vocabulary validity;
- business plans select types based on actual entities and visible content, not desired search features.

## Bing Webmaster Guidelines and tools

Sources:

- https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- https://www.bing.com/webmasters/

Program implications:

- the monitoring architecture includes appropriate Bing verification, sitemaps, crawl and indexation review;
- search-engine-specific capabilities are adapters over shared truthful content and technical foundations.

## Privacy and security standards

The shared platform should use current primary standards appropriate to implementation, including:

- OWASP Application Security Verification Standard: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- secure-header and platform-provider guidance;
- jurisdiction-specific privacy law and regulator guidance selected per business plan.

No universal privacy statement or consent configuration is assumed to satisfy every business, jurisdiction, data type, or audience.

## Domain-specific sources

Every business plan maintains its own source registry. Source preference generally follows:

1. statute, regulation, court, official standard, regulator, agency, or official form;
2. official implementation guidance and authoritative technical documentation;
3. recognized professional or standards organization;
4. peer-reviewed or academically credible research;
5. verified practitioner or first-hand operational evidence;
6. reputable secondary interpretation;
7. other sources used only with explicit quality notes.

The exact hierarchy changes by domain. Business plans must document why a source is authoritative, current, and applicable.

## Standards change management

The platform maintains:

- standard name and source;
- version or last-updated date;
- date reviewed by AINBIS;
- affected packages, page types, businesses, and plans;
- change severity;
- required migration;
- owner and due state;
- validation and release evidence.

A material change can mark affected plans stale and can restrict indexability until reviewed.

## Accuracy principle

External standards provide eligibility and best-practice guidance. They do not guarantee rankings, rich results, traffic, conversions, accessibility for every user, legal compliance in every jurisdiction, or business success. Plans and public claims must preserve that distinction.