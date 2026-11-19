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
| Vorrendern | Beim Build: je Sprache eine fertige `index.html` (`/`, `/en/`, `/fr/`), React übernimmt sie im Browser (Hydration); siehe Schritt 13 | Anfangs reine SPA. Geändert, weil KI-Werkzeuge wie ChatGPT und viele Crawler kein JavaScript ausführen und nur eine leere Seite sahen (Nutzer, 19.11.2026) |
| Gestaltung | Standardmäßig dunkel, „weniger ist mehr“; helles Schema per Knopf | Vorgabe des Nutzers |
| Reihenfolge im Lebenslauf | Werdegang, Zertifikate, Ausbildung, Sprachen – in allen Anordnungen, im Schema und in den YAML-Dateien gleich | Vorgabe des Nutzers |
| KI-Einsatz | Vier Stufen: keine KI → wenig KI-Unterstützung → starker KI-Einsatz → vibe-coded | Gemeint ist KI beim Entwickeln, nicht KI im Produkt |
| Komplexität | Fünf benannte Stufen wie beim KI-Einsatz: Skript → Demo → kleine Anwendung → mehrteilige Anwendung → großes System | Vorgabe des Nutzers; benannte Stufen sind leichter einzuordnen und zu lesen als Zahlen. „Demo“ kam bei der Durchsicht der Projekte dazu, für Spielwiesen und Beispiele |
| Art des Projekts | Beruflich, Weiterbildung (von der Arbeit getragen, aber ohne Kundenbezug), Hobby | Vorgabe des Nutzers |
| Projekt-Icons | Hobby- und Weiterbildungsprojekte: eigene, von Claude gezeichnete SVG-Icons; berufliche Projekte: Logo von XPAY bzw. DATEV; alles lokal im Repository | Vorgabe des Nutzers; die SVGs sind klein, scharf in jeder Größe und frei von fremden Rechten |
| Lizenz | Code unter GPL-3.0 (`LICENSE`), persönliche Inhalte unter CC BY-SA 4.0 (`LICENSES/CC-BY-SA-4.0.txt`): `profile.yaml`, `projects.yaml`, Favicon, eigene Projekt-Icons; Porträts alle Rechte vorbehalten; fremde Logos behalten ihre Bedingungen (`docs/credits.md`). Aufteilung im README unter „License“ | Entscheidung des Nutzers: GPL hält den Code frei und die Urheberangaben erhalten, wie bei `random-picker`/`article-trainer`; AGPL brächte ohne eigenen Servercode nichts. Inhalte brauchen eine eigene Lizenz, mit Namensnennung und Weitergabe unter gleichen Bedingungen |
| Graph | Eigene Komponente aus HTML/SVG, keine Chart-Bibliothek | Nur Punkte mit Icons auf zwei Achsen; eine Bibliothek brächte mehr Gewicht als Nutzen |
| Inhalte (Profil, Projekte) | YAML-Dateien in `src/data/` (`profile.yaml`, später `projects.yaml`), getrennt vom Code | Inhalte ohne TSX pflegen; siehe „Datenhaltung“ |
| Kontakt | Link zum LinkedIn-Profil statt SimpleLogin-Alias | Entscheidung des Nutzers (weicht von `grober_plan.md` ab); keine E-Mail-Adresse auf der Seite |
| Dokumentation | `README.md` und `docs/` auf Englisch, `PLAN.md` auf Deutsch | Entscheidung des Nutzers vor dem Livegang: Das Repository ist öffentlich auf GitHub und soll sich als Vorlage für eigene Seiten eignen |

## Datenhaltung

Es gibt keinen Server: Die Seite ist statisch (S3 + CloudFront). „Beim Start laden“ heißt hier **beim Build** (`bun run build`) bzw. beim Start von `bun dev`.

