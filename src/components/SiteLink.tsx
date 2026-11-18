import {describeLink} from '../sites.ts'

interface SiteLinkProps {
    url: string
    /** Label for sites that are not recognized; without it the host name is shown. */
    fallbackLabel?: string
    /** Replaces the label in any case, the icon stays. */
    label?: string
}

/** Link with the icon and name of the site it points to, see src/sites.ts. */
export function SiteLink({url, fallbackLabel, label: fixedLabel}: SiteLinkProps) {
    const {label, icon, darkOnly} = describeLink(url, fallbackLabel)
    return (
        <a className="site-link" href={url}>
            <img className={darkOnly ? 'site-icon dark-only-icon' : 'site-icon'} src={icon} alt=""/>
            {fixedLabel ?? label}
        </a>
    )
}
