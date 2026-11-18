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
| Komplexität | Fünf benannte Stufen wie beim KI-Einsatz: Skript → Demo → kleine Anwendung → mehrteilige Anwendung → großes System | Vorgabe des Nutzers; benannte Stufen sind leichter einzuordnen und zu lesen als Zahlen. „Demo“ kam bei der Durchsicht der Projekte dazu, für Spielwiesen und Beispiele |
| Art des Projekts | Beruflich, Weiterbildung (von der Arbeit getragen, aber ohne Kundenbezug), Hobby | Vorgabe des Nutzers |
| Projekt-Icons | Hobby- und Weiterbildungsprojekte: eigene, von Claude gezeichnete SVG-Icons; berufliche Projekte: Logo von XPAY bzw. DATEV; alles lokal im Repository | Vorgabe des Nutzers; die SVGs sind klein, scharf in jeder Größe und frei von fremden Rechten |
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
- `src/data/profile.yaml` mit Platzhaltern: Name, Position, Ort, Kurzvorstellung, Werdegang, Ausbildung, Zertifikate (Name, Aussteller, ausgestellt, optional gültig bis und Link), Sprachen, Links (inzwischen eine freie Liste von URLs, siehe Schritt 9), optional `photo` (Pfad unter `public/`, z. B. `/images/profile.webp`). Leere Abschnitte werden nicht angezeigt.
- Easter Egg: optionale Felder `shadowPhoto` und `shadowAbout`. Solange die Maus über dem Foto steht (auf Touchscreens nach einem Tipp darauf), ersetzen sie Foto und Kurzvorstellung; fehlt eines, bleibt die normale Fassung. Beide Fassungen liegen in derselben Grid-Zelle und werden nur ein- und ausgeblendet (kurzes Überblenden, ohne bei `prefers-reduced-motion`): kein Springen des Layouts, kein Nachladen des Bildes, die verborgene Fassung ist auch für Screenreader unsichtbar. Ohne `photo` bzw. `about` bricht der Build ab.
- Zeiträume als `JJJJ` oder `JJJJ-MM`, Anzeige je Sprache über `Intl.DateTimeFormat` (z. B. „Sept. 2017 – Feb. 2021“, „mars 2021 – aujourd’hui“).
- Der Seitentitel ist der Name aus `profile.yaml`.
- `zod` und `yaml` landen nicht im Browser-Bundle (geprüft).

### 5. Kontakt ✅

- Abschnitt „Kontakt“ am Ende der Seite (`src/components/Contact.tsx`, Anker `#contact`): ein Satz mit Link zum LinkedIn-Profil (`contact` in `profile.yaml`), keine E-Mail-Adresse. Formulierung ohne Anrede, damit sich die Frage „du“ oder „Sie“ nicht stellt.

### 6. Projektdaten (in Arbeit)

