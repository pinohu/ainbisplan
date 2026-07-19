import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const authorityArtifacts = [
  "authority-platform/README.md",
  "authority-platform/feature-catalog.md",
  "authority-platform/per-business-plan-contract.md",
  "authority-platform/implementation-architecture.md",
  "authority-platform/programmatic-seo-network-safety.md",
  "authority-platform/delivery-program.md",
  "authority-platform/quality-gates.md",
  "authority-platform/source-standards.md"
];

const requiredPaths = [
  "README.md",
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "docs/planning/README.md",
  "docs/planning/artifact-index.md",
  "docs/planning/portfolio-design-system-plan.md",
  "docs/planning/project-system-map.md",
  "docs/planning/implementation-roadmap.md",
  "docs/planning/decisions/ADR-001-federated-design-system.md",
  "docs/planning/generated/README.md",
  ...authorityArtifacts.map((artifact) => `docs/planning/${artifact}`),
  "docs/governance/contribution-model.md",
  "schemas/business-authority-plan.schema.json",
  "templates/business-authority-plan.template.json",
  "scripts/generate-business-authority-plans.mjs",
  "fixtures/inventory.sample.json",
  "packages/tokens/package.json",
  "packages/core/package.json",
  "packages/archetypes/package.json",
  "packages/brand-engine/package.json"
];

const errors = [];

for (const relativePath of requiredPaths) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    errors.push(`Missing required path: ${relativePath}`);
  }
}

const planningIndexPath = path.join(root, "docs/planning/artifact-index.md");
let planningIndex = "";

try {
  planningIndex = await readFile(planningIndexPath, "utf8");
} catch {
  errors.push("Unable to read docs/planning/artifact-index.md");
}

for (const artifact of [
  "portfolio-design-system-plan.md",
  "project-system-map.md",
  "implementation-roadmap.md",
  "decisions/ADR-001-federated-design-system.md",
  "generated/README.md",
  ...authorityArtifacts,
  "schemas/business-authority-plan.schema.json",
  "templates/business-authority-plan.template.json",
  "scripts/generate-business-authority-plans.mjs"
]) {
  if (!planningIndex.includes(artifact)) {
    errors.push(`Planning artifact is not indexed: ${artifact}`);
  }
}

const generatedDirectory = path.join(root, "docs/planning/generated");
try {
  const generatedFiles = await readdir(generatedDirectory);

  for (const file of generatedFiles) {
    if (file === "README.md") continue;
    if (!planningIndex.includes(file)) {
      errors.push(`Generated planning artifact is not indexed: generated/${file}`);
    }
  }
} catch {
  errors.push("Unable to inspect docs/planning/generated");
}

for (const jsonPath of [
  "schemas/business-authority-plan.schema.json",
  "templates/business-authority-plan.template.json",
  "fixtures/inventory.sample.json"
]) {
  try {
    JSON.parse(await readFile(path.join(root, jsonPath), "utf8"));
  } catch (error) {
    errors.push(`Invalid JSON in ${jsonPath}: ${error.message}`);
  }
}

const packageDirectories = ["tokens", "core", "archetypes", "brand-engine"];
for (const packageDirectory of packageDirectories) {
  const packageJsonPath = path.join(root, "packages", packageDirectory, "package.json");
  try {
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
    if (typeof packageJson.name !== "string" || !packageJson.name.startsWith("@ainbis/")) {
      errors.push(`Invalid package name in packages/${packageDirectory}/package.json`);
    }
    if (packageJson.private !== true) {
      errors.push(`Initial package must remain private: packages/${packageDirectory}/package.json`);
    }
  } catch {
    errors.push(`Unable to validate packages/${packageDirectory}/package.json`);
  }
}

if (errors.length > 0) {
  console.error("AINBIS repository validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`AINBIS repository validation passed (${requiredPaths.length} required paths checked).`);
