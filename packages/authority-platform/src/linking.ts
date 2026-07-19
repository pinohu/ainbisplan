import type { QualityFinding } from "./types.js";

export interface LinkPage {
  id: string;
  path: string;
  purpose: string;
  indexable: boolean;
  topics: string[];
  entities: string[];
  linksTo: string[];
}

export interface LinkSuggestion {
  from: string;
  to: string;
  reason: string;
  score: number;
}

const tokens = (values: string[]): Set<string> => new Set(values.flatMap((value) => value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2)));

function overlap(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const value of left) if (right.has(value)) shared += 1;
  return shared / Math.max(left.size, right.size);
}

export function suggestInternalLinks(pages: LinkPage[], maxPerPage = 5): LinkSuggestion[] {
  const byId = new Map(pages.map((page) => [page.id, page]));
  const suggestions: LinkSuggestion[] = [];

  for (const source of pages) {
    const existing = new Set(source.linksTo);
    const sourceTerms = tokens([...source.topics, ...source.entities, source.purpose]);
    const candidates = pages
      .filter((target) => target.id !== source.id && target.indexable && !existing.has(target.id))
      .map((target) => {
        const topicScore = overlap(sourceTerms, tokens([...target.topics, ...target.entities, target.purpose]));
        const reciprocalPenalty = target.linksTo.includes(source.id) ? 0.05 : 0;
        return { target, score: Math.max(0, topicScore - reciprocalPenalty) };
      })
      .filter(({ score }) => score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPerPage);

    for (const { target, score } of candidates) {
      suggestions.push({
        from: source.id,
        to: target.id,
        reason: `Shared topic/entity relevance between ${source.path} and ${target.path}`,
        score: Number(score.toFixed(3))
      });
    }
  }

  return suggestions.filter((suggestion) => byId.has(suggestion.from) && byId.has(suggestion.to));
}

export function auditLinkGraph(pages: LinkPage[]): QualityFinding[] {
  const findings: QualityFinding[] = [];
  const byId = new Map(pages.map((page) => [page.id, page]));
  const inbound = new Map<string, number>(pages.map((page) => [page.id, 0]));

  for (const page of pages) {
    for (const targetId of page.linksTo) {
      if (!byId.has(targetId)) {
        findings.push({ code: "links.broken_internal", severity: "error", message: `Internal link target ${targetId} does not exist.`, evidence: [page.id, targetId] });
        continue;
      }
      inbound.set(targetId, (inbound.get(targetId) ?? 0) + 1);
    }
    if (page.linksTo.length > 100) {
      findings.push({ code: "links.excessive", severity: "warning", message: `${page.path} has more than 100 internal links and should be reviewed for usefulness.`, evidence: [String(page.linksTo.length)] });
    }
  }

  for (const page of pages) {
    if (page.indexable && (inbound.get(page.id) ?? 0) === 0) {
      findings.push({ code: "links.orphan", severity: "blocker", message: `Indexable page ${page.path} has no inbound internal link.`, evidence: [page.id] });
    }
  }
  return findings;
}

export function buildHubModel(hubId: string, spokeIds: string[]): string[] {
  return [
    `Hub ${hubId} links contextually to every approved spoke.`,
    ...spokeIds.map((spoke) => `Spoke ${spoke} links back to hub ${hubId} and to closely related sibling spokes only.`),
    "Anchor text describes the destination and is not mechanically keyword-stuffed.",
    "Links are rendered as crawlable HTML anchors and remain useful without JavaScript."
  ];
}
