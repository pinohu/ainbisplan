import type { ArchetypeId, Density, MotionLevel, TrustLevel } from "@ainbis/archetypes";

export type AudienceSophistication = "general" | "informed" | "expert";
export type GeographicScope = "local" | "regional" | "national" | "global";
export type ProblemSeverity = "low" | "moderate" | "high" | "critical";
export type BuyingCycle = "immediate" | "short" | "considered" | "long";
export type RegulatorySensitivity = "low" | "moderate" | "high" | "critical";
export type EmotionalPosture = "calm" | "confident" | "urgent" | "hopeful" | "playful" | "aspirational";

export interface BrandInput {
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly niche: string;
  readonly archetype: ArchetypeId;
  readonly audience: string;
  readonly audienceSophistication: AudienceSophistication;
  readonly geographicScope: GeographicScope;
  readonly problemSeverity: ProblemSeverity;
  readonly buyingCycle: BuyingCycle;
  readonly trustLevel: TrustLevel;
  readonly regulatorySensitivity: RegulatorySensitivity;
  readonly primaryConversion: string;
  readonly emotionalPosture: EmotionalPosture;
}

export interface BrandProfile {
  readonly generatorVersion: "0.1.0";
  readonly seed: number;
  readonly identity: {
    readonly slug: string;
    readonly name: string;
    readonly archetype: ArchetypeId;
    readonly positioningLine: string;
  };
  readonly visual: {
    readonly typography: "editorial" | "humanist" | "neutral" | "technical" | "friendly" | "premium";
    readonly paletteTemperature: "cool" | "balanced" | "warm";
    readonly contrast: "measured" | "strong" | "maximum";
    readonly density: Density;
    readonly radius: "square" | "soft" | "rounded";
    readonly imagery: "documentary" | "editorial" | "diagrammatic" | "product" | "character-led" | "local-evidence";
    readonly motion: MotionLevel;
  };
  readonly content: {
    readonly authority: "supportive" | "confident" | "expert";
    readonly technicality: "plain-language" | "balanced" | "technical";
    readonly pace: "concise" | "guided" | "explanatory";
    readonly emotionalPosture: EmotionalPosture;
    readonly evidenceProminence: "standard" | "elevated" | "critical";
  };
  readonly conversion: {
    readonly primary: string;
    readonly emphasis: "gentle" | "clear" | "prominent";
    readonly trustProximity: "page-level" | "section-level" | "action-level";
  };
  readonly safety: {
    readonly regulatorySensitivity: RegulatorySensitivity;
    readonly requiresDomainReview: boolean;
    readonly prohibited: readonly string[];
  };
}

const typographyOptions = ["editorial", "humanist", "neutral", "technical", "friendly", "premium"] as const;
const temperatureOptions = ["cool", "balanced", "warm"] as const;
const radiusOptions = ["square", "soft", "rounded"] as const;

function hash(value: string): number {
  let result = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }

  return result >>> 0;
}

function pick<T>(values: readonly T[], seed: number, offset: number): T {
  const value = values[(seed + offset) % values.length];

  if (value === undefined) {
    throw new Error("Cannot select from an empty brand option set.");
  }

  return value;
}

function deriveDensity(archetype: ArchetypeId): Density {
  switch (archetype) {
    case "authority":
    case "children-learning":
    case "premium-consumer":
      return "spacious";
    case "clinical":
    case "directory":
    case "real-estate":
      return "compact";
    case "operations":
    case "administration":
      return "dense";
    default:
      return "balanced";
  }
}

function deriveMotion(archetype: ArchetypeId, sensitivity: RegulatorySensitivity): MotionLevel {
  if (sensitivity === "critical" || archetype === "clinical" || archetype === "administration") {
    return "minimal";
  }

  if (archetype === "children-learning") {
    return "expressive";
  }

  if (archetype === "saas-workflow" || archetype === "operations" || archetype === "directory" || archetype === "ai-native") {
    return "functional";
  }

  return "restrained";
}

