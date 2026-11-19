import {de, type Messages} from './de.ts'
import {en} from './en.ts'
import {fr} from './fr.ts'
import {DEFAULT_LANGUAGE, languageFromPath, LANGUAGES, pathFor, type Language} from './languages.ts'

export {LANGUAGES, pathFor, type Language}

const DICTIONARIES: Record<Language, Messages> = {de, en, fr}

/** Name of each language in that language, for the switcher. */
export const LANGUAGE_NAMES: Record<Language, string> = {
    de: 'Deutsch',
    en: 'English',
    fr: 'Français',
}

// Switching language is a normal page load, so in the browser the language is fixed for the lifetime of the
// page. Read them at render time, not at module level: prerendering changes them (`setLanguage`).
export let LANGUAGE: Language = typeof window === 'undefined' ? DEFAULT_LANGUAGE : languageFromPath(window.location.pathname)
export let MESSAGES: Messages = DICTIONARIES[LANGUAGE]

/** Prerendering only (src/entry-server.tsx): renders the page once per language in the same process. */
export function setLanguage(language: Language): void {
    LANGUAGE = language
    MESSAGES = DICTIONARIES[language]
}
