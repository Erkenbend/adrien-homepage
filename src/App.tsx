import {LanguageSwitcher} from './components/LanguageSwitcher.tsx'
import {LayoutPicker} from './components/LayoutPicker.tsx'
import {ShadowProvider} from './components/Profile.tsx'
import {useLayout} from './layout.ts'
import {PageContent} from './layouts/Layouts.tsx'

function App() {
    const layout = useLayout()
    return (
        <ShadowProvider>
            <div className={`page layout-${layout}`}>
                <header>
                    <LanguageSwitcher layout={layout}/>
                </header>
                <main>
                    <PageContent layout={layout}/>
                </main>
            </div>
            <LayoutPicker layout={layout}/>
        </ShadowProvider>
    )
}

export default App
