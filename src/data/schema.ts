import {z} from 'zod'
import type {Language} from '../i18n/languages.ts'
import {AI_USAGE_LEVELS, COMPLEXITY_LEVELS, PROJECT_KINDS, TEAM_SIZES} from './scales.ts'
import {FRAMEWORKS, idsOf, PROGRAMMING_LANGUAGES, TOOLS} from './technologies.ts'

// Validated at build time by build-plugins/yaml-data.ts; the app only imports the types.

const text = z.string().trim().min(1)

/** Either one text for all languages (e.g. a company name) or one per language. */
const localized = z.union([
    text,
    z.strictObject({de: text, en: text, fr: text} satisfies Record<Language, typeof text>),
], {error: 'expected a text for all languages or an object with exactly de, en and fr'})

/** `YYYY` or `YYYY-MM`; unquoted years arrive from YAML as numbers. */
const yearMonth = z.coerce.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, 'expected YYYY or YYYY-MM')

/** Without `to` the period lasts until today. */
const period = z.strictObject({
    from: yearMonth,
    to: yearMonth.optional(),
}).refine(({from, to}) => to === undefined || from <= to, 'from must not be after to')

/** A flag emoji: two regional indicators (🇫🇷) or a subdivision tag sequence (🏴󠁧󠁢󠁳󠁣󠁴󠁿). */
const flag = z.string().regex(/^(\p{Regional_Indicator}{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2,}\u{E007F})$/u,
    'expected a single flag emoji, e.g. 🇫🇷')

/** Ids of page sections; a project id is used as URL hash too, so it must differ from them. */
const SECTION_ANCHORS = ['projects', 'contact']

export interface SchemaContext {
    /** Whether a URL path like `/images/profile.webp` exists in `public/`. */
    imageExists: (urlPath: string) => boolean
}

export function createSchemas(context: SchemaContext) {
    const image = z.string()
        .regex(/^\/images\/[\w./-]+$/, 'expected a path below /images/')
        .refine(urlPath => context.imageExists(urlPath), {
            error: issue => `image not found: public${String(issue.input)}`,
        })

    const profile = z.strictObject({
        name: text,
        headline: localized,
        location: localized.optional(),
        photo: image.optional(),
        about: localized.optional(),
        /** Easter egg: shown instead of `photo` and `about` while the mouse is over the photo. */
        shadowPhoto: image.optional(),
        shadowAbout: localized.optional(),
        experience: z.array(z.strictObject({
            role: localized,
            organization: text,
            /** Logo of the organization, shown on a white tile. */
            logo: image.optional(),
            location: localized.optional(),
            period,
            description: localized.optional(),
        })).default([]),
        certificates: z.array(z.strictObject({
            name: localized,
            issuer: text,
            logo: image.optional(),
            issued: yearMonth,
            /** Last month of validity, if the certificate expires. */
            validUntil: yearMonth.optional(),
            url: z.url().optional(),
        }).refine(({issued, validUntil}) => validUntil === undefined || issued <= validUntil,
            'issued must not be after validUntil')).default([]),
        education: z.array(z.strictObject({
            degree: localized,
            institution: text.optional(),
            logo: image.optional(),
            period,
            /** Details below the title line, e.g. the focus of the studies. */
            description: localized.optional(),
        })).default([]),
        languages: z.array(z.strictObject({
            name: localized,
            level: localized,
            flag: flag.optional(),
        })).default([]),
        /** Shown below the name; known sites (src/sites.ts) get their icon and name. */
        links: z.array(z.url()).default([]),
        /** The one way to get in touch, linked in the contact section. */
        contact: z.url(),
    })
        .refine(({photo, shadowPhoto, shadowAbout}) =>
            photo !== undefined || (shadowPhoto === undefined && shadowAbout === undefined),
        {error: 'shadowPhoto and shadowAbout need a photo to hover over', path: ['photo']})
        .refine(({about, shadowAbout}) => about !== undefined || shadowAbout === undefined,
            {error: 'shadowAbout needs an about to replace', path: ['about']})

    const project = z.strictObject({
        /** Stable key, later also the anchor in the URL. */
        id: z.string()
            .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'expected lowercase letters, digits and single hyphens')
            .refine(id => !SECTION_ANCHORS.includes(id), {
                error: issue => `id "${String(issue.input)}" is taken by a section anchor of the page`,
            }),
        /** Hidden projects are still validated, but left out of the page and the bundle. */
        visible: z.boolean().default(true),
        name: localized,
        icon: image,
        complexity: z.enum(COMPLEXITY_LEVELS),
        aiUsage: z.enum(AI_USAGE_LEVELS),
        description: localized,
        /** Ids from src/data/technologies.ts; an unknown id fails the build. */
        languages: z.array(z.enum(idsOf(PROGRAMMING_LANGUAGES))).default([]),
        frameworks: z.array(z.enum(idsOf(FRAMEWORKS))).default([]),
        /** Platforms, build tools, infrastructure, e.g. Docker or AWS. */
        tools: z.array(z.enum(idsOf(TOOLS))).default([]),
        kind: z.enum(PROJECT_KINDS).optional(),
        period: period.optional(),
        team: z.enum(TEAM_SIZES).optional(),
        /** Free text about the team, e.g. its size or the own role in it. */
        teamDetails: localized.optional(),
        githubUrl: z.url().optional(),
        websiteUrl: z.url().optional(),
    })

    const projects = z.array(project).superRefine((entries, context) => {
        const seen = new Set<string>()
        entries.forEach(({id}, index) => {
            if (seen.has(id)) {
                context.addIssue({code: 'custom', path: [index, 'id'], message: `duplicate id "${id}"`})
            }
            seen.add(id)
        })
    }).transform(entries => entries.filter(({visible}) => visible))

    /** One schema per file in src/data, keyed by file name without `.yaml`. */
    return {profile, projects}
}

type Schemas = ReturnType<typeof createSchemas>

export type Localized = z.infer<typeof localized>
export type Period = z.infer<typeof period>
export type Profile = z.infer<Schemas['profile']>
export type Project = z.infer<Schemas['projects']>[number]
