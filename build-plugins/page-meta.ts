import type {Localized, Profile} from '../src/data/schema.ts'
import {LANGUAGES, pathFor, type Language} from '../src/i18n/languages.ts'

export const SITE_URL_VARIABLE = 'VITE_SITE_URL'

/**
 * Title, description and Open Graph tags from src/data/profile.yaml for the page in one language, as HTML for
 * `<head>`. Link previews (LinkedIn, messengers) and other crawlers do not run JavaScript, so these must be in
 * the HTML itself; build-plugins/prerender.ts writes them into each language's page.
 *
 * Open Graph needs absolute URLs, hence `VITE_SITE_URL` (in .env): checked when Vite starts.
 */
export function pageHead(profile: Profile, language: Language, siteUrl: string): string {
    const localize = (value: Localized): string => typeof value === 'string' ? value : value[language]
    const headline = localize(profile.headline)
    const description = profile.about ? localize(profile.about).trim() : headline

    const meta = (attribute: 'name' | 'property', key: string, content: string): string =>
        element('meta', {[attribute]: key, content})
    const tags = [
        element('title', {}, profile.name),
        meta('name', 'description', description),
        meta('property', 'og:type', 'website'),
        meta('property', 'og:url', `${siteUrl}${pathFor(language)}`),
        meta('property', 'og:title', `${profile.name} · ${headline}`),
        meta('property', 'og:description', description),
        meta('name', 'twitter:card', 'summary'),
        ...LANGUAGES.map(other => element('link', {rel: 'alternate', hreflang: other, href: `${siteUrl}${pathFor(other)}`})),
    ]
    if (profile.photo) {
        tags.push(
            meta('property', 'og:image', `${siteUrl}${profile.photo}`),
            meta('property', 'og:image:alt', profile.name),
        )
    }
    return tags.join('\n    ')
}

/** The origin of `VITE_SITE_URL`; fails with an explanation if it is missing or not the address of a page. */
export function parseSiteUrl(value: string | undefined): string {
    let url: URL | undefined
    try {
        url = value ? new URL(value) : undefined
    } catch {
        url = undefined
    }
    if (!url || !['http:', 'https:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash) {
        const shown = value === undefined ? 'not set' : `invalid value "${value}"`
        throw new Error(`Build setting ${SITE_URL_VARIABLE}: ${shown}, expected the address of the page, e.g. https://example.com`)
    }
    return url.origin
}

/** An HTML element; without content a void element such as `<meta>`. */
function element(tag: string, attributes: Record<string, string>, content?: string): string {
    const attributeText = Object.entries(attributes).map(([name, value]) => ` ${name}="${escapeHtml(value)}"`).join('')
    return content === undefined ? `<${tag}${attributeText}>` : `<${tag}${attributeText}>${escapeHtml(content)}</${tag}>`
}

function escapeHtml(text: string): string {
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}
