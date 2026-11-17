# Persönliche Homepage

Profil, Kontakt und eigene Projekte → https://adrien.wehrung.online

## Befehle

Einrichten: `bun install`

Entwicklungsserver: `bun dev`

Lint: `bun lint`

Produktions-Build nach `dist/`: `bun run build`

Inhalte (Profil, Projekte): YAML-Dateien in `src/data/`, beim Build gegen `src/data/schema.ts` geprüft; Bilder unter `public/images/`. Alle Felder mit Erklärungen: [src/data/examples/profile.yaml](src/data/examples/profile.yaml), [src/data/examples/projects.yaml](src/data/examples/projects.yaml)

Infrastruktur (AWS CDK): siehe [infrastructure/README.md](infrastructure/README.md)

## Grafiken

Logos sind Marken ihrer Inhaber und werden nur verwendet, um auf die jeweilige Seite, Organisation oder das Projekt zu verweisen.

Icons der Links (`src/assets/sites/`):

| Datei | Quelle | Lizenz / Bedingungen |
|---|---|---|
| `github.svg` | GitHub Mark (weiß) von [github.com/logos](https://github.com/logos), wie in `random-picker` | GitHub Logo-Richtlinien: unverändert, zum Verlinken auf GitHub |
| `linkedin.png` | `LI-In-Bug.png` aus `in-logo.zip` von [brand.linkedin.com/downloads](https://brand.linkedin.com/downloads) | LinkedIn Brand Guidelines: unverändert, zum Verlinken auf das eigene Profil |
| `isaqb.svg` | Signet aus dem Favicon von [isaqb.org](https://www.isaqb.org) (`favicon.svg`), nur Editor-Metadaten entfernt | Marke des iSAQB e. V., Fragen zur Nutzung an info@isaqb.org ([Trademarks](https://www.isaqb.org/trademarks)) |
| `link.svg` | `link-external-16` aus [Primer Octicons](https://github.com/primer/octicons), Füllfarbe weiß | MIT, © GitHub Inc. |

Logos der Organisationen (`public/images/logos/`), jeweils unverändert von der Webseite der Organisation:

| Datei | Quelle |
|---|---|
| `finatix.png` | Favicon von [finatix.de](https://www.finatix.de) (`logo-finatix-l-ohne-Hintergrund.png`) |
| `it-sonix.png` | Favicon von [itsonix.eu](https://itsonix.eu) (`cropped-it-sonix-favicon-192x192.png`) |
| `mlu.png` | Favicon von [uni-halle.de](https://www.uni-halle.de) (`favicon-192x192.png`) |
| `telecom-nancy.png` | Favicon von [telecomnancy.univ-lorraine.fr](https://telecomnancy.univ-lorraine.fr) (`apple-icon-180x180.png`) |
| `isaqb.svg` | wie `src/assets/sites/isaqb.svg` |
