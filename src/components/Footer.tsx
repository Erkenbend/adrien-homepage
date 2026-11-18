import {LANGUAGE, MESSAGES} from '../i18n/language.ts'
import {describeLink} from '../sites.ts'

const REPOSITORY_URL = 'https://github.com/Erkenbend/adrien-homepage'

const buildTime = new Intl.DateTimeFormat(LANGUAGE, {dateStyle: 'medium', timeStyle: 'short'})
    .format(new Date(BUILD_TIMESTAMP))

/** Build time as version and a link to the source code. */
export function Footer() {
    return (
        <footer>
            <span>{MESSAGES.version}: <time dateTime={BUILD_TIMESTAMP}>{buildTime}</time></span>
            <a className="site-link" href={REPOSITORY_URL}>
                <img className="site-icon" src={describeLink(REPOSITORY_URL).icon} alt=""/>
                {MESSAGES.sourceCode}
            </a>
        </footer>
    )
}
