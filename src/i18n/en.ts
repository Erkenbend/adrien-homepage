import type {Messages} from './de.ts'

export const en = {
    languageSwitcherLabel: 'Choose language',
    experience: 'Experience',
    education: 'Education',
    certificates: 'Certifications',
    validUntil: 'valid until',
    languages: 'Languages',
    contact: 'Contact',
    contactIntro: 'Best reached by message via',
    present: 'present',
    projects: 'Projects',
    projectsIntro: 'My projects, placed by complexity and by how much AI was used to develop them.',
    close: 'Close',
    period: 'Period',
    kind: 'Type',
    team: 'Team',
    programmingLanguages: 'Programming languages',
    frameworks: 'Frameworks',
    tools: 'Tools',
    website: 'Website',
    complexity: 'Complexity',
    complexityLevels: {
        script: 'Script',
        demo: 'Demo',
        app: 'Small application',
        multiPart: 'Multi-part application',
        system: 'Large system',
    },
    aiUsage: 'AI usage',
    aiUsageLevels: {
        none: 'No AI',
        light: 'Light AI assistance',
        heavy: 'Heavy AI use',
        vibe: 'Vibe-coded',
    },
    projectKinds: {
        professional: 'Professional',
        training: 'Professional development',
        hobby: 'Hobby',
    },
    teamSizes: {
        solo: 'Solo',
        group: 'Team',
    },
    options: {
        layout: {
            title: 'Layout',
            values: {
                classic: 'Classic',
                showcase: 'Projects in focus',
                sidebar: 'Sidebar',
                split: 'Split screen',
                bento: 'Tiles',
            },
        },
        graph: {
            title: 'Graph',
            values: {
                classic: 'Classic',
                matrix: 'Matrix',
                lines: 'Grid lines',
                open: 'Open',
            },
        },
    },
} satisfies Messages
