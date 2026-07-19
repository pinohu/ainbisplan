#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const GENERATOR = 'ainbis-business-authority-plan-generator@0.2.0';
const DEFAULT_OUTPUT = 'plans/businesses';

function parseArgs(argv) {
  const args = { inventory: null, blueprintsRoot: null, output: DEFAULT_OUTPUT, mode: 'scaffold', sourceRepository: 'pinohu/ainbis' };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];
    if (token === '--inventory') { args.inventory = value; index += 1; }
    else if (token === '--blueprints-root') { args.blueprintsRoot = value; index += 1; }
    else if (token === '--output') { args.output = value; index += 1; }
    else if (token === '--mode') { args.mode = value; index += 1; }
    else if (token === '--source-repository') { args.sourceRepository = value; index += 1; }
    else if (token === '--help' || token === '-h') { printHelp(); process.exit(0); }
    else throw new Error(`Unknown or incomplete argument: ${token}`);
  }
  if (!args.inventory) throw new Error('--inventory is required');
  if (!['scaffold', 'refresh', 'validate'].includes(args.mode)) throw new Error('--mode must be scaffold, refresh, or validate');
  return args;
}

function printHelp() {
  console.log(`Generate or validate one individualized AINBIS authority-plan scaffold per inventory business.\n\nThe inventory may include a trusted blueprint_sha256 on each business, allowing self-contained cross-repository snapshots without a source checkout.`);
}

async function fileExists(filePath) {
  try { await access(filePath); return true; } catch { return false; }
}

async function loadJson(filePath) {
  const text = await readFile(filePath, 'utf8');
  try { return JSON.parse(text); } catch (error) { throw new Error(`Invalid JSON at ${filePath}: ${error.message}`); }
}

function normalizeTitle(value) {
  return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
}

function validateInventory(inventory) {
  if (!inventory || !Array.isArray(inventory.businesses)) throw new Error('Inventory must contain a businesses array');
  const slugs = new Map();
  const titles = new Map();
  for (const business of inventory.businesses) {
    if (!business.slug || !/^[a-z0-9][a-z0-9-]*$/.test(business.slug)) throw new Error(`Invalid business slug: ${business.slug}`);
    if (!business.title || !business.blueprint_html) throw new Error(`Business ${business.slug} is missing title or blueprint_html`);
    if (business.blueprint_sha256 && !/^[a-f0-9]{64}$/.test(business.blueprint_sha256)) throw new Error(`Business ${business.slug} has an invalid blueprint_sha256`);
    if (slugs.has(business.slug)) throw new Error(`Duplicate normalized slug: ${business.slug}`);
    slugs.set(business.slug, business.blueprint_html);
    const normalizedTitle = normalizeTitle(business.title);
    if (titles.has(normalizedTitle)) throw new Error(`Duplicate normalized title: ${business.title}`);
    titles.set(normalizedTitle, business.slug);
  }
  const declared = inventory.counts?.total_businesses;
  if (Number.isInteger(declared) && declared !== inventory.businesses.length) throw new Error(`Inventory count mismatch: declared ${declared}, found ${inventory.businesses.length}`);
}

function includesAny(text, expressions) { return expressions.some((expression) => expression.test(text)); }

