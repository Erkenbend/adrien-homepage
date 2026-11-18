import path from 'node:path'
import type {HtmlTagDescriptor, Plugin} from 'vite'
import type {Localized, Profile} from '../src/data/schema.ts'
import {DEFAULT_LANGUAGE, LANGUAGES, pathFor} from '../src/i18n/languages.ts'
import {loadData} from './yaml-data.ts'

export const SITE_URL_VARIABLE = 'VITE_SITE_URL'

/**
 * Writes title, description and Open Graph tags from src/data/profile.yaml into index.html, in the default
 * language. Link previews (LinkedIn, messengers) do not run JavaScript, so these must be in the HTML itself;
 * as the page is a single index.html for every language, the previews are in the default language.
 *
 * Open Graph needs absolute URLs, hence `VITE_SITE_URL` (in .env): checked when Vite starts.
 */
export function pageMeta(): Plugin {
    let root = process.cwd()
    let siteUrl = ''

    return {
        name: 'page-meta',

        configResolved(config) {
            root = config.root
            siteUrl = parseSiteUrl(config.env[SITE_URL_VARIABLE] as string | undefined)
        },

        transformIndexHtml(html, context) {
            if (context.filename !== path.join(root, 'index.html')) {
                return html
            }
            const profile = loadData(root, 'profile') as Profile
            const headline = inDefaultLanguage(profile.headline)
            const description = profile.about ? inDefaultLanguage(profile.about).trim() : headline

            const meta = (attribute: 'name' | 'property', key: string, content: string): HtmlTagDescriptor =>
                ({tag: 'meta', attrs: {[attribute]: key, content}, injectTo: 'head'})
            const tags: HtmlTagDescriptor[] = [
                {tag: 'title', children: profile.name, injectTo: 'head'},
                meta('name', 'description', description),
                meta('property', 'og:type', 'website'),
                meta('property', 'og:url', `${siteUrl}/`),
                meta('property', 'og:title', `${profile.name} · ${headline}`),
                meta('property', 'og:description', description),
                meta('name', 'twitter:card', 'summary'),
                ...LANGUAGES.map((language): HtmlTagDescriptor => ({
                    tag: 'link',
                    attrs: {rel: 'alternate', hreflang: language, href: `${siteUrl}${pathFor(language)}`},
                    injectTo: 'head',
                })),
            ]
            if (profile.photo) {
                tags.push(
                    meta('property', 'og:image', `${siteUrl}${profile.photo}`),
                    meta('property', 'og:image:alt', profile.name),
                )
            }
            return {
                html: html.replace(/<html lang="[^"]*">/, `<html lang="${DEFAULT_LANGUAGE}">`),
                tags,
            }
        },
    }
}

function parseSiteUrl(value: string | undefined): string {
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

function inDefaultLanguage(value: Localized): string {
    return typeof value === 'string' ? value : value[DEFAULT_LANGUAGE]
}
