import {useEffect, useRef, type MouseEvent, type ReactNode} from 'react'
import {formatPeriod, kindClass, localize} from '../data/format.ts'
import type {Project} from '../data/schema.ts'
import {FRAMEWORKS, PROGRAMMING_LANGUAGES, TOOLS, type Technology} from '../data/technologies.ts'
import {MESSAGES} from '../i18n/language.ts'
import {SiteLink} from './SiteLink.tsx'

interface ProjectDialogProps {
    /** The project to show; none keeps the dialog closed. */
    project: Project | undefined
    onClose: () => void
}

/** Modal with every field the project has; closes with Esc, the close button or a click beside it. */
export function ProjectDialog({project, onClose}: ProjectDialogProps) {
    const dialog = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const element = dialog.current
        if (project && !element?.open) {
            element?.showModal()
        } else if (!project && element?.open) {
            element.close()
        }
    }, [project])

    // The dialog box has no padding, so a click on the dialog element itself is a click on the backdrop.
    function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    return (
        <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title"
                onClose={onClose} onClick={closeOnBackdrop}>
            {project && <Details project={project} onClose={onClose}/>}
        </dialog>
    )
}

function Details({project, onClose}: {project: Project, onClose: () => void}) {
    return (
        <div className="project-dialog-content">
            <header className="project-dialog-header">
                <img className={`project-dialog-icon ${kindClass(project)}`} src={project.icon} alt="" width={56} height={56}/>
                <h3 id="project-dialog-title">{localize(project.name)}</h3>
                <button type="button" className="project-dialog-close" aria-label={MESSAGES.close} onClick={onClose}>
                    ×
                </button>
            </header>

            <p>{localize(project.description)}</p>

            <dl className="project-facts">
                <Fact label={MESSAGES.complexity}>{MESSAGES.complexityLevels[project.complexity]}</Fact>
                <Fact label={MESSAGES.aiUsage}>{MESSAGES.aiUsageLevels[project.aiUsage]}</Fact>
                {project.period && <Fact label={MESSAGES.period}>{formatPeriod(project.period)}</Fact>}
                {project.kind && <Fact label={MESSAGES.kind}>{MESSAGES.projectKinds[project.kind]}</Fact>}
                {(project.team ?? project.teamDetails) && (
                    <Fact label={MESSAGES.team}>
                        {project.team && MESSAGES.teamSizes[project.team]}
                        {project.team && project.teamDetails && ' · '}
                        {project.teamDetails && localize(project.teamDetails)}
                    </Fact>
                )}
                <TechFact label={MESSAGES.programmingLanguages} registry={PROGRAMMING_LANGUAGES} ids={project.languages}/>
                <TechFact label={MESSAGES.frameworks} registry={FRAMEWORKS} ids={project.frameworks}/>
                <TechFact label={MESSAGES.tools} registry={TOOLS} ids={project.tools}/>
            </dl>

            {(project.githubUrl ?? project.websiteUrl) && (
                <p className="project-links">
                    {project.websiteUrl && <SiteLink url={project.websiteUrl} fallbackLabel={MESSAGES.website}/>}
                    {project.githubUrl && <SiteLink url={project.githubUrl}/>}
                </p>
            )}
        </div>
    )
}

function Fact({label, children}: {label: string, children: ReactNode}) {
    return (
        <>
            <dt>{label}</dt>
            <dd>{children}</dd>
        </>
    )
}

interface TechFactProps<Id extends string> {
    label: string
    registry: Record<Id, Technology>
    ids: Id[]
}

/** Technologies with their logo before the name; the logo is decorative, the name follows. */
function TechFact<Id extends string>({label, registry, ids}: TechFactProps<Id>) {
    return ids.length > 0 && (
        <Fact label={label}>
            <ul className="tech-list">
                {ids.map(id => {
                    const {name, logo} = registry[id]
                    return (
                        <li key={id}>
                            {logo && <img className="tech-logo" src={logo} alt=""/>}
                            {name}
                        </li>
                    )
                })}
            </ul>
        </Fact>
    )
}
