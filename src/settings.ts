// Build settings for the display of the page, set in `.env` (see README.md, "Build-Einstellungen").
// Without React or browser APIs, because the build checks the values too (build-plugins/settings.ts).

export const SETTINGS = {
    /** Arrangement of the page, see src/layouts/Layouts.tsx. */
    layout: ['classic', 'showcase', 'sidebar', 'split', 'bento'],
    /** Look of the project graph, see src/components/ProjectGraph.tsx. */
    graph: ['classic', 'matrix', 'lines', 'open'],
} as const

export type SettingName = keyof typeof SETTINGS
export type SettingValue<Name extends SettingName> = (typeof SETTINGS)[Name][number]
export type Layout = SettingValue<'layout'>
export type GraphStyle = SettingValue<'graph'>

export const SETTING_NAMES = Object.keys(SETTINGS) as SettingName[]

/** Environment variable of each setting; Vite only hands variables starting with `VITE_` to the page. */
export const ENV_VARIABLES = {
    layout: 'VITE_LAYOUT',
    graph: 'VITE_GRAPH',
} as const satisfies Record<SettingName, `VITE_${string}`>

/** The value if it is a known one for the setting, else undefined. */
export function parseSetting<Name extends SettingName>(name: Name, value: unknown): SettingValue<Name> | undefined {
    const values: readonly SettingValue<Name>[] = SETTINGS[name]
    return values.find(candidate => candidate === value)
}
