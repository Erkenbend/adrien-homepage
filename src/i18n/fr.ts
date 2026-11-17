import type {Messages} from './de.ts'

export const fr = {
    languageSwitcherLabel: 'Choisir la langue',
    experience: 'Expérience',
    education: 'Formation',
    certificates: 'Certifications',
    validUntil: 'valable jusqu’à',
    languages: 'Langues',
    contact: 'Contact',
    contactIntro: 'Le plus simple pour me joindre : un message via',
    present: 'aujourd’hui',
    projects: 'Projets',
    projectsIntro: 'Mes projets, classés selon leur complexité et la part d’IA utilisée pour les développer.',
    complexity: 'Complexité',
    complexityLevels: {
        script: 'Script',
        app: 'Petite application',
        multiPart: 'Application en plusieurs parties',
        system: 'Grand système',
    },
    aiUsage: 'Usage de l’IA',
    aiUsageLevels: {
        none: 'Sans IA',
        light: 'Peu d’assistance IA',
        heavy: 'Usage intensif de l’IA',
        vibe: 'Vibe-codé',
    },
    projectKinds: {
        professional: 'Professionnel',
        hobby: 'Loisir',
    },
    teamSizes: {
        solo: 'En solo',
        group: 'En équipe',
    },
} satisfies Messages
