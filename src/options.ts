import {useSyncExternalStore} from 'react'
import {ENV_VARIABLES, parseSetting, SETTING_NAMES, SETTINGS, type SettingName, type SettingValue} from './settings.ts'

// The display settings of src/settings.ts as the page uses them. The build fixes them (`.env`); in `bun dev`
// the options picker can override them for comparison, kept in the query string (`?layout=split&graph=lines`)
// so a link shows the same choice. The production build ignores the query string.

const CHANGE_EVENT = 'options-change'

/** The values from the build, checked there (build-plugins/settings.ts). */
const BUILD_VALUES = Object.fromEntries(SETTING_NAMES.map(name => {
    const value = parseSetting(name, import.meta.env[ENV_VARIABLES[name]])
    return [name, value ?? SETTINGS[name][0]]
})) as {[Name in SettingName]: SettingValue<Name>}

function subscribe(onChange: () => void): () => void {
    window.addEventListener('popstate', onChange)
    window.addEventListener(CHANGE_EVENT, onChange)
    return () => {
        window.removeEventListener('popstate', onChange)
        window.removeEventListener(CHANGE_EVENT, onChange)
    }
}

/** The value from the query string; anything unknown falls back to the build value. */
function valueIn<Name extends SettingName>(parameters: URLSearchParams, name: Name): SettingValue<Name> {
    return parseSetting(name, parameters.get(name)) ?? BUILD_VALUES[name]
}

function currentValue<Name extends SettingName>(name: Name): SettingValue<Name> {
    return valueIn(new URLSearchParams(window.location.search), name)
}

/** Query string with every option that differs from the build value, empty if none does. */
function queryOf(parameters: URLSearchParams): string {
    const kept = new URLSearchParams()
    for (const name of SETTING_NAMES) {
        const value = valueIn(parameters, name)
        if (value !== BUILD_VALUES[name]) {
            kept.set(name, value)
        }
    }
    const query = kept.toString()
    return query ? `?${query}` : ''
}

function currentQuery(): string {
    return queryOf(new URLSearchParams(window.location.search))
}

export function useOption<Name extends SettingName>(name: Name): SettingValue<Name> {
    const value = useSyncExternalStore(subscribe, () => currentValue(name), () => BUILD_VALUES[name])
    return import.meta.env.DEV ? value : BUILD_VALUES[name]
}

/** The query string to keep the current options on another page, e.g. another language; empty in production. */
export function useOptionsQuery(): string {
    const query = useSyncExternalStore(subscribe, currentQuery, () => '')
    return import.meta.env.DEV ? query : ''
}

/** Replaces the current history entry, keeping its state (see `src/hash.ts`) and the hash. */
export function setOption<Name extends SettingName>(name: Name, value: SettingValue<Name>): void {
    const parameters = new URLSearchParams(window.location.search)
    parameters.set(name, value)
    const url = window.location.pathname + queryOf(parameters) + window.location.hash
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new Event(CHANGE_EVENT))
}
