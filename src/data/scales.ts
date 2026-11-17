// Values of the project fields with a fixed set of choices. Kept free of browser globals: also used by
// the data schema at build time. The labels per language are in src/i18n/, typed against these lists.

/** Axis of the project graph, ordered from the lowest to the highest level. */
export const COMPLEXITY_LEVELS = ['script', 'demo', 'app', 'multiPart', 'system'] as const
export type Complexity = typeof COMPLEXITY_LEVELS[number]

/** AI used while developing (not AI in the product); axis of the project graph, from none to the most. */
export const AI_USAGE_LEVELS = ['none', 'light', 'heavy', 'vibe'] as const
export type AiUsage = typeof AI_USAGE_LEVELS[number]

/** `training`: sponsored by work, but not for a customer. */
export const PROJECT_KINDS = ['professional', 'training', 'hobby'] as const
export type ProjectKind = typeof PROJECT_KINDS[number]

export const TEAM_SIZES = ['solo', 'group'] as const
export type TeamSize = typeof TEAM_SIZES[number]
