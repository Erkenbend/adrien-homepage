# Personal homepage

[![CI](https://github.com/Erkenbend/adrien-homepage/actions/workflows/github-actions-build-deploy.yml/badge.svg?branch=main)](https://github.com/Erkenbend/adrien-homepage/actions/workflows/github-actions-build-deploy.yml?query=branch%3Amain)
[![License](https://img.shields.io/github/license/Erkenbend/adrien-homepage)](LICENSE)
[![Vibe coded with Opus 5.5](https://img.shields.io/badge/vibe%20coded%20with-Opus%205.5-D97757?logo=claude&logoColor=white)](AGENTS.md)

Profile, projects and contact on one static page → https://adrien.wehrung.online

- **Projects as a graph:** every project sits on two axes, complexity and AI used while developing it. Click a project for its details; each one has its own link (`/#article-trainer`).
- **Three languages:** German at `/`, English at `/en/`, French at `/fr/`.
- **Content in YAML:** profile and projects live in `src/data/*.yaml`, separate from the code. The build checks them against a schema, so a missing translation, an unknown value or a missing image fails the build instead of showing up on the page.
- **Static and small:** React, prerendered at build time (readable without JavaScript, also by AI tools and search engines), no server, no tracking. Hosted on AWS (S3 + CloudFront), deployed by GitHub Actions.

## Quick start

Requires [Bun](https://bun.sh) (CI uses 1.3.8).

```sh
bun install       # set up
bun dev           # development server with hot reload
bun lint          # ESLint over the whole repository
bun run build     # production build into dist/
bun run preview   # serve dist/ locally
```

In `bun dev`, a bar on the left switches between the available page layouts and graph styles.

## Make it your own

The code is generic; everything personal sits in a few places. To build your own page from it:

1. **Fork or clone** the repository, run `bun install` and `bun dev`.
2. **Replace the content:** rewrite `src/data/profile.yaml` and `src/data/projects.yaml`. The reference examples in `src/data/examples/` show every field with an explanation. Put your photo, logos and project icons under `public/images/`, and delete the images you no longer use. Put your initials in the favicon. → [docs/content.md](docs/content.md)
3. **Adjust the texts of the page** (headings, the sentence above the graph, the contact sentence) in `src/i18n/`. Title, description and link preview come from `profile.yaml` at build time.
4. **Optionally adapt the model and the look:** the levels of the graph axes, the kinds of projects and their colours, the list of technologies and the recognized link sites, the colours of the dark and light theme. → [docs/content.md](docs/content.md)
5. **Choose your languages:** add, remove or reorder them, or pick another default. → [docs/languages.md](docs/languages.md)
6. **Choose a layout and graph style** in `.env`. → [docs/build-settings.md](docs/build-settings.md)
7. **Point the footer** at your repository: `REPOSITORY_URL` in `src/components/Footer.tsx`.
8. **Deploy:** set the address of your page as `VITE_SITE_URL` in `.env` (for link previews), change the domain, hosted zone and bucket name in `infrastructure/`, or serve `dist/` from any static host. → [docs/deployment.md](docs/deployment.md)
9. **Check the credits** for the images you keep. → [docs/credits.md](docs/credits.md)

`bun lint` and `bun run build` tell you when something is missing: the data, the translations and the examples are all checked at build time.

## Documentation

| File | Contents |
|---|---|
| [docs/content.md](docs/content.md) | Profile and project data, images, favicon, technologies, link sites, graph axes, colours and themes, texts of the page |
| [docs/languages.md](docs/languages.md) | Adding or removing a language, changing the default |
| [docs/build-settings.md](docs/build-settings.md) | Page layouts and graph styles (`VITE_LAYOUT`, `VITE_GRAPH`), page address and link previews (`VITE_SITE_URL`) |
| [docs/deployment.md](docs/deployment.md) | AWS infrastructure (CDK), GitHub Actions, manual deployment, other hosts |
| [docs/credits.md](docs/credits.md) | Sources and licences of logos and icons |
| [PLAN.md](PLAN.md) | Implementation plan, decisions and status (German) |

## Tech stack

React 19, TypeScript, Vite, Bun; Zod and YAML at build time only; AWS CDK for S3, CloudFront and Route 53.

## License

Copyright © 2026 Adrien Wehrung

- **Code:** [GPL-3.0](LICENSE). This covers everything in the repository that is not listed below, including the docs and the reference examples in `src/data/examples/`.
- **Personal content:** [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt). This covers the profile and project data (`src/data/profile.yaml`, `src/data/projects.yaml`), the favicon (`public/favicon.svg`, `public/apple-touch-icon.png`) and the own project icons in `public/images/projects/` (all except `xpay.svg` and `datev-paymentnext.svg`). If you reuse it, credit Adrien Wehrung with a link to https://adrien.wehrung.online and share your changes under the same licence.
- **Portraits** (`public/images/portrait_*.jpg`): all rights reserved, not licensed for reuse.
- **Third-party logos and icons** keep their own licences and trademarks. → [docs/credits.md](docs/credits.md)

If you build your own page from this repository, replace the personal content with your own (see [Make it your own](#make-it-your-own)).
