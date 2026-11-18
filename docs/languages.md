# Languages

The page is available in German (default, at `/`), English (`/en/`) and French (`/fr/`).

- **No library:** the language comes from the first segment of the path, without a router. Unknown paths show the default language.
- **No redirect by browser language:** a shared link always shows the same language.
- **Language switcher:** plain links. It keeps the anchor (e.g. `#contact`), and switching is a normal page load.

The page relies on the host serving `index.html` for paths like `/en/`; see [deployment.md](deployment.md#other-hosts).

## Adding a language

Example: Spanish (`es`). TypeScript points out each place you have missed.

1. `src/i18n/languages.ts`: add `'es'` to `LANGUAGES`. The order is the order in the language switcher.
2. `src/i18n/es.ts`: copy `en.ts`, rename the export to `es` and translate. `satisfies Messages` makes sure no text is missing.
3. `src/i18n/language.ts`: add `es` to `DICTIONARIES` and `LANGUAGE_NAMES` (the name in that language, e.g. `Español`).
4. `src/data/schema.ts`: add `es: text` to the object in `localized`, and adjust its error message.
5. Add an `es` text to every per-language text in `src/data/profile.yaml`, `src/data/projects.yaml` and the examples in `src/data/examples/`. The build lists each one that is missing.

Dates are formatted by the browser (`Intl.DateTimeFormat`), so they need no translation.

## Removing a language

Do the same steps in reverse: remove it from `LANGUAGES`, delete its dictionary, and remove it from `language.ts`, `schema.ts` and every per-language text in the YAML files. The build fails on each leftover text in that language.

## Changing the default language

Set `DEFAULT_LANGUAGE` in `src/i18n/languages.ts`. That language moves to `/`, and the former default gets its own path (e.g. `/de/`). `<html lang>` and the texts of the link previews in `index.html` follow at build time (`build-plugins/page-meta.ts`).

`src/i18n/de.ts` stays the reference dictionary that defines the keys, whichever language is the default.
