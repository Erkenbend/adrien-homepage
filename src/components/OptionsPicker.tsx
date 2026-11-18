import {MESSAGES} from '../i18n/language.ts'
import {OPTIONS, setOption, useOption, type OptionName} from '../options.ts'

/** Proof of concept: floating selection of the display options, see src/options.ts. */
export function OptionsPicker() {
    return (
        <div className="options-picker">
            <OptionGroup name="layout"/>
            <OptionGroup name="graph"/>
        </div>
    )
}

function OptionGroup({name}: {name: OptionName}) {
    const current = useOption(name)
    const {title, values} = MESSAGES.options[name]
    const labels: Record<string, string> = values
    return (
        <nav className="options-group" aria-label={title}>
            <span className="options-group-title">{title}</span>
            {OPTIONS[name].map((value, index) => (
                <button key={value} type="button" title={labels[value]}
                        aria-pressed={value === current} onClick={() => { setOption(name, value) }}>
                    <span className="options-number">{index + 1}</span>
                    <span className="options-name">{labels[value]}</span>
                </button>
            ))}
        </nav>
    )
}
