# Persönliche Homepage

Profil, Kontakt und eigene Projekte → https://adrien.wehrung.online

## Befehle

Einrichten: `bun install`

Entwicklungsserver: `bun dev`

Lint: `bun lint`

Produktions-Build nach `dist/`: `bun run build`

Inhalte (Profil, Projekte): YAML-Dateien in `src/data/`, beim Build gegen `src/data/schema.ts` geprüft; Bilder unter `public/images/`. Alle Felder mit Erklärungen: [src/data/examples/profile.yaml](src/data/examples/profile.yaml), [src/data/examples/projects.yaml](src/data/examples/projects.yaml)

Infrastruktur (AWS CDK): siehe [infrastructure/README.md](infrastructure/README.md)
