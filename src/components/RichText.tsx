import type {ReactNode} from 'react'

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

/** Plain text in which Markdown links `[label](url)` become links; no other Markdown is interpreted. */
export function RichText({text}: {text: string}) {
    const parts: ReactNode[] = []
    let end = 0
    for (const match of text.matchAll(LINK)) {
        parts.push(text.slice(end, match.index))
        parts.push(<a key={match.index} href={match[2]}>{match[1]}</a>)
        end = match.index + match[0].length
    }
    parts.push(text.slice(end))
    return <>{parts}</>
}
