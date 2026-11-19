// Technologies a project may list, keyed by the id used in projects.yaml. An id missing here fails the
// build, so names and logos stay consistent across projects. Kept free of browser globals: also used by the
// data schema and build-plugins/yaml-data.ts (which checks that every logo exists) at build time.

export interface Technology {
    /** Shown on the page, the same in every language. */
    name: string
    /** Path below public/, shown before the name; sources in docs/credits.md. */
    logo?: string
    /** The logo is (partly) white, made for a dark background: inverted in the light theme. */
    darkOnly?: boolean
}

export const PROGRAMMING_LANGUAGES = {
    c: {name: 'C', logo: '/images/tech/c.svg'},
    cpp: {name: 'C++', logo: '/images/tech/cpp.svg'},
    csharp: {name: 'C#', logo: '/images/tech/csharp.svg'},
    gml: {name: 'GML'},
    go: {name: 'Go', logo: '/images/tech/go.svg'},
    java: {name: 'Java', logo: '/images/tech/java.svg'},
    javascript: {name: 'JavaScript', logo: '/images/tech/javascript.svg'},
    kotlin: {name: 'Kotlin', logo: '/images/tech/kotlin.svg'},
    php: {name: 'PHP', logo: '/images/tech/php.svg'},
    python: {name: 'Python', logo: '/images/tech/python.svg'},
    rust: {name: 'Rust', logo: '/images/tech/rust.svg', darkOnly: true},
    typescript: {name: 'TypeScript', logo: '/images/tech/typescript.svg'},
} as const satisfies Record<string, Technology>

export const FRAMEWORKS = {
    'angular': {name: 'Angular', logo: '/images/tech/angular.svg'},
    'aws-cdk': {name: 'AWS CDK', logo: '/images/tech/aws.svg', darkOnly: true},
    'cobra': {name: 'Cobra'},
    'fastapi': {name: 'FastAPI', logo: '/images/tech/fastapi.svg'},
    'gamemaker': {name: 'GameMaker'},
    'htmx': {name: 'HTMX', logo: '/images/tech/htmx.svg'},
    'react': {name: 'React', logo: '/images/tech/react.svg'},
    'spring-boot': {name: 'Spring-Boot', logo: '/images/tech/spring-boot.svg'},
    'symfony': {name: 'Symfony', logo: '/images/tech/symfony.svg'},
    'webflux': {name: 'WebFlux'},
} as const satisfies Record<string, Technology>

/** Platforms, build tools, infrastructure. */
export const TOOLS = {
    'android': {name: 'Android', logo: '/images/tech/android.svg'},
    'aws': {name: 'AWS', logo: '/images/tech/aws.svg', darkOnly: true},
    'azure': {name: 'Azure', logo: '/images/tech/azure.svg'},
    'docker': {name: 'Docker', logo: '/images/tech/docker.svg'},
    'dynamodb': {name: 'DynamoDB', logo: '/images/tech/dynamodb.svg'},
    'gcp': {name: 'Google Cloud', logo: '/images/tech/gcp.svg'},
    'localstack': {name: 'LocalStack', logo: '/images/tech/localstack.svg'},
    'maven': {name: 'Maven', logo: '/images/tech/maven.svg'},
    'openapi': {name: 'OpenAPI', logo: '/images/tech/openapi.svg'},
    'postgres': {name: 'Postgres', logo: '/images/tech/postgres.svg'},
    'rabbitmq': {name: 'RabbitMQ', logo: '/images/tech/rabbitmq.svg'},
    'raspberry-pi': {name: 'Raspberry Pi', logo: '/images/tech/raspberry-pi.svg'},
    'terraform': {name: 'Terraform', logo: '/images/tech/terraform.svg'},
    'vite': {name: 'Vite', logo: '/images/tech/vite.svg'},
} as const satisfies Record<string, Technology>

export type ProgrammingLanguage = keyof typeof PROGRAMMING_LANGUAGES
export type Framework = keyof typeof FRAMEWORKS
export type Tool = keyof typeof TOOLS

/** Ids of a registry as a tuple, as `z.enum` expects it. */
export function idsOf<T extends Record<string, Technology>>(registry: T): [keyof T & string, ...(keyof T & string)[]] {
    return Object.keys(registry) as [keyof T & string, ...(keyof T & string)[]]
}

export const ALL_TECHNOLOGIES: Technology[] = [
    ...Object.values(PROGRAMMING_LANGUAGES),
    ...Object.values(FRAMEWORKS),
    ...Object.values(TOOLS),
]
