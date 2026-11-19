import {MESSAGES} from '../i18n/language.ts'
import {applyTheme, useTheme} from '../theme.ts'

/** Switches to the light theme and back; a toggle button, pressed while the page is light. */
export function ThemeToggle() {
    const light = useTheme() === 'light'
    return (
        <button type="button" className="theme-toggle" aria-pressed={light} aria-label={MESSAGES.lightTheme}
                title={MESSAGES.lightTheme} onClick={() => {
                    applyTheme(light ? 'dark' : 'light')
                }}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" fill={light ? 'currentColor' : 'none'}/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
        </button>
    )
}
