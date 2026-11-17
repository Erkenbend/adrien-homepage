import projects from '../data/projects.yaml'
import {localize} from '../data/format.ts'
import {AI_USAGE_LEVELS, COMPLEXITY_LEVELS, type AiUsage, type Complexity} from '../data/scales.ts'
import type {Project} from '../data/schema.ts'
import {LANGUAGE, MESSAGES} from '../i18n/language.ts'

/** One column per complexity level. */
const COLUMNS = {gridTemplateColumns: `repeat(${String(COMPLEXITY_LEVELS.length)}, minmax(0, 1fr))`}

/**
 * Projects on two axes with named levels: one column per complexity level, one band per
 * AI usage level (most AI at the top). Projects sharing a cell sit side by side, sorted by name, so
 * they never overlap and the layout does not change between builds.
 */
export function ProjectGraph() {
    if (projects.length === 0) {
        return null
    }
    const bands = [...AI_USAGE_LEVELS].reverse()

    return (
        <section id="projects">
            <h2>{MESSAGES.projects}</h2>
            <p>{MESSAGES.projectsIntro}</p>
            <div className="graph">
                <div className="graph-axis-title">↑ {MESSAGES.aiUsage}</div>
                <div className="graph-plot">
                    {bands.map(aiUsage => (
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
        </section>
    )
}

interface CellProps {
    complexity: Complexity
    aiUsage: AiUsage
    tooltipAlign: TooltipAlign
}

type TooltipAlign = 'start' | 'center' | 'end'

/** Tooltips grow towards the middle of the graph, so they do not stick out of the page. */
function tooltipAlign(column: number): TooltipAlign {
    const middle = (COMPLEXITY_LEVELS.length - 1) / 2
    return column < middle ? 'start' : column > middle ? 'end' : 'center'
}

function Cell({complexity, aiUsage, tooltipAlign}: CellProps) {
    const inCell = projects
        .filter(project => project.complexity === complexity && project.aiUsage === aiUsage)
        .sort(byName)
    if (inCell.length === 0) {
        return <div className="graph-cell"/>
    }
    return (
        <ul className="graph-cell"
            aria-label={`${MESSAGES.complexityLevels[complexity]} · ${MESSAGES.aiUsageLevels[aiUsage]}`}>
            {inCell.map(project => (
                <li key={project.id}>
                    <button type="button" className={`project-icon tooltip-${tooltipAlign}`}
                            aria-label={localize(project.name)}>
                        <img src={project.icon} alt="" width={44} height={44}/>
                        <span className="tooltip" aria-hidden="true">{localize(project.name)}</span>
                    </button>
                </li>
            ))}
        </ul>
    )
}

const collator = new Intl.Collator(LANGUAGE)

function byName(a: Project, b: Project): number {
    return collator.compare(localize(a.name), localize(b.name)) || a.id.localeCompare(b.id)
}
