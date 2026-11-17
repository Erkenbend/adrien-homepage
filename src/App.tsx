import {LanguageSwitcher} from './components/LanguageSwitcher.tsx'
import {MESSAGES} from './i18n/language.ts'

function App() {
    return (
        <>
            <header>
                <LanguageSwitcher/>
            </header>
            <main>
                <h1>Adrien Wehrung</h1>
                <p>{MESSAGES.underConstruction}</p>
            </main>
        </>
    )
}

export default App
