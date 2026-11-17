import {describeLink} from '../sites.ts'

interface SiteLinkProps {
    url: string
    /** Label for sites that are not recognized; without it the host name is shown. */
    fallbackLabel?: string
}

/** Link with the icon and name of the site it points to, see src/sites.ts. */
export function SiteLink({url, fallbackLabel}: SiteLinkProps) {
    const {label, icon} = describeLink(url, fallbackLabel)
    return (
        <a className="site-link" href={url}>
            <img className="site-icon" src={icon} alt=""/>
            {label}
        </a>
    )
}
