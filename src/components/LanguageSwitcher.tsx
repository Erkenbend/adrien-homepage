import {useHash} from '../hash.ts'
import {LANGUAGE, LANGUAGE_NAMES, LANGUAGES, MESSAGES, pathFor} from '../i18n/language.ts'
import {useOptionsQuery} from '../options.ts'

export function LanguageSwitcher() {
    // Keeps the display options and the position when switching language, e.g. #contact.
    const hash = useHash()
    const query = useOptionsQuery()
    const suffix = hash ? `#${encodeURIComponent(hash)}` : ''
    return (
        <nav className="language-switcher" aria-label={MESSAGES.languageSwitcherLabel}>
            {LANGUAGES.map(language => (
                <a
                    key={language}
                    href={pathFor(language) + query + suffix}
                    hrefLang={language}
                    lang={language}
                    title={LANGUAGE_NAMES[language]}
                    aria-current={language === LANGUAGE ? 'page' : undefined}
                >
                    {language.toUpperCase()}
                </a>
            ))}
        </nav>
    )
}
