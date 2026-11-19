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

Link previews (LinkedIn, messengers) read the HTML without running JavaScript. `build-plugins/page-meta.ts` therefore writes into the page of each language at build time, from `src/data/profile.yaml` in that language:

- `<title>` (the name) and `<meta name="description">` (the introduction, else the headline);
- Open Graph tags: title (name · headline), description, `og:url`, and the photo as `og:image`;
- `<link rel="alternate" hreflang>` for each language, and `<html lang>`.

Open Graph needs absolute URLs, hence the variable. A missing or invalid value stops `bun dev` and `bun run build`. After a deployment, check the preview with LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/), which also refreshes LinkedIn's cache.

## Prerendering

AI tools such as ChatGPT, search engines and link previews often read the HTML without running JavaScript. So `bun run build` prerenders the page: one complete HTML file per language, `dist/index.html` for the default language and `dist/<language>/index.html` for the others. In the browser, React takes over the prerendered HTML (hydration) instead of rendering it again.

- `build-plugins/prerender.ts` builds the client as usual, then `src/entry-server.tsx` for Node, renders each language and fills the placeholders `<!--page-head-->` and `<!--page-body-->` in `index.html`.
- `bun dev` does not prerender; it renders in the browser, with the head of the language in the URL.
- What only the browser knows is prerendered with a fixed value and updated after hydration: no project dialog (the hash), the dark theme, the build time in UTC instead of the visitor's time zone. In code, such values come from `useSyncExternalStore` with a server snapshot (see `src/hash.ts`, `src/theme.ts`, `src/options.ts`).
- Read `LANGUAGE` and `MESSAGES` (`src/i18n/language.ts`) at render time, not at module level: prerendering switches the language between the pages.
- A page served under the path of another language (e.g. `/index.html` for `/en` on a host that does not map it) is rendered anew in the browser instead of hydrated.

## Comparing in development

In `bun dev`, a bar on the left edge shows every value for comparison. The choice is kept in the URL (`?layout=split&graph=open`), so a link shows the same view, and it overrides the setting.

The production build contains neither the bar nor the URL parameters: there, only the build settings count.

## Adding a layout or graph style

1. Add the value to `layout` or `graph` in `SETTINGS` in `src/settings.ts`.
2. Add its label in every dictionary in `src/i18n/` (shown in the development bar).
3. Layouts: add a component to `src/layouts/Layouts.tsx` and CSS under `.layout-<name>` in `src/index.css`. Graph styles: see `src/components/ProjectGraph.tsx`.
