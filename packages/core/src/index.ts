export const lifecycleStates = [
  "draft",
  "generated",
  "reviewed",
  "verified",
  "committed",
  "deployed",
  "published",
  "deprecated",
  "retired"
] as const;

export const operationStates = [
  "idle",
  "queued",
  "running",
  "partial",
  "blocked",
  "failed",
  "succeeded",
  "reconciled",
  "complete"
] as const;

export const interfaceStates = [
  "loading",
  "empty",
  "ready",
  "stale",
  "offline",
  "warning",
  "error",
  "success",
  "disabled"
] as const;

export type LifecycleState = (typeof lifecycleStates)[number];
export type OperationState = (typeof operationStates)[number];
export type InterfaceState = (typeof interfaceStates)[number];

export interface AccessibleControlContract {
  readonly hasPersistentLabel: boolean;
  readonly keyboardOperable: boolean;
  readonly exposesName: boolean;
  readonly exposesState: boolean;
  readonly focusVisible: boolean;
  readonly minimumTargetSize: "24px-exception-aware" | "44px-preferred";
  readonly errorsAreProgrammaticallyAssociated: boolean;
  readonly colorIsNotTheOnlySignal: boolean;
}

export const accessibleControlContract: AccessibleControlContract = {
  hasPersistentLabel: true,
  keyboardOperable: true,
  exposesName: true,
  exposesState: true,
  focusVisible: true,
  minimumTargetSize: "44px-preferred",
  errorsAreProgrammaticallyAssociated: true,
  colorIsNotTheOnlySignal: true
};

export interface FeatureDefinitionOfDone {
  readonly documentedOutcome: boolean;
  readonly accessibilityImplemented: boolean;
  readonly responsiveVerified: boolean;
  readonly statesCovered: readonly InterfaceState[];
  readonly privacyReviewed: boolean;
  readonly analyticsReviewed: boolean;
  readonly contentRequirementsDocumented: boolean;
  readonly validationPassing: boolean;
  readonly planningLinked: boolean;
  readonly deploymentVerified: boolean;
}

export const requiredFeatureStates: readonly InterfaceState[] = [
  "loading",
  "empty",
  "ready",
  "warning",
  "error",
  "success",
  "disabled"
];

export function isFeatureComplete(
  definition: FeatureDefinitionOfDone
): boolean {
  const requiredStatesCovered = requiredFeatureStates.every((state) =>
    definition.statesCovered.includes(state)
  );

  return (
    definition.documentedOutcome &&
    definition.accessibilityImplemented &&
    definition.responsiveVerified &&
    requiredStatesCovered &&
    definition.privacyReviewed &&
    definition.analyticsReviewed &&
    definition.contentRequirementsDocumented &&
    definition.validationPassing &&
    definition.planningLinked &&
    definition.deploymentVerified
  );
}