function classifyBusiness(business) {
  const text = `${business.slug} ${business.title}`.toLowerCase();
  const sensitivity = new Set();
  if (includesAny(text, [/medical/, /clinical/, /patient/, /health/, /pharmacy/, /340b/, /hipaa/, /aba-/, /reimbursement/, /medicare/, /medicaid/])) sensitivity.add('clinical');
  if (includesAny(text, [/legal/, /litigation/, /court/, /counsel/, /contract/, /lien/, /subpoena/, /privilege/, /claim/, /penalty-defense/, /appeal/, /dispute/])) sensitivity.add('legal');
  if (includesAny(text, [/tax/, /401k/, /financial/, /finance/, /bank/, /mortgage/, /loan/, /payroll/, /commission/, /billing/, /audit/, /insurance/, /revenue/, /bond/, /accounting/])) sensitivity.add('financial');
  if (includesAny(text, [/employment/, /employee/, /labor/, /wage/, /payroll/, /ada-/, /pwfa/, /hr-/, /benefit/, /workers-comp/])) sensitivity.add('employment');
  if (includesAny(text, [/tenant/, /housing/, /hud/, /lihtc/, /landlord/, /property/, /real-estate/, /mortgage/, /appraisal/])) sensitivity.add('housing');
  if (includesAny(text, [/safety/, /osha/, /fire/, /hazard/, /emergency/, /injury/, /recall/])) sensitivity.add('safety');
  if (includesAny(text, [/environment/, /epa/, /emission/, /asbestos/, /refrigerant/, /aim-act/, /neshap/, /waste/, /water/, /air-/])) sensitivity.add('environmental');
  if (includesAny(text, [/privacy/, /cyber/, /security/, /data-/, /identity/, /breach/, /hipaa/])) sensitivity.add('privacy');
  if (includesAny(text, [/child/, /children/, /school/, /student/, /education/])) sensitivity.add('education');
  if (includesAny(text, [/federal/, /government/, /fema/, /agency/, /grant/, /public-assistance/, /contractor/, /procurement/])) sensitivity.add('government');
  if (includesAny(text, [/compliance/, /regulatory/, /audit/, /reporting/, /certification/, /license/, /filing/, /notification/, /inspection/])) sensitivity.add('regulated_industry');
  if (sensitivity.size === 0) sensitivity.add('none');
  const highRisk = ['clinical', 'legal', 'financial', 'employment', 'housing', 'safety'].some((item) => sensitivity.has(item));
  const moderateRisk = highRisk || sensitivity.size > 1 || sensitivity.has('regulated_industry') || sensitivity.has('environmental') || sensitivity.has('privacy');
  const secondaryArchetypes = new Set();
  if (includesAny(text, [/engine/, /platform/, /software/, /workflow/, /portal/, /ai-native/, /generator/, /checker/])) secondaryArchetypes.add('saas');
  if (includesAny(text, [/desk/, /done-for-you/, /managed/, /review/, /audit/, /advisory/, /service/])) secondaryArchetypes.add('professional');
  if (includesAny(text, [/directory/, /marketplace/, /provider/])) secondaryArchetypes.add('directory');
  if (sensitivity.has('clinical')) secondaryArchetypes.add('clinical');
  if (includesAny(text, [/real-estate/, /property/, /housing/, /appraisal/, /mortgage/])) secondaryArchetypes.add('real_estate');
  if (includesAny(text, [/ai-native/, /artificial-intelligence/, /algorithm/, /automated/])) secondaryArchetypes.add('ai_native');
  const businessModel = new Set();
  if (includesAny(text, [/desk/, /managed/, /done-for-you/, /review/, /audit/])) businessModel.add('managed_service');
  if (includesAny(text, [/engine/, /platform/, /software/, /ai-native/])) businessModel.add('software');
  if (includesAny(text, [/engine/, /workflow/, /checker/, /tracker/, /reconciliation/, /completeness/])) businessModel.add('workflow');
  if (includesAny(text, [/pack/, /document/, /form/, /notice/, /filing/, /report/, /narrative/])) businessModel.add('document_generation');
  if (includesAny(text, [/advisory/, /opinion/, /assessment/, /audit/, /review/])) businessModel.add('advisory');
  if (includesAny(text, [/directory/])) businessModel.add('directory');
  if (businessModel.size === 0) businessModel.add('hybrid');
  let geographicModel = 'national';
  if (includesAny(text, [/multi-state/, /multistate/, /multi-jurisdiction/])) geographicModel = 'multi_jurisdiction';
  if (includesAny(text, [/global/, /international/, /cross-border/, /import/, /export/])) geographicModel = 'global';
  if (includesAny(text, [/local-/, /city-/, /county-/])) geographicModel = 'local';
  let cohort = 'general-regulatory-and-workflow';
  for (const item of ['clinical', 'financial', 'employment', 'housing', 'environmental', 'safety', 'privacy', 'government', 'legal']) if (sensitivity.has(item)) { cohort = item; break; }
  return {
    primary_archetype: 'authority', secondary_archetypes: [...secondaryArchetypes].filter((item) => item !== 'authority'), sensitivity: [...sensitivity],
    ymyl_level: highRisk ? 'high' : moderateRisk ? 'moderate' : 'none', geographic_model: geographicModel, business_model: [...businessModel],
    review_intensity: highRisk ? 'qualified_domain_review' : moderateRisk ? 'enhanced' : 'standard', cohort,
    priority: business.launched || business.developed ? 'high' : 'unscored'
  };
}

