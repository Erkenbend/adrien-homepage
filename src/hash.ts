import {useSyncExternalStore} from 'react'

// The URL hash names the project shown in the detail dialog (e.g. `#tfcoach`), so details can be linked
// and the browser's back button closes the dialog. `history.pushState` fires no event, hence our own.

const CHANGE_EVENT = 'hash-change'

function subscribe(onChange: () => void): () => void {
    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    window.addEventListener(CHANGE_EVENT, onChange)
    return () => {
        window.removeEventListener('hashchange', onChange)
        window.removeEventListener('popstate', onChange)
        window.removeEventListener(CHANGE_EVENT, onChange)
    }
}

function currentHash(): string {
    return decodeURIComponent(window.location.hash.slice(1))
}

/** The URL hash without `#`, empty if there is none. */
export function useHash(): string {
    return useSyncExternalStore(subscribe, currentHash)
}

interface HistoryState {
    /** Set on entries added by `openHash`, which `closeHash` can then simply go back from. */
    openedHere?: boolean
}

/** Adds a history entry with the hash, so going back removes it again. */
export function openHash(hash: string): void {
    window.history.pushState({openedHere: true} satisfies HistoryState, '', `#${encodeURIComponent(hash)}`)
    window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Removes the hash: goes back if `openHash` added it, else (e.g. opened from a link) replaces the entry. */
export function closeHash(): void {
    if ((window.history.state as HistoryState | null)?.openedHere) {
        window.history.back() // fires popstate
        return
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    window.dispatchEvent(new Event(CHANGE_EVENT))
}
