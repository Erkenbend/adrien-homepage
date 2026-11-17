import {existsSync, readdirSync, readFileSync} from 'node:fs'
import path from 'node:path'
import type {Plugin} from 'vite'
import {parse} from 'yaml'
import {z} from 'zod'
import {createSchemas, type SchemaContext} from '../src/data/schema.ts'
import {unusedFields} from './completeness.ts'

type Schemas = ReturnType<typeof createSchemas>

/**
 * Turns `src/data/<name>.yaml` into a JS module after validating it against the schema `<name>`
 * from src/data/schema.ts. Invalid data fails the build (and shows the error overlay in `bun dev`).
 *
 * At build start it also checks the reference examples `src/data/examples/<name>.yaml`: they must be
 * valid and use every field of the schema at least once, so they cannot fall behind the schema.
 */
export function yamlData(): Plugin {
    let root = process.cwd()

    return {
        name: 'yaml-data',

        configResolved(config) {
            root = config.root
        },

        buildStart() {
            const examplesDir = path.join(root, 'src', 'data', 'examples')
            // Example images need not exist, the example only documents the format.
            const schemas = createSchemas({imageExists: () => true})
            for (const fileName of readdirSync(examplesDir).filter(name => name.endsWith('.yaml'))) {
                const file = path.join(examplesDir, fileName)
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
