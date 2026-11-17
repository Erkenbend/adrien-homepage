import profile from '../data/profile.yaml'
import {formatPeriod, localize} from '../data/format.ts'
import {MESSAGES} from '../i18n/language.ts'

export function Profile() {
    return (
        <>
            <section className="profile-intro">
                {profile.photo && <img className="profile-photo" src={profile.photo} alt={profile.name}/>}
                <div>
                    <h1>{profile.name}</h1>
                    <p className="headline">{localize(profile.headline)}</p>
                    {profile.location && <p className="muted">{localize(profile.location)}</p>}
                    <p className="profile-links">
                        <a href={profile.links.linkedin}>LinkedIn</a>
                        {profile.links.github && <a href={profile.links.github}>GitHub</a>}
                    </p>
                </div>
            </section>

            {profile.about && <p>{localize(profile.about)}</p>}

            {profile.experience.length > 0 && (
                <section>
                    <h2>{MESSAGES.experience}</h2>
                    <ul className="timeline">
                        {profile.experience.map(entry => (
                            <li key={`${entry.organization}-${entry.period.from}`}>
                                <strong>{localize(entry.role)}</strong> · {entry.organization}
                                <div className="muted">
                                    {formatPeriod(entry.period)}
                                    {entry.location && <> · {localize(entry.location)}</>}
                                </div>
                                {entry.description && <p>{localize(entry.description)}</p>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {profile.education.length > 0 && (
                <section>
                    <h2>{MESSAGES.education}</h2>
                    <ul className="timeline">
                        {profile.education.map(entry => (
                            <li key={`${entry.institution}-${entry.period.from}`}>
                                <strong>{localize(entry.degree)}</strong> · {entry.institution}
                                <div className="muted">{formatPeriod(entry.period)}</div>
                            </li>
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
                                {localize(entry.name)} <span className="muted">· {localize(entry.level)}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    )
}
