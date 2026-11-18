import {de, type Messages} from './de.ts'
import {en} from './en.ts'
import {fr} from './fr.ts'
import {DEFAULT_LANGUAGE, LANGUAGES, pathFor, type Language} from './languages.ts'

export {LANGUAGES, pathFor, type Language}

const DICTIONARIES: Record<Language, Messages> = {de, en, fr}

/** Name of each language in that language, for the switcher. */
export const LANGUAGE_NAMES: Record<Language, string> = {
    de: 'Deutsch',
    en: 'English',
    fr: 'Français',
}

/** Language from the first path segment; anything unknown falls back to the default language. */
export function languageFromPath(pathname: string): Language {
    const segment = pathname.split('/')[1] ?? ''
    return LANGUAGES.find(language => language !== DEFAULT_LANGUAGE && language === segment) ?? DEFAULT_LANGUAGE
}

// Switching language is a normal page load, so the language is fixed for the lifetime of the page.
export const LANGUAGE: Language = languageFromPath(window.location.pathname)
export const MESSAGES: Messages = DICTIONARIES[LANGUAGE]
