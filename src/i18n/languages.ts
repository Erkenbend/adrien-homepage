// Kept free of browser globals: also used by the data schema at build time.
export const LANGUAGES = ['de', 'en', 'fr'] as const
export type Language = typeof LANGUAGES[number]

export const DEFAULT_LANGUAGE: Language = 'de'

/** Language from the first path segment; anything unknown falls back to the default language. */
export function languageFromPath(pathname: string): Language {
    const segment = pathname.split('/')[1] ?? ''
    return LANGUAGES.find(language => language !== DEFAULT_LANGUAGE && language === segment) ?? DEFAULT_LANGUAGE
}

/** The default language lives at `/`, the others under `/<language>/`. */
export function pathFor(language: Language): string {
    return language === DEFAULT_LANGUAGE ? '/' : `/${language}/`
}