function selectUtility(business) {
  const text = `${business.slug} ${business.title}`.toLowerCase();
  if (includesAny(text, [/calculator/, /estimator/, /computation/, /rebate/, /yield/])) return ['calculator', 'Business-specific calculator or estimator'];
  if (includesAny(text, [/deadline/, /renewal/, /tracker/, /lifecycle/])) return ['tracker', 'Deadline, renewal, or obligation tracker'];
  if (includesAny(text, [/document/, /notice/, /form/, /filing/, /pack/, /narrative/])) return ['document_generator', 'Guided document or evidence-pack generator'];
  if (includesAny(text, [/comparison/, /vendor/, /selection/, /alternatives/])) return ['comparison', 'Decision and comparison matrix'];
  if (includesAny(text, [/audit/, /risk/, /assessment/, /compliance/, /completeness/, /review/, /checker/])) return ['assessment', 'Readiness, risk, or completeness assessment'];
  return ['checklist', 'Business-specific implementation checklist or decision aid'];
}

function unassignedOwner() { return { name: null, role: null, contact: null, status: 'unassigned' }; }
function requirementProfile(requirements) { return { status: 'planned', requirements, owners: [], evidence: [] }; }
const EPICS = [
  ['epic-01', 'Discovery, sources, and differentiation'], ['epic-02', 'Audience, offer, and commercial validation'], ['epic-03', 'Brand and design-system configuration'], ['epic-04', 'Content and entity models'],
  ['epic-05', 'Information architecture and URL plan'], ['epic-06', 'Authority content and trust pages'], ['epic-07', 'Product, service, or workflow experience'], ['epic-08', 'Original utility and lead magnets'],
  ['epic-09', 'Editorial and domain-review operations'], ['epic-10', 'Technical SEO, structured data, and internal linking'], ['epic-11', 'Lead capture, newsletter, CRM, and lifecycle'],
  ['epic-12', 'Analytics, attribution, experimentation, and dashboards'], ['epic-13', 'Accessibility, performance, security, privacy, and legal review'],
  ['epic-14', 'Off-site authority, partnerships, reviews, and reputation'], ['epic-15', 'Migration, launch, indexation, monitoring, and rollback'], ['epic-16', 'Continuous content, regulatory, product, and technical maintenance']
];
const GATES = [
  ['gate-a', 'Inventory and identity'], ['gate-b', 'Independent purpose and differentiation'], ['gate-c', 'Research and source integrity'], ['gate-d', 'Authority and editorial trust'],
  ['gate-e', 'Original value and content completeness'], ['gate-f', 'Product, service, and conversion truthfulness'], ['gate-g', 'Information architecture and internal linking'],
  ['gate-h', 'On-page and technical SEO'], ['gate-i', 'Structured data'], ['gate-j', 'Accessibility'], ['gate-k', 'Performance and page experience'], ['gate-l', 'Privacy, security, and legal'],
  ['gate-m', 'Analytics, consent, and measurement'], ['gate-n', 'Newsletter and lifecycle operations'], ['gate-o', 'Off-site authority and reputation'], ['gate-p', 'Launch, migration, and operations']
];

async function blueprintHash(business, blueprintsRoot) {
  if (business.blueprint_sha256) return business.blueprint_sha256;
  if (!blueprintsRoot) return null;
  const blueprintPath = path.resolve(blueprintsRoot, business.blueprint_html);
  if (!(await fileExists(blueprintPath))) return null;
  const content = await readFile(blueprintPath);
  return createHash('sha256').update(content).digest('hex');
}

