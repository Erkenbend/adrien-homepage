import {type ReactNode, useState} from 'react'
import profile from '../data/profile.yaml'
import {formatPeriod, formatYearMonth, localize} from '../data/format.ts'
import {MESSAGES} from '../i18n/language.ts'
import {SiteLink} from './SiteLink.tsx'

export function Profile() {
    // Easter egg: hovering the photo swaps photo and introduction for their shadow versions.
    const [shadow, setShadow] = useState(false)
    const hasShadow = profile.shadowPhoto !== undefined || profile.shadowAbout !== undefined

    return (
        <>
            <section className="profile-intro">
                {profile.photo && (
                    <div onMouseEnter={hasShadow ? () => { setShadow(true) } : undefined}
                         onMouseLeave={hasShadow ? () => { setShadow(false) } : undefined}>
                        <Swap shadow={shadow}
                              normal={<img className="profile-photo" src={profile.photo} alt={profile.name}/>}
                              alternative={profile.shadowPhoto &&
                                  <img className="profile-photo" src={profile.shadowPhoto} alt={profile.name}/>}/>
                    </div>
                )}
                <div>
                    <h1>{profile.name}</h1>
                    <p className="headline">{localize(profile.headline)}</p>
                    {profile.location && <p className="muted">{localize(profile.location)}</p>}
                    {profile.links.length > 0 && (
                        <p className="profile-links">
                            {profile.links.map(url => <SiteLink key={url} url={url}/>)}
                        </p>
                    )}
                </div>
            </section>

            {profile.about && (
                <Swap className="profile-about" shadow={shadow}
                      normal={<p>{localize(profile.about)}</p>}
                      alternative={profile.shadowAbout && <p>{localize(profile.shadowAbout)}</p>}/>
            )}

            {profile.experience.length > 0 && (
                <section>
                    <h2>{MESSAGES.experience}</h2>
                    <ul className="timeline">
                        {profile.experience.map(entry => (
                            <TimelineItem key={`${entry.organization}-${entry.period.from}`}
                                          logo={entry.logo} withLogo={hasLogos(profile.experience)}>
                                <strong>{localize(entry.role)}</strong> · {entry.organization}
                                <div className="muted">
                                    {formatPeriod(entry.period)}
                                    {entry.location && <> · {localize(entry.location)}</>}
                                </div>
                                {entry.description && <p>{localize(entry.description)}</p>}
                            </TimelineItem>
                        ))}
                    </ul>
                </section>
            )}

            {profile.education.length > 0 && (
                <section>
                    <h2>{MESSAGES.education}</h2>
                    <ul className="timeline">
                        {profile.education.map(entry => (
                            <TimelineItem key={`${localize(entry.degree)}-${entry.period.from}`}
                                          logo={entry.logo} withLogo={hasLogos(profile.education)}>
                                <strong>{localize(entry.degree)}</strong>
                                {entry.institution && <> · {entry.institution}</>}
                                <div className="muted">{formatPeriod(entry.period)}</div>
                            </TimelineItem>
                        ))}
                    </ul>
                </section>
            )}

            {profile.certificates.length > 0 && (
                <section>
                    <h2>{MESSAGES.certificates}</h2>
                    <ul className="timeline">
                        {profile.certificates.map(entry => (
                            <TimelineItem key={`${localize(entry.name)}-${entry.issued}`}
                                          logo={entry.logo} withLogo={hasLogos(profile.certificates)}>
                                <strong>
                                    {entry.url ? <a href={entry.url}>{localize(entry.name)}</a> : localize(entry.name)}
                                </strong> · {entry.issuer}
                                <div className="muted">
                                    {formatYearMonth(entry.issued)}
                                    {entry.validUntil && <> · {MESSAGES.validUntil} {formatYearMonth(entry.validUntil)}</>}
                                </div>
                            </TimelineItem>
                        ))}
                    </ul>
                </section>
            )}

            {profile.languages.length > 0 && (
                <section>
                    <h2>{MESSAGES.languages}</h2>
                    <ul className="timeline">
                        {profile.languages.map(entry => (
                            <li key={localize(entry.name)}>
                                {/* The name follows, a screen reader need not read "flag: France" too. */}
                                {entry.flag && <span aria-hidden="true">{entry.flag} </span>}
                                {localize(entry.name)} <span className="muted">· {localize(entry.level)}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    )
}

interface SwapProps {
    className?: string
    shadow: boolean
    normal: ReactNode
    /** Without it, `normal` stays visible. */
    alternative: ReactNode
}

/**
 * Shows `alternative` instead of `normal` while `shadow` is set. Both stay rendered in the same grid cell, so
 * the swap neither shifts the layout nor waits for an image to load; the hidden one is invisible to screen
 * readers too.
 */
function Swap({className, shadow, normal, alternative}: SwapProps) {
    if (!alternative) {
        return <div className={className}>{normal}</div>
    }
    return (
        <div className={className ? `swap ${className}` : 'swap'}>
            <div className={shadow ? 'swap-hidden' : undefined}>{normal}</div>
            <div className={shadow ? undefined : 'swap-hidden'}>{alternative}</div>
        </div>
    )
}

function hasLogos(entries: {logo?: string}[]): boolean {
    return entries.some(entry => entry.logo !== undefined)
}

interface TimelineItemProps {
    logo: string | undefined
    /** Whether to leave room for a logo, so that all texts of a list stay aligned. */
    withLogo: boolean
    children: ReactNode
}

function TimelineItem({logo, withLogo, children}: TimelineItemProps) {
    if (!withLogo) {
        return <li>{children}</li>
    }
    return (
        <li className="with-logo">
            {/* Decorative: the name of the organization is right next to it. */}
            <span className={logo ? 'org-logo' : 'org-logo org-logo-empty'}>
                {logo && <img src={logo} alt=""/>}
            </span>
            <div>{children}</div>
        </li>
    )
}
