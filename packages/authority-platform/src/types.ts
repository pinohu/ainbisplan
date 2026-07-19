export type Priority = "critical" | "high" | "medium" | "low" | "unscored";
export type Indexability = "planning" | "private_build" | "public_noindex" | "indexable_candidate" | "indexable" | "restricted" | "retired";
export type GateStatus = "not_assessed" | "blocked" | "in_progress" | "passed" | "failed" | "not_applicable";

export interface BusinessIdentity {
  slug: string;
  title: string;
  brand_name?: string | null;
  developed: boolean;
  launched: boolean;
  blueprint_sha256?: string | null;
}

export interface Classification {
  primary_archetype: string;
  secondary_archetypes: string[];
  sensitivity: string[];
  ymyl_level: "none" | "moderate" | "high";
  geographic_model: string;
  business_model: string[];
  review_intensity: string;
  cohort?: string | null;
  priority?: Priority;
}

export interface PlanGate {
  id: string;
  name: string;
  status: GateStatus;
  blocking: boolean;
  evidence: string[];
  notes?: string;
}

export interface BusinessPlan {
  plan_id: string;
  plan_version: string;
  business: BusinessIdentity;
  state: {
    planning: string;
    indexability: Indexability;
    freshness: string;
    blockers?: string[];
  };
  classification: Classification;
  strategy: Record<string, unknown>;
  authority: Record<string, unknown>;
  search: {
    topic_boundary?: string;
    intent_clusters?: unknown[];
    entities?: unknown[];
    regulations_standards?: unknown[];
    query_page_map?: unknown[];
    collision_status?: string;
  };
  site_architecture: {
    pages?: Array<{ id: string; path: string; purpose: string; indexability: string; status: string }>;
    internal_linking_model?: string[];
  };
  content: {
    launch_portfolio?: unknown[];
    expansion_backlog?: unknown[];
  };
  utilities: Array<{ id: string; name: string; type: string; status: string; source_basis?: string[] }>;
  conversion: Record<string, unknown>;
  trust: Record<string, unknown>;
  technical: Record<string, unknown>;
  accessibility: RequirementProfile;
  performance: RequirementProfile;
  privacy_security: RequirementProfile;
  analytics: RequirementProfile;
  offsite_authority: RequirementProfile;
  implementation: {
    stage: string;
    epics: Array<Record<string, unknown>>;
    dependencies: string[];
    migration: string[];
    launch: string[];
    operations: string[];
  };
  gates: PlanGate[];
  provenance: {
    generated_at: string;
    generator: string;
    inputs: string[];
    human_review: string[];
    change_log: string[];
  };
}

export interface RequirementProfile {
  status: "not_started" | "planned" | "in_progress" | "review" | "passed" | "failed" | "not_applicable";
  requirements: string[];
  owners: string[];
  evidence: string[];
}

export interface PriorityAssessment {
  slug: string;
  score: number;
  priority: Priority;
  cohort: string;
  reasons: string[];
  reviewerRequired: boolean;
  launchedAuditRequired: boolean;
}

export interface ReferenceSelection {
  category: "launched_regulated" | "high_risk" | "professional_service" | "saas_workflow" | "local_jurisdiction" | "tool_intensive";
  slug: string;
  title: string;
  rationale: string[];
}

export interface QualityFinding {
  code: string;
  severity: "info" | "warning" | "error" | "blocker";
  message: string;
  evidence: string[];
}
