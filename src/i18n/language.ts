import {de, type Messages} from './de.ts'
import {en} from './en.ts'
import {fr} from './fr.ts'

export const LANGUAGES = ['de', 'en', 'fr'] as const
export type Language = typeof LANGUAGES[number]

export const DEFAULT_LANGUAGE: Language = 'de'

const DICTIONARIES: Record<Language, Messages> = {de, en, fr}

/** Name of each language in that language, for the switcher. */
export const LANGUAGE_NAMES: Record<Language, string> = {
    de: 'Deutsch',
    en: 'English',
    fr: 'Français',
}

/** The default language lives at `/`, the others under `/<language>/`. */
export function pathFor(language: Language): string {
    return language === DEFAULT_LANGUAGE ? '/' : `/${language}/`
}

/** Language from the first path segment; anything unknown falls back to the default language. */
export function languageFromPath(pathname: string): Language {
    const segment = pathname.split('/')[1] ?? ''
    return LANGUAGES.find(language => language !== DEFAULT_LANGUAGE && language === segment) ?? DEFAULT_LANGUAGE
}

// Switching language is a normal page load, so the language is fixed for the lifetime of the page.
export const LANGUAGE: Language = languageFromPath(window.location.pathname)
export const MESSAGES: Messages = DICTIONARIES[LANGUAGE]
