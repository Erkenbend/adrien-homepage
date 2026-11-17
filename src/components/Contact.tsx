import profile from '../data/profile.yaml'
import {MESSAGES} from '../i18n/language.ts'
import {SiteLink} from './SiteLink.tsx'

export function Contact() {
    return (
        <section id="contact">
            <h2>{MESSAGES.contact}</h2>
            <p>
                {MESSAGES.contactIntro} <SiteLink url={profile.contact}/>.
            </p>
        </section>
    )
}
