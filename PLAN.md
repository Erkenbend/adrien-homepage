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
| Projekt-Icons | KI-generierte Logos, lokal im Repository | Vorgabe des Nutzers |
| Lizenz | Wird vor dem Livegang entschieden | |
| Graph | Eigene Komponente aus HTML/SVG, keine Chart-Bibliothek | Nur Punkte mit Icons auf zwei Achsen; eine Bibliothek brächte mehr Gewicht als Nutzen |
| Projektdaten | Eine typisierte Datei `src/data/projects.ts`, Texte je Sprache | Inhalte im Repository, Build schlägt bei fehlenden Feldern fehl |

## Schritte

Jeder Schritt endet mit `bun lint` und `bun run build` ohne Fehler und einem eigenen Commit.

### 1. Grundgerüst

- Vite-Projekt (React + TS) mit Bun anlegen; `package.json`, `tsconfig*.json`, `vite.config.ts`, `eslint.config.js`, `.gitignore` nach dem Vorbild von `article-trainer`.
- `README.md` im Stil der anderen Projekte (Kurzbeschreibung, Link, Befehle, Quellen der Grafiken).
- `LICENSE`: erst vor dem Livegang.
- Ergebnis: leere Seite mit Titel läuft mit `bun dev`.

### 2. Infrastruktur

- `infrastructure/` aus `article-trainer` übernehmen (`bin/`, `lib/`, `cdk.json`, `package.json` ohne Jest, `tsconfig.json`); gleicher AWS-Account wie die anderen Projekte.
- Anpassungen im Stack:
  - `ROOT_DOMAIN_NAME = 'wehrung.online'`, Hosted Zone über ID importieren (wie bisher) – ID wird benötigt.
  - Zertifikat nur für `adrien.wehrung.online` statt Wildcard der Root-Domain (bisher legt jeder Stack ein eigenes Wildcard-Zertifikat an; hier reicht der eine Name).
  - Bucket-Name nach dem bisherigen Muster `adrien-homepage-bucket-<account>-us-east-1`.
  - Stack-Name `AdrienHomepageInfrastructureStack`, Construct-IDs mit Präfix `AdrienHomepage`.
- Prüfen mit `bunx cdk synth`; erstes `cdk deploy` von Hand, sobald Hosted-Zone-ID und Zugangsdaten feststehen.

### 3. CI-Pipeline

- `.github/workflows/github-actions-build-deploy.yml` aus `article-trainer` übernehmen (Bun 1.3.8, Node 22), Stack-Name anpassen.
- Wird erst mit dem Upstream-Repository wirksam; dort die Secrets `AWS_ACCESS_KEY_ID` und `AWS_SECRET_ACCESS_KEY` hinterlegen.

### 4. I18n-Grundlage

- `Messages`-Typ aus `de.ts` ableiten, `en.ts` und `fr.ts` müssen ihn erfüllen.
- Die Sprache ergibt sich allein aus dem Pfad (`/`, `/en/`, `/fr/`), ohne Router-Bibliothek; unbekannte Pfade zeigen die deutsche Seite.
- Keine automatische Weiterleitung nach Browsersprache: Ein geteilter Link zeigt immer dieselbe Sprache. Höchstens ein dezenter Hinweis „This page is also available in English“, wenn die Browsersprache abweicht (optional).
- Sprachumschalter in der Kopfzeile als normale Links; `<html lang>` und `document.title` folgen der Sprache.

### 5. Profil

- Profilbild (`public/` bzw. `src/assets/`, optimiert als WebP/AVIF mit passender Größe).
- Eckdaten analog zum LinkedIn-Profil: Name, aktuelle Position, Werdegang in Kurzform, Ort, Sprachen, Links (LinkedIn, GitHub). Inhalte liefert der Nutzer, sie werden nicht automatisch von LinkedIn geholt.

### 6. Kontakt

