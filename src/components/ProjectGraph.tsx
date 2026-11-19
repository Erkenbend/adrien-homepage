import type {CSSProperties} from 'react'
import projects from '../data/projects.yaml'
import {kindClass, localize} from '../data/format.ts'
import {AI_USAGE_LEVELS, COMPLEXITY_LEVELS, PROJECT_KINDS, type AiUsage, type Complexity} from '../data/scales.ts'
import type {Project} from '../data/schema.ts'
import {closeHash, openHash, useHash} from '../hash.ts'
import {LANGUAGE, MESSAGES} from '../i18n/language.ts'
import {useOption} from '../options.ts'
import {ProjectDialog} from './ProjectDialog.tsx'

/** One column per complexity level. */
const COLUMNS = {gridTemplateColumns: `repeat(${String(COMPLEXITY_LEVELS.length)}, minmax(0, 1fr))`}

/** Most AI at the top. */
const BANDS = [...AI_USAGE_LEVELS].reverse()

/**
 * Projects on two axes with named levels: one column per complexity level, one row per AI usage level.
 * Projects sharing a cell sit side by side, sorted by name, so they never overlap and the layout does not
 * change between builds. The look is a display option (src/options.ts): `classic` as alternating bands with
 * their names inside, the others as a plot with arrows for axes.
 */
export function ProjectGraph({className}: {className?: string}) {
    const hash = useHash()
    const style = useOption('graph')
    if (projects.length === 0) {
        return null
    }
    const selected = projects.find(project => project.id === hash)

    return (
        <section id="projects" className={className}>
            <h2>{MESSAGES.projects}</h2>
            <p>{MESSAGES.projectsIntro}</p>
            {style === 'classic' ? <BandsGraph/> : <AxesGraph className={`axes-graph axes-${style}`}/>}
            <ul className="graph-legend" aria-label={MESSAGES.kind}>
                {PROJECT_KINDS.map(kind => (
                    <li key={kind} className={`kind-${kind}`}>
                        <span className="graph-legend-swatch"/>
                        {MESSAGES.projectKinds[kind]}
                    </li>
                ))}
            </ul>
            <ProjectDialog project={selected} onClose={() => {
                // Also called when the dialog closes because the hash went away, e.g. with the back button.
                if (selected) {
                    closeHash()
                }
            }}/>
        </section>
    )
}

/** Alternating bands with the AI usage level written inside, complexity levels below. */
function BandsGraph() {
    return (
        <div className="graph">
            <div className="graph-axis-title">↑ {MESSAGES.aiUsage}</div>
            <div className="graph-plot">
                {BANDS.map(aiUsage => (
                    <div key={aiUsage} className="graph-band" style={COLUMNS}>
                        <div className="graph-band-label">{MESSAGES.aiUsageLevels[aiUsage]}</div>
                        {COMPLEXITY_LEVELS.map((complexity, column) => (
                            <Cell key={complexity} complexity={complexity} aiUsage={aiUsage}
                                  tooltipAlign={tooltipAlign(column)}/>
                        ))}
                    </div>
                ))}
            </div>
            <div className="graph-x-labels" style={COLUMNS}>
                {COMPLEXITY_LEVELS.map(complexity => (
                    <div key={complexity}>{MESSAGES.complexityLevels[complexity]}</div>
                ))}
            </div>
            <div className="graph-axis-title graph-x-title">{MESSAGES.complexity} →</div>
        </div>
    )
}

/*
 * One grid for the whole plot:
 *
 *   columns: y labels | y axis | one per complexity level | room for the x arrowhead
 *   rows:    y arrowhead and title | one per AI usage level | x axis | x labels | x title
 */
const FIRST_CELL_COLUMN = 3
const FIRST_CELL_ROW = 2
const X_AXIS_ROW = FIRST_CELL_ROW + BANDS.length

const AXES_GRID: CSSProperties = {
    gridTemplateColumns:
        `fit-content(8rem) var(--axis-room) repeat(${String(COMPLEXITY_LEVELS.length)}, minmax(0, 1fr)) var(--axis-room)`,
    gridTemplateRows: `auto repeat(${String(BANDS.length)}, auto) var(--axis-room) auto auto`,
}

