import {useSyncExternalStore} from 'react'

// Proof of concept: the arrangement of the page is chosen on the page itself and kept in the query string
// (`?layout=split`), so a link shows the same arrangement. Once one is picked, this may become a build setting.

export const LAYOUTS = ['classic', 'showcase', 'sidebar', 'split', 'bento'] as const

export type Layout = (typeof LAYOUTS)[number]

export const DEFAULT_LAYOUT: Layout = 'classic'

const PARAMETER = 'layout'
const CHANGE_EVENT = 'layout-change'

function subscribe(onChange: () => void): () => void {
    window.addEventListener('popstate', onChange)
    window.addEventListener(CHANGE_EVENT, onChange)
    return () => {
        window.removeEventListener('popstate', onChange)
        window.removeEventListener(CHANGE_EVENT, onChange)
    }
}

function currentLayout(): Layout {
    const value = new URLSearchParams(window.location.search).get(PARAMETER)
    return LAYOUTS.find(layout => layout === value) ?? DEFAULT_LAYOUT
}

/** The layout from the query string; anything unknown falls back to the default. */
export function useLayout(): Layout {
    return useSyncExternalStore(subscribe, currentLayout)
}

/** Query string for a layout, empty for the default one. */
export function layoutQuery(layout: Layout): string {
    return layout === DEFAULT_LAYOUT ? '' : `?${PARAMETER}=${layout}`
}

/** Replaces the current history entry, keeping its state (see `src/hash.ts`) and the hash. */
export function setLayout(layout: Layout): void {
    const url = window.location.pathname + layoutQuery(layout) + window.location.hash
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new Event(CHANGE_EVENT))
}
