// Kept free of browser globals: also used by the data schema at build time.
export const LANGUAGES = ['de', 'en', 'fr'] as const
export type Language = typeof LANGUAGES[number]

export const DEFAULT_LANGUAGE: Language = 'de'
