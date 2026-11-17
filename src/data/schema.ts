import {z} from 'zod'
import type {Language} from '../i18n/languages.ts'

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
        experience: z.array(z.strictObject({
            role: localized,
            organization: text,
            location: localized.optional(),
            period,
            description: localized.optional(),
        })).default([]),
        education: z.array(z.strictObject({
            degree: localized,
            institution: text.optional(),
            period,
        })).default([]),
        certificates: z.array(z.strictObject({
            name: localized,
            issuer: text,
            issued: yearMonth,
            /** Last month of validity, if the certificate expires. */
            validUntil: yearMonth.optional(),
            url: z.url().optional(),
        }).refine(({issued, validUntil}) => validUntil === undefined || issued <= validUntil,
            'issued must not be after validUntil')).default([]),
        languages: z.array(z.strictObject({
            name: localized,
            level: localized,
        })).default([]),
        links: z.strictObject({
            linkedin: z.url(),
            github: z.array(z.url()).default([]),
        }),
    })

    /** One schema per file in src/data, keyed by file name without `.yaml`. */
    return {profile}
}

type Schemas = ReturnType<typeof createSchemas>

export type Localized = z.infer<typeof localized>
export type Period = z.infer<typeof period>
export type Profile = z.infer<Schemas['profile']>
