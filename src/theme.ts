// Colour scheme: dark by default, light on request. The choice is kept in localStorage; an inline script in
// index.html applies it before the first paint, so a light page does not flash dark first. Both read the
// same key and attribute, keep them in sync.

export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'theme'

/** The theme index.html applied, from `<html data-theme>`. */
export function currentTheme(): Theme {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function applyTheme(theme: Theme) {
    const root = document.documentElement
    if (theme === 'light') {
        root.dataset.theme = 'light'
    } else {
        delete root.dataset.theme
    }
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme)
    try {
        if (theme === 'light') {
            localStorage.setItem(THEME_STORAGE_KEY, theme)
        } else {
            localStorage.removeItem(THEME_STORAGE_KEY)
        }
    } catch {
        // Storage blocked (private mode, settings): the choice holds until the next page load.
    }
}
