import {existsSync, readFileSync} from 'node:fs'
import path from 'node:path'
import type {Plugin} from 'vite'
import {parse} from 'yaml'
import {z} from 'zod'
import {createSchemas} from '../src/data/schema.ts'

/**
 * Turns `src/data/<name>.yaml` into a JS module after validating it against the schema `<name>`
 * from src/data/schema.ts. Invalid data fails the build (and shows the error overlay in `bun dev`).
 */
export function yamlData(): Plugin {
    let root = process.cwd()

    return {
        name: 'yaml-data',

        configResolved(config) {
            root = config.root
        },

        load(id) {
            const file = id.split('?')[0] ?? id
            const dataDir = path.join(root, 'src', 'data')
            if (!file.endsWith('.yaml') || path.dirname(file) !== dataDir) {
                return null
            }
            this.addWatchFile(file)

            const relativeFile = path.relative(root, file)
            const name = path.basename(file, '.yaml')
            const schemas = createSchemas({
                imageExists: urlPath => existsSync(path.join(root, 'public', urlPath)),
            })
            if (!Object.hasOwn(schemas, name)) {
                this.error(`${relativeFile}: no schema "${name}" in src/data/schema.ts`)
            }
            const schema = schemas[name as keyof typeof schemas]

            let raw: unknown
            try {
                raw = parse(readFileSync(file, 'utf8'))
            } catch (error) {
                this.error(`${relativeFile}: ${String(error)}`)
            }

            const result = schema.safeParse(raw)
            if (!result.success) {
                this.error(`${relativeFile} is invalid:\n${z.prettifyError(result.error)}`)
            }
            return `export default ${JSON.stringify(result.data)}`
        },
    }
}
