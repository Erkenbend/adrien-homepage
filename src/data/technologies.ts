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
    bash: {name: 'Bash', logo: '/images/tech/bash.svg', darkOnly: true},
    c: {name: 'C', logo: '/images/tech/c.svg'},
    cpp: {name: 'C++', logo: '/images/tech/cpp.svg'},
    csharp: {name: 'C#', logo: '/images/tech/csharp.svg'},
    dart: {name: 'Dart', logo: '/images/tech/dart.svg'},
    gml: {name: 'GML'},
    go: {name: 'Go', logo: '/images/tech/go.svg'},
    java: {name: 'Java', logo: '/images/tech/java.svg'},
    javascript: {name: 'JavaScript', logo: '/images/tech/javascript.svg'},
    kotlin: {name: 'Kotlin', logo: '/images/tech/kotlin.svg'},
    php: {name: 'PHP', logo: '/images/tech/php.svg'},
    python: {name: 'Python', logo: '/images/tech/python.svg'},
    rust: {name: 'Rust', logo: '/images/tech/rust.svg', darkOnly: true},
    scala: {name: 'Scala', logo: '/images/tech/scala.svg'},
    sql: {name: 'SQL'},
    swift: {name: 'Swift', logo: '/images/tech/swift.svg'},
    typescript: {name: 'TypeScript', logo: '/images/tech/typescript.svg'},
} as const satisfies Record<string, Technology>

export const FRAMEWORKS = {
    'angular': {name: 'Angular', logo: '/images/tech/angular.svg'},
    'aws-cdk': {name: 'AWS CDK', logo: '/images/tech/aws.svg', darkOnly: true},
    'cobra': {name: 'Cobra'},
    'fastapi': {name: 'FastAPI', logo: '/images/tech/fastapi.svg'},
    'flutter': {name: 'Flutter', logo: '/images/tech/flutter.svg'},
    'gamemaker': {name: 'GameMaker'},
    'hibernate': {name: 'Hibernate', logo: '/images/tech/hibernate.svg'},
    'htmx': {name: 'HTMX', logo: '/images/tech/htmx.svg'},
    'junit': {name: 'JUnit', logo: '/images/tech/junit.svg'},
    'micronaut': {name: 'Micronaut'},
    'nextjs': {name: 'Next.js', logo: '/images/tech/nextjs.svg', darkOnly: true},
    'quarkus': {name: 'Quarkus', logo: '/images/tech/quarkus.svg'},
    'react': {name: 'React', logo: '/images/tech/react.svg'},
    'spring-boot': {name: 'Spring-Boot', logo: '/images/tech/spring-boot.svg'},
    'svelte': {name: 'Svelte', logo: '/images/tech/svelte.svg'},
    'symfony': {name: 'Symfony', logo: '/images/tech/symfony.svg'},
    'tailwindcss': {name: 'Tailwind CSS', logo: '/images/tech/tailwindcss.svg'},
    'vue': {name: 'Vue', logo: '/images/tech/vue.svg'},
    'webflux': {name: 'WebFlux'},
} as const satisfies Record<string, Technology>

/** Platforms, build tools, infrastructure. */
export const TOOLS = {
    'android': {name: 'Android', logo: '/images/tech/android.svg'},
    'ansible': {name: 'Ansible', logo: '/images/tech/ansible.svg', darkOnly: true},
    'aws': {name: 'AWS', logo: '/images/tech/aws.svg', darkOnly: true},
    'azure': {name: 'Azure', logo: '/images/tech/azure.svg'},
    'datadog': {name: 'Datadog', logo: '/images/tech/datadog.svg'},
    'docker': {name: 'Docker', logo: '/images/tech/docker.svg'},
    'dynamodb': {name: 'DynamoDB', logo: '/images/tech/dynamodb.svg'},
    'elasticsearch': {name: 'Elasticsearch', logo: '/images/tech/elasticsearch.svg'},
    'gcp': {name: 'Google Cloud', logo: '/images/tech/gcp.svg'},
    'git': {name: 'Git', logo: '/images/tech/git.svg'},
    'github-actions': {name: 'GitHub Actions', logo: '/images/tech/github-actions.svg'},
    'gitlab-ci': {name: 'GitLab CI', logo: '/images/tech/gitlab.svg'},
    'gradle': {name: 'Gradle', logo: '/images/tech/gradle.svg', darkOnly: true},
    'grafana': {name: 'Grafana', logo: '/images/tech/grafana.svg'},
    'helm': {name: 'Helm', logo: '/images/tech/helm.svg', darkOnly: true},
    'jenkins': {name: 'Jenkins', logo: '/images/tech/jenkins.svg'},
    'kafka': {name: 'Kafka', logo: '/images/tech/kafka.svg', darkOnly: true},
    'kubernetes': {name: 'Kubernetes', logo: '/images/tech/kubernetes.svg'},
    'linux': {name: 'Linux', logo: '/images/tech/linux.svg'},
    'localstack': {name: 'LocalStack', logo: '/images/tech/localstack.svg'},
    'maven': {name: 'Maven', logo: '/images/tech/maven.svg'},
    'mongodb': {name: 'MongoDB', logo: '/images/tech/mongodb.svg'},
    'mysql': {name: 'MySQL', logo: '/images/tech/mysql.svg'},
    'nginx': {name: 'Nginx', logo: '/images/tech/nginx.svg'},
    'nodejs': {name: 'Node.js', logo: '/images/tech/nodejs.svg'},
    'openapi': {name: 'OpenAPI', logo: '/images/tech/openapi.svg'},
    'postgres': {name: 'Postgres', logo: '/images/tech/postgres.svg'},
    'prometheus': {name: 'Prometheus', logo: '/images/tech/prometheus.svg'},
    'rabbitmq': {name: 'RabbitMQ', logo: '/images/tech/rabbitmq.svg'},
    'raspberry-pi': {name: 'Raspberry Pi', logo: '/images/tech/raspberry-pi.svg'},
    'redis': {name: 'Redis', logo: '/images/tech/redis.svg'},
    'sonarqube': {name: 'SonarQube', logo: '/images/tech/sonarqube.svg'},
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
