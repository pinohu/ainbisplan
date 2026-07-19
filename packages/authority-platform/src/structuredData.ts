import type { QualityFinding } from "./types.js";

export type SchemaType =
  | "Organization"
  | "WebSite"
  | "WebPage"
  | "BreadcrumbList"
  | "Article"
  | "Service"
  | "LocalBusiness"
  | "FAQPage"
  | "HowTo"
  | "SoftwareApplication"
  | "Dataset"
  | "ProfilePage"
  | "VideoObject"
  | "Event";

export interface StructuredDataNode {
  "@context": "https://schema.org";
  "@type": SchemaType | SchemaType[];
  "@id"?: string;
  [key: string]: unknown;
}

const REQUIRED: Partial<Record<SchemaType, string[]>> = {
  Organization: ["name", "url"],
  WebSite: ["name", "url"],
  WebPage: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  Article: ["headline", "author", "datePublished", "dateModified"],
  Service: ["name", "provider"],
  LocalBusiness: ["name", "address"],
  FAQPage: ["mainEntity"],
  HowTo: ["name", "step"],
  SoftwareApplication: ["name", "applicationCategory", "operatingSystem"],
  Dataset: ["name", "description"],
  ProfilePage: ["mainEntity"],
  VideoObject: ["name", "description", "thumbnailUrl", "uploadDate"],
  Event: ["name", "startDate", "location"]
};

function schemaTypes(node: StructuredDataNode): SchemaType[] {
  return Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
}

export function validateStructuredData(node: StructuredDataNode, visibleText: string): QualityFinding[] {
  const findings: QualityFinding[] = [];
  if (node["@context"] !== "https://schema.org") {
    findings.push({ code: "schema.context", severity: "error", message: "Structured data must use the HTTPS Schema.org context.", evidence: [String(node["@context"])] });
  }

  for (const type of schemaTypes(node)) {
    for (const field of REQUIRED[type] ?? []) {
      if (node[field] === undefined || node[field] === null || node[field] === "") {
        findings.push({ code: `schema.${type}.missing_${field}`, severity: "error", message: `${type} is missing required field ${field}.`, evidence: [] });
      }
    }
  }

  const normalizedVisible = visibleText.toLowerCase();
  for (const claimField of ["name", "headline", "description"] as const) {
    const value = node[claimField];
    if (typeof value === "string" && value.length > 20 && !normalizedVisible.includes(value.toLowerCase().slice(0, 20))) {
      findings.push({
        code: `schema.visible_content.${claimField}`,
        severity: "warning",
        message: `${claimField} is not clearly represented in visible content; verify that the markup is truthful and user-visible.`,
        evidence: [value]
      });
    }
  }
  return findings;
}

export function recommendedSchema(pageType: string, local = false): SchemaType[] {
  const base: SchemaType[] = ["WebPage", "BreadcrumbList"];
  if (["article", "guide", "news", "research"].includes(pageType)) base.push("Article");
  if (["service", "solution", "professional_service"].includes(pageType)) base.push("Service");
  if (["software", "tool", "calculator", "assessment"].includes(pageType)) base.push("SoftwareApplication");
  if (pageType === "dataset") base.push("Dataset");
  if (pageType === "profile") base.push("ProfilePage");
  if (pageType === "video") base.push("VideoObject");
  if (pageType === "event") base.push("Event");
  if (local) base.push("LocalBusiness");
  return [...new Set(base)];
}

export function buildGraph(nodes: StructuredDataNode[]): { "@context": "https://schema.org"; "@graph": StructuredDataNode[] } {
  return { "@context": "https://schema.org", "@graph": nodes.map(({ "@context": _context, ...node }) => ({ "@context": "https://schema.org", ...node })) };
}
