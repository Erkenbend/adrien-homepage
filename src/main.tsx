import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LANGUAGE } from './i18n/language.ts'
import profile from './data/profile.yaml'

document.documentElement.lang = LANGUAGE
document.title = profile.name

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
