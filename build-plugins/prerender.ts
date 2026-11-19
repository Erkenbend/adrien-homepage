import {mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import type {Plugin} from 'vite'
import type {Profile} from '../src/data/schema.ts'
import {languageFromPath, LANGUAGES, pathFor, type Language} from '../src/i18n/languages.ts'
import {pageHead, parseSiteUrl, SITE_URL_VARIABLE} from './page-meta.ts'
import {loadData} from './yaml-data.ts'

/** The server bundle, only needed during the build. */
const SERVER_OUT_DIR = 'node_modules/.prerender'
const SERVER_ENTRY = 'src/entry-server.tsx'

// Placeholders in index.html.
const HEAD_PLACEHOLDER = '<!--page-head-->'
const BODY_PLACEHOLDER = '<!--page-body-->'
const HTML_LANG = /<html lang="[^"]*">/

/**
 * Prerenders the page: AI tools, search engines and link previews often read the HTML without running
 * JavaScript, and would see an empty page otherwise.
 *
 * `vite build` builds the client as usual, then `src/entry-server.tsx` for Node, and writes one page per
 * language from the built index.html: `dist/index.html` for the default language, `dist/<language>/index.html`
 * for the others, each with the rendered page, `<html lang>` and the head from build-plugins/page-meta.ts.
 * The browser hydrates them (`src/main.tsx`). `bun dev` renders in the browser only, with the head of the
 * language in the URL.
 */
export function prerender(): Plugin {
    let root = process.cwd()
    let siteUrl = ''

    function page(template: string, language: Language, body: string): string {
        if (!template.includes(HEAD_PLACEHOLDER) || !template.includes(BODY_PLACEHOLDER) || !HTML_LANG.test(template)) {
            throw new Error(`index.html needs <html lang="…">, ${HEAD_PLACEHOLDER} in <head> and ${BODY_PLACEHOLDER} in <div id="root">`)
        }
        const profile = loadData(root, 'profile') as Profile
        return template
            .replace(HTML_LANG, `<html lang="${language}">`)
            .replace(HEAD_PLACEHOLDER, () => pageHead(profile, language, siteUrl))
            .replace(BODY_PLACEHOLDER, () => body)
    }

    return {
        name: 'prerender',

        config() {
            return {
                builder: {},
                environments: {
                    ssr: {
                        build: {
                            outDir: SERVER_OUT_DIR,
                            emptyOutDir: true,
                            copyPublicDir: false,
                            rollupOptions: {input: SERVER_ENTRY},
                        },
                    },
                },
            }
        },

        configResolved(config) {
            root = config.root
            siteUrl = parseSiteUrl(config.env[SITE_URL_VARIABLE] as string | undefined)
        },

        transformIndexHtml(html, context) {
            if (!context.server || context.filename !== path.join(root, 'index.html')) {
                return html
            }
            const language = languageFromPath(new URL(context.originalUrl ?? '/', 'http://localhost').pathname)
            return page(html, language, '')
        },

        async buildApp(builder) {
            const {client, ssr} = builder.environments
            await builder.build(client)
            await builder.build(ssr)

            const serverDir = path.resolve(root, SERVER_OUT_DIR)
            const serverEntry = path.join(serverDir, `${path.basename(SERVER_ENTRY, '.tsx')}.js`)
            const {render} = await import(pathToFileURL(serverEntry).href) as {render: (language: Language) => string}

            const outDir = path.resolve(root, client.config.build.outDir)
            const template = await readFile(path.join(outDir, 'index.html'), 'utf8')
            for (const language of LANGUAGES) {
                const file = path.join(outDir, pathFor(language), 'index.html')
                await mkdir(path.dirname(file), {recursive: true})
                await writeFile(file, page(template, language, render(language)))
                client.logger.info(`prerendered ${path.relative(root, file)}`)
            }
            await rm(serverDir, {recursive: true, force: true})
        },
    }
}
