# Build settings

The layout of the page, the style of the project graph and the address of the page are fixed at build time, through environment variables in [.env](../.env):

| Variable | Meaning | Values | Default |
|---|---|---|---|
| `VITE_LAYOUT` | Arrangement of the page | `classic` (one column, projects as the first section), `showcase` (projects at the centre), `sidebar` (sidebar with photo, links and contact), `split` (split screen, the graph stays in place while scrolling), `bento` (tiles) | `classic` |
| `VITE_GRAPH` | Style of the project graph | `classic` (alternating bands), `matrix` (cells of the same colour), `lines` (grid lines), `open` (axes only) | `lines` |

- Override for one build: `VITE_LAYOUT=split bun run build`
- Override locally for good: the same lines in `.env.local` (not committed)
- A missing or unknown value stops `bun dev` and `bun run build` with the allowed values (`build-plugins/settings.ts`).
- Below a width of 56rem, every layout is a single column.

## Page address and link previews

| Variable | Meaning | Example |
|---|---|---|
| `VITE_SITE_URL` | Address of the deployed page, without a path | `https://adrien.wehrung.online` |

Link previews (LinkedIn, messengers) read the HTML without running JavaScript. `build-plugins/page-meta.ts` therefore writes into `index.html` at build time, from `src/data/profile.yaml` in the default language:

- `<title>` (the name) and `<meta name="description">` (the introduction, else the headline); the page replaces the description with the one of its language on load;
- Open Graph tags: title (name · headline), description, `og:url`, and the photo as `og:image`;
- `<link rel="alternate" hreflang>` for each language, and `<html lang>`.

Open Graph needs absolute URLs, hence the variable. A missing or invalid value stops `bun dev` and `bun run build`. After a deployment, check the preview with LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/), which also refreshes LinkedIn's cache.

## Comparing in development

In `bun dev`, a bar on the left edge shows every value for comparison. The choice is kept in the URL (`?layout=split&graph=open`), so a link shows the same view, and it overrides the setting.

The production build contains neither the bar nor the URL parameters: there, only the build settings count.

## Adding a layout or graph style

1. Add the value to `layout` or `graph` in `SETTINGS` in `src/settings.ts`.
2. Add its label in every dictionary in `src/i18n/` (shown in the development bar).
3. Layouts: add a component to `src/layouts/Layouts.tsx` and CSS under `.layout-<name>` in `src/index.css`. Graph styles: see `src/components/ProjectGraph.tsx`.
