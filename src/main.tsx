import {StrictMode} from 'react'
import {createRoot, hydrateRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {LANGUAGE} from './i18n/language.ts'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = document.getElementById('root')!
const app = <StrictMode><App/></StrictMode>

// The build prerenders the page per language (src/entry-server.tsx), `bun dev` does not. A host may serve
// the page of another language for a path, e.g. `/index.html` for `/en` without slash: rendered anew then.
if (root.hasChildNodes() && document.documentElement.lang === LANGUAGE) {
    hydrateRoot(root, app)
} else {
    root.replaceChildren()
    document.documentElement.lang = LANGUAGE
    createRoot(root).render(app)
}