function buildPlan(business, classification, hash, sourceRepository) {
  const [utilityType, utilityName] = selectUtility(business);
  const now = new Date().toISOString();
  return {
    schema_version: '1.0.0', plan_id: `ainbis-plan:${business.slug}`, plan_version: '0.1.0',
    business: { slug: business.slug, title: business.title, brand_name: null, source_repository: sourceRepository, blueprint_path: business.blueprint_html, blueprint_sha256: hash, source: business.source ?? null, on_main: Boolean(business.on_main), developed: Boolean(business.developed), launched: Boolean(business.launched) },
    state: { planning: 'scaffolded', indexability: business.launched ? 'public_noindex' : 'planning', freshness: hash ? 'current' : 'unknown', blockers: ['Complete current primary-source and search-landscape research','Validate independent purpose and portfolio differentiation','Assign accountable owners and required reviewers','Specify original utility, launch content graph, conversion, and operating model','Pass all authority and indexability gates'] },
    owners: { business: unassignedOwner(), editorial: unassignedOwner(), technical: unassignedOwner(), domain_reviewer: classification.review_intensity === 'standard' ? null : unassignedOwner(), privacy_security: unassignedOwner(), approver: unassignedOwner() },
    classification,
    strategy: { independent_purpose: { status: 'unassessed', text: '', evidence: [] }, audiences: [], jobs_to_be_done: [], problem: { status: 'unassessed', text: '', evidence: [] }, offer: { status: 'unassessed', text: '', evidence: [] }, differentiation: { status: 'unassessed', text: '', evidence: [] }, boundaries: [], commercial_model: [], overlap_assessment: { status: 'unassessed', related_businesses: [], decision: 'pending', rationale: '' }, success_metrics: [] },
    authority: { thesis: { status: 'unassessed', text: '', evidence: [] }, original_value: [], expertise: [], first_hand_evidence: [], methodology: [], maintenance_model: [], who_how_why: { who: '', how: '', why: '' } },
    research: { status: 'not_started', source_manifest: 'research-manifest.json', primary_sources: [], secondary_sources: [], open_questions: [], effective_date_dependencies: [] },
    search: { topic_boundary: '', intent_clusters: [], entities: [], regulations_standards: [], query_page_map: [], collision_status: 'unassessed', competitor_and_gap_notes: [] },
    site_architecture: { navigation_model: [], pages: [], url_policy: [], internal_linking_model: [], excluded_page_patterns: ['Token-swapped location, role, industry, regulation, or keyword pages','Pages without unique purpose, evidence, ownership, maintenance, and indexability decisions'] },
    content: { launch_portfolio: [], expansion_backlog: [], editorial_workflow: ['research','brief','draft','source verification','domain review when required','editorial approval','technical and accessibility validation','publish noindex','indexability approval','monitor','refresh or retire'], review_policy: [], prohibited_content: ['Unsupported consequential claims','Fabricated proof, experts, credentials, results, clients, reviews, or statistics','Scaled or doorway content created primarily for search rankings','Superficial rewriting without substantial original value'], newsletter_pillars: [] },
    utilities: [{ id: 'utility-01', name: utilityName, type: utilityType, purpose: 'Provide defensible value beyond informational content', status: 'idea', inputs: [], outputs: [], source_basis: [], risks: [], reviewers: [], conversion_role: null }],
    conversion: { primary_action: 'To be determined from business model and audience intent', secondary_actions: [], lead_magnets: [], forms: [], newsletter: 'undecided', crm_lifecycle: [], ethical_constraints: ['No fake urgency, deceptive scarcity, confirm-shaming, hidden fees, or preselected consent','Collect only data necessary for the stated purpose'] },
    trust: { authors: [], reviewers: [], source_policy: [], claim_policy: [], proof_policy: ['Only genuine, permissioned proof may be presented as real','Pre-launch proof slots must be visibly labeled placeholder or illustrative'], disclosures: [], corrections: [] },
    technical: { rendering: 'undecided', canonical_policy: [], robots_policy: ['Generated and review environments remain noindex'], sitemap_profiles: [], redirect_policy: [], structured_data: [], localization: [], monitoring: [] },
    accessibility: requirementProfile(['WCAG 2.2 AA minimum','Manual and assistive-technology review for critical flows']),
    performance: requirementProfile(['Template budgets','Core Web Vitals lab and real-user monitoring','Third-party script governance']),
    privacy_security: requirementProfile(['Data minimization','Secure forms and uploads','Consent and preference management','Incident and rollback plans']),
    analytics: requirementProfile(['Consent-aware event taxonomy','Search, content, utility, lead, conversion, and quality dashboards']),
    offsite_authority: requirementProfile(['Original citation-worthy assets','Legitimate expert, media, association, partnership, review, and reputation activity']),
    implementation: { stage: 'scaffolded', epics: EPICS.map(([id, name]) => ({ id, name, status: 'planned', owner: null, deliverables: [], dependencies: [], acceptance_criteria: [], evidence: [] })), dependencies: [], migration: business.launched ? ['Inventory and preserve existing URLs, search equity, analytics, leads, and conversion behavior'] : [], launch: [], operations: [] },
    gates: GATES.map(([id, name]) => ({ id, name, status: 'not_assessed', blocking: true, owner: null, reviewed_at: null, evidence: [], notes: '' })),
    provenance: { generated_at: now, generator: GENERATOR, inputs: [business.blueprint_html], human_review: [], change_log: ['Initial deterministic scaffold from authoritative inventory'] }
  };
}

