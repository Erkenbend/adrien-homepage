# Persönliche Homepage – Plan und Stand

Ausgangsidee: `grober_plan.md`. Statische Seite unter `adrien.wehrung.online`: Profil, Kontakt und die eigenen Projekte als Graph (Komplexität × KI-Einsatz), auf Deutsch (Standard), Englisch und Französisch.

## Entscheidungen

| Thema | Entscheidung | Begründung |
|---|---|---|
| Framework | React 19 + Vite + TypeScript | Wie `random-picker` und `article-trainer`: bekannter Stack, gleiche Lint- und Build-Konfiguration |
| Paketmanager | Bun (`bun install`, `bun dev`, `bun lint`, `bun run build`) | Vorgabe aus `grober_plan.md`, wie `article-trainer` |
| Lint | ESLint-Konfiguration aus `article-trainer` (`strictTypeChecked`, React-Plugins) | Einheitlich über die kleinen Projekte |
| Infrastruktur | CDK (TypeScript) in `infrastructure/`, ein Stack: S3-Bucket + `BucketDeployment` aus `../dist` + CloudFront mit OAC + Route-53-A-Record | Kopie des Stacks aus `article-trainer`, angepasst an Domain und Zertifikat (siehe Schritt 2) |
| Region | `us-east-1` | Zertifikate für CloudFront müssen dort liegen; wie bei den anderen Projekten |
| Deployment | GitHub Actions bei Push auf `main`: install → lint → build → `cdk diff` → `cdk deploy` | Wie `article-trainer`; erst aktiv, wenn es ein Upstream-Repository gibt |
| I18n | Eigene, typisierte Wörterbücher (`src/i18n/de.ts` als Referenz, `en.ts`/`fr.ts` mit `satisfies Messages`), keine Bibliothek | Drei Sprachen und wenige Texte; TypeScript erzwingt Vollständigkeit, kein Test nötig |
| Sprache in der URL | Pfade: `/` Deutsch, `/en/` Englisch, `/fr/` Französisch | Links auf eine bestimmte Sprache möglich; CloudFront liefert bei 403/404 schon `index.html` aus |
| Vorrendern | Vorerst nicht, reine SPA | Evtl. später für Suchmaschinen und Link-Vorschauen |
| Gestaltung | Standardmäßig dunkel, „weniger ist mehr“ | Vorgabe des Nutzers |
| KI-Einsatz | Vier Stufen: keine KI → wenig KI-Unterstützung → starker KI-Einsatz → vibe-coded | Gemeint ist KI beim Entwickeln, nicht KI im Produkt |
| Komplexität | Vier benannte Stufen wie beim KI-Einsatz: Skript → kleine Anwendung → mehrteilige Anwendung → großes System | Vorgabe des Nutzers; benannte Stufen sind leichter einzuordnen und zu lesen als Zahlen |
| Projekt-Icons | KI-generierte Logos, lokal im Repository | Vorgabe des Nutzers |
| Lizenz | Wird vor dem Livegang entschieden | |
| Graph | Eigene Komponente aus HTML/SVG, keine Chart-Bibliothek | Nur Punkte mit Icons auf zwei Achsen; eine Bibliothek brächte mehr Gewicht als Nutzen |
| Inhalte (Profil, Projekte) | YAML-Dateien in `src/data/` (`profile.yaml`, später `projects.yaml`), getrennt vom Code | Inhalte ohne TSX pflegen; siehe „Datenhaltung“ |
| Kontakt | Link zum LinkedIn-Profil statt SimpleLogin-Alias | Entscheidung des Nutzers (weicht von `grober_plan.md` ab); keine E-Mail-Adresse auf der Seite |

## Datenhaltung

Es gibt keinen Server: Die Seite ist statisch (S3 + CloudFront). „Beim Start laden“ heißt hier **beim Build** (`bun run build`) bzw. beim Start von `bun dev`.

