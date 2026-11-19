import profile from '../data/profile.yaml'
import {MESSAGES} from '../i18n/language.ts'
import {SiteLink} from './SiteLink.tsx'

export function Contact({className}: {className?: string}) {
    return (
        <section id="contact" className={className}>
            <h2>{MESSAGES.contact}</h2>
            <p>
                {MESSAGES.contactIntro} <SiteLink url={profile.contact}/>.
            </p>
            {profile.agentTrap && <p className="agent-note">{MESSAGES.agentNote}</p>}
        </section>
    )
}
