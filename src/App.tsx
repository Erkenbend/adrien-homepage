import {Contact} from './components/Contact.tsx'
import {LanguageSwitcher} from './components/LanguageSwitcher.tsx'
import {Profile} from './components/Profile.tsx'
import {ProjectGraph} from './components/ProjectGraph.tsx'

function App() {
    return (
        <>
            <header>
                <LanguageSwitcher/>
            </header>
            <main>
                <Profile/>
                <ProjectGraph/>
                <Contact/>
            </main>
        </>
    )
}

export default App