- SimpleLogin-Alias als `mailto:`-Link.
- Zusätzlich gegen einfache Scraper: Adresse nicht im statischen HTML, sondern erst im Browser zusammensetzen (der Alias selbst bleibt der eigentliche Schutz, weil er sich abschalten lässt).

### 7. Projektdaten

- Typ `Project` mit Pflichtfeldern `id`, `name`, `icon`, `complexity`, `aiUsage`, `description` (je Sprache) und optionalen Feldern aus `grober_plan.md`: `technologies`, `kind` (`professional` | `hobby`), `year` (oder Zeitraum), `githubUrl`, `websiteUrl`, `team` (`solo` | `group`).
- `aiUsage`: `none` | `light` | `heavy` | `vibe` (siehe Entscheidungen); Achse mit vier beschrifteten Stufen statt Zahlen.
- Skala für `complexity`: siehe offene Fragen.
- Icons: KI-generierte Logos unter `src/assets/projects/`, ein Bild pro Projekt (SVG oder kleines WebP).
- Fehlende optionale Felder werden in der Detailansicht einfach weggelassen.
- Kandidaten aus `~/code` und `~/WebstormProjects`: `star-battle-solver`, `random-picker`, `article-trainer` (DER oder DAS), `home-dashboard`, `popquiz`, `snake`, `tfcoach`, `overwatch-meta-predictor`, `minecraft-overview`, `halle-appointment-watch`, `ntfy-server`, `ldap-password-change`, `KotlinFizzBuzz`, `smartcjm-api-check`, `tinkering-with-files-and-streams` – plus berufliche Projekte. Auswahl und Bewertung trifft der Nutzer; Entwürfe für Beschreibungen können aus den READMEs erstellt werden.

### 8. Projekt-Graph

- Fläche mit x = Komplexität, y = KI-Einsatz (vier Bänder), Achsenbeschriftung je Sprache.
- Jedes Projekt als Icon an seiner Position, als `<button>` mit Namen als `aria-label` und Tooltip.
- Überlappungen: Projekte mit (fast) gleichen Werten leicht versetzen, deterministisch (z. B. kleiner Kreis um den Punkt), damit die Anordnung stabil bleibt.
- Mobil: Graph skaliert auf Bildschirmbreite, Icons behalten eine Mindestgröße zum Antippen; falls zu eng, zusätzlich eine Liste unter dem Graph.

### 9. Detailansicht

- Klick auf ein Icon öffnet einen Dialog (`<dialog>`, schließt mit Esc und Klick daneben) mit allen vorhandenen Feldern und Links.
- Optional: ausgewähltes Projekt in der URL (`#projekt-id`), damit sich Details verlinken lassen.

### 10. Feinschliff und Livegang

- Favicon, `<meta name="description">`, Open-Graph-Tags (für Vorschauen auf LinkedIn u. a.).
- Barrierefreiheit: Tastaturbedienung des Graphen, Kontraste, `alt`-Texte.
- Dunkles Farbschema als Standard (schon im Grundgerüst); helles Schema nur bei Bedarf.
- Prüfen mit Lighthouse (Performance, Accessibility, SEO); kein Ziel um jeden Preis, nur offensichtliche Mängel beheben.
- Deployment, Aufruf unter `https://adrien.wehrung.online`, Screenshot ins README.

## Offene Fragen

1. **Hosted Zone:** ID der Hosted Zone `wehrung.online` (kommt später; blockiert nur `cdk deploy`, nicht `cdk synth`).
2. **Skala für Komplexität:** ganze Zahlen 1–5, ebenfalls benannte Stufen oder frei? Vorschlag: benannte Stufen wie beim KI-Einsatz, z. B. Skript → kleine App → mehrteilige Anwendung → großes System.
3. **Inhalte** (kommen später): Profilbild, Eckdaten, SimpleLogin-Alias, Projektauswahl mit Bewertungen, Logos.
4. **Lizenz:** vor dem Livegang; GPL wie `random-picker`/`article-trainer` oder MIT wie `star-battle-solver`, evtl. Texte und Bilder ausgenommen.
