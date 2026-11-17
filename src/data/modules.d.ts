// Typed imports of the YAML files in src/data, see build-plugins/yaml-data.ts.

declare module '*/profile.yaml' {
    const profile: import('./schema.ts').Profile
    export default profile
}

declare module '*/projects.yaml' {
    const projects: import('./schema.ts').Project[]
    export default projects
}