function refreshPlan(existing, business, classification, hash, sourceRepository) {
  const previousHash = existing.business?.blueprint_sha256 ?? null;
  const changed = Boolean(previousHash && hash && previousHash !== hash);
  const now = new Date().toISOString();
  return { ...existing,
    business: { ...existing.business, slug: business.slug, title: business.title, source_repository: sourceRepository, blueprint_path: business.blueprint_html, blueprint_sha256: hash, source: business.source ?? null, on_main: Boolean(business.on_main), developed: Boolean(business.developed), launched: Boolean(business.launched) },
    classification: existing.classification ?? classification,
    state: { ...existing.state, freshness: changed ? 'stale' : hash ? 'current' : existing.state?.freshness ?? 'unknown', blockers: changed ? [...new Set([...(existing.state?.blockers ?? []), 'Blueprint changed after the last reviewed plan; review and refresh required'])] : existing.state?.blockers ?? [] },
    provenance: { ...existing.provenance, generated_at: now, generator: GENERATOR, inputs: [...new Set([...(existing.provenance?.inputs ?? []), business.blueprint_html])], change_log: [...(existing.provenance?.change_log ?? []), changed ? 'Refreshed inventory metadata and marked plan stale after blueprint hash change' : 'Refreshed inventory metadata'] }
  };
}

function renderMarkdown(plan) {
  const sensitivities = plan.classification.sensitivity.join(', ');
  const secondary = plan.classification.secondary_archetypes.join(', ') || 'None assigned';
  const gates = plan.gates.map((gate) => `- [ ] **${gate.name}** — ${gate.status}`).join('\n');
  const epics = plan.implementation.epics.map((epic) => `- [ ] ${epic.name}`).join('\n');
  return `# ${plan.business.title}\n\n**Slug:** \`${plan.business.slug}\`  \n**Plan version:** ${plan.plan_version}  \n**Planning state:** ${plan.state.planning}  \n**Indexability:** ${plan.state.indexability}  \n**Blueprint:** \`${plan.business.blueprint_path}\`  \n**Developed:** ${plan.business.developed ? 'Yes' : 'No'}  \n**Launched:** ${plan.business.launched ? 'Yes' : 'No'}\n\n## Initial classification\n\n- Primary archetype: ${plan.classification.primary_archetype}\n- Secondary archetypes: ${secondary}\n- Sensitivity: ${sensitivities}\n- YMYL level: ${plan.classification.ymyl_level}\n- Review intensity: ${plan.classification.review_intensity}\n- Cohort: ${plan.classification.cohort}\n\n> This is a deterministic scaffold, not an approved business, content, legal, clinical, financial, search, or indexability decision. Complete the research and review fields in \`plan.json\`.\n\n## Required implementation epics\n\n${epics}\n\n## Mandatory gates\n\n${gates}\n\n## Current blockers\n\n${plan.state.blockers.map((item) => `- ${item}`).join('\n')}\n`;
}

async function listPlanFiles(root) {
  const files = [];
  if (!(await fileExists(root))) return files;
  async function walk(directory) { for (const entry of await readdir(directory, { withFileTypes: true })) { const entryPath = path.join(directory, entry.name); if (entry.isDirectory()) await walk(entryPath); else if (entry.name === 'plan.json') files.push(entryPath); } }
  await walk(root); return files;
}

