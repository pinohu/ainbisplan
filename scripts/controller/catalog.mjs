import { readFile } from "node:fs/promises";
import path from "node:path";
import { exists, readJson, walk } from "./io.mjs";

function parseCatalogPairs(source) {
  const pairs = [];
  const pattern = /\[\s*("(?:\\.|[^"])*")\s*,\s*("(?:\\.|[^"])*")\s*\]/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    try {
      const [slug, title] = JSON.parse(`[${match[1]},${match[2]}]`);
      if (typeof slug === "string" && typeof title === "string") pairs.push({ slug, title });
    } catch {
      // Ignore non-catalog tuple syntax.
    }
  }
  return pairs;
}

export async function loadPlans(plansRoot) {
  const files = await walk(plansRoot, (_full, name) => name === "plan.json");
  const plans = new Map();
  const duplicates = [];
  for (const file of files) {
    const plan = await readJson(file);
    const slug = plan?.business?.slug;
    if (!slug) continue;
    if (plans.has(slug)) duplicates.push({ slug, paths: [plans.get(slug).file, file] });
    plans.set(slug, { plan, file });
  }
  return { plans, duplicates, files };
}

export async function loadLaunchpadCatalog(launchpadRoot) {
  if (!launchpadRoot || !(await exists(launchpadRoot))) {
    return { available: false, count: null, slugs: new Set(), titles: new Map(), meta: null, source: null };
  }

  const jsonCandidates = [
    path.join(launchpadRoot, "data/ainbis/launchpad_catalog.generated.json"),
    path.join(launchpadRoot, "src/data/launchpad_catalog.generated.json"),
    path.join(launchpadRoot, "public/launchpad_catalog.generated.json")
  ];
  for (const candidate of jsonCandidates) {
    if (!(await exists(candidate))) continue;
    const payload = await readJson(candidate);
    const rows = payload.businesses ?? payload.items ?? [];
    const slugs = new Set(rows.map((item) => item.s ?? item.slug).filter(Boolean));
    return {
      available: true,
      count: Number(payload.count ?? slugs.size),
      slugs,
      titles: new Map(rows.map((item) => [item.s ?? item.slug, item.t ?? item.title])),
      meta: payload,
      source: candidate
    };
  }

  const rowFiles = await walk(
    path.join(launchpadRoot, "src/data"),
    (_full, name) => /^catalog\.rows\.\d+\.generated\.ts$/.test(name)
  );
  const rows = [];
  for (const file of rowFiles) rows.push(...parseCatalogPairs(await readFile(file, "utf8")));

  const generatedFile = path.join(launchpadRoot, "src/data/catalog.generated.ts");
  let meta = null;
  if (await exists(generatedFile)) {
    const source = await readFile(generatedFile, "utf8");
    const count = source.match(/"count"\s*:\s*(\d+)/)?.[1];
    const authoritative = source.match(/"authoritativeInventoryCount"\s*:\s*(\d+)/)?.[1];
    const sourceCommit = source.match(/"sourceCommit"\s*:\s*"([a-f0-9]+)"/)?.[1];
    const generatedAt = source.match(/"generatedAt"\s*:\s*"([^"]+)"/)?.[1];
    meta = {
      count: count ? Number(count) : rows.length,
      authoritativeInventoryCount: authoritative ? Number(authoritative) : null,
      sourceCommit: sourceCommit ?? null,
      generatedAt: generatedAt ?? null
    };
  }

  return {
    available: true,
    count: Number(meta?.count ?? rows.length),
    slugs: new Set(rows.map((row) => row.slug)),
    titles: new Map(rows.map((row) => [row.slug, row.title])),
    meta,
    source: generatedFile
  };
}

export function flattenBuildManifest(payload) {
  if (!payload) return new Map();
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.businesses)
      ? payload.businesses
      : Array.isArray(payload.builds)
        ? payload.builds
        : Array.isArray(payload.entries)
          ? payload.entries
          : Object.entries(payload).map(([slug, value]) => ({
              slug,
              ...(typeof value === "object" && value ? value : { value })
            }));
  const result = new Map();
  for (const row of rows) {
    const slug = row.slug ?? row.s ?? row.id;
    if (slug) result.set(slug, row);
  }
  return result;
}
