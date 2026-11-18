import {useSyncExternalStore} from 'react'

// Proof of concept: display options chosen on the page itself and kept in the query string
// (`?layout=split&graph=lines`), so a link shows the same choice. Once one is picked, an option may become a
// build setting. The first value of each option is its default and is left out of the URL.

export const OPTIONS = {
    /** Arrangement of the page, see src/layouts/Layouts.tsx. */
    layout: ['classic', 'showcase', 'sidebar', 'split', 'bento'],
    /** Look of the project graph, see src/components/ProjectGraph.tsx. */
    graph: ['classic', 'matrix', 'lines', 'open'],
} as const

export type OptionName = keyof typeof OPTIONS
export type OptionValue<Name extends OptionName> = (typeof OPTIONS)[Name][number]
export type Layout = OptionValue<'layout'>
export type GraphStyle = OptionValue<'graph'>

const OPTION_NAMES = Object.keys(OPTIONS) as OptionName[]
const CHANGE_EVENT = 'options-change'

function subscribe(onChange: () => void): () => void {
    window.addEventListener('popstate', onChange)
    window.addEventListener(CHANGE_EVENT, onChange)
    return () => {
        window.removeEventListener('popstate', onChange)
        window.removeEventListener(CHANGE_EVENT, onChange)
    }
}

/** The value from the query string; anything unknown falls back to the default. */
function valueIn<Name extends OptionName>(parameters: URLSearchParams, name: Name): OptionValue<Name> {
    const values: readonly OptionValue<Name>[] = OPTIONS[name]
    const value = parameters.get(name)
    return values.find(candidate => candidate === value) ?? values[0]
}

function currentValue<Name extends OptionName>(name: Name): OptionValue<Name> {
    return valueIn(new URLSearchParams(window.location.search), name)
}

/** Query string with every option that differs from its default, empty if none does. */
function queryOf(parameters: URLSearchParams): string {
    const kept = new URLSearchParams()
    for (const name of OPTION_NAMES) {
        const value = valueIn(parameters, name)
        if (value !== OPTIONS[name][0]) {
            kept.set(name, value)
        }
    }
    const query = kept.toString()
    return query ? `?${query}` : ''
}

function currentQuery(): string {
    return queryOf(new URLSearchParams(window.location.search))
}

export function useOption<Name extends OptionName>(name: Name): OptionValue<Name> {
    return useSyncExternalStore(subscribe, () => currentValue(name))
}

/** The query string to keep the current options on another page, e.g. another language. */
export function useOptionsQuery(): string {
    return useSyncExternalStore(subscribe, currentQuery)
}

/** Replaces the current history entry, keeping its state (see `src/hash.ts`) and the hash. */
export function setOption<Name extends OptionName>(name: Name, value: OptionValue<Name>): void {
    const parameters = new URLSearchParams(window.location.search)
    parameters.set(name, value)
    const url = window.location.pathname + queryOf(parameters) + window.location.hash
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new Event(CHANGE_EVENT))
}
