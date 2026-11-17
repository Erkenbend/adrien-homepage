import {existsSync, readdirSync, readFileSync} from 'node:fs'
import path from 'node:path'
import type {Plugin} from 'vite'
import {parse} from 'yaml'
import {z} from 'zod'
import {createSchemas, type SchemaContext} from '../src/data/schema.ts'
import {ALL_TECHNOLOGIES} from '../src/data/technologies.ts'
import {GENERIC_LINK_ICON, SITES} from '../src/sites.ts'
import {unusedFields} from './completeness.ts'

type Schemas = ReturnType<typeof createSchemas>

/**
 * Turns `src/data/<name>.yaml` into a JS module after validating it against the schema `<name>`
 * from src/data/schema.ts. Invalid data fails the build (and shows the error overlay in `bun dev`).
 *
 * At build start it checks the site icons of src/sites.ts, the logos of src/data/technologies.ts, every data file, also those no code imports yet, and the reference examples
 * `src/data/examples/<name>.yaml`: they must be valid and use every field of the schema at least once,
 * so they cannot fall behind the schema.
 */
export function yamlData(): Plugin {
    let root = process.cwd()

    return {
        name: 'yaml-data',

        configResolved(config) {
            root = config.root
        },

        buildStart() {
            const {imageExists} = imagesInPublic(root)
            for (const icon of [GENERIC_LINK_ICON, ...SITES.map(site => site.icon)]) {
                if (!imageExists(icon)) {
                    throw new Error(`src/sites.ts: icon not found: public${icon}`)
                }
            }
            for (const {name, logo} of ALL_TECHNOLOGIES) {
                if (logo !== undefined && !imageExists(logo)) {
                    throw new Error(`src/data/technologies.ts: logo of ${name} not found: public${logo}`)
                }
            }

            const dataDir = path.join(root, 'src', 'data')
            const dataSchemas = createSchemas(imagesInPublic(root))
            for (const file of yamlFiles(dataDir)) {
                const relativeFile = path.relative(root, file)
                validate(schemaFor(dataSchemas, file, relativeFile), readYaml(file, relativeFile), relativeFile)
            }

            const examplesDir = path.join(dataDir, 'examples')
            // Example images need not exist, the example only documents the format.
            const schemas = createSchemas({imageExists: () => true})
            for (const file of yamlFiles(examplesDir)) {
                const relativeFile = path.relative(root, file)
                const schema = schemaFor(schemas, file, relativeFile)
                const raw = readYaml(file, relativeFile)
                validate(schema, raw, relativeFile)
                const unused = unusedFields(schema, raw)
                if (unused.length > 0) {
                    throw new Error(`${relativeFile} must use every field of the schema, missing: ${unused.join(', ')}`)
                }
            }
        },

        load(id) {
            const file = id.split('?')[0] ?? id
            if (!file.endsWith('.yaml') || path.dirname(file) !== path.join(root, 'src', 'data')) {
                return null
            }
            this.addWatchFile(file)

            const relativeFile = path.relative(root, file)
            const schemas = createSchemas(imagesInPublic(root))
            const data = validate(schemaFor(schemas, file, relativeFile), readYaml(file, relativeFile), relativeFile)
            return `export default ${JSON.stringify(data)}`
        },
    }
}

function yamlFiles(dir: string): string[] {
    return readdirSync(dir).filter(name => name.endsWith('.yaml')).map(name => path.join(dir, name))
}

function imagesInPublic(root: string): SchemaContext {
    return {imageExists: urlPath => existsSync(path.join(root, 'public', urlPath))}
}

function schemaFor(schemas: Schemas, file: string, relativeFile: string): Schemas[keyof Schemas] {
    const name = path.basename(file, '.yaml')
    if (!Object.hasOwn(schemas, name)) {
        throw new Error(`${relativeFile}: no schema "${name}" in src/data/schema.ts`)
    }
    return schemas[name as keyof Schemas]
}

function readYaml(file: string, relativeFile: string): unknown {
    try {
        return parse(readFileSync(file, 'utf8'))
    } catch (error) {
        throw new Error(`${relativeFile}: ${String(error)}`)
    }
}

function validate(schema: z.ZodType, raw: unknown, relativeFile: string): unknown {
    const result = schema.safeParse(raw)
    if (!result.success) {
        throw new Error(`${relativeFile} is invalid:\n${z.prettifyError(result.error)}`)
    }
    return result.data
}
