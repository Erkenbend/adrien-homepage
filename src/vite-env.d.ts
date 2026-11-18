/// <reference types="vite/client" />

/** Build settings from `.env`, see src/settings.ts. */
interface ImportMetaEnv {
    readonly VITE_LAYOUT: string
    readonly VITE_GRAPH: string
}
