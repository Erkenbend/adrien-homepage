import {StrictMode} from 'react'
import {renderToString} from 'react-dom/server'
import App from './App.tsx'
import {setLanguage, type Language} from './i18n/language.ts'

/**
 * The page as HTML, for prerendering at build time (build-plugins/prerender.ts). Renders what `src/main.tsx`
 * renders, so that the browser can hydrate it.
 */
export function render(language: Language): string {
    setLanguage(language)
    return renderToString(<StrictMode><App/></StrictMode>)
}