- Inhalte liegen als YAML in `src/data/`, Bilder unter `public/images/`.
- Ein kleines Vite-Plugin (`build-plugins/yaml-data.ts`) lädt `src/data/*.yaml`, prüft sie gegen ein Schema und liefert sie als JS-Modul (`import profile from './data/profile.yaml'`). Beim Bearbeiten im `bun dev` lädt die Seite neu; Fehler erscheinen im Browser-Overlay. Beim Start des Builds prüft es zusätzlich alle Dateien in `src/data/`, auch solche, die noch kein Code importiert.
- Felder mit fester Auswahl (Komplexität, KI-Einsatz, Art, Team) sind in `src/data/scales.ts` definiert, geordnet von niedrig nach hoch; ihre Beschriftungen stehen in `src/i18n/` und sind gegen diese Listen typisiert (fehlende Beschriftung → Build-Fehler).
- Schema mit Zod in `src/data/schema.ts`; daraus werden auch die TypeScript-Typen abgeleitet (`z.infer`). Ungültige Daten, fehlende Übersetzungen oder fehlende Bilder lassen den Build fehlschlagen.
- `yaml` und `zod` laufen nur beim Build (devDependencies) und landen nicht im Browser-Bundle.
- Texte sind entweder ein einfacher String (gleich in allen Sprachen, z. B. Firmennamen) oder `{de, en, fr}` mit allen drei Sprachen.
- Feste Texte der Oberfläche (Überschriften, Beschriftungen) bleiben in `src/i18n/`.
- Zu jeder Datei gibt es ein Referenzbeispiel `src/data/examples/<name>.yaml` mit allen Feldern, erfundenen Werten und Erklärungen als Kommentar. Der Build prüft beim Start (auch `bun dev`), dass es gültig ist und jedes Feld des Schemas mindestens einmal nutzt (`build-plugins/completeness.ts`, über `z.toJSONSchema`); in Listen genügt ein Eintrag mit dem Feld, damit das Beispiel auch minimale Einträge zeigen kann. Bilder der Beispiele müssen nicht existieren.
- Verworfen: YAML zur Laufzeit per `fetch` laden. Das brächte Ladezustand und Fehler erst beim Besucher, und ein Deployment ist für jede Änderung ohnehin nötig.

## Schritte

Jeder Schritt endet mit `bun lint` und `bun run build` ohne Fehler und einem eigenen Commit.

### 1. Grundgerüst ✅

- Vite-Projekt (React + TS) mit Bun; `package.json`, `tsconfig*.json`, `eslint.config.js`, `.gitignore` aus `article-trainer`.
- Abweichungen: `bun lint` prüft das ganze Repository (`eslint .`) statt nur `src`; kein `BUILD_TIMESTAMP`; `infrastructure/tsconfig.json` kommt erst mit Schritt 2 in die ESLint-Konfiguration.
- `README.md` im Stil der anderen Projekte; Quellen der Grafiken kommen dazu, sobald es welche gibt.
- `LICENSE` erst vor dem Livegang.
- Ergebnis: dunkle Seite mit Namen als Überschrift.

### 2. Infrastruktur ✅

- `infrastructure/` aus `article-trainer` übernommen (`bin/`, `lib/`, `cdk.json`, `package.json` ohne Jest, `tsconfig.json`); gleicher AWS-Account wie die anderen Projekte.
- Anpassungen im Stack:
  - `ROOT_DOMAIN_NAME = 'wehrung.online'`, Hosted Zone `Z0438866UI516D0PAKH6` über ID importiert.
  - Zertifikat nur für `adrien.wehrung.online` statt Wildcard der Root-Domain.
  - Bucket `adrien-homepage-bucket-919713414705-us-east-1`.
  - Stack `AdrienHomepageInfrastructureStack` mit fester Region `us-east-1` (Zertifikate für CloudFront müssen dort liegen), Construct-IDs mit Präfix `AdrienHomepage`.
  - Aktuelle CDK-Versionen (`aws-cdk-lib` 2.277.0, `aws-cdk` 2.1148.1) statt der Stände von `article-trainer`.
- ESLint prüft `infrastructure/` mit (`cdk.out` ausgenommen).
- Geprüft mit `bun run build` und danach `bunx cdk synth` in `infrastructure/` (ohne AWS-Zugang möglich).
- **Noch nicht deployt:** Vorerst wird nur lokal getestet (`bun dev`); das erste `cdk deploy` erst nach Rücksprache.

### 3. I18n-Grundlage ✅

