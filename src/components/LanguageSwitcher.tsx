import {LANGUAGE, LANGUAGE_NAMES, LANGUAGES, MESSAGES, pathFor} from '../i18n/language.ts'

export function LanguageSwitcher() {
    return (
        <nav className="language-switcher" aria-label={MESSAGES.languageSwitcherLabel}>
            {LANGUAGES.map(language => (
                <a
                    key={language}
                    href={pathFor(language)}
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