function deriveTypography(input: BrandInput, seed: number): BrandProfile["visual"]["typography"] {
  if (input.archetype === "authority") return pick(["editorial", "humanist"], seed, 3);
  if (input.archetype === "clinical" || input.archetype === "operations" || input.archetype === "ai-native") return pick(["neutral", "technical"], seed, 5);
  if (input.archetype === "children-learning") return "friendly";
  if (input.archetype === "premium-consumer") return "premium";
  return pick(typographyOptions, seed, 7);
}

function deriveImagery(input: BrandInput): BrandProfile["visual"]["imagery"] {
  switch (input.archetype) {
    case "children-learning":
      return "character-led";
    case "operations":
    case "clinical":
    case "ai-native":
      return "diagrammatic";
    case "directory":
    case "real-estate":
    case "professional-trust":
      return "local-evidence";
    case "premium-consumer":
      return "product";
    case "authority":
      return "editorial";
    default:
      return "documentary";
  }
}

function deriveProhibited(input: BrandInput): readonly string[] {
  const universal = [
    "inaccessible contrast",
    "status communicated by color alone",
    "deceptive urgency",
    "unverified completion claims"
  ];

  const sensitive = input.regulatorySensitivity === "high" || input.regulatorySensitivity === "critical"
    ? ["unsupported professional claims", "domain output without qualified review"]
    : [];

  const childSafety = input.archetype === "children-learning"
    ? ["manipulative autoplay", "streak pressure", "disguised advertising"]
    : [];

  return [...universal, ...sensitive, ...childSafety];
}

export function generateBrandProfile(input: BrandInput): BrandProfile {
  const normalizedSeedInput = [
    input.slug,
    input.category,
    input.niche,
    input.archetype,
    input.audience,
    input.primaryConversion
  ].join("|").toLowerCase();
  const seed = hash(normalizedSeedInput);
  const criticalTrust = input.trustLevel === "critical" || input.regulatorySensitivity === "critical";
  const highSeverity = input.problemSeverity === "high" || input.problemSeverity === "critical";

  return {
    generatorVersion: "0.1.0",
    seed,
    identity: {
      slug: input.slug,
      name: input.name,
      archetype: input.archetype,
      positioningLine: `${input.name} helps ${input.audience} address ${input.niche} with ${input.emotionalPosture} guidance and explicit evidence.`
    },
    visual: {
      typography: deriveTypography(input, seed),
      paletteTemperature: input.emotionalPosture === "urgent" ? "warm" : pick(temperatureOptions, seed, 11),
      contrast: criticalTrust ? "maximum" : highSeverity ? "strong" : "measured",
      density: deriveDensity(input.archetype),
      radius: input.archetype === "clinical" || input.archetype === "operations"
        ? "soft"
        : pick(radiusOptions, seed, 13),
      imagery: deriveImagery(input),
      motion: deriveMotion(input.archetype, input.regulatorySensitivity)
    },
    content: {
      authority: input.audienceSophistication === "expert" ? "expert" : criticalTrust ? "confident" : "supportive",
      technicality: input.audienceSophistication === "expert" ? "technical" : input.audienceSophistication === "informed" ? "balanced" : "plain-language",
      pace: input.buyingCycle === "immediate" ? "concise" : input.buyingCycle === "long" ? "explanatory" : "guided",
      emotionalPosture: input.emotionalPosture,
      evidenceProminence: criticalTrust ? "critical" : input.trustLevel === "elevated" ? "elevated" : "standard"
    },
    conversion: {
      primary: input.primaryConversion,
      emphasis: input.buyingCycle === "immediate" || highSeverity ? "prominent" : input.buyingCycle === "long" ? "gentle" : "clear",
      trustProximity: criticalTrust ? "action-level" : input.trustLevel === "elevated" ? "section-level" : "page-level"
    },
    safety: {
      regulatorySensitivity: input.regulatorySensitivity,
      requiresDomainReview: input.regulatorySensitivity === "high" || input.regulatorySensitivity === "critical",
      prohibited: deriveProhibited(input)
    }
  };
}
