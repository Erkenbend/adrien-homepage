import profile from '../data/profile.yaml'
import {MESSAGES} from '../i18n/language.ts'

export function Contact() {
    return (
        <section id="contact">
            <h2>{MESSAGES.contact}</h2>
            <p>
                {MESSAGES.contactIntro} <a href={profile.links.linkedin}>LinkedIn</a>.
            </p>
        </section>
    )
}
