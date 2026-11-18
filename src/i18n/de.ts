import type {GraphStyle, Layout} from '../options.ts'
import type {AiUsage, Complexity, ProjectKind, TeamSize} from '../data/scales.ts'

// Reference dictionary: its shape defines `Messages`, the other languages must match it.
export const de = {
    languageSwitcherLabel: 'Sprache wählen',
    experience: 'Werdegang',
    education: 'Ausbildung',
    certificates: 'Zertifikate',
    validUntil: 'gültig bis',
    languages: 'Sprachen',
    contact: 'Kontakt',
    contactIntro: 'Am einfachsten erreichbar per Nachricht über',
    present: 'heute',
    projects: 'Projekte',
    projectsIntro: 'Meine Projekte, eingeordnet nach Komplexität und nach KI-Einsatz beim Entwickeln.',
    close: 'Schließen',
    period: 'Zeitraum',
    kind: 'Art',
    team: 'Team',
    programmingLanguages: 'Programmiersprachen',
    frameworks: 'Frameworks',
    tools: 'Werkzeuge',
    website: 'Webseite',
    complexity: 'Komplexität',
    complexityLevels: {
        script: 'Skript',
        demo: 'Demo',
        app: 'Kleine Anwendung',
        multiPart: 'Mehrteilige Anwendung',
        system: 'Großes System',
    } satisfies Record<Complexity, string>,
    aiUsage: 'KI-Einsatz',
    aiUsageLevels: {
        none: 'Keine KI',
        light: 'Wenig KI-Unterstützung',
        heavy: 'Starker KI-Einsatz',
        vibe: 'Vibe-coded',
    } satisfies Record<AiUsage, string>,
    projectKinds: {
        professional: 'Beruflich',
        training: 'Weiterbildung',
        hobby: 'Hobby',
    } satisfies Record<ProjectKind, string>,
    teamSizes: {
        solo: 'Allein',
        group: 'Im Team',
    } satisfies Record<TeamSize, string>,
    options: {
        layout: {
            title: 'Layout',
            values: {
                classic: 'Klassisch',
                showcase: 'Projekte im Mittelpunkt',
                sidebar: 'Seitenleiste',
                split: 'Geteilter Bildschirm',
                bento: 'Kacheln',
            } satisfies Record<Layout, string>,
        },
        graph: {
            title: 'Graph',
            values: {
                classic: 'Klassisch',
                matrix: 'Matrix',
                lines: 'Gitterlinien',
                open: 'Offen',
            } satisfies Record<GraphStyle, string>,
        },
    },
}

export type Messages = typeof de
