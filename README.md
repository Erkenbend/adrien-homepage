# Persönliche Homepage

Profil, Kontakt und eigene Projekte → https://adrien.wehrung.online

## Befehle

Einrichten: `bun install`

Entwicklungsserver: `bun dev`

Lint: `bun lint`

Produktions-Build nach `dist/`: `bun run build`

## Build-Einstellungen

Die Darstellung der Seite wird beim Build festgelegt, über Umgebungsvariablen in [.env](.env):

| Variable | Bedeutung | Werte | Standard |
|---|---|---|---|
| `VITE_LAYOUT` | Anordnung der Seite | `classic` (eine Spalte, Projekte als erster Abschnitt), `showcase` (Projekte im Mittelpunkt), `sidebar` (Seitenleiste), `split` (geteilter Bildschirm, Graph bleibt stehen), `bento` (Kacheln) | `classic` |
| `VITE_GRAPH` | Aussehen des Projekt-Graphen | `classic` (Bänder), `matrix` (gleich gefärbte Zellen), `lines` (Gitterlinien), `open` (nur Achsen) | `lines` |

- Für einen einzelnen Build überschreiben: `VITE_LAYOUT=split bun run build`
- Lokal dauerhaft überschreiben: dieselben Zeilen in `.env.local` (nicht im Repository)
- Ein fehlender oder unbekannter Wert bricht `bun dev` und `bun run build` mit den erlaubten Werten ab.
- In `bun dev` zeigt eine Leiste am linken Rand alle Werte zum Vergleichen; die Auswahl steht in der URL (`?layout=split&graph=open`) und überschreibt die Einstellung. Im Produktions-Build gibt es die Leiste nicht, und die URL-Parameter haben keine Wirkung.

Inhalte (Profil, Projekte): YAML-Dateien in `src/data/`, beim Build gegen `src/data/schema.ts` geprüft; Bilder unter `public/images/`. Alle Felder mit Erklärungen: [src/data/examples/profile.yaml](src/data/examples/profile.yaml), [src/data/examples/projects.yaml](src/data/examples/projects.yaml)

Infrastruktur (AWS CDK): siehe [infrastructure/README.md](infrastructure/README.md)

## Grafiken

Logos sind Marken ihrer Inhaber und werden nur verwendet, um auf die jeweilige Seite, Organisation oder das Projekt zu verweisen.

Icons der Links (`public/images/sites/`; `isaqb.svg` ist auch das Logo beim Zertifikat):

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

Projekt-Icons (`public/images/projects/`):

| Datei | Quelle |
|---|---|
| `xpay.svg` | XPAY-Logo von der Referenzseite [finatix.de/referenzen/xpay](https://www.finatix.de/referenzen/xpay) (`Logo_gray_xPay.png`), zugeschnitten, verkleinert und auf eine weiße Kachel gesetzt |
| `datev-paymentnext.svg` | [File:Datev.svg](https://commons.wikimedia.org/wiki/File:Datev.svg) von Wikimedia Commons (gemeinfrei als einfaches Schriftbild, Marke der DATEV eG), auf eine weiße Kachel gesetzt |
| alle anderen | eigene Zeichnungen (mit Claude erstellt), gleiche Lizenz wie das Repository |

Logos der Technologien (`public/images/tech/`): farbige Varianten (`*-original.svg`) aus [Devicon](https://github.com/devicons/devicon) v2.18.0, MIT, © konpa; die Logos selbst sind Marken ihrer Inhaber. Für den dunklen Hintergrund aufgehellt (sonst unverändert): bei `aws.svg` der Schriftzug (weiß), bei `htmx.svg` die spitzen Klammern (hellgrau), bei `symfony.svg` der Kreis (weiß). `aws.svg` steht auch bei AWS CDK.

`localstack.svg`: Signet aus dem Logo in der Navigationsleiste von [localstack.cloud](https://www.localstack.cloud) (Inline-SVG; nur das Signet ohne Schriftzug übernommen, sonst unverändert), Marke der LocalStack GmbH.
