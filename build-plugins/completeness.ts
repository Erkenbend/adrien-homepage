import {z} from 'zod'

/** The part of JSON Schema produced by `z.toJSONSchema` that matters here. */
interface JsonSchema {
    properties?: Record<string, JsonSchema>
    items?: JsonSchema
    anyOf?: JsonSchema[]
}

/**
 * Paths of fields defined in the schema but used nowhere in `data`. A field counts as used if at least one
 * entry of a list has it, so an example may show both a complete and a minimal entry.
 */
export function unusedFields(schema: z.ZodType, data: unknown): string[] {
    const jsonSchema = z.toJSONSchema(schema, {io: 'input', unrepresentable: 'any'}) as JsonSchema
    const unused: string[] = []
    collect(jsonSchema, [data], '', unused)
    return unused
}

function collect(schema: JsonSchema, values: unknown[], path: string, unused: string[]): void {
    if (schema.anyOf) {
        for (const option of schema.anyOf) {
            collect(option, values, path, unused)
        }
        return
    }
    if (schema.properties) {
        const objects = values.filter(isRecord)
        if (objects.length === 0) {
            return // a different anyOf option, e.g. a plain text instead of {de, en, fr}
        }
        for (const [key, property] of Object.entries(schema.properties)) {
            const present = objects.map(object => object[key]).filter(value => value !== undefined)
            const keyPath = path ? `${path}.${key}` : key
            if (present.length === 0) {
                unused.push(keyPath)
            } else {
                collect(property, present, keyPath, unused)
            }
        }
        return
    }
    if (schema.items) {
        const elements = values.filter(Array.isArray).flat() as unknown[]
        if (elements.length === 0) {
            unused.push(`${path}[]`)
        } else {
            collect(schema.items, elements, `${path}[]`, unused)
        }
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}
