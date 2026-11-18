import type {Plugin} from 'vite'
import {ENV_VARIABLES, parseSetting, SETTING_NAMES, SETTINGS} from '../src/settings.ts'

/**
 * Checks the build settings from `.env` (or the environment) when Vite starts, in `bun dev` as in the build:
 * a missing or unknown value fails with the allowed ones, instead of silently showing another layout.
 */
export function buildSettings(): Plugin {
    return {
        name: 'build-settings',

        configResolved(config) {
            for (const name of SETTING_NAMES) {
                const variable = ENV_VARIABLES[name]
                const value = config.env[variable] as string | undefined
                if (parseSetting(name, value) === undefined) {
                    const shown = value === undefined ? 'not set' : `unknown value "${value}"`
                    throw new Error(`Build setting ${variable}: ${shown}, expected one of: ${SETTINGS[name].join(', ')}`)
                }
            }
        },
    }
}
