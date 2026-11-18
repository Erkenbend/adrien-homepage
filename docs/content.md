# Content

There is no server: the page is static. Content is read when Vite starts (`bun dev`) or builds (`bun run build`), checked, and bundled into the page. A change to the content therefore needs a new build and deployment.

## Data files

| File | Contents | Reference example |
|---|---|---|
| `src/data/profile.yaml` | Name, headline, photo, introduction, experience, education, certificates, languages, links, contact | [src/data/examples/profile.yaml](../src/data/examples/profile.yaml) |
| `src/data/projects.yaml` | Projects shown in the graph | [src/data/examples/projects.yaml](../src/data/examples/projects.yaml) |

The reference examples list every field with fictional values and an explanation. Start from them when writing your own files.

- **Schema:** `src/data/schema.ts` (Zod). The TypeScript types of the page are derived from it.
- **Checks:** invalid YAML, unknown fields, missing required fields, unknown values, duplicate project ids and missing images fail the build with the path and the reason. In `bun dev` the error shows in the browser overlay.
- **Examples stay complete:** the build also checks that each example is valid and uses every field of the schema (`build-plugins/completeness.ts`). When you add a field to the schema, add it to the example too.
- **Texts** are either one string for all languages (e.g. a company name) or one string per language: `{de: …, en: …, fr: …}`, all languages required.
- **Links in descriptions:** in the descriptions of experience, education and projects, Markdown links `[text](https://…)` become links. Other Markdown stays plain text.
- **Dates:** `YYYY` or `YYYY-MM`, shown per language (e.g. "Sep 2017 – Feb 2021"). A period without `to` is ongoing.
- **Empty sections** (e.g. no certificates) are not shown.

### Profile

- `name` is also the page title.
- `photo` and the optional easter egg `shadowPhoto`/`shadowAbout`: while the mouse is over the photo (on touch screens: from one tap on the photo to the next), the shadow photo and text replace the normal ones.
- `links`: any URLs, shown with the logo and name of the site (see [Link sites](#link-sites)).
- `contact`: the URL of the contact section. There is deliberately no e-mail address.

### Projects

- `id`: lower-case letters, digits and hyphens, unique; used as the link to the project (`/#my-project`). It must not be the anchor of a section (`projects`, `contact`).
- `complexity` and `aiUsage`: the position in the graph, see [Graph axes](#graph-axes-kinds-and-team-sizes).
- `kind`: shown as a coloured ring around the icon.
- `languages`, `frameworks`, `tools`: ids from `src/data/technologies.ts`, see [Technologies](#technologies).
- `visible: false` hides a project without deleting it. It is still checked, but not included in the page.
- Optional fields that are missing are simply left out of the detail view.

## Images

All images live under `public/images/` and are referenced from YAML by their path below `public/` (e.g. `/images/profile.webp`). The build checks that each referenced image exists.

| Folder | Contents |
|---|---|
| `public/images/` | Profile photo (and the easter egg photo) |
| `public/images/logos/` | Logos of employers, schools and certificate issuers (optional `logo` field), shown on a white tile |
| `public/images/projects/` | One icon per project, square; `placeholder.svg` stands in for a project without one |
| `public/images/sites/` | Logos of recognized link sites |
| `public/images/tech/` | Logos of technologies |

Square images work best: a signet or favicon rather than a full word mark, which would be unreadable at this size. SVG or a small WebP keeps the page light.

When you replace images, update [credits.md](credits.md) as well.

### Favicon

`public/favicon.svg` shows the initials as white strokes on the page background (drawn as paths, not text, so they do not depend on a font). `public/apple-touch-icon.png` is the same icon as a 180 × 180 PNG without rounded corners, for the home screen of iOS: export it again from the SVG with any tool after a change.

## Technologies

`src/data/technologies.ts` holds three fixed lists: `PROGRAMMING_LANGUAGES`, `FRAMEWORKS` and `TOOLS` (platforms, build tools, infrastructure). Projects refer to them by id, e.g. `languages: [java, kotlin]`. An unknown id, or an id in the wrong list, fails the build.

To add a technology, add an entry with its `name` (the same in every language) and optionally a `logo` (path below `public/`).

## Link sites

`src/sites.ts` recognizes known sites by host name, subdomains included, and shows their logo and name: GitHub, LinkedIn and iSAQB so far. Links to other sites get a generic link icon and the host name.

To recognize another site, add an entry to `SITES` and put its logo into `public/images/sites/`. The build checks that the logo exists.

## Graph axes, kinds and team sizes

The fixed choices of a project are defined in `src/data/scales.ts`, each ordered from low to high:

| List | Values |
|---|---|
| `COMPLEXITY_LEVELS` (x axis) | `script`, `demo`, `app`, `multiPart`, `system` |
| `AI_USAGE_LEVELS` (y axis) | `none`, `light`, `heavy`, `vibe` |
| `PROJECT_KINDS` | `professional`, `training`, `hobby` |
| `TEAM_SIZES` | `solo`, `group` |

The graph adapts to the number of levels. When you change a list:

- add or remove its labels in every dictionary in `src/i18n/` (a missing label is a type error);
- update `src/data/projects.yaml` and the examples in `src/data/examples/projects.yaml`;
- for a new kind of project, add its colour as `.kind-<name>` in `src/index.css`.

## Texts of the page

Fixed texts (headings, the sentence explaining the graph, the contact sentence, labels of the axes) are in `src/i18n/`, one dictionary per language. `de.ts` is the reference: the other dictionaries must have exactly the same keys, or the build fails.
