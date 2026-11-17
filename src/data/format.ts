import {LANGUAGE, MESSAGES} from '../i18n/language.ts'
import type {Localized, Period} from './schema.ts'

export function localize(value: Localized): string {
    return typeof value === 'string' ? value : value[LANGUAGE]
}

const monthFormat = new Intl.DateTimeFormat(LANGUAGE, {month: 'short', year: 'numeric', timeZone: 'UTC'})

/** `YYYY` stays as is, `YYYY-MM` becomes e.g. "März 2021". */
export function formatYearMonth(value: string): string {
    const match = /^(\d{4})-(\d{2})$/.exec(value)
    if (match === null) {
        return value
    }
    return monthFormat.format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1)))
}

export function formatPeriod({from, to}: Period): string {
    return `${formatYearMonth(from)} – ${to === undefined ? MESSAGES.present : formatYearMonth(to)}`
}