async function validateParity(inventory, outputRoot) {
  const expected = new Set(inventory.businesses.map((business) => business.slug));
  const planFiles = await listPlanFiles(outputRoot); const actual = new Map(); const errors = [];
  for (const planFile of planFiles) { const plan = await loadJson(planFile); const slug = plan.business?.slug; if (!slug) { errors.push(`${planFile}: missing business.slug`); continue; } if (actual.has(slug)) errors.push(`Duplicate plan for ${slug}: ${actual.get(slug)} and ${planFile}`); actual.set(slug, planFile); if (plan.plan_id !== `ainbis-plan:${slug}`) errors.push(`${planFile}: plan_id does not match slug`); if (plan.schema_version !== '1.0.0') errors.push(`${planFile}: unsupported schema_version ${plan.schema_version}`); }
  for (const slug of expected) if (!actual.has(slug)) errors.push(`Missing plan for inventory business ${slug}`);
  for (const [slug, planFile] of actual) if (!expected.has(slug)) errors.push(`Orphan plan not found in inventory: ${slug} (${planFile})`);
  if (errors.length > 0) throw new Error(`Portfolio plan validation failed:\n- ${errors.join('\n- ')}`);
  return { expected: expected.size, actual: actual.size };
}

async function writeJson(filePath, value) { await mkdir(path.dirname(filePath), { recursive: true }); await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8'); }

async function main() {
  const args = parseArgs(process.argv.slice(2)); const inventoryPath = path.resolve(args.inventory); const outputRoot = path.resolve(args.output); const blueprintsRoot = args.blueprintsRoot ? path.resolve(args.blueprintsRoot) : null;
  const inventory = await loadJson(inventoryPath); validateInventory(inventory);
  if (args.mode === 'validate') { const result = await validateParity(inventory, outputRoot); console.log(`Validated ${result.actual} business authority plans against ${result.expected} inventory records.`); return; }
  const index = [];
  for (const business of inventory.businesses) {
    const bucket = business.slug[0]; const directory = path.join(outputRoot, bucket, business.slug); const planPath = path.join(directory, 'plan.json');
    const classification = classifyBusiness(business); const hash = await blueprintHash(business, blueprintsRoot); const existing = await fileExists(planPath) ? await loadJson(planPath) : null;
    const plan = existing ? refreshPlan(existing, business, classification, hash, args.sourceRepository) : buildPlan(business, classification, hash, args.sourceRepository);
    await mkdir(directory, { recursive: true }); await writeJson(planPath, plan); await writeFile(path.join(directory, 'plan.md'), renderMarkdown(plan), 'utf8');
    index.push({ slug: business.slug, title: business.title, plan_path: path.relative(process.cwd(), planPath), blueprint_path: business.blueprint_html, blueprint_sha256: hash, developed: Boolean(business.developed), launched: Boolean(business.launched), planning_state: plan.state.planning, indexability: plan.state.indexability, sensitivity: plan.classification.sensitivity, ymyl_level: plan.classification.ymyl_level, review_intensity: plan.classification.review_intensity, cohort: plan.classification.cohort });
  }
  index.sort((left, right) => left.slug.localeCompare(right.slug)); await writeJson(path.join(outputRoot, 'index.json'), { generated_at: new Date().toISOString(), count: index.length, source_repository: args.sourceRepository, inventory: path.relative(process.cwd(), inventoryPath), businesses: index });
  const summary = { generated_at: new Date().toISOString(), inventory_count: inventory.businesses.length, plan_count: index.length, developed_count: index.filter((item) => item.developed).length, launched_count: index.filter((item) => item.launched).length, blueprint_hash_count: index.filter((item) => item.blueprint_sha256).length, by_review_intensity: index.reduce((accumulator, item) => { accumulator[item.review_intensity] = (accumulator[item.review_intensity] ?? 0) + 1; return accumulator; }, {}) };
  await writeJson(path.join(outputRoot, 'summary.json'), summary); const result = await validateParity(inventory, outputRoot); console.log(`${args.mode === 'refresh' ? 'Refreshed' : 'Generated'} ${result.actual} business authority plans with exact inventory parity.`);
}

main().catch((error) => { console.error(error); process.exit(1); });
