# Persönliche Homepage

Schöne statische Webseite, die mich und meine Projekte präsentiert

## Features

Profilbild und Eckdaten analog zum LinkedIn Profil

Kontaktdaten: SimpleLogin Alias wegen Spambots

Darstellung meine Projekte als Graph mit 2 Achsen: Komplexität und KI-Einsatz. Jedes Projekt ist ein Icon, wenn man darauf klickt öffnen sich Details.

Je nach Verfügbarkeit:
- Sprache/Frameworks
- Beschreibung des Projekts
- Professionnell vs. Hobby
- Wann entstanden
- Link zum GitHub
- Link zur Webseite
- Solo vs. Gruppe

I18n: Die Seite soll auf Deutsch (default), Englisch und Französisch verfügbar sein

## Technisches

Hosting in AWS (Cloudfront distribution) unter `adrien.wehrung.online` (Domain und Hosted Zone schon vorhanden)

Package Manager: Bun

Technologie: Typescript Framework, offen

IaC mit CDK (Typecript)