- Inhalte liegen als YAML in `src/data/`, Bilder unter `public/images/`.
- Ein kleines Vite-Plugin (`build-plugins/yaml-data.ts`) lädt `src/data/*.yaml`, prüft sie gegen ein Schema und liefert sie als JS-Modul (`import profile from './data/profile.yaml'`). Beim Bearbeiten im `bun dev` lädt die Seite neu; Fehler erscheinen im Browser-Overlay. Beim Start des Builds prüft es zusätzlich alle Dateien in `src/data/`, auch solche, die noch kein Code importiert.
- Felder mit fester Auswahl (Komplexität, KI-Einsatz, Art, Team) sind in `src/data/scales.ts` definiert, geordnet von niedrig nach hoch; ihre Beschriftungen stehen in `src/i18n/` und sind gegen diese Listen typisiert (fehlende Beschriftung → Build-Fehler).
- Schema mit Zod in `src/data/schema.ts`; daraus werden auch die TypeScript-Typen abgeleitet (`z.infer`). Ungültige Daten, fehlende Übersetzungen oder fehlende Bilder lassen den Build fehlschlagen.
- `yaml` und `zod` laufen nur beim Build (devDependencies) und landen nicht im Browser-Bundle.
- Texte sind entweder ein einfacher String (gleich in allen Sprachen, z. B. Firmennamen) oder `{de, en, fr}` mit allen drei Sprachen.
- In Beschreibungen (Werdegang, Ausbildung, Projekte) werden Links in Markdown-Schreibweise `[Text](URL)` zu Links (`src/components/RichText.tsx`); sonstiges Markdown bleibt reiner Text.
- Feste Texte der Oberfläche (Überschriften, Beschriftungen) bleiben in `src/i18n/`.
- Zu jeder Datei gibt es ein Referenzbeispiel `src/data/examples/<name>.yaml` mit allen Feldern, erfundenen Werten und Erklärungen als Kommentar. Der Build prüft beim Start (auch `bun dev`), dass es gültig ist und jedes Feld des Schemas mindestens einmal nutzt (`build-plugins/completeness.ts`, über `z.toJSONSchema`); in Listen genügt ein Eintrag mit dem Feld, damit das Beispiel auch minimale Einträge zeigen kann. Bilder der Beispiele müssen nicht existieren.
- Verworfen: YAML zur Laufzeit per `fetch` laden. Das brächte Ladezustand und Fehler erst beim Besucher, und ein Deployment ist für jede Änderung ohnehin nötig.

## Schritte

Jeder Schritt endet mit `bun lint` und `bun run build` ohne Fehler und einem eigenen Commit.

### 1. Grundgerüst ✅

- Vite-Projekt (React + TS) mit Bun; `package.json`, `tsconfig*.json`, `eslint.config.js`, `.gitignore` aus `article-trainer`.
- Abweichungen: `bun lint` prüft das ganze Repository (`eslint .`) statt nur `src`; kein `BUILD_TIMESTAMP`; `infrastructure/tsconfig.json` kommt erst mit Schritt 2 in die ESLint-Konfiguration.
- `README.md` im Stil der anderen Projekte (inzwischen auf Englisch mit Details in `docs/`, siehe Schritt 11).
- `LICENSE` erst vor dem Livegang (inzwischen ergänzt, siehe Entscheidung „Lizenz“).
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
- ✅ Deployt über die CI-Pipeline (Schritt 10), live seit 18.11.2026.

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
- `src/data/profile.yaml` mit Platzhaltern: Name, Position, Ort, Kurzvorstellung, Werdegang, Zertifikate (Name, Aussteller, ausgestellt, optional gültig bis und Link), Ausbildung, Sprachen, Links (inzwischen eine freie Liste von URLs, siehe Schritt 9), optional `photo` (Pfad unter `public/`, z. B. `/images/profile.webp`). Leere Abschnitte werden nicht angezeigt.
- Easter Egg: optionale Felder `shadowPhoto` und `shadowAbout`. Solange die Maus über dem Foto steht (auf Touchscreens von einem Tipp auf das Foto bis zum nächsten), ersetzen sie Foto und Kurzvorstellung; fehlt eines, bleibt die normale Fassung. Beide Fassungen liegen in derselben Grid-Zelle und werden nur ein- und ausgeblendet (kurzes Überblenden, ohne bei `prefers-reduced-motion`): kein Springen des Layouts, kein Nachladen des Bildes, die verborgene Fassung ist auch für Screenreader unsichtbar. Ohne `photo` bzw. `about` bricht der Build ab.
- Zeiträume als `JJJJ` oder `JJJJ-MM`, Anzeige je Sprache über `Intl.DateTimeFormat` (z. B. „Sept. 2017 – Feb. 2021“, „mars 2021 – aujourd’hui“).
- Der Seitentitel ist der Name aus `profile.yaml`.
- `zod` und `yaml` landen nicht im Browser-Bundle (geprüft).

### 5. Kontakt ✅

- Abschnitt „Kontakt“ am Ende der Seite (`src/components/Contact.tsx`, Anker `#contact`): ein Satz mit Link zum LinkedIn-Profil (`contact` in `profile.yaml`), keine E-Mail-Adresse. Formulierung ohne Anrede, damit sich die Frage „du“ oder „Sie“ nicht stellt.

### 6. Projektdaten ✅