- ✅ Schema `projects` in `src/data/schema.ts`, Typ `Project`: Pflichtfelder `id` (eindeutig, Kleinbuchstaben/Ziffern/Bindestriche, später Anker in der URL), `name` und `description` (Text), `icon`, `complexity`, `aiUsage`; optional `visible` (Standard `true`), `languages`, `frameworks` und `tools` (Listen von IDs aus `src/data/technologies.ts`, siehe Schritt 9; `tools` für Plattformen, Build-Werkzeuge und Infrastruktur wie Docker oder AWS), `kind` (`professional` | `training` | `hobby`), `period` (wie im Profil: `{from, to}`, ohne `to` = laufend), `team` (`solo` | `group`), `teamDetails` (Text, z. B. Größe des Teams oder eigene Rolle), `githubUrl`, `websiteUrl`.
- ✅ `visible: false` blendet ein Projekt aus, ohne den Eintrag auszukommentieren: Es wird weiter geprüft, aber schon im Schema herausgefiltert und landet nicht im Bundle (geprüft). In `projects.yaml` steht `visible: true` ausdrücklich bei jedem Eintrag.
- ✅ `complexity`: `script` | `demo` | `app` | `multiPart` | `system`; `aiUsage`: `none` | `light` | `heavy` | `vibe` (siehe Entscheidungen). Beide Achsen mit beschrifteten Stufen statt Zahlen; Beschriftungen und Achsentitel in `src/i18n/`.
- ✅ Referenzbeispiel `src/data/examples/projects.yaml` mit Erklärung jeder Stufe.
- ✅ Geprüft: unbekannte Stufe, doppelte `id`, fehlendes Icon und ein Feld, das im Beispiel fehlt, lassen den Build fehlschlagen.
- ✅ Entwurf `src/data/projects.yaml` aus beiden GitHub-Profilen (`Erkenbend`, `awehrung`), `tfcoach` (eigene Beiträge) sowie XPAY und DATEV PaymentNext. Weggelassen: Forks ohne nennenswerte eigene Arbeit (nur Abhängigkeits-Updates, Formatierung, Badge) und das leere `my-solid-kata`; nach Durchsicht außerdem `9gag-bot`, `php-from-scratch`, `tcp-chat-room`, `localstack-testing` und `nina-workshop`.
- Offen: mit `TODO` markierte Angaben vervollständigt der Nutzer selbst.
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
- ✅ **Logos der Organisationen:** optionales Feld `logo` bei Werdegang, Ausbildung und Zertifikaten (Bilder unter `public/images/logos/`). Angezeigt links neben dem Eintrag auf einer weißen Kachel, weil die meisten Logos für helle Hintergründe gemacht sind. Hat ein Eintrag einer Liste ein Logo, lassen alle Einträge dieser Liste Platz dafür. Quadratische Varianten (Signet oder Favicon) statt Schriftzügen, die in der kleinen Kachel unlesbar wären. Das Lycée Clemenceau hat kein eigenes Logo im Netz, das Abitur keine Institution: beide ohne Logo.
- ✅ **Projekt-Icons:** jedes Projekt zeigt auf `public/images/projects/<id>.svg`; `placeholder.svg` bleibt für neue Projekte ohne Icon. Alle Icons 64 × 64 mit abgerundeter Kachel, damit der Graph einheitlich wirkt:
  - Hobby und Weiterbildung: eigene Motive auf dunkler, farbiger Kachel, ohne fremde Marken (kein Terraform-, RabbitMQ- oder Overwatch-Logo): Star-Battle-Raster mit Sternen, Tablet mit Uhr/Sonne/Abfahrten, „DER“/„DAS“ in den üblichen Artikelfarben, zwei Container im Duell, Trillerpfeife mit Haken (tfcoach), Pixel-Pflänzchen, Würfel, Waage zwischen zwei Teams, zwei Dienste mit Warteschlange und Trace-Faden, Dokumente aus einem Datenstrom, versetzte, überlappende Verarbeitungsschritte, Sudoku-Block, sprudelndes Glas mit Biene (Fizz/Buzz).
  - XPAY und DATEV PaymentNext: Firmenlogo auf weißer Kachel, wie die Logos der Organisationen.
