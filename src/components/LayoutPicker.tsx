import {MESSAGES} from '../i18n/language.ts'
import {LAYOUTS, setLayout, type Layout} from '../layout.ts'

/** Proof of concept: floating selection of the page layout, see src/layout.ts. */
export function LayoutPicker({layout}: {layout: Layout}) {
    return (
        <nav className="layout-picker" aria-label={MESSAGES.layout}>
            <span className="layout-picker-title">{MESSAGES.layout}</span>
            {LAYOUTS.map((option, index) => (
                <button key={option} type="button" title={MESSAGES.layoutNames[option]}
                        aria-pressed={option === layout} onClick={() => { setLayout(option) }}>
                    <span className="layout-picker-number">{index + 1}</span>
                    <span className="layout-picker-name">{MESSAGES.layoutNames[option]}</span>
                </button>
            ))}
        </nav>
    )
}
