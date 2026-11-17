import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LANGUAGE, MESSAGES } from './i18n/language.ts'

document.documentElement.lang = LANGUAGE
document.title = MESSAGES.pageTitle

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