- ✅ **Technologien:** Programmiersprachen, Frameworks und Werkzeuge sind kein Freitext mehr, sondern IDs aus drei festen Listen in `src/data/technologies.ts` (`PROGRAMMING_LANGUAGES`, `FRAMEWORKS`, `TOOLS`; z. B. `java` → „Java“). Eine unbekannte ID oder eine ID in der falschen Liste (z. B. `docker` unter `languages`) bricht den Build ab; eine neue Technologie ist ein Eintrag dort. Der Name ist in allen Sprachen gleich, das Logo optional (`public/images/tech/`, der Build prüft, dass es existiert). In der Detailansicht steht das Logo vor dem Namen, die Einträge stehen nebeneinander statt durch Kommas getrennt.
  - Logos aus [Devicon](https://devicon.dev) (farbige Varianten). LocalStack: Signet aus dem Logo auf localstack.cloud (Devicon hat keines). AWS CDK nutzt das AWS-Logo. Ohne Logo: GML, GameMaker, Cobra, WebFlux.
- ✅ **Flaggen bei Sprachen:** optionales Feld `flag` mit einem Flaggen-Emoji (🇫🇷, 🇩🇪, 🇬🇧), vom Schema geprüft; für Screenreader ausgeblendet, weil der Name daneben steht. Hinweis: Windows hat keine Flaggen-Emojis, Browser dort zeigen stattdessen die zwei Buchstaben (z. B. „FR“).

### 9a. Anordnung der Seite ausprobieren (Proof of Concept, in Arbeit)

- Ziel: verschiedene Anordnungen von Profiltexten und Graph vergleichen (nicht Schrift und Farben). Auswahl vorerst auf der Seite selbst, später evtl. als Build-Einstellung.
- Entscheidung des Nutzers: Standard sind Anordnung 1 (mit den Projekten als erstem Abschnitt) und Graph 3 (Gitterlinien). Die anderen Varianten bleiben vorerst auswählbar.
- Das Profil besteht jetzt aus einzelnen Bausteinen (`ProfileHeader`, `ProfileAbout`, `Experience`, `Education`, `Certificates`, `Languages` in `src/components/Profile.tsx`), die jede Anordnung frei platziert. Der Zustand des Easter Eggs liegt in einem Context (`src/components/shadow.ts`), weil Foto und Kurzvorstellung je nach Anordnung an verschiedenen Stellen stehen.
- `src/options.ts`: Darstellungsoptionen (Anordnung `layout`, Aussehen des Graphen `graph`), jeweils über einen Query-Parameter (`?layout=split&graph=lines`), damit ein Link dieselbe Darstellung zeigt. Der Standard (`DEFAULTS`, unabhängig von der Reihenfolge im Umschalter) steht nicht in der URL. Der Sprachumschalter übernimmt die Parameter, der Hash der Detailansicht bleibt erhalten.
- `src/layouts/Layouts.tsx`: eine Komponente je Anordnung; CSS unter `.layout-<name>` in `src/index.css`. Unter 56rem Breite ist jede Anordnung einspaltig in DOM-Reihenfolge.
- Umschalter unten in der Mitte (`src/components/OptionsPicker.tsx`), eine Gruppe je Option; bei wenig Platz untereinander, mobil nur mit Nummern.
- Anordnungen:
  1. **Klassisch** (`classic`, **Standard**): eine Spalte; Name und Kurzvorstellung, danach die Projekte als erster Abschnitt, dann Werdegang, Ausbildung, Zertifikate, Sprachen, Kontakt.
  2. **Projekte im Mittelpunkt** (`showcase`): Name und Kurzvorstellung nebeneinander, darunter der Graph über die volle Breite auf leicht abgesetzter Fläche, danach Lebenslauf in zwei Spalten (Werdegang | Ausbildung, Zertifikate, Sprachen).
  3. **Seitenleiste** (`sidebar`): links eine mitlaufende Spalte mit Foto, Name, Links, Sprachen und Kontakt; rechts Kurzvorstellung als Einleitung, Graph, Werdegang, Ausbildung, Zertifikate.
  4. **Geteilter Bildschirm** (`split`): breitere Seite; Texte links, der Graph rechts bleibt beim Scrollen stehen. Mobil folgt der Graph direkt auf die Kurzvorstellung.
  5. **Kacheln** (`bento`): jeder Baustein auf einer eigenen Kachel in einem Raster mit unterschiedlich großen Kacheln.
- Aussehen des Graphen: Ziel ist ein Graph, der wie ein Diagramm aussieht: alle Zellen gleich gefärbt, lange Pfeile als Achsen, die Stufennamen außerhalb an den Achsen.
  1. **Klassisch** (`classic`): die ursprüngliche Fassung, abwechselnd gefärbte Bänder mit dem Namen der KI-Stufe darin, zum Vergleich.
  2. **Matrix** (`matrix`): alle Zellen gleich gefärbt, mit schmalen Abständen, abgerundet.
  3. **Gitterlinien** (`lines`, **Standard**): keine Füllung, dünne Linien zwischen den Zellen wie auf Millimeterpapier.
  4. **Offen** (`open`): nur Achsen und Teilstriche, keine Zellen.
- Die Varianten 2–4 haben dasselbe Gerüst (`AxesGraph` in `src/components/ProjectGraph.tsx`, ein einziges CSS-Grid): Pfeile aus CSS (Linie + Dreieck), die sich unten links kreuzen; Stufennamen links der y-Achse bzw. unter der x-Achse, jeweils mit Teilstrich; Achsentitel an den Pfeilspitzen (KI-Einsatz neben der oberen, Komplexität unter der rechten). Mobil (unter 36rem) stehen die Namen der KI-Stufen hochkant, damit die Spalten breit genug für die Icons bleiben.
- Geprüft mit Headless-Chromium bei 360, 900 und 1400 px in allen drei Sprachen, jeder Anordnung und jedem Graphen: kein horizontales Scrollen, alle 15 Projekte sichtbar.

### 10. CI-Pipeline (sobald es das Upstream-Repository gibt)

- `.github/workflows/github-actions-build-deploy.yml` aus `article-trainer` übernehmen (Bun 1.3.8, Node 22), Stack-Name anpassen.
- Wird erst mit dem Upstream-Repository wirksam; dort die Secrets `AWS_ACCESS_KEY_ID` und `AWS_SECRET_ACCESS_KEY` hinterlegen.

**Sobald es das Upstream-Repository gibt:**
- `BUILD_TIMESTAMP` wieder einführen (`define` in `vite.config.ts`, Deklaration in `src/vite-env.d.ts`) und als Version im Footer anzeigen, wie bei `article-trainer`.
- Link zum GitHub-Repository mit GitHub-Logo im Footer, wie bei `random-picker` und `article-trainer`.

### 11. Feinschliff und Livegang

- Favicon, `<meta name="description">`, Open-Graph-Tags (für Vorschauen auf LinkedIn u. a.).
- Barrierefreiheit: Tastaturbedienung des Graphen, Kontraste, `alt`-Texte.
- Dunkles Farbschema als Standard (schon im Grundgerüst); helles Schema nur bei Bedarf.
- Prüfen mit Lighthouse (Performance, Accessibility, SEO); kein Ziel um jeden Preis, nur offensichtliche Mängel beheben.
- Deployment, Aufruf unter `https://adrien.wehrung.online`, Screenshot ins README.

### 12. PDF-Export (später, noch nicht genau festgelegt)

- Idee: Profil (und evtl. Projekte) als PDF exportieren, etwa als Lebenslauf zum Herunterladen.
- Wahrscheinlich sind Änderungen an der Datenhaltung nötig: Manche Angaben gehören nur ins PDF, andere nur auf die Seite (z. B. Felder oder Markierungen in `profile.yaml`/`projects.yaml`, was wo erscheint).
- Offen: Umfang und Inhalt, Erzeugung beim Build oder im Browser (Druckansicht mit `@media print` vs. eigens erzeugtes PDF), eine Datei je Sprache, Darstellung des Graphen im PDF.

## Offene Fragen

1. **Inhalte:** Profil ausgefüllt, es fehlen nur das Profilbild und das Bild des Easter Eggs (bis dahin Platzhalter `public/images/profile-placeholder.svg` und `profile-shadow-placeholder.svg`, in `profile.yaml` mit `TODO` markiert). Projekte: mit `TODO` markierte Angaben (vervollständigt der Nutzer).
2. **Lizenz:** vor dem Livegang; GPL wie `random-picker`/`article-trainer` oder MIT wie `star-battle-solver`, evtl. Texte und Bilder ausgenommen.