- ✅ Schema `projects` in `src/data/schema.ts`, Typ `Project`: Pflichtfelder `id` (eindeutig, Kleinbuchstaben/Ziffern/Bindestriche, später Anker in der URL), `name` und `description` (Text), `icon`, `complexity`, `aiUsage`; optional `visible` (Standard `true`), `languages`, `frameworks` und `tools` (Listen von IDs aus `src/data/technologies.ts`, siehe Schritt 9; `tools` für Plattformen, Build-Werkzeuge und Infrastruktur wie Docker oder AWS), `kind` (`professional` | `training` | `hobby`), `period` (wie im Profil: `{from, to}`, ohne `to` = laufend), `team` (`solo` | `group`), `teamDetails` (Text, z. B. Größe des Teams oder eigene Rolle), `githubUrl`, `websiteUrl`.
- ✅ `visible: false` blendet ein Projekt aus, ohne den Eintrag auszukommentieren: Es wird weiter geprüft, aber schon im Schema herausgefiltert und landet nicht im Bundle (geprüft). In `projects.yaml` steht `visible: true` ausdrücklich bei jedem Eintrag.
- ✅ `complexity`: `script` | `demo` | `app` | `multiPart` | `system`; `aiUsage`: `none` | `light` | `heavy` | `vibe` (siehe Entscheidungen). Beide Achsen mit beschrifteten Stufen statt Zahlen; Beschriftungen und Achsentitel in `src/i18n/`.
- ✅ Referenzbeispiel `src/data/examples/projects.yaml` mit Erklärung jeder Stufe.
- ✅ Geprüft: unbekannte Stufe, doppelte `id`, fehlendes Icon und ein Feld, das im Beispiel fehlt, lassen den Build fehlschlagen.
- ✅ `src/data/projects.yaml` aus beiden GitHub-Profilen (`Erkenbend`, `awehrung`), `tfcoach` (eigene Beiträge) sowie XPAY und DATEV PaymentNext. Weggelassen: Forks ohne nennenswerte eigene Arbeit (nur Abhängigkeits-Updates, Formatierung, Badge) und das leere `my-solid-kata`; nach Durchsicht außerdem `9gag-bot`, `php-from-scratch`, `tcp-chat-room`, `localstack-testing` und `nina-workshop`.
- ✅ Alle Angaben vom Nutzer vervollständigt und geprüft.
- Icons: ein Bild pro Projekt unter `public/images/projects/` (SVG oder kleines WebP, quadratisch), Pflichtfeld; der Build prüft, dass jedes Bild existiert. Siehe Schritt 9.
- Fehlende optionale Felder werden in der Detailansicht einfach weggelassen.
- Kandidaten aus `~/code` und `~/WebstormProjects`: `star-battle-solver`, `random-picker`, `article-trainer` (DER oder DAS), `home-dashboard`, `popquiz`, `snake`, `tfcoach`, `overwatch-meta-predictor`, `minecraft-overview`, `halle-appointment-watch`, `ntfy-server`, `ldap-password-change`, `KotlinFizzBuzz`, `smartcjm-api-check`, `tinkering-with-files-and-streams` – plus berufliche Projekte. Auswahl und Bewertung trifft der Nutzer; Entwürfe für Beschreibungen können aus den READMEs erstellt werden.

### 7. Projekt-Graph ✅

- `src/components/ProjectGraph.tsx`, Abschnitt „Projekte“ (Anker `#projects`), in der Standardanordnung direkt nach der Kurzvorstellung, mit einem Satz zur Bedeutung der Achsen. Die folgende Beschreibung gilt für die ursprüngliche Fassung mit Bändern; Standard ist inzwischen die Fassung mit Pfeilen als Achsen und Gitterlinien (siehe Schritt 9a).
- Raster statt freier Koordinaten: eine Spalte je Komplexitätsstufe, ein Band je KI-Stufe (oben am meisten KI), Stufennamen je Sprache an den Spalten bzw. in den Bändern, Achsentitel mit Pfeil. Leere Stufen bleiben sichtbar, damit die Skala vollständig ist.
- Überlappungen gibt es nicht: Projekte derselben Zelle stehen nebeneinander (umbrechend), nach Namen sortiert. Das ersetzt den angedachten Versatz im Kreis, weil beide Achsen ohnehin nur vier Stufen haben.
- Jedes Projekt ist ein `<button>` (Name als `aria-label`) mit eigenem Tooltip bei Hover und Tastaturfokus; Tooltips wachsen zur Mitte hin (in der mittleren Spalte zentriert), damit sie nicht über den Rand ragen; versteckte Tooltips nehmen keinen Platz ein. Jede belegte Zelle ist eine Liste mit Stufen als `aria-label`. Ein Klick hat noch keine Wirkung (Schritt 8).
- Die Spaltenzahl ergibt sich aus der Zahl der Komplexitätsstufen.
- Art des Projekts als farbiger Ring um das Icon (mit schmalem Abstand in Seitenfarbe): beruflich blau, Weiterbildung orange, Hobby rosa; Legende unter dem Graph mit allen drei Arten. Projekte ohne `kind` bekommen keinen Ring. Damit die Information nicht nur an der Farbe hängt, steht die Art auch im `aria-label` des Icons („XPAY · Beruflich“) und in der Detailansicht, deren Icon denselben Ring trägt. Farben in `src/index.css` (`.kind-*`).
- Mobil: Spalten teilen sich die Breite, Icons bleiben 44 px groß und stapeln sich in der Zelle. Eine zusätzliche Liste unter dem Graph ist deshalb nicht nötig.
- Geprüft mit `bun run preview` und Headless-Chromium bei 1100 px und 360 px: alle 15 Projekte sichtbar; bei 360 px in allen drei Sprachen kein horizontales Scrollen, auch nicht beim Hover über jedes einzelne Icon.

