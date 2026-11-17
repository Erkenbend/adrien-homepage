import githubIcon from './assets/sites/github.svg'
import isaqbIcon from './assets/sites/isaqb.svg'
import linkIcon from './assets/sites/link.svg'
import linkedinIcon from './assets/sites/linkedin.png'

interface Site {
    /** Host names, subdomains included (`linkedin.com` also matches `de.linkedin.com`). */
    hosts: string[]
    name: string
    icon: string
    /** Optional detail shown after the name, e.g. to tell several profiles apart. */
    detail?: (url: URL) => string | undefined
}

/** Known sites, recognized by host name. Add an entry here to give another site its icon and name. */
const SITES: Site[] = [
    {hosts: ['github.com'], name: 'GitHub', icon: githubIcon, detail: githubUser},
    {hosts: ['linkedin.com'], name: 'LinkedIn', icon: linkedinIcon},
    {hosts: ['isaqb.org'], name: 'iSAQB', icon: isaqbIcon},
]

export interface LinkDisplay {
    label: string
    icon: string
}

/**
 * Label and icon for a link: known sites get their name and logo, other links a generic icon and either
 * `fallbackLabel` or the host name.
 */
export function describeLink(href: string, fallbackLabel?: string): LinkDisplay {
    const url = new URL(href)
    const host = url.hostname.toLowerCase()
    const site = SITES.find(({hosts}) => hosts.some(known => host === known || host.endsWith(`.${known}`)))
    if (!site) {
        return {label: fallbackLabel ?? host.replace(/^www\./, ''), icon: linkIcon}
    }
    const detail = site.detail?.(url)
    return {label: detail ? `${site.name} (${detail})` : site.name, icon: site.icon}
}

/** `https://github.com/<user>` → `<user>`; repository URLs get no detail, the project is clear from context. */
function githubUser(url: URL): string | undefined {
    const segments = url.pathname.split('/').filter(Boolean)
    return segments.length === 1 ? segments[0] : undefined
}