function at(row: number, column: number | string): CSSProperties {
    return {gridRow: row, gridColumn: column}
}

/** Arrows for axes, level names outside the plot next to tick marks, axis titles at the arrowheads. */
function AxesGraph({className}: {className: string}) {
    return (
        <div className={className} style={AXES_GRID}>
            <div className="axes-y-arrow" style={{gridRow: `1 / ${String(X_AXIS_ROW + 1)}`, gridColumn: 2}}/>
            <div className="axes-x-arrow" style={at(X_AXIS_ROW, '2 / -1')}/>
            <div className="axes-y-title" style={at(1, `${String(FIRST_CELL_COLUMN)} / -1`)}>{MESSAGES.aiUsage}</div>
            {BANDS.map((aiUsage, row) => (
                <div key={aiUsage} className="axes-y-label" style={at(FIRST_CELL_ROW + row, 1)}>
                    <span>{MESSAGES.aiUsageLevels[aiUsage]}</span>
                </div>
            ))}
            {BANDS.map((aiUsage, row) => COMPLEXITY_LEVELS.map((complexity, column) => (
                <Cell key={`${aiUsage}-${complexity}`} complexity={complexity} aiUsage={aiUsage}
                      tooltipAlign={tooltipAlign(column)}
                      style={at(FIRST_CELL_ROW + row, FIRST_CELL_COLUMN + column)}/>
            )))}
            {COMPLEXITY_LEVELS.map((complexity, column) => (
                <div key={complexity} className="axes-x-label" style={at(X_AXIS_ROW + 1, FIRST_CELL_COLUMN + column)}>
                    {MESSAGES.complexityLevels[complexity]}
                </div>
            ))}
            <div className="axes-x-title" style={at(X_AXIS_ROW + 2, `${String(FIRST_CELL_COLUMN)} / -1`)}>
                {MESSAGES.complexity}
            </div>
        </div>
    )
}

interface CellProps {
    complexity: Complexity
    aiUsage: AiUsage
    tooltipAlign: TooltipAlign
    style?: CSSProperties
}

type TooltipAlign = 'start' | 'center' | 'end'

/** Tooltips grow towards the middle of the graph, so they do not stick out of the page. */
function tooltipAlign(column: number): TooltipAlign {
    const middle = (COMPLEXITY_LEVELS.length - 1) / 2
    return column < middle ? 'start' : column > middle ? 'end' : 'center'
}

function Cell({complexity, aiUsage, tooltipAlign, style}: CellProps) {
    const inCell = projects
        .filter(project => project.complexity === complexity && project.aiUsage === aiUsage)
        .sort(byName)
    if (inCell.length === 0) {
        return <div className="graph-cell" style={style}/>
    }
    return (
        <ul className="graph-cell" style={style}
            aria-label={`${MESSAGES.complexityLevels[complexity]} · ${MESSAGES.aiUsageLevels[aiUsage]}`}>
            {inCell.map(project => (
                <li key={project.id}>
                    <button type="button" className={`project-icon tooltip-${tooltipAlign} ${kindClass(project)}`}
                            aria-label={iconLabel(project)} aria-haspopup="dialog"
                            onClick={() => { openHash(project.id) }}>
                        <img src={project.icon} alt="" width={44} height={44}/>
                        <span className="tooltip" aria-hidden="true">{localize(project.name)}</span>
                    </button>
                </li>
            ))}
        </ul>
    )
}

function byName(a: Project, b: Project): number {
    return new Intl.Collator(LANGUAGE).compare(localize(a.name), localize(b.name)) || a.id.localeCompare(b.id)
}

/** The kind is shown as a coloured ring around the icon, so it is part of the label too. */
function iconLabel(project: Project): string {
    const name = localize(project.name)
    return project.kind ? `${name} · ${MESSAGES.projectKinds[project.kind]}` : name
}