### 8. Detailansicht ✅

- `src/components/ProjectDialog.tsx`: Klick auf ein Icon öffnet einen modalen `<dialog>` mit Icon, Name, Beschreibung und allen vorhandenen Angaben (Komplexität, KI-Einsatz, Zeitraum, Art, Team mit Details, Programmiersprachen, Frameworks, Werkzeuge) sowie Links zu Webseite und GitHub. Fehlende Angaben entfallen. Mobil stehen Bezeichnung und Wert untereinander.
- Schließen mit Esc, Schließen-Knopf, Klick neben den Dialog oder Zurück im Browser (auf dem Handy also mit der Zurück-Geste). Der Fokus kehrt zum Icon zurück; die Seite dahinter scrollt nicht mit.
- Das geöffnete Projekt steht im Hash (`/en/#tfcoach`), Details lassen sich also verlinken. `src/hash.ts`: Öffnen legt einen History-Eintrag an, Schließen geht ihn zurück, sodass sich beim wiederholten Öffnen keine Einträge ansammeln; bei einem direkt aufgerufenen Link wird der Hash beim Schließen ersetzt. Unbekannte Hashes öffnen nichts.
- Projekt-`id`s dürfen nicht wie Abschnittsanker heißen (`projects`, `contact`), sonst Build-Fehler.
- Der Sprachumschalter übernimmt den Hash (z. B. `#contact`). Für ein offenes Projekt greift das nicht, weil die Seite hinter dem modalen Dialog nicht bedienbar ist; ein Sprachwechsel mit offenem Projekt bliebe eine Idee für später.
- Geprüft mit Headless-Chromium: alle Wege zum Öffnen und Schließen samt URL, Fokus und History, direkter Link, unbekannter Hash, Darstellung bei 1100 px und 360 px.

### 9. Icons und Logos ✅

- ✅ **Links mit Icons:** `links` in `profile.yaml` ist eine Liste beliebiger URLs, `contact` die URL für den Kontakt-Abschnitt. `src/sites.ts` erkennt bekannte Seiten am Hostnamen (auch Subdomains) und zeigt Logo und Namen: GitHub (bei Profil-URLs mit Benutzername, bei Repositorys ohne), LinkedIn, iSAQB. Unbekannte Seiten bekommen ein allgemeines Link-Icon und den Hostnamen (bei Projekten „Webseite“). Eine weitere Seite ist ein Eintrag in `SITES`. Gilt für Profil-Links, Kontakt und die Links in der Projekt-Detailansicht.
- Die Site-Icons liegen in `public/images/sites/`; der Build prüft beim Start, dass jedes Icon aus `src/sites.ts` existiert. Das Zertifikat nutzt dieselbe Datei `isaqb.svg` als Logo, es gibt sie nur einmal.
- ✅ **Logos der Organisationen:** optionales Feld `logo` bei Werdegang, Zertifikaten und Ausbildung (Bilder unter `public/images/logos/`). Angezeigt links neben dem Eintrag auf einer weißen Kachel, weil die meisten Logos für helle Hintergründe gemacht sind. Hat ein Eintrag einer Liste ein Logo, lassen alle Einträge dieser Liste Platz dafür. Quadratische Varianten (Signet oder Favicon) statt Schriftzügen, die in der kleinen Kachel unlesbar wären. Das Lycée Clemenceau hat kein eigenes Logo im Netz, das Abitur keine Institution: beide ohne Logo.
- ✅ **Projekt-Icons:** jedes Projekt zeigt auf `public/images/projects/<id>.svg`; `placeholder.svg` bleibt für neue Projekte ohne Icon. Alle Icons 64 × 64 mit abgerundeter Kachel, damit der Graph einheitlich wirkt:
  - Hobby und Weiterbildung: eigene Motive auf dunkler, farbiger Kachel, ohne fremde Marken (kein Terraform-, RabbitMQ- oder Overwatch-Logo): Star-Battle-Raster mit Sternen, Tablet mit Uhr/Sonne/Abfahrten, „DER“/„DAS“ in den üblichen Artikelfarben, zwei Container im Duell, Trillerpfeife mit Haken (tfcoach), Pixel-Pflänzchen, Würfel, Waage zwischen zwei Teams, zwei Dienste mit Warteschlange und Trace-Faden, Dokumente aus einem Datenstrom, versetzte, überlappende Verarbeitungsschritte, Sudoku-Block, sprudelndes Glas mit Biene (Fizz/Buzz), Mini-Graph mit Achsenpfeilen und Kacheln in den Farben der Projektarten (diese Homepage).
  - XPAY und DATEV PaymentNext: Firmenlogo auf weißer Kachel, wie die Logos der Organisationen.