- `src/i18n/de.ts` ist das Referenz-Wörterbuch, `Messages = typeof de`; `en.ts` und `fr.ts` nutzen `satisfies Messages` (fehlende oder überzählige Texte → Build-Fehler).
- `src/i18n/language.ts`: Sprache allein aus dem ersten Pfadsegment (`/`, `/en/`, `/fr/`, auch ohne Schrägstrich am Ende), ohne Router-Bibliothek; unbekannte Pfade zeigen die deutsche Seite. Sprache und Texte stehen beim Laden fest (`LANGUAGE`, `MESSAGES`), weil ein Sprachwechsel ein normaler Seitenaufruf ist.
- `main.tsx` setzt `<html lang>` und `document.title`.
- Sprachumschalter `DE · EN · FR` oben rechts als normale Links (`hreflang`, aktuelle Sprache mit `aria-current`).
- Keine automatische Weiterleitung nach Browsersprache: Ein geteilter Link zeigt immer dieselbe Sprache. Ein Hinweis „This page is also available in English“ bei abweichender Browsersprache bleibt optional.
- Lokal geprüft mit `bun run build` + `bun run preview` und Headless-Chromium für `/`, `/en/`, `/fr/`, `/en` und einen unbekannten Pfad. In Produktion übernimmt CloudFront die Rückfalllösung (403/404 → `index.html`).
- Platzhaltertext „Seite im Aufbau“, bis echte Inhalte kommen.

### 4. Datenhaltung und Profil ✅

- `build-plugins/yaml-data.ts`: lädt `src/data/<name>.yaml`, prüft gegen das Schema `<name>` aus `src/data/schema.ts` und liefert ein JS-Modul. Ohne passendes Schema, bei YAML-Syntaxfehlern oder ungültigen Daten bricht der Build mit Pfad und Grund ab (geprüft: fehlende Übersetzung, ungültiger Monat, fehlendes Bild).
- `src/data/schema.ts`: `createSchemas({imageExists})` (die Bildprüfung kommt vom Plugin, damit das Schema ohne Node-APIs auskommt); Typen `Profile`, `Localized`, `Period` per `z.infer`. `src/data/modules.d.ts` typisiert `import … from '*/profile.yaml'`.
- `src/i18n/languages.ts` enthält die Sprachliste ohne Browser-Globals, weil das Schema sie beim Build braucht.
- `tsconfig.app.json` ohne Node-Typen (`"types": []`), `tsconfig.node.json` mit Node-Typen und `build-plugins/`.
- `src/data/profile.yaml` mit Platzhaltern: Name, Position, Ort, Kurzvorstellung, Werdegang, Ausbildung, Zertifikate (Name, Aussteller, ausgestellt, optional gültig bis und Link), Sprachen, Links (LinkedIn, beliebig viele GitHub-Profile, angezeigt als „GitHub (Benutzername)“), optional `photo` (Pfad unter `public/`, z. B. `/images/profile.webp`). Leere Abschnitte werden nicht angezeigt.
- Zeiträume als `JJJJ` oder `JJJJ-MM`, Anzeige je Sprache über `Intl.DateTimeFormat` (z. B. „Sept. 2017 – Feb. 2021“, „mars 2021 – aujourd’hui“).
- Der Seitentitel ist der Name aus `profile.yaml`.
- `zod` und `yaml` landen nicht im Browser-Bundle (geprüft).

### 5. Kontakt ✅

- Abschnitt „Kontakt“ am Ende der Seite (`src/components/Contact.tsx`, Anker `#contact`): ein Satz mit Link zum LinkedIn-Profil (URL aus `profile.yaml`), keine E-Mail-Adresse. Formulierung ohne Anrede, damit sich die Frage „du“ oder „Sie“ nicht stellt.

### 6. Projektdaten (in Arbeit)

