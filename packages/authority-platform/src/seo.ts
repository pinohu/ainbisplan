import type { Indexability, QualityFinding } from "./types.js";

export interface MetadataInput {
  title: string;
  description: string;
  canonicalUrl: string;
  siteName: string;
  indexability: Indexability;
  imageUrl?: string;
  publishedAt?: string;
  modifiedAt?: string;
}

export interface MetadataResult {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
}

const normalizeWhitespace = (value: string): string => value.trim().replace(/\s+/g, " ");

export function buildMetadata(input: MetadataInput): MetadataResult {
  const title = normalizeWhitespace(input.title).slice(0, 70);
  const description = normalizeWhitespace(input.description).slice(0, 180);
  const robots = input.indexability === "indexable" || input.indexability === "indexable_candidate"
    ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    : "noindex,follow";

  const openGraph: Record<string, string> = {
    "og:title": title,
    "og:description": description,
    "og:url": input.canonicalUrl,
    "og:site_name": input.siteName,
    "og:type": "website"
  };
  if (input.imageUrl) openGraph["og:image"] = input.imageUrl;
  if (input.publishedAt) openGraph["article:published_time"] = input.publishedAt;
  if (input.modifiedAt) openGraph["article:modified_time"] = input.modifiedAt;

  const twitter: Record<string, string> = {
    "twitter:card": input.imageUrl ? "summary_large_image" : "summary",
    "twitter:title": title,
    "twitter:description": description
  };
  if (input.imageUrl) twitter["twitter:image"] = input.imageUrl;

  return { title, description, canonical: input.canonicalUrl, robots, openGraph, twitter };
}

export function validateCanonical(canonicalUrl: string, currentUrl: string): QualityFinding[] {
  const findings: QualityFinding[] = [];
  let canonical: URL;
  let current: URL;
  try {
    canonical = new URL(canonicalUrl);
    current = new URL(currentUrl);
  } catch {
    return [{ code: "seo.invalid_url", severity: "blocker", message: "Canonical or current URL is invalid.", evidence: [canonicalUrl, currentUrl] }];
  }

  if (canonical.protocol !== "https:") {
    findings.push({ code: "seo.canonical_not_https", severity: "error", message: "Canonical URL must use HTTPS.", evidence: [canonicalUrl] });
  }
  if (canonical.hash) {
    findings.push({ code: "seo.canonical_has_fragment", severity: "error", message: "Canonical URL must not include a fragment.", evidence: [canonicalUrl] });
  }
  if (canonical.search) {
    findings.push({ code: "seo.canonical_has_query", severity: "warning", message: "Canonical URL contains query parameters and requires explicit approval.", evidence: [canonicalUrl] });
  }
  if (canonical.origin !== current.origin) {
    findings.push({ code: "seo.cross_domain_canonical", severity: "warning", message: "Cross-domain canonical requires documented equivalence and ownership.", evidence: [canonicalUrl, currentUrl] });
  }
  return findings;
}

export function sitemapEligible(indexability: Indexability, statusCode: number, canonicalIsSelf: boolean): boolean {
  return indexability === "indexable" && statusCode === 200 && canonicalIsSelf;
}

export function defaultTechnicalPolicies(archetype: string, indexability: Indexability): {
  rendering: "static" | "server_rendered" | "hybrid";
  canonicalPolicy: string[];
  robotsPolicy: string[];
  sitemapProfiles: string[];
  redirectPolicy: string[];
  structuredData: string[];
  monitoring: string[];
} {
  const applicationLike = ["saas", "operations", "clinical", "directory", "ai_native", "admin"].includes(archetype);
  return {
    rendering: applicationLike ? "hybrid" : "server_rendered",
    canonicalPolicy: [
      "Every indexable URL has one absolute HTTPS self-referencing canonical unless an approved equivalent owns the canonical.",
      "Canonical targets must return 200, remain indexable, and not redirect."
    ],
    robotsPolicy: [
      indexability === "indexable" ? "Allow approved public content." : "Keep generated, review, and incomplete surfaces noindex.",
      "Do not block resources required to render or evaluate public content."
    ],
    sitemapProfiles: ["indexable canonical 200 URLs only", "separate image/video/news sitemaps only when the content type exists"],
    redirectPolicy: ["Use one-hop permanent redirects only for genuine replacements.", "Never redirect unrelated retired content to the homepage."],
    structuredData: ["Organization", "WebSite", "BreadcrumbList", "WebPage", "Article or Service when visible content supports it"],
    monitoring: ["crawl status", "indexation", "canonical drift", "robots drift", "sitemap health", "structured-data validity", "Core Web Vitals"]
  };
}
