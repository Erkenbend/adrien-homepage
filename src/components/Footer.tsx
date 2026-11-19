import {useSyncExternalStore} from 'react'
import {LANGUAGE, MESSAGES} from '../i18n/language.ts'
import {SiteLink} from './SiteLink.tsx'

const REPOSITORY_URL = 'https://github.com/Erkenbend/adrien-homepage'

/** False while prerendering and hydrating, true afterwards. */
function useInBrowser(): boolean {
    return useSyncExternalStore(() => () => undefined, () => true, () => false)
}

/** Build time as version and a link to the source code. */
export function Footer() {
    // In the visitor's time zone, which only the browser knows; prerendered in UTC.
    const inBrowser = useInBrowser()
    const format = new Intl.DateTimeFormat(LANGUAGE, {dateStyle: 'medium', timeStyle: 'short', timeZone: inBrowser ? undefined : 'UTC'})
    const buildTime = format.format(new Date(BUILD_TIMESTAMP)) + (inBrowser ? '' : ' UTC')
    return (
        <footer>
            <span>{MESSAGES.version}: <time dateTime={BUILD_TIMESTAMP}>{buildTime}</time></span>
            <SiteLink url={REPOSITORY_URL} label={MESSAGES.sourceCode}/>
        </footer>
    )
}