- ✅ Schema `projects` in `src/data/schema.ts`, Typ `Project`: Pflichtfelder `id` (eindeutig, Kleinbuchstaben/Ziffern/Bindestriche, später Anker in der URL), `name` und `description` (Text), `icon`, `complexity`, `aiUsage`; optional `technologies` (Liste), `kind` (`professional` | `hobby`), `period` (wie im Profil: `{from, to}`, ohne `to` = laufend), `team` (`solo` | `group`), `githubUrl`, `websiteUrl`.
- ✅ `complexity`: `script` | `app` | `multiPart` | `system`; `aiUsage`: `none` | `light` | `heavy` | `vibe` (siehe Entscheidungen). Beide Achsen mit vier beschrifteten Stufen statt Zahlen; Beschriftungen und Achsentitel in `src/i18n/`.
- ✅ Referenzbeispiel `src/data/examples/projects.yaml` mit Erklärung jeder Stufe.
- ✅ Geprüft: unbekannte Stufe, doppelte `id`, fehlendes Icon und ein Feld, das im Beispiel fehlt, lassen den Build fehlschlagen.
- ✅ Entwurf `src/data/projects.yaml` aus beiden GitHub-Profilen (`Erkenbend`, `awehrung`), `tfcoach` (eigene Beiträge) sowie XPAY und DATEV PaymentNext. Weggelassen: Forks ohne nennenswerte eigene Arbeit (nur Abhängigkeits-Updates, Formatierung, Badge) und das leere `my-solid-kata`; nach Durchsicht außerdem `9gag-bot`, `php-from-scratch`, `tcp-chat-room`, `localstack-testing` und `nina-workshop`. Bis es Logos gibt, zeigen alle Icons auf `public/images/projects/placeholder.svg`.
- Offen: mit `TODO` markierte Angaben vervollständigt der Nutzer selbst; Logos.
- Icons: KI-generierte Logos unter `public/images/projects/`, ein Bild pro Projekt (SVG oder kleines WebP); der Build prüft, dass jedes Bild existiert.
- Fehlende optionale Felder werden in der Detailansicht einfach weggelassen.
- Kandidaten aus `~/code` und `~/WebstormProjects`: `star-battle-solver`, `random-picker`, `article-trainer` (DER oder DAS), `home-dashboard`, `popquiz`, `snake`, `tfcoach`, `overwatch-meta-predictor`, `minecraft-overview`, `halle-appointment-watch`, `ntfy-server`, `ldap-password-change`, `KotlinFizzBuzz`, `smartcjm-api-check`, `tinkering-with-files-and-streams` – plus berufliche Projekte. Auswahl und Bewertung trifft der Nutzer; Entwürfe für Beschreibungen können aus den READMEs erstellt werden.

### 7. Projekt-Graph

- Fläche mit x = Komplexität, y = KI-Einsatz (vier Bänder), Achsenbeschriftung je Sprache.
- Jedes Projekt als Icon an seiner Position, als `<button>` mit Namen als `aria-label` und Tooltip.
- Überlappungen: Projekte mit (fast) gleichen Werten leicht versetzen, deterministisch (z. B. kleiner Kreis um den Punkt), damit die Anordnung stabil bleibt.
- Mobil: Graph skaliert auf Bildschirmbreite, Icons behalten eine Mindestgröße zum Antippen; falls zu eng, zusätzlich eine Liste unter dem Graph.

### 8. Detailansicht

- Klick auf ein Icon öffnet einen Dialog (`<dialog>`, schließt mit Esc und Klick daneben) mit allen vorhandenen Feldern und Links.
- Optional: ausgewähltes Projekt in der URL (`#projekt-id`), damit sich Details verlinken lassen; dann sollte der Sprachumschalter den Hash mitnehmen.

### 9. CI-Pipeline (sobald es das Upstream-Repository gibt)

- `.github/workflows/github-actions-build-deploy.yml` aus `article-trainer` übernehmen (Bun 1.3.8, Node 22), Stack-Name anpassen.
- Wird erst mit dem Upstream-Repository wirksam; dort die Secrets `AWS_ACCESS_KEY_ID` und `AWS_SECRET_ACCESS_KEY` hinterlegen.

**Sobald es das Upstream-Repository gibt:**
- `BUILD_TIMESTAMP` wieder einführen (`define` in `vite.config.ts`, Deklaration in `src/vite-env.d.ts`) und als Version im Footer anzeigen, wie bei `article-trainer`.
- Link zum GitHub-Repository mit GitHub-Logo im Footer, wie bei `random-picker` und `article-trainer`.

### 10. Feinschliff und Livegang

- Favicon, `<meta name="description">`, Open-Graph-Tags (für Vorschauen auf LinkedIn u. a.).
- Barrierefreiheit: Tastaturbedienung des Graphen, Kontraste, `alt`-Texte.
- Dunkles Farbschema als Standard (schon im Grundgerüst); helles Schema nur bei Bedarf.
- Prüfen mit Lighthouse (Performance, Accessibility, SEO); kein Ziel um jeden Preis, nur offensichtliche Mängel beheben.
- Deployment, Aufruf unter `https://adrien.wehrung.online`, Screenshot ins README.

## Offene Fragen

1. **Inhalte:** Profil ausgefüllt, es fehlt nur das Profilbild. Projekte: mit `TODO` markierte Angaben (vervollständigt der Nutzer), Logos.
2. **Lizenz:** vor dem Livegang; GPL wie `random-picker`/`article-trainer` oder MIT wie `star-battle-solver`, evtl. Texte und Bilder ausgenommen.
