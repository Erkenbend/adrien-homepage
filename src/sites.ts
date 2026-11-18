// No browser APIs here: build-plugins/yaml-data.ts imports this file to check that every icon exists.

interface Site {
    /** Host names, subdomains included (`linkedin.com` also matches `de.linkedin.com`). */
    hosts: string[]
    name: string
    /** Path below public/. */
    icon: string
    /** The icon is white, made for a dark background: inverted in the light theme. */
    darkOnly?: boolean
    /** Optional detail shown after the name, e.g. to tell several profiles apart. */
    detail?: (url: URL) => string | undefined
}

/** Known sites, recognized by host name. Add an entry here to give another site its icon and name. */
export const SITES: Site[] = [
    {hosts: ['github.com'], name: 'GitHub', icon: '/images/sites/github.svg', darkOnly: true, detail: githubUser},
    {hosts: ['linkedin.com'], name: 'LinkedIn', icon: '/images/sites/linkedin.png'},
    {hosts: ['isaqb.org'], name: 'iSAQB', icon: '/images/sites/isaqb.svg'},
]

/** Icon of links to sites not in `SITES`. */
export const GENERIC_LINK_ICON = '/images/sites/link.svg'

export interface LinkDisplay {
    label: string
    icon: string
    /** See `Site.darkOnly`. */
    darkOnly: boolean
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
        // The generic icon is white as well.
        return {label: fallbackLabel ?? host.replace(/^www\./, ''), icon: GENERIC_LINK_ICON, darkOnly: true}
    }
    const detail = site.detail?.(url)
    return {label: detail ? `${site.name} (${detail})` : site.name, icon: site.icon, darkOnly: site.darkOnly ?? false}
}

/** `https://github.com/<user>` → `<user>`; repository URLs get no detail, the project is clear from context. */
function githubUser(url: URL): string | undefined {
    const segments = url.pathname.split('/').filter(Boolean)
    return segments.length === 1 ? segments[0] : undefined
}
