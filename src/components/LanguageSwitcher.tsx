import {useHash} from '../hash.ts'
import {LANGUAGE, LANGUAGE_NAMES, LANGUAGES, MESSAGES, pathFor} from '../i18n/language.ts'
import {layoutQuery, type Layout} from '../layout.ts'

export function LanguageSwitcher({layout}: {layout: Layout}) {
    // Keeps the layout and the position when switching language, e.g. #contact.
    const hash = useHash()
    const suffix = hash ? `#${encodeURIComponent(hash)}` : ''
    return (
        <nav className="language-switcher" aria-label={MESSAGES.languageSwitcherLabel}>
            {LANGUAGES.map(language => (
                <a
                    key={language}
                    href={pathFor(language) + layoutQuery(layout) + suffix}
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
