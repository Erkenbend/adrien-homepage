import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LANGUAGE } from './i18n/language.ts'
import profile from './data/profile.yaml'
import { localize } from './data/format.ts'

document.documentElement.lang = LANGUAGE
document.title = profile.name
// index.html has it in the default language (build-plugins/page-meta.ts), for crawlers that run JavaScript.
document.querySelector('meta[name="description"]')?.setAttribute('content', localize(profile.about ?? profile.headline).trim())

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