- ✅ **Technologien:** Programmiersprachen, Frameworks und Werkzeuge sind kein Freitext mehr, sondern IDs aus drei festen Listen in `src/data/technologies.ts` (`PROGRAMMING_LANGUAGES`, `FRAMEWORKS`, `TOOLS`; z. B. `java` → „Java“). Eine unbekannte ID oder eine ID in der falschen Liste (z. B. `docker` unter `languages`) bricht den Build ab; eine neue Technologie ist ein Eintrag dort. Der Name ist in allen Sprachen gleich, das Logo optional (`public/images/tech/`, der Build prüft, dass es existiert). In der Detailansicht steht das Logo vor dem Namen, die Einträge stehen nebeneinander statt durch Kommas getrennt.
  - Logos aus [Devicon](https://devicon.dev) (farbige Varianten). LocalStack: Signet aus dem Logo auf localstack.cloud (Devicon hat keines). AWS CDK nutzt das AWS-Logo. Ohne Logo: GML, GameMaker, Cobra, WebFlux.
  - Vorrat für spätere Projekte (noch von keinem Projekt genutzt): Sprachen Bash, C, C++, C#, Dart, Rust, Scala, SQL, Swift; Frameworks Flutter, Hibernate, JUnit, Micronaut, Next.js, Quarkus, Svelte, Tailwind CSS, Vue; Werkzeuge Android, Ansible, Azure, Datadog, Elasticsearch, Git, GitHub Actions, GitLab CI, Google Cloud, Gradle, Grafana, Helm, Jenkins, Kafka, Kubernetes, Linux, MongoDB, MySQL, Nginx, Node.js, Prometheus, Redis, SonarQube. Ohne Logo (nicht in Devicon): SQL, Micronaut.
  - Dunkle einfarbige Logos (Gradle, Helm, Kafka, Rust, Sechseck von Bash) weiß eingefärbt und `darkOnly` wie AWS; bei Ansible und Next.js (schwarzer Kreis, weißes Zeichen) Schwarz und Weiß getauscht, damit die Invertierung im hellen Schema das Original ergibt.
- ✅ **Flaggen bei Sprachen:** optionales Feld `flag` mit einem Flaggen-Emoji (🇫🇷, 🇩🇪, 🇬🇧), vom Schema geprüft; für Screenreader ausgeblendet, weil der Name daneben steht. Hinweis: Windows hat keine Flaggen-Emojis, Browser dort zeigen stattdessen die zwei Buchstaben (z. B. „FR“).

### 9a. Anordnung der Seite und Aussehen des Graphen ✅

- Ziel: verschiedene Anordnungen von Profiltexten und Graph vergleichen (nicht Schrift und Farben). Begonnen als Auswahl auf der Seite (Proof of Concept), jetzt Build-Einstellungen mit Umschalter nur in `bun dev`.
- Entscheidung des Nutzers: Standard sind Anordnung 1 (mit den Projekten als erstem Abschnitt) und Graph 3 (Gitterlinien). Die anderen Varianten bleiben vorerst auswählbar.
- Das Profil besteht jetzt aus einzelnen Bausteinen (`ProfileHeader`, `ProfileAbout`, `Experience`, `Certificates`, `Education`, `Languages` in `src/components/Profile.tsx`), die jede Anordnung frei platziert. Der Zustand des Easter Eggs liegt in einem Context (`src/components/shadow.ts`), weil Foto und Kurzvorstellung je nach Anordnung an verschiedenen Stellen stehen.
- **Build-Einstellungen** in `.env` (im Repository): `VITE_LAYOUT` (Anordnung) und `VITE_GRAPH` (Graph); dokumentiert in `docs/build-settings.md`. Überschreibbar für einen Build (`VITE_LAYOUT=split bun run build`) oder lokal in `.env.local` (nicht im Repository). Die erlaubten Werte stehen in `src/settings.ts` (ohne React und Browser-APIs, weil auch der Build sie braucht); `build-plugins/settings.ts` prüft beim Start von Vite, dass beide gesetzt und gültig sind, sonst bricht `bun dev` bzw. der Build mit den erlaubten Werten ab.
- Vites Mechanismus für Umgebungsvariablen statt einer eigenen Konfigurationsdatei: Er bringt `.env`, `.env.local` und das Überschreiben per Umgebung schon mit, auch für eine spätere CI-Pipeline.
- `src/options.ts`: Werte für die Seite. Im Produktions-Build gelten nur die Build-Einstellungen, Query-Parameter werden ignoriert. In `bun dev` überschreibt ein Query-Parameter (`?layout=split&graph=lines`) die Einstellung, damit ein Link dieselbe Darstellung zeigt; Werte gleich der Build-Einstellung stehen nicht in der URL. Der Sprachumschalter übernimmt die Parameter (nur in `bun dev`), der Hash der Detailansicht bleibt erhalten.
- `src/layouts/Layouts.tsx`: eine Komponente je Anordnung; CSS unter `.layout-<name>` in `src/index.css`. Unter 56rem Breite ist jede Anordnung einspaltig in DOM-Reihenfolge.
- Umschalter nur in `bun dev` (`src/components/OptionsPicker.tsx`, hinter `import.meta.env.DEV`, im Produktions-Bundle nicht enthalten): senkrechte Leiste am linken Rand, eine Gruppe je Einstellung; die Seite rückt um die Breite der Leiste nach rechts, damit nichts verdeckt wird. Unter 56rem nur mit Nummern (Name als Tooltip).
- Anordnungen:
  1. **Klassisch** (`classic`, **Standard**): eine Spalte; Name und Kurzvorstellung, danach die Projekte als erster Abschnitt, dann Werdegang, Zertifikate, Ausbildung, Sprachen, Kontakt.
  2. **Projekte im Mittelpunkt** (`showcase`): Name und Kurzvorstellung nebeneinander, darunter der Graph über die volle Breite auf leicht abgesetzter Fläche, danach Lebenslauf in zwei Spalten (Werdegang | Zertifikate, Ausbildung, Sprachen).
  3. **Seitenleiste** (`sidebar`): links eine mitlaufende Spalte mit Foto, Name, Links, Sprachen und Kontakt; rechts Kurzvorstellung als Einleitung, Graph, Werdegang, Zertifikate, Ausbildung.
  4. **Geteilter Bildschirm** (`split`): breitere Seite; Texte links, der Graph rechts bleibt beim Scrollen stehen. Mobil folgt der Graph direkt auf die Kurzvorstellung.
  5. **Kacheln** (`bento`): jeder Baustein auf einer eigenen Kachel in einem Raster mit unterschiedlich großen Kacheln.
- Aussehen des Graphen: Ziel ist ein Graph, der wie ein Diagramm aussieht: alle Zellen gleich gefärbt, lange Pfeile als Achsen, die Stufennamen außerhalb an den Achsen.
  1. **Klassisch** (`classic`): die ursprüngliche Fassung, abwechselnd gefärbte Bänder mit dem Namen der KI-Stufe darin, zum Vergleich.
  2. **Matrix** (`matrix`): alle Zellen gleich gefärbt, mit schmalen Abständen, abgerundet.
  3. **Gitterlinien** (`lines`, **Standard**): keine Füllung, dünne Linien zwischen den Zellen wie auf Millimeterpapier.
  4. **Offen** (`open`): nur Achsen und Teilstriche, keine Zellen.
- Die Varianten 2–4 haben dasselbe Gerüst (`AxesGraph` in `src/components/ProjectGraph.tsx`, ein einziges CSS-Grid): Pfeile aus CSS (Linie + Dreieck), die sich unten links kreuzen; Stufennamen links der y-Achse bzw. unter der x-Achse, jeweils mit Teilstrich; Achsentitel an den Pfeilspitzen (KI-Einsatz neben der oberen, Komplexität unter der rechten). Mobil (unter 36rem) stehen die Namen der KI-Stufen hochkant, damit die Spalten breit genug für die Icons bleiben.
- Geprüft mit Headless-Chromium bei 360, 900 und 1400 px in allen drei Sprachen, jeder Anordnung und jedem Graphen: kein horizontales Scrollen, alle 15 Projekte sichtbar; in `bun dev` mit Leiste ebenso bei 360 px. Produktions-Build mit `VITE_LAYOUT=split`: Anordnung `split` trotz `?layout=bento`, kein Umschalter, Sprachlinks ohne Query-Parameter. Ungültige und leere Werte brechen den Build ab.

### 10. CI-Pipeline ✅

- ✅ Upstream-Repository `git@github.com:Erkenbend/adrien-homepage.git` als Remote `origin` eingetragen.
- ✅ `.github/workflows/github-actions-build-deploy.yml` aus `article-trainer` übernommen (Bun 1.3.8, Node 22), Stack `AdrienHomepageInfrastructureStack`. Abweichung: nur bei Push auf `main`, ohne manuellen Start (`workflow_dispatch`), Entscheidung des Nutzers.
- ✅ Befehle für Deployment von Hand in `docs/deployment.md`.
- ✅ Secrets `AWS_ACCESS_KEY_ID` und `AWS_SECRET_ACCESS_KEY` im Repository hinterlegt (Nutzer).
- ✅ Erstes Deployment durch die Pipeline beim Push von `3788cfb` am 18.11.2026 (Lauf erfolgreich).

**Footer** ✅ (`src/components/Footer.tsx`), am Ende jeder Anordnung in Seitenbreite, klein und gedämpft:
- Version = Zeitpunkt des Builds: `BUILD_TIMESTAMP` (`define` in `vite.config.ts`, Deklaration in `src/vite-env.d.ts`), wie bei `article-trainer`; angezeigt je Sprache über `Intl.DateTimeFormat` in der Zeitzone des Besuchers (vorgerendert in UTC mit Zusatz „UTC“, siehe Schritt 13).
- Link „Quellcode“ zum GitHub-Repository mit GitHub-Logo aus `src/sites.ts`. Abweichung von `article-trainer`: nicht fest unten rechts über dem Inhalt, sondern als normaler Footer unter der Seite, damit nichts verdeckt wird.
- Geprüft mit Headless-Chromium bei 1100 und 360 px.

### 11. Feinschliff und Livegang ✅

- ✅ **README für GitHub:** `README.md` auf Englisch, kurz: Überblick, Befehle, „Make it your own“ (Schritte, um aus dem Repository eine eigene Seite zu machen) und Verweise auf die Details in `docs/`: `content.md` (Daten, Bilder, Technologien, Link-Seiten, Achsen, Texte), `languages.md` (Sprachen hinzufügen/entfernen, Standardsprache), `build-settings.md` (Anordnung, Graph), `deployment.md` (Infrastruktur, CI, Deployment von Hand, eigene Domain, andere Hosts), `credits.md` (Quellen der Grafiken, vorher im README).
- ✅ **Favicon:** Initialen „AW“ weiß auf der dunklen Seitenfarbe, als Linien gezeichnet statt als Text (unabhängig von Schriftarten): `public/favicon.svg` mit abgerundeten Ecken, `public/apple-touch-icon.png` (180 × 180, eckig, iOS rundet selbst) aus dem SVG gerendert.
- ✅ **Link-Vorschau und Metadaten:** `build-plugins/page-meta.ts` schreibt beim Build `<title>`, `<meta name="description">`, Open-Graph-Tags (Titel „Name · Position“, Beschreibung = Kurzvorstellung, Foto als `og:image`), `hreflang`-Links und `<html lang>` aus `profile.yaml` in `index.html`, in der Standardsprache: Vorschau-Crawler führen kein JavaScript aus, und es gibt nur eine `index.html` für alle Sprachen. Die Seite ersetzt die Beschreibung beim Laden durch die ihrer Sprache. (Seit Schritt 13 hat jede Sprache ihre eigene Seite mit eigenen Kopfdaten.) Absolute URLs über die neue Build-Einstellung `VITE_SITE_URL` in `.env` (beim Start von Vite geprüft). Kein `canonical`, damit `/en/` und `/fr/` nicht als Duplikate von `/` gelten. Mit LinkedIns Post Inspector geprüft (Nutzer, 19.11.2026): Titel und Foto erscheinen, die Beschreibung zeigt LinkedIn in der Karte nicht an. Das quadratische Foto wird auf das Querformat der Karte (1,91:1) zugeschnitten, der Kopf oben knapp angeschnitten.
- ✅ **Barrierefreiheit:** geprüft mit axe-core (WCAG 2.2 AA + Best Practices) in beiden Farbschemata, bei 1100 und 360 px, mit und ohne offene Detailansicht: keine Verstöße (Kontraste, Zielgrößen, Namen, `alt`-Texte). Tastatur: Sprachlinks → Farbschema → Profil-Links → Projekt-Icons, Umschalten mit Enter und Leertaste. Ergänzt: `prefers-reduced-motion` auch für das Vergrößern der Projekt-Icons. Das Easter Egg bleibt bewusst ohne Tastaturbedienung.
- ✅ **Helles Farbschema:** Knopf mit Sonne rechts neben dem Sprachumschalter (`src/components/ThemeToggle.tsx`, Toggle-Button mit `aria-pressed`), dunkel bleibt Standard; die Systemeinstellung (`prefers-color-scheme`) wird bewusst nicht beachtet. Die Wahl liegt in `localStorage` (`theme`), ein Inline-Skript in `index.html` setzt `<html data-theme="light">` vor dem ersten Zeichnen, damit nichts dunkel aufblitzt (`src/theme.ts`). Farben als Custom Properties: `--ink` (RGB-Kanäle für Linien und Tönungen) ersetzt alle festen `rgba(255, 255, 255, …)`; im hellen Schema gedämpfter Text mit 0,6 statt 0,5 Deckkraft (Kontrast ≥ 4,5:1), dunklere Ringfarben für die Projektarten, dunkle Tooltips. Weiße Icons (GitHub, allgemeines Link-Icon, AWS) tragen `darkOnly` und werden im hellen Schema invertiert (`invert` + `hue-rotate`, damit Farbiges wie das AWS-Lächeln seinen Farbton behält); Logos bleiben auf weißer Kachel, im hellen Schema mit feinem Rand.
- ✅ **Lighthouse** (Performance, Accessibility, Best Practices, SEO; nur offensichtliche Mängel beheben): vorher 80 / 100 / 100 / 92. Behoben: `public/robots.txt` (CloudFront lieferte `index.html`, ungültig) und die Profilfotos (450 KB bzw. 154 KB → 18 KB bzw. 37 KB: 400 px breit, JPEG, ohne Kamera-Metadaten; JPEG statt WebP, weil das Foto auch `og:image` ist). Danach 98 / 100 / 100 / 100. Bleibt: LCP ist der Text der Kurzvorstellung, der erst nach dem JS-Bundle erscheint (reine SPA; mit Schritt 13 vorgerendert).
- ✅ **Deployment:** live unter `https://adrien.wehrung.online` (antwortet mit 200, `<title>` aus `profile.yaml`).

### 12. PDF-Export (später, noch nicht genau festgelegt)

- Idee: Profil (und evtl. Projekte) als PDF exportieren, etwa als Lebenslauf zum Herunterladen.
- Wahrscheinlich sind Änderungen an der Datenhaltung nötig: Manche Angaben gehören nur ins PDF, andere nur auf die Seite (z. B. Felder oder Markierungen in `profile.yaml`/`projects.yaml`, was wo erscheint).
- Offen: Umfang und Inhalt, Erzeugung beim Build oder im Browser (Druckansicht mit `@media print` vs. eigens erzeugtes PDF), eine Datei je Sprache, Darstellung des Graphen im PDF.

### 13. Vorrendern ✅

Anlass: ChatGPT konnte die Seite nicht lesen. Das HTML enthielt nur `<div id="root"></div>`, der Inhalt entstand erst per JavaScript; robots.txt und CloudFront waren nicht die Ursache (200 auch mit den User-Agents von OpenAI).

- ✅ **Build:** Plugin `build-plugins/prerender.ts` mit Vites App-Builder (`builder`/`buildApp`): erst der Client wie bisher, dann `src/entry-server.tsx` als SSR-Bundle (nach `node_modules/.prerender`, danach gelöscht), das je Sprache `renderToString` aufruft. Daraus `dist/index.html`, `dist/en/index.html`, `dist/fr/index.html`, je mit Seite, `<html lang>` und Kopfdaten der Sprache; Platzhalter `<!--page-head-->` und `<!--page-body-->` in `index.html`. Ein einziger `vite build`, damit `BUILD_TIMESTAMP` in Client und Server gleich ist.
- ✅ **Kopfdaten je Sprache:** `build-plugins/page-meta.ts` liefert nur noch das HTML für `<head>` (Titel, Beschreibung, Open Graph mit `og:url` der Sprache, `hreflang`); `src/main.tsx` setzt Titel, Sprache und Beschreibung nicht mehr selbst. In `bun dev` schreibt das Plugin die Kopfdaten der Sprache aus der URL, ohne Vorrendern.
- ✅ **Sprache beim Vorrendern:** `LANGUAGE`/`MESSAGES` sind umschaltbar (`setLanguage`, nur für `entry-server.tsx`); die drei Stellen, die sie auf Modulebene lasen (Monatsformat, Sortierung im Graphen, Build-Zeit), lesen sie jetzt beim Rendern. `languageFromPath` liegt in `languages.ts` (ohne Browser-Globals, auch vom Build genutzt).
- ✅ **Nur im Browser bekannt:** `useSyncExternalStore` mit Server-Snapshot für Hash (leer), Optionen (Build-Werte), Farbschema (dunkel; `ThemeToggle` liest es jetzt über `useTheme`) und Build-Zeit (UTC mit Zusatz „UTC“, nach der Hydration in der Zeitzone des Besuchers). Ein geteilter Link mit Hash öffnet die Detailansicht nach der Hydration.
- ✅ **Hydration:** `hydrateRoot`, wenn die Seite vorgerendert ist und ihr `<html lang>` zur Sprache der URL passt; sonst (z. B. ein Host liefert für `/en` ohne Schrägstrich `/index.html`) wird neu gerendert, ohne Hydration-Fehler.
- ✅ **CloudFront:** CloudFront Function `infrastructure/lib/page-path.js` (Viewer Request): Pfade ohne Dateiendung → `index.html` ihres ersten Segments (`/en/…` → `/en/index.html`, `/` → `/index.html`); ohne passende Seite greift wie bisher die Fehlerantwort mit `/index.html`. Abbildung lokal mit Node geprüft, `cdk synth` ok.
- ✅ Geprüft mit Headless-Chromium gegen `bun run preview`: `/`, `/en/`, `/fr/` (auch mit hellem Schema), `/en/#tfcoach`, `/en`, unbekannter Pfad, jeweils ohne Konsolenfehler; `/fr/` ohne JavaScript zeigt den ganzen Inhalt; ebenso mit `VITE_LAYOUT=bento VITE_GRAPH=classic`; `bun dev` mit Kopfdaten je Sprache.
- Offen: nach dem Deployment prüfen, dass `/en/` und `/fr/` live die eigene Seite liefern und ChatGPT den Inhalt lesen kann.

## Offene Fragen

Derzeit keine.
