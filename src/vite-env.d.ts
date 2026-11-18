/// <reference types="vite/client" />

/** Build settings from `.env`, see src/settings.ts. */
interface ImportMetaEnv {
    readonly VITE_LAYOUT: string
    readonly VITE_GRAPH: string
    /** Address of the deployed page, see build-plugins/page-meta.ts. */
    readonly VITE_SITE_URL: string
}

/** Build time as ISO string, set in vite.config.ts. */
declare const BUILD_TIMESTAMP: string
