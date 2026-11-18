import {LanguageSwitcher} from './components/LanguageSwitcher.tsx'
import {OptionsPicker} from './components/OptionsPicker.tsx'
import {ShadowProvider} from './components/Profile.tsx'
import {useOption} from './options.ts'
import {PageContent} from './layouts/Layouts.tsx'

function App() {
    const layout = useOption('layout')
    return (
        <ShadowProvider>
            <div className={`page layout-${layout}`}>
                <header>
                    <LanguageSwitcher/>
                </header>
                <main>
                    <PageContent layout={layout}/>
                </main>
            </div>
            <OptionsPicker/>
        </ShadowProvider>
    )
}

export default App
