import {LanguageSwitcher} from './components/LanguageSwitcher.tsx'
import {Profile} from './components/Profile.tsx'

function App() {
    return (
        <>
            <header>
                <LanguageSwitcher/>
            </header>
            <main>
                <Profile/>
            </main>
        </>
    )
}

export default App
