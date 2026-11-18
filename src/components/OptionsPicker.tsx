import {MESSAGES} from '../i18n/language.ts'
import {setOption, useOption} from '../options.ts'
import {SETTING_NAMES, SETTINGS, type SettingName} from '../settings.ts'

/** Only in `bun dev`: a bar on the left to compare the display settings, see src/options.ts. */
export function OptionsPicker() {
    return (
        <div className="options-picker">
            {SETTING_NAMES.map(name => <OptionGroup key={name} name={name}/>)}
        </div>
    )
}

function OptionGroup({name}: {name: SettingName}) {
    const current = useOption(name)
    const {title, values} = MESSAGES.options[name]
    const labels: Record<string, string> = values
    return (
        <nav className="options-group" aria-label={title}>
            <span className="options-group-title">{title}</span>
            {SETTINGS[name].map((value, index) => (
                <button key={value} type="button" title={labels[value]}
                        aria-pressed={value === current} onClick={() => { setOption(name, value) }}>
                    <span className="options-number">{index + 1}</span>
                    <span className="options-name">{labels[value]}</span>
                </button>
            ))}
        </nav>
    )
}
