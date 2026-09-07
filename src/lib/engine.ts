/**
 * Rule-based requirements engine.
 *
 * Pure functions only — no React, no DOM. This keeps the decision logic
 * testable and reusable, and cleanly separated from UI (spec §11, closing).
 */
import type {
  Answers,
  Condition,
  FormVersion,
  Question,
  Requirement,
  ResolvedRequirement,
} from "./types";

/**
 * Evaluate a declarative condition against user answers.
 * Missing answers evaluate as "not equal" rather than throwing.
 */
export function evaluateCondition(
  condition: Condition | undefined,
  answers: Answers
): boolean {
  if (!condition) return true;

  if ("always" in condition) return true;
  if ("all" in condition) {
    return condition.all.every((c) => evaluateCondition(c, answers));
  }
  if ("any" in condition) {
    return condition.any.some((c) => evaluateCondition(c, answers));
  }
  if ("not" in condition) {
    return !evaluateCondition(condition.not, answers);
  }
  if ("equals" in condition) {
    return answers[condition.equals.questionId] === condition.equals.value;
  }
  if ("in" in condition) {
    return condition.in.values.includes(answers[condition.in.questionId]);
  }
  return false;
}

/**
 * Return the questions that should be shown for the current answers.
 * A question is hidden until its `showWhen` condition (if any) is satisfied.
 */
export function getVisibleQuestions(
  version: FormVersion,
  answers: Answers
): Question[] {
  return version.questions.filter((q) =>
    q.showWhen ? evaluateCondition(q.showWhen, answers) : true
  );
}

/** Whether a single requirement is active for the given answers. */
export function isRequirementActive(
  requirement: Requirement,
  answers: Answers
): boolean {
  return evaluateCondition(requirement.condition, answers);
}

/**
 * Resolve all requirements for a version against the user's answers.
 * Returns only the requirements that apply, preserving authoring order.
 */
export function resolveRequirements(
  version: FormVersion,
  answers: Answers
): ResolvedRequirement[] {
  return version.requirements
    .map((r) => ({ ...r, active: isRequirementActive(r, answers) }))
    .filter((r) => r.active);
}

/** Only the requirements that need a file upload. */
export function getUploadRequirements(
  version: FormVersion,
  answers: Answers
): ResolvedRequirement[] {
  return resolveRequirements(version, answers).filter(
    (r) => r.requiresUpload && r.uploadRule
  );
}

/**
 * Group resolved requirements by their `group` label for checklist display.
 * Requirements without a group fall under "Other Documents".
 */
export function groupRequirements(
  requirements: ResolvedRequirement[]
): { group: string; items: ResolvedRequirement[] }[] {
  const map = new Map<string, ResolvedRequirement[]>();
  for (const r of requirements) {
    const key = r.group || "Other Documents";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return Array.from(map.entries()).map(([group, items]) => ({ group, items }));
}

/** Convenience: current (marked) version of a form, else the first. */
export function getCurrentVersion(versions: FormVersion[]): FormVersion {
  return versions.find((v) => v.isCurrent) ?? versions[0];
}
