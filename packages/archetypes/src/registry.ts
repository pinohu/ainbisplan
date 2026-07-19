export const archetypeIds = [
  "authority",
  "professional-trust",
  "saas-workflow",
  "operations",
  "clinical",
  "academic",
  "directory",
  "children-learning",
  "real-estate",
  "premium-consumer",
  "ai-native",
  "administration"
] as const;

export type ArchetypeId = (typeof archetypeIds)[number];

export type Density = "spacious" | "balanced" | "compact" | "dense";
export type MotionLevel = "minimal" | "restrained" | "functional" | "expressive";
export type TrustLevel = "standard" | "elevated" | "critical";

export interface ArchetypeDefinition {
  readonly id: ArchetypeId;
  readonly name: string;
  readonly dominantTask: string;
  readonly density: Density;
  readonly motion: MotionLevel;
  readonly trust: TrustLevel;
  readonly primaryConversions: readonly string[];
  readonly requiredCapabilities: readonly string[];
  readonly prohibitedPatterns: readonly string[];
}

export const archetypeRegistry: Readonly<Record<ArchetypeId, ArchetypeDefinition>> = {
  authority: {
    id: "authority",
    name: "Authority and publishing",
    dominantTask: "Understand a topic, establish trust, and take a contextual next step.",
    density: "spacious",
    motion: "restrained",
    trust: "elevated",
    primaryConversions: ["subscribe", "download", "use-tool", "request-service"],
    requiredCapabilities: [
      "editorial hierarchy",
      "authorship and review history",
      "citations and evidence",
      "topic and location hubs",
      "lead magnets",
      "internal linking"
    ],
    prohibitedPatterns: ["generic popup overload", "thin templated content", "false expertise"]
  },
  "professional-trust": {
    id: "professional-trust",
    name: "Professional services and trust",
    dominantTask: "Decide whether a provider is credible, appropriate, available, and worth contacting.",
    density: "balanced",
    motion: "minimal",
    trust: "critical",
    primaryConversions: ["schedule", "request-quote", "check-eligibility", "call"],
    requiredCapabilities: [
      "credentials",
      "transparent pricing",
      "service boundaries",
      "availability",
      "preparation guidance",
      "privacy and security explanation"
    ],
    prohibitedPatterns: ["hidden fees", "fake urgency", "unsupported guarantees"]
  },
  "saas-workflow": {
    id: "saas-workflow",
    name: "SaaS and workflow",
    dominantTask: "Complete a structured task safely and efficiently.",
    density: "balanced",
    motion: "functional",
    trust: "elevated",
    primaryConversions: ["start", "resume", "preview", "verify", "export"],
    requiredCapabilities: [
      "progress",
      "validation",
      "saved state",
      "preview and diff",
      "version history",
      "approval and export"
    ],
    prohibitedPatterns: ["irreversible action without confirmation", "hidden assumptions", "ambiguous save state"]
  },
  operations: {
    id: "operations",
    name: "Data-intensive operations",
    dominantTask: "Monitor, reconcile, diagnose, and act across many records or processes.",
    density: "dense",
    motion: "functional",
    trust: "critical",
    primaryConversions: ["filter", "reconcile", "retry", "approve", "verify"],
    requiredCapabilities: [
      "dense tables",
      "saved views",
      "bulk actions",
      "run history",
      "logs and provenance",
      "exception queues"
    ],
    prohibitedPatterns: ["status by color alone", "optimistic completion", "untraceable bulk action"]
  },
  clinical: {
    id: "clinical",
    name: "Healthcare and clinical documentation",
    dominantTask: "Review and document clinically relevant information safely.",
    density: "compact",
    motion: "minimal",
    trust: "critical",
    primaryConversions: ["document", "review", "calculate", "refer", "follow-up"],
    requiredCapabilities: [
      "unit-aware values",
      "medication provenance",
      "red flags",
      "guideline versions",
      "audit history",
      "clinician verification"
    ],
    prohibitedPatterns: ["decorative ambiguity", "unverified clinical claims", "silent unit conversion"]
  },
  academic: {
    id: "academic",
    name: "Academic and institutional",
    dominantTask: "Evaluate programs, evidence, people, facilities, outcomes, or requirements.",
    density: "balanced",
    motion: "minimal",
    trust: "elevated",
    primaryConversions: ["request-information", "apply", "visit", "download", "contact"],
    requiredCapabilities: [
      "curriculum and outcomes",
      "faculty and facilities",
      "accreditation evidence",
      "audience pathways",
      "downloadable records"
    ],
    prohibitedPatterns: ["marketing without evidence", "buried accreditation", "inaccessible document-only content"]
  },
  directory: {
    id: "directory",
    name: "Local directory and marketplace",
    dominantTask: "Find, compare, and contact a suitable local provider or resource.",
    density: "compact",
    motion: "functional",
    trust: "elevated",
    primaryConversions: ["search", "compare", "contact", "request-quotes", "save"],
    requiredCapabilities: [
      "location-first navigation",
      "filters",
      "map and list parity",
      "provider freshness",
      "comparison",
      "correction workflow"
    ],
    prohibitedPatterns: ["pay-to-rank without disclosure", "stale listings without dates", "map-only access"]
  },
  "children-learning": {
    id: "children-learning",
    name: "Children’s learning and entertainment",
    dominantTask: "Learn through safe, age-appropriate stories, activities, and reflection.",
    density: "spacious",
    motion: "expressive",
    trust: "critical",
    primaryConversions: ["watch", "read", "discuss", "print", "parent-subscribe"],
    requiredCapabilities: [
      "child and adult pathways",
      "captions and read-aloud support",
      "large targets",
      "pause and reduced motion",
      "learning objectives",
      "parent guidance"
    ],
    prohibitedPatterns: ["dark patterns", "shame or streak pressure", "manipulative autoplay", "disguised advertising"]
  },
  "real-estate": {
    id: "real-estate",
    name: "Real-estate investment analysis",
    dominantTask: "Evaluate a property using evidence, assumptions, scenarios, and due diligence.",
    density: "compact",
    motion: "minimal",
    trust: "critical",
    primaryConversions: ["save", "investigate", "model", "inspect", "decide"],
    requiredCapabilities: [
      "comps",
      "rehab assumptions",
      "rent and subsidy scenarios",
      "zoning and parking",
      "risk register",
      "data freshness"
    ],
    prohibitedPatterns: ["false precision", "fact-estimate conflation", "go decision without unknowns"]
  },
  "premium-consumer": {
    id: "premium-consumer",
    name: "Premium consumer and lifestyle",
    dominantTask: "Explore, trust, compare, and purchase an aspirational offering.",
    density: "spacious",
    motion: "restrained",
    trust: "standard",
    primaryConversions: ["explore", "compare", "purchase", "inquire"],
    requiredCapabilities: ["quality imagery", "product evidence", "comparison", "transparent terms"],
    prohibitedPatterns: ["image-heavy performance failure", "hidden pricing", "motion without control"]
  },
  "ai-native": {
    id: "ai-native",
    name: "AI-native interfaces",
    dominantTask: "Delegate, inspect, edit, approve, and verify assisted work.",
    density: "balanced",
    motion: "functional",
    trust: "critical",
    primaryConversions: ["generate", "review", "approve", "commit", "deploy"],
    requiredCapabilities: [
      "tool visibility",
      "source provenance",
      "permissions",
      "editable output",
      "reversible actions",
      "partial-result handling"
    ],
    prohibitedPatterns: ["hidden tool actions", "fabricated completion", "write without approval"]
  },
  administration: {
    id: "administration",
    name: "Internal administration",
    dominantTask: "Configure, govern, and audit users, content, permissions, and systems.",
    density: "dense",
    motion: "minimal",
    trust: "critical",
    primaryConversions: ["configure", "grant", "revoke", "audit", "archive"],
    requiredCapabilities: ["permissions", "audit history", "safe destructive actions", "defaults", "bulk administration"],
    prohibitedPatterns: ["unclear permission scope", "silent destructive action", "decorative complexity"]
  }
};

export function getArchetype(id: ArchetypeId): ArchetypeDefinition {
  return archetypeRegistry[id];
}
