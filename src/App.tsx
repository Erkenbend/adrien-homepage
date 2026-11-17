import {Contact} from './components/Contact.tsx'
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
                <Contact/>
            </main>
        </>
    )
}

export default App
